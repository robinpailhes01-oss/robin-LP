/* Repères de la voix off (secondes dans le fichier audio), partagés par la vidéo et les sons. */
(function (root) {
  const O = 0.8; // la voix démarre 0,8 s après le début de la vidéo
  const R = {
    A: 0, A2: 1.58, A3: 2.74,
    B: 4.30, B2: 5.73, B3: 6.50, B4: 7.81,
    C: 10.28, C2: 11.6,
    D: 13.34, D2: 15.72,
    E1: 18.95, E2: 20.50, E3: 23.53, E4: 25.34,
    F1: 26.98, Fwa: 28.40, Fcal: 29.75, Fmet: 30.80, Fsite: 31.80,
    F2: 33.41, F2b: 34.97, F2c: 36.83, F3: 39.80, F3b: 41.30,
    G1: 44.61, G1b: 46.09, G1c: 48.90, G2: 51.36, G2b: 53.22,
    H1: 55.66, H2: 57.28,
    I1: 59.49, I2: 60.45, I3: 64.52, END: 65.65,
  };
  const T = {};
  for (const k in R) T[k] = +(R[k] + O).toFixed(3);
  const CUES = { O, R, T, DURATION: 68.5 };
  if (typeof module !== "undefined") module.exports = CUES;
  else root.CUES = CUES;
})(this);
