/* Mixage final : voix off découpée phrase par phrase et posée sur sa scène,
   musique et effets un peu plus bas et atténués sous la voix. */
const { execFileSync } = require("child_process");
const ffmpeg = require("ffmpeg-static");

/* [début dans voix-off.mp3, fin, instant dans la vidéo, texte] */
const VO = [
  [0.00, 2.40, 1.20, "Luma, agence IA à Montpellier."],
  [2.75, 6.55, 4.20, "Vos clients vous écrivent partout : WhatsApp, mail, téléphone…"],
  [6.75, 8.10, 8.30, "Et tout repose sur vous."],
  [8.50, 14.95, 10.15, "Luma simplifie votre relation client. Un agent IA répond à vos clients, avec vos informations, à toute heure."],
  [15.40, 16.35, 17.70, "Le client écrit."],
  [16.55, 17.40, 18.95, "L’agent répond."],
  [17.70, 19.15, 19.95, "La demande est enregistrée."],
  [19.50, 20.42, 21.55, "Et vous validez."],
  [20.80, 22.20, 23.30, "Des réponses plus rapides."],
  [22.30, 23.65, 25.20, "Des demandes bien suivies."],
  [23.85, 25.25, 27.10, "Des outils personnalisés."],
  [25.75, 28.42, 29.40, "Chez Harmonie Yacht : trois heures gagnées chaque jour."],
  [28.80, 30.40, 33.50, "Vous aussi, gagnez du temps."],
  [30.70, 32.13, 35.35, "Échangeons sur votre projet."],
];
const BED_DB = -9; // musique + effets sous la voix

const parts = VO.map(([a, b, t], i) => {
  const d = b - a, ms = Math.round(t * 1000);
  return `[0]atrim=${a}:${b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st=${(d - 0.04).toFixed(3)}:d=0.04,adelay=${ms}|${ms}[v${i}]`;
});
const run = (args) => execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
/* 1. Voix seule, en stéréo, sur 38 s */
run(["-i", "audio/voix-off.mp3", "-filter_complex", [
  ...parts,
  `${VO.map((_, i) => `[v${i}]`).join("")}amix=inputs=${VO.length}:normalize=0,aformat=channel_layouts=stereo,highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=10:release=150,loudnorm=I=-15:TP=-2,apad=whole_dur=38.5,atrim=0:38[out]`,
].join(";"), "-map", "[out]", "-ar", "48000", "audio/vo.wav"]);
/* 2. Musique et effets sous la voix */
run(["-i", "audio/vo.wav", "-i", "audio/mix3.wav", "-filter_complex", [
  `[0]asplit[vo][key]`,
  `[1]volume=${BED_DB}dB[bed]`,
  `[bed][key]sidechaincompress=threshold=0.04:ratio=4:attack=15:release=350[bd]`,
  `[vo][bd]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11,apad=whole_dur=38,atrim=0:38[out]`,
].join(";"), "-map", "[out]", "-ar", "48000", "audio/final.wav"]);

/* Sous-titres WebVTT (pour Instagram ou le site) */
const ts = (s) => new Date(s * 1000).toISOString().slice(11, 23);
const vtt = "WEBVTT\n\n" + VO.map(([a, b, t, txt]) => `${ts(t)} --> ${ts(t + b - a)}\n${txt}\n`).join("\n");
require("fs").writeFileSync("Luma-presentation-reel.fr.vtt", vtt);
console.log("audio/final.wav + Luma-presentation-reel.fr.vtt");
