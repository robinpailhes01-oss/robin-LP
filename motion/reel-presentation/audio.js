/* Bande son du réel de présentation 9:16 : effets sonores calés sur l'animation
   (audio/sfx3.wav) et musique légère synthétisée (audio/music3.wav). */
const fs = require("fs");
const SR = 48000, DURATION = 38, N = Math.ceil(DURATION * SR);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const bus = () => [new Float32Array(N), new Float32Array(N)];
function adder([Lc, Rc]) {
  return (t0, samples, pan = 0, gain = 1) => {
    const s0 = Math.round(t0 * SR), gl = Math.cos((pan + 1) * Math.PI / 4) * gain, gr = Math.sin((pan + 1) * Math.PI / 4) * gain;
    for (let i = 0; i < samples.length; i++) { const k = s0 + i; if (k < 0 || k >= N) continue; Lc[k] += samples[i] * gl; Rc[k] += samples[i] * gr; }
  };
}

/* --- Effets sonores --- */
function whoosh(dur = 0.6, f1 = 300, f2 = 2600, amp = 0.35) {
  const n = Math.round(dur * SR), out = new Float32Array(n); let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const x = i / n, env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2);
    const fc = f1 + (f2 - f1) * Math.sin(Math.PI * x * 0.9), f = 2 * Math.sin(Math.PI * fc / SR), q = 0.5;
    const hp = rnd() - lp - q * bp; bp += f * hp; lp += f * bp;
    out[i] = bp * env * amp * 0.7;
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
const NOTE = { C5: 523.25, D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.66, E6: 1318.5 };

const SFX = bus(), add = adder(SFX);
/* S1 : logo */
add(0.1, riser(1.0, 0.14)); add(1.1, whoosh(0.6, 400, 2800, 0.16)); add(1.2, thump(0.45)); add(1.25, chime(NOTE.D5, 0.08));
add(2.0, tick(0.08)); add(2.35, tick(0.07), 0.3);
/* S2 : messages éparpillés */
add(3.75, whoosh(0.7, 2600, 300, 0.22)); add(4.0, whoosh(0.8, 250, 2400, 0.16), 0.3);
for (let i = 0; i < 5; i++) add(5.3 + i * 0.42, pop(760 + i * 55, 0.17), i % 2 ? 0.4 : -0.4);
add(7.6, tick(0.08));
add(9.1, whoosh(0.7, 300, 2800, 0.22), -0.3); add(9.55, whoosh(0.8, 2600, 250, 0.2), 0.3);
/* S3 : conversation */
add(9.75, pop(620, 0.18)); add(10.2, whoosh(0.6, 400, 2600, 0.15));
add(11.0, pop(820, 0.16), -0.3);
for (let i = 0; i < 6; i++) add(11.6 + i * 0.14, tick(0.04), 0.3);
add(12.4, blip(NOTE.G5, 0.11), 0.3); add(13.4, pop(860, 0.15), -0.3); add(14.7, blip(NOTE.A5, 0.11), 0.3);
add(15.4, chime(NOTE.E5, 0.08)); add(16.6, whoosh(0.8, 2600, 250, 0.22));
/* S4 : étapes */
add(17.1, tick(0.08));
[17.5, 17.62, 17.74, 17.86].forEach((t, i) => add(t, pop(700 + i * 60, 0.08), -0.2 + i * 0.13));
[[18.15, NOTE.D5], [19.22, NOTE.Fs5], [20.28, NOTE.A5], [21.35, NOTE.D6]].forEach(([t, f], i) => add(t, blip(f, 0.13), -0.3 + i * 0.2));
add(21.4, chime(NOTE.A5, 0.05));
/* S5 : bénéfices sur fond nuit */
add(22.3, whoosh(0.9, 200, 2600, 0.24), -0.3);
[23.3, 25.2, 27.1].forEach((t) => add(t, thump(0.32)));
[25.0, 26.9].forEach((t, i) => add(t, whoosh(0.45, 600, 3000, 0.1), i ? 0.4 : -0.4));
add(28.5, whoosh(0.85, 2600, 250, 0.22));
/* S6 : 3 h */
add(29.3, tick(0.08)); add(29.5, thump(0.42));
for (let i = 0; i < 10; i++) add(29.6 + i * 0.1, tick(0.05));
add(30.6, chime(NOTE.D6, 0.08));
/* S7 : signature */
add(32.4, whoosh(0.9, 250, 2600, 0.22), -0.3);
add(33.3, pop(660, 0.16));
add(33.1, riser(0.6, 0.1)); add(33.7, thump(0.45)); add(33.75, chime(NOTE.D5, 0.1)); add(34.0, chime(NOTE.A5, 0.05), 0.3);
add(34.5, tick(0.06)); add(34.9, tick(0.06), 0.3);
add(35.3, pop(720, 0.18)); add(35.6, chime(NOTE.E6, 0.04));

/* --- Musique : 100 BPM, un accord par mesure de 2,4 s --- */
const BEAT = 0.6, BAR = 2.4;
const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);
const PROG = [[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 47, 52, 57]]; // Dmaj7 Bm7 Gmaj7 Asus2
const FINAL = [50, 54, 57, 61, 64]; // Dmaj9
const chordAt = (bar) => (bar >= 14 ? FINAL : PROG[bar % 4]);
const MUS = bus(), addM = adder(MUS);
const DRY = bus(), addD = adder(DRY); // basse et kick, hors réverbération (évite les résonances graves)
const smooth = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);

/* Nappe : scies désaccordées filtrées, fondu entre les accords */
for (let bar = 0; bar < 16; bar++) {
  const t0 = bar * BAR, len = bar === 14 ? DURATION - t0 : BAR + 0.9;
  if (bar === 15) break;
  const n = Math.round(len * SR), out = new Float32Array(n);
  const notes = chordAt(bar), att = bar === 0 ? 1.6 : 0.5;
  for (const m of notes) for (const det of [-0.11, 0, 0.12]) {
    const f = mf(m) * Math.pow(2, det / 12); let ph = (rnd() + 1) / 2;
    for (let i = 0; i < n; i++) { ph += f / SR; ph -= Math.floor(ph); out[i] += (2 * ph - 1) * 0.06; }
  }
  let a = 0, b = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR, fc = 700 + 250 * Math.sin(2 * Math.PI * (t0 + tt) / 9.6), k = 1 - Math.exp(-2 * Math.PI * fc / SR);
    a += k * (out[i] - a); b += k * (a - b);
    const env = smooth(tt / att) * (bar === 14 ? 1 - smooth((tt - (len - 2.6)) / 2.6) : 1 - smooth((tt - BAR) / 0.9));
    out[i] = b * env;
  }
  /* Même niveau efficace pour chaque accord (certains renversements sonnent plus fort) */
  let e = 0; const m0 = Math.round(Math.min(len, BAR) * SR); for (let i = 0; i < m0; i++) e += out[i] * out[i];
  const rms = Math.sqrt(e / m0);
  addM(t0, out, 0, 0.55 * 0.05 / rms);
}

/* Basse douce à partir de la scène 2 */
for (let bar = 2; bar < 15; bar++) {
  const t0 = bar * BAR, len = bar === 14 ? DURATION - t0 : BAR + 0.15, f = mf(chordAt(bar)[0] - 12), n = Math.round(len * SR), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const tt = i / SR, env = smooth(tt / 0.08) * (bar === 14 ? Math.exp(-tt / 1.4) : 1 - smooth((tt - BAR + 0.1) / 0.25));
    out[i] = (Math.sin(2 * Math.PI * f * tt) + 0.18 * Math.sin(4 * Math.PI * f * tt)) * env;
  }
  addD(t0, out, 0, bar < 4 ? 0.11 * (bar - 1) / 2 : 0.11);
}

/* Arpège en croches, de la conversation jusqu'à la signature */
const pluck = (f, amp) => { const n = Math.round(0.7 * SR), out = new Float32Array(n); for (let i = 0; i < n; i++) { const tt = i / SR, env = Math.min(1, tt / 0.003) * Math.exp(-tt / 0.22); out[i] = (Math.sin(2 * Math.PI * f * tt) + 0.22 * Math.sin(4 * Math.PI * f * tt) * Math.exp(-tt / 0.06)) * env * amp; } return out; };
for (let s = Math.ceil(9.6 / (BEAT / 2)); s * BEAT / 2 < 32.4; s++) {
  const t = s * BEAT / 2, bar = Math.floor(t / BAR), c = chordAt(bar), step = s % 8;
  const seq = [c[0] + 12, c[1] + 12, c[2] + 12, c[3] + 12, c[0] + 24, c[3] + 12, c[2] + 12, c[1] + 12];
  const fadeIn = smooth((t - 9.6) / 2.4), fadeOut = 1 - smooth((t - 31.2) / 1.2), accent = step % 2 ? 0.75 : 1;
  addM(t, pluck(mf(seq[step]), 0.07 * accent * fadeIn * fadeOut), step % 2 ? 0.35 : -0.35);
}

/* Pulsation légère : kick feutré et charleston, de la scène 4 à la scène 6 */
const kick = () => { const n = Math.round(0.35 * SR), out = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const tt = i / SR, f = 52 + 70 * Math.exp(-tt / 0.03); ph += 2 * Math.PI * f / SR; out[i] = Math.sin(ph) * Math.exp(-tt / 0.11); } return out; };
const hat = () => { const n = Math.round(0.08 * SR), out = new Float32Array(n); let prev = 0; for (let i = 0; i < n; i++) { const x = rnd(), hp = x - prev; prev = x; out[i] = hp * Math.exp(-i / SR / 0.018); } return out; };
for (let b = Math.ceil(16.8 / BEAT); b * BEAT < 32.4; b++) {
  const t = b * BEAT, k = smooth((t - 16.8) / 2.4) * (1 - smooth((t - 31.0) / 1.4));
  addD(t, kick(), 0, 0.22 * k);
  addM(t + BEAT / 2, hat(), 0.25, 0.05 * k);
}

/* Réverbération (Schroeder) */
function reverb(x, combs, mix) {
  const y = new Float32Array(x.length);
  for (const [d, g] of combs) { const buf = new Float32Array(d); let k = 0, lp = 0; for (let i = 0; i < x.length; i++) { const o = buf[k]; lp = o * 0.7 + lp * 0.3; buf[k] = x[i] + lp * g; k = (k + 1) % d; y[i] += o / combs.length; } }
  for (const d of [556, 441]) { const buf = new Float32Array(d); let k = 0; for (let i = 0; i < y.length; i++) { const b = buf[k], v = y[i]; const o = -v + b; buf[k] = v + b * 0.5; k = (k + 1) % d; y[i] = o; } }
  for (let i = 0; i < x.length; i++) x[i] = x[i] + y[i] * mix;
}
reverb(SFX[0], [[1557, 0.8], [1617, 0.8], [1491, 0.8], [1422, 0.8]], 0.22);
reverb(SFX[1], [[1580, 0.8], [1640, 0.8], [1514, 0.8], [1445, 0.8]], 0.22);
reverb(MUS[0], [[2557, 0.84], [2617, 0.84], [2491, 0.84], [2422, 0.84]], 0.35);
reverb(MUS[1], [[2580, 0.84], [2640, 0.84], [2514, 0.84], [2445, 0.84]], 0.35);
for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) MUS[c][i] += DRY[c][i];

/* Écriture WAV 16 bits stéréo */
function writeWav(file, [Lc, Rc]) {
  let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(Lc[i]), Math.abs(Rc[i]));
  const norm = peak > 0.89 ? 0.89 / peak : 1, buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Lc[i] * norm)) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Rc[i] * norm)) * 32767), 46 + i * 4); }
  fs.writeFileSync(file, buf);
  console.log(file, "peak", peak.toFixed(2));
}
fs.mkdirSync("audio", { recursive: true });
writeWav("audio/sfx3.wav", SFX);
writeWav("audio/music3.wav", MUS);
