/**
 * The fragment shader behind Button.astro: a rounded plate with electric arcs
 * crawling along its edge.
 *
 * Written here from the behaviour of the user's reference
 * (research/moodboard/_taste/button/button_1.png and its prompt, "Induction
 * Button / VALENCE CORE"), the way `research/notes/taste.md` D12 asks: the
 * saved prompt is a spec to rebuild, not code to port — the more so here,
 * since it names no licence. What is kept is the idea: one signed-distance
 * field for the plate, and a handful of arcs that are the same field read at a
 * wandering offset, so each one hugs the edge without ever repeating it. The
 * palette, the transparency (the reference paints its page's own black; we
 * have to sit on ink *and* on paper) and the calm idle state are ours.
 *
 * Uniforms are packed into vec4s, the same discipline as neuro-noise.ts.
 */
export const INDUCTION_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec4 u_scene;   // resolution.xy, time, flash
uniform vec4 u_plate;   // half width, half height, corner radius, arc count
uniform vec3 u_ground;  // the plate itself
uniform vec3 u_accent;  // the arcs
uniform vec3 u_hot;     // their core, where they burn out to near white

#define RES u_scene.xy
#define TIME u_scene.z
#define FLASH u_scene.w
#define HALF u_plate.xy
#define RADIUS u_plate.z
#define ARCS u_plate.w

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.05 + vec2(9.7, 3.1);
    a *= 0.5;
  }
  return v;
}

/** Distance to a rounded box: negative inside, zero on the edge. */
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * RES) / RES.y;
  float d = sdRoundBox(p, HALF, RADIUS);
  float px = 1.5 / RES.y;

  // How lit the button is: 0 at rest, 1 under the pointer.
  float lit = clamp((ARCS - 2.0) / 3.6, 0.0, 1.0);

  // The plate. Its own light gathers at the edge, from the inside.
  float plate = 1.0 - smoothstep(-px, px, d);
  vec3 col = u_ground;
  col += u_accent * 0.05 * fbm(p * 14.0);
  col += u_accent * exp(d * 14.0) * (0.11 + lit * 0.26);
  col *= plate;
  float alpha = plate;

  // The arcs: the same edge, each read at its own wandering offset, so they
  // ride it and fray away from it. Segments come and go along the angle, which
  // is what keeps a strand from reading as a drawn outline.
  float angle = atan(p.y, p.x);
  vec3 arc = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float w = clamp(ARCS - fi, 0.0, 1.0);
    float wander = fbm(vec2(angle * 2.4 + fi * 11.3, TIME * (1.6 + fi * 0.27) + fi * 53.1)) - 0.5;
    // The wander is in units of the canvas height, not of the plate: scaling
    // it by the plate's half-height made the strands hug the edge instead of
    // straying off it, which is the whole look.
    float off = wander * (0.10 + FLASH * 0.09);
    float seg = smoothstep(0.35, 0.75, noise(vec2(angle * 1.8 + fi * 7.7, TIME * (0.9 + fi * 0.13) + fi * 19.0)));
    seg = 0.28 + 0.72 * seg;
    float g = 0.0034 / (abs(d + off) + 0.005);
    arc += (u_accent * g + u_hot * g * g * 0.55) * w * seg;
  }
  arc *= 0.55 + 0.45 * lit;

  // On the click, the edge itself rings out for a moment.
  float ring = 0.005 / (abs(d) + 0.005);
  arc += u_hot * ring * FLASH * 1.3;

  // Nothing carries past the reach of the glow, so the canvas can be wider
  // than the button and still show no rectangle on any surface.
  float reach = 1.0 - smoothstep(0.04, 0.16, d);
  arc *= reach;

  col += arc;
  alpha = clamp(alpha + max(max(arc.r, arc.g), arc.b), 0.0, 1.0);

  // Premultiplied: the page shows through everywhere the glow does not reach.
  gl_FragColor = vec4(col, alpha);
}
`;
