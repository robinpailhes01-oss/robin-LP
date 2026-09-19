import { caseStudies } from "@/lib/content";

function embedUrl(url: string): { kind: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  return { kind: "iframe", src: url };
}

/** Vidéo de l’étude de cas : YouTube, Vimeo ou fichier. Sans URL, un emplacement sobre « vidéo à venir ». */
export function CaseVideo({ url, title }: { url: string; title: string }) {
  const e = embedUrl(url);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] border border-line">
      {e?.kind === "iframe" && (
        <iframe
          src={e.src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
      {e?.kind === "video" && <video src={e.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
      {!e && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_90%_at_80%_70%,rgba(99,80,255,0.45),transparent_70%)]" />
          <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <svg width="20" height="20" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              <path d="M2.5 1.5v7l6-3.5-6-3.5z" />
            </svg>
          </span>
          <p className="relative text-[14px] text-white/75">{caseStudies.videoPending}</p>
        </div>
      )}
    </div>
  );
}
