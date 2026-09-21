/**
 * The electric edge of Button.astro (src/shaders/induction-button.ts), in a
 * plain WebGL1 context on a fullscreen triangle — the same machinery as the
 * shader bands, with the same rules:
 *
 * - The button is complete without this: the canvas only ever adds to a plate
 *   that CSS has already drawn. If WebGL is missing, or the context is lost,
 *   nothing appears and nothing breaks.
 * - One frame is always drawn, so the edge is lit even when still. The loop
 *   runs only while the button is on screen in a visible tab, and never under
 *   reduced motion, where the arcs stay in the one position they were dealt.
 * - The canvas is larger than the button (the glow needs room) and paints
 *   premultiplied, so it sits on ink and on paper without a rectangle.
 * - DPR capped at 1.75 (CLAUDE.md).
 */
import { INDUCTION_FRAGMENT } from "../shaders/induction-button";
import { prefersReducedMotion, whenVisible } from "./motion";

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/** Ink, so the plate reads the same on either surface, and the theme's accent. */
const GROUND = [0.059, 0.078, 0.125];

const TONES: Record<string, { accent: number[]; hot: number[] }> = {
  amber: { accent: [0.902, 0.635, 0.235], hot: [1.0, 0.925, 0.78] },
  sage: { accent: [0.498, 0.702, 0.627], hot: [0.886, 0.98, 0.945] },
  violet: { accent: [0.557, 0.486, 0.765], hot: [0.914, 0.894, 0.98] },
  ice: { accent: [0.435, 0.659, 0.863], hot: [0.878, 0.945, 0.996] },
};

/** How far the glow may spread past the button, in CSS pixels. */
const REACH = 24;
const MAX_DPR = 1.75;
const IDLE = 2.1;
const ALIVE = 5.7;

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

function setup(button: HTMLElement): void {
  const canvas = button.querySelector<HTMLCanvasElement>("[data-induction]");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) return;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, INDUCTION_FRAGMENT);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!vertex || !fragment || !program) return;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const at = (name: string) => gl.getUniformLocation(program, name);
  const uScene = at("u_scene");
  const uPlate = at("u_plate");

  const tone = TONES[button.dataset.tone ?? "amber"] ?? TONES.amber;
  gl.uniform3fv(at("u_ground"), GROUND);
  gl.uniform3fv(at("u_accent"), tone.accent);
  gl.uniform3fv(at("u_hot"), tone.hot);

  let width = 0;
  let height = 0;
  let plate = [0, 0, 0];
  let frame = 0;
  let start = 0;
  let stamp = 0;
  let elapsed = 0;
  let arcs = IDLE;
  let target = IDLE;
  let flash = 0;

  const resize = () => {
    const box = button.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const cssHeight = box.height + REACH * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round((box.width + REACH * 2) * dpr));
    const h = Math.max(1, Math.round(cssHeight * dpr));
    // The shader works in units of the canvas height, so the plate's half-size
    // and its radius travel as fractions of it.
    const radius = parseFloat(getComputedStyle(button).borderTopLeftRadius) || 10;
    plate = [box.width / 2 / cssHeight, box.height / 2 / cssHeight, radius / cssHeight];
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    width = w;
    height = h;
    gl.viewport(0, 0, w, h);
  };

  const render = (time: number) => {
    gl.uniform4f(uScene, width, height, time, flash);
    gl.uniform4f(uPlate, plate[0], plate[1], plate[2], arcs);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    if (!start) start = now;
    const dt = Math.min(0.05, (now - stamp || 16) / 1000);
    stamp = now;
    arcs += (target - arcs) * Math.min(1, dt * 5);
    flash *= Math.exp(-3.6 * dt);
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

  // Under reduced motion the arcs keep the one shape they were dealt: the
  // button answers with its label and its rule instead (Button.astro).
  const wake = (value: number) => {
    if (prefersReducedMotion()) return;
    target = value;
  };
  button.addEventListener("pointerenter", () => wake(ALIVE));
  button.addEventListener("pointerleave", () => wake(IDLE));
  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) wake(ALIVE);
  });
  button.addEventListener("blur", () => wake(IDLE));
  button.addEventListener("click", () => {
    if (!prefersReducedMotion()) flash = 1;
  });

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    stop();
    canvas.classList.remove("is-ready");
  });
}

export function initInductionButtons(): void {
  for (const button of document.querySelectorAll<HTMLElement>("[data-induction-button]")) setup(button);
}
