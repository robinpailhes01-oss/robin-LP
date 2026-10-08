/* Sons du motion design, synthétisés et calés sur les repères de la voix off. */
const fs = require("fs");
const { T, DURATION } = require("./cues.js");
const SR = 48000, N = Math.ceil(DURATION * SR);
const Lc = new Float32Array(N), Rc = new Float32Array(N);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
function add(t0, samples, pan = 0, gain = 1) {
  const s0 = Math.round(t0 * SR), gl = Math.cos((pan + 1) * Math.PI / 4) * gain, gr = Math.sin((pan + 1) * Math.PI / 4) * gain;
  for (let i = 0; i < samples.length; i++) { const k = s0 + i; if (k < 0 || k >= N) continue; Lc[k] += samples[i] * gl; Rc[k] += samples[i] * gr; }
}
function whoosh(dur = 0.6, f1 = 300, f2 = 2600, amp = 0.35) {
  const n = Math.round(dur * SR), out = new Float32Array(n); let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const x = i / n, env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2);
    const fc = f1 + (f2 - f1) * Math.sin(Math.PI * x * 0.9), f = 2 * Math.sin(Math.PI * fc / SR), q = 0.5;
    const hp = rnd() - lp - q * bp; bp += f * hp; lp += f * bp;
    out[i] = bp * env * amp;
  }
  return out;
}
function riser(dur = 0.8, amp = 0.25) {
  const n = Math.round(dur * SR), out = new Float32Array(n); let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const x = i / n, env = Math.pow(x, 2.2) * (1 - Math.pow(x, 12));
    const fc = 800 + 6000 * x * x, f = 2 * Math.sin(Math.PI * fc / SR);
    const hp = rnd() - lp - 0.35 * bp; bp += f * hp; lp += f * bp;
    out[i] = bp * env * amp + Math.sin(2 * Math.PI * (1200 + 1800 * x) * i / SR) * env * amp * 0.08;
  }
  return out;
}
function tone(freqs, dur, decay, amp, glide = 1) {
  const n = Math.round(dur * SR), out = new Float32Array(n);
  freqs.forEach(([f, a], j) => { let ph = 0; for (let i = 0; i < n; i++) { const tt = i / SR; const fr = f * (1 + (glide - 1) * Math.min(1, tt / 0.04)); ph += 2 * Math.PI * fr / SR; const att = Math.min(1, tt / 0.004); out[i] += Math.sin(ph) * a * att * Math.exp(-tt / (decay * (1 - j * 0.15))); } });
  for (let i = 0; i < n; i++) out[i] *= amp;
  return out;
}
const pop = (f = 880, amp = 0.22) => tone([[f, 1], [f * 2.01, 0.25]], 0.25, 0.045, amp, 1.22);
const tick = (amp = 0.12) => tone([[2600, 1], [5200, 0.3]], 0.08, 0.012, amp);
const blip = (f, amp = 0.2) => tone([[f, 1], [f * 1.5, 0.35], [f * 2, 0.2]], 0.6, 0.11, amp);
const chime = (f, amp = 0.16) => tone([[f, 1], [f * 1.5, 0.6], [f * 2, 0.45], [f * 3.01, 0.2]], 2.2, 0.55, amp);
function thump(amp = 0.55) {
  const n = Math.round(0.6 * SR), out = new Float32Array(n); let ph = 0, lp = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR, f = 46 + 44 * Math.exp(-tt / 0.05); ph += 2 * Math.PI * f / SR; lp += 0.08 * (rnd() - lp); out[i] = (Math.sin(ph) * Math.exp(-tt / 0.16) + lp * 1.5 * Math.exp(-tt / 0.02)) * amp; }
  return out;
}
const NOTE = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5 };

/* --- Partition --- */
add(0.15, riser(0.4, 0.18));
add(0.35, thump(0.55));
add(0.4, chime(NOTE.E5, 0.1));
[0.55, 0.8, 1.05].forEach((t, i) => add(t, tick(0.08)));
add(T.S2 - 0.5, whoosh(0.8, 2600, 250, 0.3));
[T.S2, T.S2b, T.S2c, T.S2d].forEach((t, i) => add(t, pop(700 + i * 80, 0.18), i % 2 ? 0.4 : -0.4));
add(T.S3 - 0.55, whoosh(0.7, 250, 2800, 0.28));
[T.S3 + .3, T.S3a - .1, T.S3b - .1, T.S3c - .1, T.S3d - .1].forEach((t, i) => add(t, pop(820 + i * 60, 0.2), i % 2 ? 0.45 : -0.45));
add(T.S4 - 0.55, whoosh(0.7, 2600, 300, 0.28));
add(T.S4 + 0.5, pop(600, 0.2), -0.3);
[[T.S5b, 0.3], [T.S6b, 0.3], [T.S8 + .2, 0.3], [T.S9 + .2, 0.3], [T.S9b + .1, 0.3], [T.S10 + .1, 0.3]].forEach(([t, p]) => add(t, blip(NOTE.G5, 0.1), p));
[T.S8c - .1, T.S9e + .35].forEach((t) => add(t, pop(600, 0.16), -0.3));
add(T.S5 - 0.2, whoosh(0.5, 500, 3000, 0.16), -0.4);
add(T.S5b + 0.15, tick(0.1), -0.4); add(T.S5b + 0.3, tick(0.1), -0.4);
add(T.S6 - 0.2, whoosh(0.5, 500, 3000, 0.16), 0.4);
add(T.S6b + 0.3, chime(NOTE.B5, 0.06), 0.4);
add(T.S7 - 0.25, whoosh(0.5, 500, 3000, 0.16), 0.4);
[T.S8b + .05, T.S8c + .05, T.S8c + .45].forEach((t, i) => add(t, pop(880 + i * 90, 0.17), i % 2 ? 0.4 : -0.4));
[[T.S9c - .05, NOTE.E5], [T.S9d - .05, NOTE.G5], [T.S9e - .05, NOTE.C6]].forEach(([t, f], i) => add(t, blip(f, 0.15), i % 2 ? -0.4 : 0.4));
add(T.S10 + 0.1, whoosh(0.45, 600, 3000, 0.14), -0.4);
add(T.S10b - 0.1, whoosh(0.6, 300, 2400, 0.2));
for (let i = 0; i < 6; i++) add(T.S10b + .3 + i * .17, tick(0.08), -0.3 + i * 0.12);
add(T.S10b + 1.5, pop(700, 0.18));
add(T.S11 - 0.6, whoosh(0.8, 200, 2600, 0.3), -0.4);
add(T.S11b - 0.2, thump(0.5));
add(T.S11b - 0.15, chime(NOTE.G5, 0.12));
add(T.S12 - 0.5, whoosh(0.9, 2600, 200, 0.28));
add(T.S12b - 0.1, thump(0.45));
add(T.S12b + 0.1, chime(NOTE.C5, 0.1));
add(T.S12c + 0.9, pop(660, 0.2));
add(T.S12c + 1.2, chime(NOTE.E6, 0.05));

/* Petite réverbération (Schroeder) pour lier les sons */
function reverb(x, combs, mix) {
  const y = new Float32Array(x.length);
  for (const [d, g] of combs) { const buf = new Float32Array(d); let k = 0, lp = 0; for (let i = 0; i < x.length; i++) { const o = buf[k]; lp = o * 0.7 + lp * 0.3; buf[k] = x[i] + lp * g; k = (k + 1) % d; y[i] += o / combs.length; } }
  for (const d of [556, 441]) { const buf = new Float32Array(d); let k = 0; for (let i = 0; i < y.length; i++) { const b = buf[k], v = y[i]; const o = -v + b; buf[k] = v + b * 0.5; k = (k + 1) % d; y[i] = o; } }
  for (let i = 0; i < x.length; i++) x[i] = x[i] + y[i] * mix;
}
reverb(Lc, [[1557, 0.8], [1617, 0.8], [1491, 0.8], [1422, 0.8]], 0.22);
reverb(Rc, [[1580, 0.8], [1640, 0.8], [1514, 0.8], [1445, 0.8]], 0.22);

/* Écriture WAV 16 bits stéréo */
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(Lc[i]), Math.abs(Rc[i]));
const norm = peak > 0.89 ? 0.89 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Lc[i] * norm)) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Rc[i] * norm)) * 32767), 46 + i * 4); }
fs.writeFileSync("audio/sfx.wav", buf);
console.log("sfx.wav", DURATION + "s", "peak", peak.toFixed(2));
