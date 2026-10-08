function embedUrl(url: string): { kind: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  return { kind: "iframe", src: url };
}

/** Vidéo YouTube, Vimeo ou fichier. Sans URL, rien n’est affiché : pas d’emplacement vide. */
export function CaseVideo({ url, title }: { url: string; title: string }) {
  const e = embedUrl(url);
  if (!e) return null;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-night border border-line">
      {e.kind === "iframe" ? (
        <iframe
          src={e.src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video src={e.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}
