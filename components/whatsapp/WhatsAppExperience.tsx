"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Logo, Pill } from "@/components/ui/Logo";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { Reveal } from "@/components/ui/Reveal";
export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.4 7.5c-.9.4-1 1.4-.5 2.7.9 2.3 3 4.4 5.3 5.2 1.3.5 2.3.3 2.6-.6l.4-1.2-2.4-1.1-.9 1c-1.5-.6-2.5-1.6-3.1-3l.9-.8-1.1-2.5-1.2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function WhatsAppHero() {
  return (
    <section className="whatsapp-hero">
      <div className="container whatsapp-hero-grid">
        <div className="whatsapp-copy entrance">
          <Pill>Agent WhatsApp</Pill>
          <h1 className="t-h1">
            Un agent WhatsApp
            <br className="desktop-break" /> qui travaille{" "}
            <span className="accent">pour vous.</span>
          </h1>
          <p className="t-lead">
            Il répond à vos clients, qualifie vos leads, prépare vos devis et
            s’intègre à vos outils. 24h/24, 7j/7.
          </p>
          <ul className="benefit-list">
            {[
              "Réponse instantanée",
              "Connecté à votre CRM",
              "Qualifie vos leads",
              "Parle comme vous",
            ].map((t) => (
              <li key={t}>
                <span>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="whatsapp-mascot entrance">
          <span className="hand-note">
            Toujours
            <br />à vos côtés.
            <svg viewBox="0 0 80 65" fill="none" aria-hidden>
              <path
                d="M52 4c17 24 1 39-25 47m-1-13-1 15 16-1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Image
            src="/images/luma-whatsapp.webp"
            alt="La mascotte Luma tient un téléphone WhatsApp"
            width={1254}
            height={1254}
            priority
            sizes="(max-width: 767px) 90vw, 520px"
          />
          <div className="message-note">
            <span className="wa-badge">
              <WhatsAppIcon />
            </span>
            <div>
              <strong>Nouveau message client !</strong>
              <small>Bonjour, j’aimerais un devis…</small>
            </div>
            <span className="note-time">À l’instant</span>
          </div>
        </div>
        <div className="whatsapp-actions entrance">
          <OpenContactButton />
          <p className="micro">Échange gratuit et sans engagement.</p>
        </div>
      </div>
    </section>
  );
}
export function VideoSection({ src }: { src?: string }) {
  return (
    <section
      className="container video-section"
      aria-label="Présentation de l’agent WhatsApp"
    >
      <Reveal>
        {src ? (
          <video
            className="real-video"
            controls
            preload="metadata"
            poster="/images/luma-whatsapp.webp"
            aria-label="Présentation vidéo de l’agent WhatsApp"
          >
            <source src={src} type="video/mp4" />
            Votre navigateur ne peut pas lire cette vidéo.
          </video>
        ) : (
          <div className="video-poster">
            <div className="video-poster-copy">
              <Logo light className="text-[25px]" />
              <h2>
                Découvrez
                <br />
                notre agent
                <br />
                WhatsApp.
              </h2>
              <ButtonLink href="#conversations" variant="white">
                Voir les conversations
                <Arrow />
              </ButtonLink>
            </div>
            <Image
              src="/images/luma-whatsapp.webp"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 767px) 75vw, 650px"
            />
            <span className="video-caption">Présentation vidéo à venir</span>
          </div>
        )}
      </Reveal>
    </section>
  );
}
const conversations = [
  {
    title: "Une question. Une réponse.",
    name: "Nouveau contact",
    initials: "CL",
    messages: [
      {
        client: true,
        text: "Bonjour, proposez-vous des sorties en bateau ?",
        time: "09:14",
      },
      {
        client: false,
        text: "Bonjour ! Oui, plusieurs formules sont possibles selon vos envies. Vous avez une date en tête ?",
        time: "09:14",
      },
      {
        client: true,
        text: "Samedi, nous serions 6 personnes.",
        time: "09:15",
      },
      {
        client: false,
        text: "Parfait, je vérifie les disponibilités et je vous transmets les options pour votre groupe.",
        time: "09:15",
      },
    ],
    status: "Demande prise en charge",
  },
  {
    title: "Un échange. Un prospect qualifié.",
    name: "Prospect qualifié",
    initials: "PM",
    messages: [
      {
        client: true,
        text: "Nous organisons un EVJF pour 8 personnes. Est-ce possible ?",
        time: "10:04",
      },
      {
        client: false,
        text: "Avec plaisir ! Pour quelle date et quelle durée souhaitez-vous réserver ?",
        time: "10:04",
      },
      { client: true, text: "Le 12 juillet, pour 3 heures.", time: "10:05" },
      {
        client: false,
        text: "Merci ! J’ai bien noté : 8 personnes, EVJF, 3 heures. L’équipe peut maintenant vous proposer la formule adaptée.",
        time: "10:05",
      },
    ],
    status: "Informations enregistrées dans le CRM",
  },
  {
    title: "Un suivi. Une relation qui dure.",
    name: "Client",
    initials: "JD",
    messages: [
      {
        client: true,
        text: "Merci encore pour hier, c’était incroyable !",
        time: "11:32",
      },
      {
        client: false,
        text: "Merci pour votre confiance ! Nous sommes ravis que cette sortie vous ait plu.",
        time: "11:32",
      },
      { client: true, text: "On reviendra avec nos amis !", time: "11:33" },
      {
        client: false,
        text: "Avec grand plaisir. Écrivez-nous quand vous aurez une date, nous préparerons ça ensemble.",
        time: "11:33",
      },
    ],
    status: "Conversation centralisée",
  },
];
export function Conversations() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  function go(delta: number) {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(2, index + delta));
    const card = el.children[next] as HTMLElement;
    el.scrollTo({
      left: card.offsetLeft - el.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setIndex(next);
  }
  return (
    <section id="conversations" className="section conversations-section">
      <div className="container">
        <Reveal>
          <div className="section-heading centered">
            <p className="t-kicker">En action</p>
            <h2 className="t-h2">
              Des conversations qui se transforment en opportunités.
            </h2>
            <p className="t-body">
              De la première question au suivi client, chaque échange a une
              suite.
            </p>
          </div>
        </Reveal>
        <div
          ref={track}
          className="conversation-grid"
          onScroll={() => {
            const el = track.current;
            if (el && el.scrollWidth > el.clientWidth)
              setIndex(
                Math.round(
                  (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 2,
                ),
              );
          }}
        >
          {conversations.map((c, i) => (
            <article key={c.name} className="conversation-card">
              <div className="chat-header">
                <span aria-hidden>‹</span>
                <span className="chat-avatar">{c.initials}</span>
                <div>
                  <strong>{c.name}</strong>
                  <small>En ligne</small>
                </div>
                <WhatsAppIcon />
              </div>
              <div className="chat-body">
                <span className="chat-date">Exemple de conversation</span>
                {c.messages.map((m, j) => (
                  <div
                    key={j}
                    className={`chat-bubble ${m.client ? "outgoing" : "incoming"}`}
                  >
                    {m.text}
                    <small>
                      {m.time}
                      {m.client ? " ✓✓" : ""}
                    </small>
                  </div>
                ))}
              </div>
              <div className="chat-result">
                <span>✓</span>
                {c.status}
              </div>
              <h3 className="chat-caption">
                <span>0{i + 1}</span>
                {c.title}
              </h3>
            </article>
          ))}
        </div>
        <div className="carousel-controls">
          <button
            aria-label="Conversation précédente"
            disabled={index === 0}
            onClick={() => go(-1)}
          >
            ←
          </button>
          <span>{index + 1} / 3</span>
          <button
            aria-label="Conversation suivante"
            disabled={index === 2}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
        <p className="demo-disclaimer">
          Exemples illustratifs : messages et profils fictifs, inspirés d’un
          parcours de réservation.
        </p>
      </div>
    </section>
  );
}
const leads = [
  {
    name: "Julie Martin",
    source: "WhatsApp",
    status: "Qualifié",
    date: "12/07",
    initials: "JM",
  },
  {
    name: "Thomas R.",
    source: "Site web",
    status: "Nouveau",
    date: "12/07",
    initials: "TR",
  },
  {
    name: "Camille D.",
    source: "WhatsApp",
    status: "Client",
    date: "11/07",
    initials: "CD",
  },
  {
    name: "Sophie L.",
    source: "Instagram",
    status: "Qualifié",
    date: "11/07",
    initials: "SL",
  },
  {
    name: "Entreprise Dupont",
    source: "Site web",
    status: "Nouveau",
    date: "10/07",
    initials: "ED",
  },
];
export function Dashboard() {
  const [filter, setFilter] = useState("Tous");
  const filtered = leads.filter(
    (l) => filter === "Tous" || l.status === filter,
  );
  return (
    <section className="container dashboard-section">
      <Reveal>
        <div className="section-heading">
          <p className="t-kicker">Tout est au même endroit</p>
          <h2 className="t-h2">
            Un tableau de bord
            <br />
            clair et complet.
          </h2>
          <p className="t-body">
            Vos conversations, vos prospects et les prochaines actions. Sans
            perdre le fil.
          </p>
        </div>
        <div className="dashboard">
          <aside className="dashboard-sidebar">
            <Logo className="text-[24px]" />
            <span>◉ Conversations</span>
            <span className="selected">♙ Leads</span>
            <span>▦ Réservations</span>
            <span>▤ Devis</span>
            <span>◷ Statistiques</span>
          </aside>
          <div className="dashboard-main">
            <div className="dashboard-title">
              <h3>Leads</h3>
              <span>Données de démonstration</span>
            </div>
            <div
              className="dashboard-tabs"
              role="group"
              aria-label="Filtrer les prospects"
            >
              {["Tous", "Qualifié", "Nouveau", "Client"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}{" "}
                  <span>
                    (
                    {f === "Tous"
                      ? leads.length
                      : leads.filter((l) => l.status === f).length}
                    )
                  </span>
                </button>
              ))}
            </div>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">
                  Exemple de prospects centralisés dans votre CRM
                </caption>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Source</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.name}>
                      <td>
                        <span className="lead-avatar">{l.initials}</span>
                        {l.name}
                      </td>
                      <td>{l.source}</td>
                      <td>
                        <span
                          className={`status status-${l.status.toLowerCase()}`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td>{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sr-only" role="status">
              {filtered.length} prospects affichés
            </p>
          </div>
          <aside className="dashboard-stats">
            <h3>En un coup d’œil</h3>
            <div>
              <strong>5</strong>
              <span>Contacts</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Leads qualifiés</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Client</span>
            </div>
            <div>
              <strong>2</strong>
              <span>À suivre</span>
            </div>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}
export function Guarantee() {
  return (
    <section className="container guarantee-section">
      <Reveal>
        <div className="guarantee">
          <span className="shield" aria-hidden>
            <svg width="35" height="40" viewBox="0 0 35 40" fill="none">
              <path
                d="M17.5 1 33 7v12c0 10-15.5 19-15.5 19S2 29 2 19V7L17.5 1Z"
                fill="currentColor"
              />
              <path
                d="m10 19 5 5 10-11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <h2>Satisfait ou remboursé.</h2>
            <p>
              Vous testez votre agent WhatsApp en toute sérénité.
              <br />
              Si vous n’êtes pas satisfait dans les 14 premiers jours, nous vous
              remboursons.
            </p>
          </div>
          <div>
            <OpenContactButton />
            <p className="micro">Un premier échange sans engagement.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
