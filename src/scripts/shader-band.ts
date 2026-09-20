/**
 * The "Neuro Noise" band (ShaderBand.astro): the shader of
 * research/moodboard/_taste/shader, run in a plain WebGL1 context on a
 * fullscreen triangle — no libraries.
 *
 * - Its uniforms are the recipe's, with two changes of ours: the palette is
 *   the site's (ink, amber, pale gold, deep amber) instead of the orange of
 *   the reference, so `u_hue` stays 0 rather than rotating a hue we already
 *   chose.
 * - It draws one frame always, so the band is never empty; the loop runs only
 *   while the band is on screen in a visible tab, and never under reduced
 *   motion. The clock carries across pauses, so coming back it does not jump.
 * - The pointer lights it, as the recipe's cursor spotlight does; the light
 *   fades in and out with the pointer, and touch never triggers it.
 * - The device pixel ratio is capped (CLAUDE.md), and a lost context simply
 *   stops the loop: the band falls back to the page's own surface.
 */
import { NEURO_NOISE_FRAGMENT } from "../shaders/neuro-noise";
import { prefersReducedMotion, whenVisible } from "./motion";

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/** The reference's ramp in our colours, one set per tone: the ground (darker
    than ink on purpose — the recipe's contrast lifts the low end, and this
    lands the band back on the page's own ink), the colour itself, its pale
    tint, and its deep one. `amber` is the site's accent; the four others are
    the research themes, so a theme's page keeps its own single colour. */
const GROUND = [0.022, 0.031, 0.055];

const TONES: Record<string, number[][]> = {
  amber: [GROUND, [0.902, 0.635, 0.235], [0.98, 0.91, 0.769], [0.541, 0.353, 0.063]],
  rlaif: [GROUND, [0.902, 0.635, 0.235], [0.98, 0.91, 0.769], [0.541, 0.353, 0.063]],
  cl: [GROUND, [0.498, 0.702, 0.627], [0.886, 0.953, 0.925], [0.208, 0.42, 0.345]],
  topology: [GROUND, [0.557, 0.486, 0.765], [0.906, 0.878, 0.969], [0.416, 0.333, 0.659]],
  agentic: [GROUND, [0.435, 0.659, 0.863], [0.867, 0.929, 0.98], [0.184, 0.427, 0.639]],
};

const SPEED = 1.05;
const MAX_DPR = 1.75;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function setup(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) return;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, NEURO_NOISE_FRAGMENT);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!vertex || !fragment || !program) return;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const at = (name: string) => gl.getUniformLocation(program, name);
  const uColors = at("u_colors[0]");
  const uScene = at("u_scene");
  const uShape = at("u_shape");
  const uSurface = at("u_surface");
  const uFinish = at("u_finish");
  const uTransform = at("u_transform");
  const uSpace = at("u_space");
  const uCursor = at("u_cursor");

  const colours = TONES[canvas.dataset.tone ?? "amber"] ?? TONES.amber;
  const palette = new Float32Array(8 * 3);
  colours.forEach((colour, i) => palette.set(colour, i * 3));
  gl.uniform3fv(uColors, palette);
  // scale, intensity, paramA, warp — the recipe's shape.
  gl.uniform4f(uShape, 1.26, 0.35, 0.28, 0.0);
  // detail, contrast, brightness, saturation.
  gl.uniform4f(uSurface, 1.82, 0.89, -0.03, 1.45);
  // hue (0: the palette is already ours), vignette, blur, grain.
  gl.uniform4f(uFinish, 0.0, 0.0, 0.0, 0.0);
  // seed, rotation, drift, OKLab mixing.
  const seed = Number(canvas.dataset.seed) || 1372;
  gl.uniform4f(uTransform, seed, 0.0, 0.08, 1.0);

  let width = 0;
  let height = 0;
  let frame = 0;
  let start = 0;
  let stamp = 0;
  let elapsed = 0;
  let presence = 0;
  let pointer = [0, 0];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const box = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(box.width * dpr));
    height = Math.max(1, Math.round(box.height * dpr));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  };

  const render = (time: number) => {
    gl.uniform4f(uScene, width, height, time * SPEED, colours.length);
    gl.uniform4f(uSpace, -0.09, 0.01, pointer[0], pointer[1]);
    // presence, effect (4 = spotlight), strength, radius.
    gl.uniform4f(uCursor, presence, 4.0, 0.4, 0.49);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    if (!start) start = now;
    stamp = now;
    render(elapsed + (now - start) / 1000);
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    elapsed += (stamp - start) / 1000;
    frame = 0;
    start = 0;
  };

  resize();
  render(0);
  canvas.classList.add("is-ready");

  whenVisible(canvas, (visible) => {
    stop();
    if (!visible || prefersReducedMotion()) return;
    resize();
    frame = requestAnimationFrame(tick);
  });

  window.addEventListener(
    "resize",
    () => {
      resize();
      if (!frame) render(elapsed);
    },
    { passive: true },
  );

  // The spotlight follows a mouse or a pen, never a finger: on touch the
  // pointer would be wherever the last tap was.
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const box = canvas.getBoundingClientRect();
    pointer = [((event.clientX - box.left) / box.width) * 2 - 1, 1 - ((event.clientY - box.top) / box.height) * 2];
    presence = 1;
  });
  canvas.addEventListener("pointerleave", () => {
    presence = 0;
  });

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    stop();
    canvas.classList.remove("is-ready");
  });
}

export function initShaderBands(): void {
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>("[data-shader-band]")) setup(canvas);
}
