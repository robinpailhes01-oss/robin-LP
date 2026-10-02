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
add(0.15, whoosh(0.9, 200, 1400, 0.22));
add(T.A2 - 0.3, whoosh(0.5, 400, 2200, 0.12), -0.3);
add(T.A3 - 0.25, whoosh(0.5, 400, 2200, 0.12), 0.3);
add(T.A3 + 0.45, tick(0.1));
add(T.B - 0.4, whoosh(0.75, 250, 2800, 0.3));
[T.B + 0.7, T.B2 + 0.15, T.B3 + 0.35, T.B3 + 0.75, T.B3 + 1.1].forEach((t, i) => add(t, pop(760 + i * 70, 0.2), i % 2 ? 0.35 : -0.35));
for (let i = 0; i < 6; i++) add(T.B4 - 0.1 + i * 0.22, tick(0.07), 0.2);
add(T.C - 0.85, whoosh(0.8, 2400, 300, 0.3));
add(T.C - 0.6, riser(0.8, 0.22));
add(T.C + 0.22, thump(0.5));
add(T.C + 0.25, chime(NOTE.E5, 0.08));
add(T.C2, tick(0.08));
add(T.D - 0.2, whoosh(0.7, 300, 2000, 0.18));
add(T.E1 - 0.55, whoosh(0.6, 300, 2600, 0.22));
[[T.E1, NOTE.C5], [T.E2, NOTE.E5], [T.E3, NOTE.G5], [T.E4, NOTE.C6]].forEach(([t, f], i) => add(t, blip(f, 0.17), -0.45 + i * 0.3));
add(T.F1 - 0.5, whoosh(0.7, 250, 2800, 0.26));
add(T.Fwa, pop(620, 0.24));
[[T.Fcal, NOTE.E5, -0.4], [T.Fmet, NOTE.G5, 0.4], [T.Fsite, NOTE.B5, 0.4]].forEach(([t, f, p]) => { add(t - 0.15, whoosh(0.35, 800, 3200, 0.07), p); add(t + 0.2, blip(f, 0.14), p); });
[T.F2, T.F2b, T.F2c].forEach((t) => add(t, tick(0.11), -0.3));
add(T.F3 - 0.45, whoosh(0.6, 300, 2400, 0.2));
add(T.F3 - 0.05, thump(0.45));
add(T.F3 + 0.05, chime(NOTE.G5, 0.12));
add(T.G1 - 0.55, whoosh(0.75, 250, 2800, 0.28), 0.4);
for (let i = 0; i < 20; i++) add(T.G1b + i * 0.045, pop(1100 + (i % 5) * 90, 0.045), -0.5 + (i % 5) * 0.25);
add(T.G1c - 0.15, whoosh(0.6, 600, 2600, 0.16), 0.3);
[0, 1, 2].forEach((i) => add(T.G1c + 0.55 + i * 0.4, tick(0.11), 0.3));
add(T.G1c + 1.8, pop(700, 0.18), 0.3);
add(T.G2, thump(0.35));
add(T.G2 + 0.05, chime(NOTE.A5, 0.11));
add(T.G2b, tick(0.11), -0.3);
add(T.H1 - 0.6, whoosh(0.8, 200, 2600, 0.3), -0.4);
add(T.H1, thump(0.3));
add(T.H2, thump(0.3));
add(T.I1 - 0.5, whoosh(0.9, 2600, 200, 0.28));
add(T.I1 - 0.55, riser(0.6, 0.18));
add(T.I1 + 0.05, thump(0.5));
add(T.I1 + 0.1, chime(NOTE.C5, 0.1));
add(T.I3, pop(660, 0.2));
add(T.I3 + 0.35, chime(NOTE.E6, 0.06));

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
