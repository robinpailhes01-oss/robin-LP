/** Marques simplifiées des outils connectés, dessinées en SVG pour rester nettes à toutes les tailles. */
export function ToolIcon({ name, size = 30 }: { name: string; size?: number }) {
  const s = { width: size, height: size };
  switch (name) {
    case "WhatsApp":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="16" r="15" fill="#25D366" />
          <path d="M9.5 23.5l1.1-3.6A8 8 0 1 1 13.5 22.8L9.5 23.5z" fill="#fff" />
          <path d="M13 12.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.5.9 1.6 2 2.9 2.6.3.1.5.1.7-.1l.7-.8c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.4 0 .3 0 1-.4 1.6-.4.6-1.5 1-2 1-.7 0-1.9-.2-3.7-1.4-2.3-1.6-3.5-3.9-3.6-4.1-.1-.2-.8-1.2-.8-2.3s.6-1.6.8-1.9z" fill="#25D366" />
        </svg>
      );
    case "Notion":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#111" strokeWidth="1.6" />
          <path d="M10 22V10h2.4l6.6 8.6V10H22v12h-2.4L13 13.4V22H10z" fill="#111" />
        </svg>
      );
    case "HubSpot":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <circle cx="19" cy="18" r="6" fill="none" stroke="#FF7A59" strokeWidth="3" />
          <circle cx="19" cy="18" r="1.6" fill="#FF7A59" />
          <path d="M19 12V7M19 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 10l7 5M8 10a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM12 27l3-4M12 27a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" stroke="#FF7A59" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "Google Calendar":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <rect x="4" y="5" width="24" height="23" rx="3" fill="#fff" stroke="#DADCE0" strokeWidth="1.5" />
          <rect x="4" y="5" width="24" height="6" rx="3" fill="#4285F4" />
          <rect x="4" y="9" width="24" height="2" fill="#4285F4" />
          <text x="16" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A73E8" fontFamily="system-ui, sans-serif">31</text>
        </svg>
      );
    case "Airbnb":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <path d="M16 5c1.6 0 2.6 1 3.4 2.6l5.8 12.6c1.3 2.9-.6 6-3.5 6-1.9 0-3.6-1.3-5.7-3.6-2.1 2.3-3.8 3.6-5.7 3.6-2.9 0-4.8-3.1-3.5-6L12.6 7.6C13.4 6 14.4 5 16 5zm0 5.6c-.9 0-1.5.5-2 1.5l-3.6 8c-.5 1.1.3 2.3 1.4 2.3 1 0 2.3-1 4.2-3.2 1.9 2.2 3.2 3.2 4.2 3.2 1.1 0 1.9-1.2 1.4-2.3l-3.6-8c-.5-1-1.1-1.5-2-1.5zm0 4.6c1.1 0 1.9.9 1.9 1.9 0 1.2-1 2.5-1.9 3.5-.9-1-1.9-2.3-1.9-3.5 0-1 .8-1.9 1.9-1.9z" fill="#FF5A5F" />
        </svg>
      );
    case "Gmail":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <path d="M5 9v14a2 2 0 0 0 2 2h3V13.5L16 18l6-4.5V25h3a2 2 0 0 0 2-2V9" fill="none" stroke="#5F6368" strokeWidth="0" />
          <path d="M5 10.5V23a2 2 0 0 0 2 2h3V13.5L5 10.5z" fill="#4285F4" />
          <path d="M27 10.5V23a2 2 0 0 1-2 2h-3V13.5l5-3z" fill="#34A853" />
          <path d="M10 13.5L16 18l6-4.5V9l-6 4.5L10 9v4.5z" fill="#EA4335" />
          <path d="M5 10.5V9.4c0-1.9 2.1-3 3.6-1.8L10 9v4.5l-5-3z" fill="#C5221F" />
          <path d="M27 10.5V9.4c0-1.9-2.1-3-3.6-1.8L22 9v4.5l5-3z" fill="#FBBC04" />
        </svg>
      );
    case "Stripe":
      return (
        <svg {...s} viewBox="0 0 32 32" aria-hidden>
          <rect x="4" y="4" width="24" height="24" rx="6" fill="#635BFF" />
          <path d="M14.6 12.6c0-.8.7-1.1 1.8-1.1 1.6 0 3.6.5 5.2 1.3V8.9c-1.7-.7-3.4-1-5.2-1-4.2 0-7 2.2-7 5.9 0 5.7 7.9 4.8 7.9 7.3 0 .9-.8 1.2-2 1.2-1.7 0-4-.7-5.7-1.7v3.9c1.9.8 3.9 1.2 5.7 1.2 4.3 0 7.3-2.1 7.3-5.9 0-6.2-8-5.1-8-7.2z" fill="#fff" />
        </svg>
      );
    default:
      return <span style={s} className="rounded-md bg-card" aria-hidden />;
  }
}
