// Mock-ups animés de la VSL (style keynote : cartes blanches, Inter, emojis 3D, logos des outils).
// Chaque modèle : html(g) construit la scène dans une boîte g.w × g.h ; update(t, g) la place à l'instant t (s depuis l'apparition).
// g.cues = instants (s, relatifs) des mots qui déclenchent les étapes.
(function () {
  const A = (n) => `assets/emoji/${n}.png`;
  const L = (n) => `assets/logos/${n}.svg`;
  const cl = (x) => Math.min(1, Math.max(0, x));
  const pr = (t, a, d) => cl((t - a) / d);
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
  const eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const spring = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-6.5 * x) * Math.cos(10.5 * x));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  // apparition : fondu + glissé + petit rebond
  const pop = (el, t, a, o = {}) => {
    if (!el) return 0;
    const d = o.d || 0.6, q = pr(t, a, d), s0 = o.s0 ?? 0.82, dy = o.dy ?? 26, dx = o.dx ?? 0;
    el.style.opacity = t < a ? 0 : eo(q * 2.4);
    el.style.transform = `${o.base || ""} translate(${(1 - eo(q)) * dx}px, ${(1 - eo(q)) * dy}px) scale(${s0 + (1 - s0) * spring(q)})`;
    return q;
  };
  const fade = (el, t, a, d = 0.45, dy = 18) => { const q = eo(pr(t, a, d)); el.style.opacity = t < a ? 0 : q; el.style.transform = `translateY(${(1 - q) * dy}px)`; return q; };
  const C = (g, i, def = 0) => (g.cues && g.cues[i] != null ? g.cues[i] : def);
  const em = (n, s, cls = "") => `<img class="em ${cls}" src="${A(n)}" style="width:${s}px;height:${s}px">`;
  const tx = (g, k, d = "") => (g[k] != null ? g[k] : d);

  const T = {};

  /* gros emoji 3D + titre (+ sous-titre sur le 1er repère) */
  T.emoji = {
    w: 760, h: 520,
    html: (g) => `<div class="glow" id="gl"></div>
      <div id="e" style="position:absolute;left:50%;top:${tx(g, "ey", 36)}px;margin-left:-${(g.es || 210) / 2}px">${em(g.emoji, g.es || 210)}</div>
      <div class="ttl" id="t" style="top:${tx(g, "ty", 290)}px">${g.title}</div>
      ${g.sub ? `<div class="sub" id="s" style="top:${tx(g, "ty", 290) + 84}px">${g.sub}</div>` : ""}`,
    update: (t, g) => {
      const q = pop($("#e"), t, 0, { s0: 0.4, dy: 40, d: 0.8 });
      const fl = Math.sin(t * 2.2) * 6 * eo(pr(t, 0.6, 0.6));
      if (g.bounce) $("#e").style.transform += ` translateY(${Math.abs(Math.sin(t * 4.2)) * -22}px)`;
      else $("#e").style.transform += ` translateY(${fl}px) rotate(${Math.sin(t * 1.6) * 2}deg)`;
      $("#gl").style.opacity = 0.9 * eo(q);
      fade($("#t"), t, 0.18);
      if (g.sub) fade($("#s"), t, C(g, 0, 0.5));
    },
  };

  /* iPhone : écran verrouillé, notifications WhatsApp qui tombent */
  T.iphone = {
    w: 520, h: 940,
    html: (g) => `<div class="phone" id="ph"><div class="scr">
        <div class="island"></div><div class="lockdate">${tx(g, "date", "mardi 14 juillet")}</div>
        <div class="lockt" id="clk">${g.notifs[0].time}</div><div id="stack"></div></div></div>`,
    update: (t, g) => {
      const ph = $("#ph"), q = eo(pr(t, 0, 0.7));
      ph.style.opacity = q; ph.style.transform = `translateY(${(1 - q) * 80}px) scale(${0.94 + 0.06 * q})`;
      const st = $("#stack");
      if (!st.children.length)
        st.innerHTML = g.notifs.map((n, i) => `<div class="ntf" id="n${i}"><img class="app" src="${L("whatsapp-icon")}">
          <div class="nb"><div class="nh"><b>${n.who || "WhatsApp"}</b><span>${n.time}</span></div><div class="nm">${n.text}</div></div></div>`).join("");
      let shown = 0, clk = g.notifs[0].time;
      g.notifs.forEach((n, i) => { if (t >= C(g, i, 0.5 + i)) { shown = i + 1; clk = n.time; } });
      $("#clk").textContent = clk;
      g.notifs.forEach((n, i) => {
        const el = $("#n" + i), a = C(g, i, 0.5 + i), qq = pr(t, a, 0.55);
        // le plus récent en haut, les autres descendent
        let y = 0;
        for (let j = i + 1; j < g.notifs.length; j++) y += 150 * eo(pr(t, C(g, j, 0.5 + j), 0.5));
        el.style.opacity = t < a ? 0 : eo(qq * 2);
        el.style.transform = `translateY(${y + (1 - spring(qq)) * -60}px) scale(${0.9 + 0.1 * spring(qq)})`;
      });
    },
  };

  /* rangée de tuiles emoji + légende, une par repère */
  T.row = {
    w: 900, h: 420,
    html: (g) => `<div class="rowt">${g.items.map((it, i) => `<div class="tile" id="r${i}">${em(it.emoji, 130)}<div class="tl">${it.label}</div></div>`).join("")}</div>`,
    update: (t, g) => g.items.forEach((it, i) => {
      const el = $("#r" + i); pop(el, t, C(g, i, i * 0.4), { s0: 0.6, dy: 40 });
      el.querySelector(".em").style.transform = `translateY(${Math.sin(t * 2 + i) * 5}px)`;
    }),
  };

  /* liste « Rappels » façon iOS : tâches en retard */
  T.todo = {
    w: 740, h: 440,
    html: (g) => `<div class="card todo" id="c"><div class="th"><span>${tx(g, "head", "À faire")}</span><span class="badge" id="bd">0</span></div>
      ${g.items.map((it, i) => `<div class="ti" id="i${i}"><span class="ck"></span><div><div class="tt">${it.t}</div><div class="ts">${it.s}</div></div></div>`).join("")}</div>`,
    update: (t, g) => {
      pop($("#c"), t, 0, { s0: 0.9, dy: 40 });
      let n = 0;
      g.items.forEach((it, i) => { const a = C(g, i, 0.4 + i * 0.6); if (t >= a) n++; pop($("#i" + i), t, a, { s0: 0.95, dy: 0, dx: -40 }); });
      $("#bd").textContent = n; $("#bd").style.transform = `scale(${1 + 0.35 * Math.exp(-6 * Math.max(0, t - C(g, n - 1, 0)))})`;
    },
  };

  /* le client écrit à 3 établissements : le premier qui répond gagne */
  T.race = {
    w: 800, h: 520,
    html: (g) => `<div class="msg" id="m">${tx(g, "msg", "Bonjour, c'est dispo samedi ?")}</div>
      ${[0, 1, 2].map((i) => `<div class="card race" id="k${i}" style="top:${150 + i * 118}px">${em("office_building", 64)}
        <div class="rname">Établissement ${"ABC"[i]}</div><div class="rs" id="s${i}"><span class="dots"><i></i><i></i><i></i></span></div></div>`).join("")}
      <div id="tr" style="position:absolute;right:-6px;top:118px">${em("trophy", 110)}</div>`,
    update: (t, g) => {
      pop($("#m"), t, 0, { s0: 0.8, dy: 20 });
      const win = C(g, 0, 2.5);
      [0, 1, 2].forEach((i) => {
        const k = $("#k" + i); pop(k, t, 0.35 + i * 0.18, { s0: 0.9, dy: 24 });
        const s = $("#s" + i);
        if (t < win) { s.className = "rs"; s.innerHTML = `<span class="dots">${[0, 1, 2].map((j) => `<i style="opacity:${0.35 + 0.65 * Math.max(0, Math.sin(t * 6 - j * 0.9))}"></i>`).join("")}</span>`; }
        else if (i === 0) { s.className = "rs ok"; s.textContent = "✓ Répondu en 1 min"; }
        else { s.className = "rs ko"; s.textContent = "Sans réponse"; k.style.opacity = 1 - 0.45 * eo(pr(t, win, 0.4)); }
      });
      $("#k0").style.boxShadow = t >= win ? `0 0 0 ${4 * eo(pr(t, win, 0.3))}px #30d158, 0 30px 80px rgba(0,0,0,.45)` : "";
      pop($("#tr"), t, win + 0.1, { s0: 0.2, dy: 30, d: 0.8 });
    },
  };

  /* chiffre qui compte + comparaison en barres ou courbe */
  T.counter = {
    w: 800, h: 560,
    html: (g) => `<div class="kick" id="k">${g.kicker}</div>
      <div class="num" id="n">${g.prefix || ""}0${g.suffix || ""}</div><div class="sub2" id="s">${g.sub}</div>
      ${g.bars ? `<div class="bars" id="b">${g.bars.map((b, i) => `<div class="bar"><span class="bl">${b.label}</span><span class="bt"><i id="bi${i}" style="background:${b.color}"></i></span><span class="bv">${b.v}</span></div>`).join("")}</div>` : ""}
      ${g.line ? `<svg class="line" id="ln" viewBox="0 0 600 150"><defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffc35c" stop-opacity=".35"/><stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></linearGradient></defs>
         <path id="la" d="M0,130 C80,125 140,118 200,108 S330,95 400,70 S520,30 600,12 L600,150 L0,150Z" fill="url(#lg)"/>
         <path id="lp" d="M0,130 C80,125 140,118 200,108 S330,95 400,70 S520,30 600,12" fill="none" stroke="#ffc35c" stroke-width="5" stroke-linecap="round"/></svg>` : ""}`,
    update: (t, g) => {
      fade($("#k"), t, 0); const q = eio(pr(t, 0.15, g.count || 1.4));
      const n = $("#n"); n.textContent = `${g.prefix || ""}${Math.round(g.value * q)}${g.suffix || ""}`;
      n.style.opacity = eo(pr(t, 0.1, 0.3)); n.style.transform = `scale(${0.9 + 0.1 * spring(pr(t, 0.1, 0.8))})`;
      fade($("#s"), t, 0.45);
      if (g.bars) { fade($("#b"), t, 0.6, 0.4, 10); g.bars.forEach((b, i) => { $("#bi" + i).style.width = b.w * eio(pr(t, 0.8 + i * 0.25, 0.9)) + "%"; }); }
      if (g.line) { const lp = $("#lp"), L0 = lp.getTotalLength(); const qq = eio(pr(t, 0.5, 1.4));
        lp.style.strokeDasharray = L0; lp.style.strokeDashoffset = L0 * (1 - qq); $("#la").style.opacity = qq; }
    },
  };

  /* semaine d'un salarié : week-end, soirées, nuits indisponibles */
  T.week = {
    w: 860, h: 470,
    html: (g) => { const D = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"], R = ["Journée", "Soirée", "Nuit"];
      return `<div class="card dark week" id="c"><div class="wh">${tx(g, "head", "Un salarié, c'est disponible…")}</div>
      <div class="wg"><span></span>${D.map((d) => `<span class="wd">${d}</span>`).join("")}
      ${R.map((r, ri) => `<span class="wr">${r}</span>${D.map((d, di) => `<span class="cell" id="c${ri}_${di}"></span>`).join("")}`).join("")}</div></div>`; },
    update: (t, g) => {
      pop($("#c"), t, 0, { s0: 0.92, dy: 40 });
      // repères : samedi, dimanche, nuit, soirée
      const off = (ri, di) => { const sat = C(g, 0, 0.6), sun = C(g, 1, 1.2), night = C(g, 2, 1.8), eve = C(g, 3, 2.4);
        let a = 99; if (di === 5) a = Math.min(a, sat); if (di === 6) a = Math.min(a, sun); if (ri === 2) a = Math.min(a, night); if (ri === 1) a = Math.min(a, eve); return a; };
      for (let ri = 0; ri < 3; ri++) for (let di = 0; di < 7; di++) {
        const el = $(`#c${ri}_${di}`), a = off(ri, di), on = eo(pr(t, 0.3 + (di + ri) * 0.03, 0.3)), k = eo(pr(t, a, 0.35));
        el.style.opacity = on;
        el.style.background = k > 0 ? `rgba(255,69,58,${0.25 + 0.6 * k})` : "rgba(48,209,88,.85)";
        el.innerHTML = k > 0.5 ? "✕" : "";
        el.style.transform = `scale(${1 + 0.18 * Math.sin(Math.PI * k)})`;
      }
    },
  };

  /* hub : l'agent au centre, les outils branchés autour (logos) */
  T.hub = {
    w: 900, h: 640,
    html: (g) => { const cx = 450, cy = 300;
      return `<svg class="hubl" viewBox="0 0 900 640">${g.tools.map((o, i) => `<line id="l${i}" x1="${cx}" y1="${cy}" x2="${o.x}" y2="${o.y}"/><circle id="d${i}" r="6" fill="#fff"/>`).join("")}</svg>
      <div class="hc" id="hc" style="left:${cx - 85}px;top:${cy - 85}px"><img src="${L("whatsapp-icon")}" style="width:96px"><div class="hcl">${tx(g, "center", "Agent IA")}</div></div>
      ${g.tools.map((o, i) => `<div class="ht" id="t${i}" style="left:${o.x - 62}px;top:${o.y - 62}px"><div class="hi">${o.logo ? `<img src="${L(o.logo)}" style="width:66px">` : em(o.emoji, 82)}</div><div class="htl">${o.label}</div></div>`).join("")}`; },
    update: (t, g) => {
      const cx = 450, cy = 300;
      pop($("#hc"), t, 0, { s0: 0.5, dy: 0, d: 0.8 });
      $("#hc").style.boxShadow = `0 0 0 ${10 + 6 * Math.sin(t * 3)}px rgba(48,209,88,.16), 0 30px 80px rgba(0,0,0,.45)`;
      g.tools.forEach((o, i) => {
        const a = C(g, i, 0.5 + i * 0.5), q = eio(pr(t, a - 0.15, 0.45));
        const l = $("#l" + i); l.setAttribute("x2", cx + (o.x - cx) * q); l.setAttribute("y2", cy + (o.y - cy) * q); l.style.opacity = t < a - 0.15 ? 0 : 1;
        pop($("#t" + i), t, a + 0.1, { s0: 0.4, dy: 0, d: 0.7 });
        const d = $("#d" + i), ph = ((t - a - 0.5) * 0.7 + i * 0.17) % 1;      // donnée qui circule
        d.setAttribute("cx", cx + (o.x - cx) * ph); d.setAttribute("cy", cy + (o.y - cy) * ph);
        d.style.opacity = t > a + 0.5 ? Math.sin(Math.PI * ph) : 0;
      });
    },
  };

  /* chrono : réponse en quelques secondes */
  T.stopwatch = {
    w: 700, h: 540,
    html: (g) => `<svg class="ring" viewBox="0 0 300 300" id="rg"><circle cx="150" cy="150" r="128" class="rb"/><circle cx="150" cy="150" r="128" class="rf" id="rf"/></svg>
      <div class="rc"><div class="rn" id="rn">0</div><div class="ru">secondes</div></div>
      <div class="bub" id="bb">✓ Réponse envoyée</div>`,
    update: (t, g) => {
      const r = $("#rg"), q = eo(pr(t, 0, 0.6)); r.style.opacity = q; r.style.transform = `scale(${0.85 + 0.15 * spring(pr(t, 0, 0.8))})`;
      $(".rc").style.opacity = q;
      const T0 = 0.4, D = g.secs || 3, k = pr(t, T0, D * 0.55);
      const f = $("#rf"), Lc = 2 * Math.PI * 128; f.style.strokeDasharray = Lc; f.style.strokeDashoffset = Lc * (1 - k);
      $("#rn").textContent = Math.min(D, Math.floor(k * D + 0.0001)) + (k >= 1 ? "" : "");
      pop($("#bb"), t, T0 + D * 0.55 + 0.1, { s0: 0.6, dy: 20 });
    },
  };

  /* chatbot ✕ / employé IA ✓ */
  T.versus = {
    w: 900, h: 520,
    html: (g) => `<div class="card dark vs" id="a" style="left:20px">${em("robot", 170)}<div class="vt">Chatbot</div><div class="vsb">Réponses toutes faites</div><div class="strike" id="x"></div></div>
      <div class="card vs vsw" id="b" style="left:470px">${em("office_worker", 170)}<div class="vt">Employé IA</div><div class="vsb">Parle comme toi</div><div class="vbadge">✓</div></div>`,
    update: (t, g) => {
      pop($("#a"), t, 0, { s0: 0.85, dy: 30 });
      const xk = eo(pr(t, 0.45, 0.4)); $("#x").style.transform = `rotate(-24deg) scaleX(${xk})`;
      $("#a").style.opacity = Math.min(+$("#a").style.opacity, 1 - 0.45 * eo(pr(t, C(g, 0, 1.0), 0.4)));
      const b = $("#b"); pop(b, t, C(g, 0, 1.0), { s0: 0.6, dy: 30, d: 0.8 });
      b.style.boxShadow = `0 0 0 ${3 + 2 * Math.sin(t * 3)}px rgba(10,132,255,.9), 0 0 80px rgba(10,132,255,${0.45 * eo(pr(t, C(g, 0, 1), 0.6))}), 0 30px 80px rgba(0,0,0,.45)`;
      b.querySelector(".em").style.transform = `translateY(${Math.sin(t * 2.2) * 6}px)`;
    },
  };

  /* conversation WhatsApp : question du client, l'agent écrit puis répond */
  T.chat = {
    w: 760, h: 600,
    html: (g) => `<div class="wa" id="w"><div class="wah"><img src="${L("whatsapp-icon")}" style="width:40px"><div><b>${tx(g, "who", "Client")}</b><span id="st">en ligne</span></div></div>
      <div class="wab in" id="q">${g.q}<em>${g.tq || "22:00"}</em></div>
      <div class="wab out typing" id="ty"><span class="dots"><i></i><i></i><i></i></span></div>
      <div class="wab out" id="r">${g.r}<em>${g.tr || "22:00"} <b class="ticks">✓✓</b></em></div></div>`,
    update: (t, g) => {
      pop($("#w"), t, 0, { s0: 0.92, dy: 40 });
      pop($("#q"), t, 0.35, { s0: 0.8, dy: 16 });
      const ta = 0.9, ra = C(g, 0, 2.0);
      const ty = $("#ty"); ty.style.display = t >= ta && t < ra ? "" : "none";
      ty.querySelectorAll("i").forEach((d, j) => (d.style.opacity = 0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - j * 0.9))));
      $("#st").textContent = t >= ta && t < ra ? "écrit…" : "en ligne";
      pop($("#r"), t, ra, { s0: 0.8, dy: 16 });
    },
  };

  /* étapes reliées : engager → devis → réserver */
  T.steps = {
    w: 920, h: 380,
    html: (g) => `<div class="stl"><i id="sf"></i></div>${g.items.map((it, i) => `<div class="sp" id="p${i}" style="left:${70 + i * 300}px"><div class="spc">${em(it.emoji, 92)}</div><div class="spl">${it.label}</div></div>`).join("")}`,
    update: (t, g) => {
      const n = g.items.length;
      g.items.forEach((it, i) => pop($("#p" + i), t, C(g, i, i * 0.6), { s0: 0.5, dy: 20, d: 0.7 }));
      const last = C(g, n - 1, (n - 1) * 0.6); $("#sf").style.width = 100 * eio(pr(t, C(g, 0, 0), Math.max(0.5, last - C(g, 0, 0)))) + "%";
    },
  };

  /* bannière de notification iOS */
  T.banner = {
    w: 820, h: 260,
    html: (g) => `<div class="ban" id="b"><img src="${L("whatsapp-icon")}" style="width:64px"><div class="nb"><div class="nh"><b>${g.title}</b><span>${g.time || "maintenant"}</span></div><div class="nm">${g.text}</div></div></div>
      <div id="e" style="position:absolute;right:20px;top:-6px">${em(g.emoji || "bell", 96)}</div>`,
    update: (t, g) => { const q = pr(t, 0, 0.7), b = $("#b"); b.style.opacity = eo(q * 2); b.style.transform = `translateY(${(1 - spring(q)) * -120}px)`;
      const e = $("#e"); pop(e, t, 0.35, { s0: 0.3, dy: 0 }); e.style.transform += ` rotate(${Math.sin(t * 14) * 14 * Math.exp(-2 * Math.max(0, t - 0.4))}deg)`; },
  };

  /* fiche client puis tableau de bord */
  T.crm = {
    w: 860, h: 760,
    html: (g) => `<div class="card dash" id="d"><div class="dh"><b>Tableau de bord</b><span>Agent WhatsApp</span></div>
        <div class="kp"><div class="kpi"><span>Demandes traitées</span><b id="k1">0</b></div><div class="kpi"><span>Messages envoyés</span><b id="k2">0</b></div></div>
        <div id="rows">${g.rows.map((r, i) => `<div class="row" id="w${i}"><span class="av">${r.n[0]}</span><div class="rt"><b>${r.n}</b><span>${r.o} · ${r.d} · ${r.p} pers.</span></div><span class="sc" style="background:${r.s >= 8 ? "#e3f7e9" : "#eef6ea"}">${r.s}</span></div>`).join("")}</div></div>
      <div class="card fiche" id="f"><div class="fa">${g.client.n[0]}</div><div class="fn">${g.client.n}</div><div class="fo">${g.client.o}</div>
        <div class="fm"><span>📅 ${g.client.d}</span><span>👥 ${g.client.p} personnes</span></div>
        <svg class="fr" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="rb2"/><circle cx="60" cy="60" r="50" class="rf2" id="fr"/></svg><div class="fsc"><b id="fs">0</b><span>/10</span></div>
        <div class="fw">💬 Conversation WhatsApp qualifiée</div></div>`,
    update: (t, g) => {
      const db = C(g, 0, 3.0);
      const f = $("#f"); pop(f, t, 0, { s0: 0.85, dy: 40 });
      const sq = eio(pr(t, 0.5, 1.0)), Lc = 2 * Math.PI * 50; const fr = $("#fr"); fr.style.strokeDasharray = Lc; fr.style.strokeDashoffset = Lc * (1 - sq * g.client.s / 10);
      $("#fs").textContent = Math.round(g.client.s * sq);
      // la fiche rejoint le tableau de bord
      const m = eio(pr(t, db, 0.7));
      f.style.transform += ` translate(${m * -40}px, ${m * 150}px) scale(${1 - 0.35 * m})`;
      f.style.opacity = Math.min(+f.style.opacity, 1 - eo(pr(t, db + 0.4, 0.35)));
      const d = $("#d"); pop(d, t, db + 0.15, { s0: 0.9, dy: 50, d: 0.7 });
      const kq = eio(pr(t, db + 0.5, 1.4)); $("#k1").textContent = Math.round(g.k1 * kq); $("#k2").textContent = Math.round(g.k2 * kq).toLocaleString("fr-FR");
      g.rows.forEach((r, i) => pop($("#w" + i), t, db + 0.55 + i * 0.16, { s0: 0.97, dy: 0, dx: 50 }));
    },
  };

  /* anneau + grand chiffre (temps gagné) */
  T.ring = {
    w: 700, h: 540,
    html: (g) => `<svg class="ring" viewBox="0 0 300 300" id="rg"><circle cx="150" cy="150" r="128" class="rb"/><circle cx="150" cy="150" r="128" class="rf gold" id="rf"/></svg>
      <div class="rc"><div class="rn small" id="rn">${g.text}</div><div class="ru">${g.unit}</div></div><div class="kick2" id="k">${g.kicker}</div>`,
    update: (t, g) => {
      const r = $("#rg"), q = eo(pr(t, 0, 0.6)); r.style.opacity = q; r.style.transform = `scale(${0.85 + 0.15 * spring(pr(t, 0, 0.8))})`;
      $(".rc").style.opacity = eo(pr(t, 0.3, 0.4)); $(".rc").style.transform = `scale(${0.9 + 0.1 * spring(pr(t, 0.3, 0.8))})`;
      const f = $("#rf"), Lc = 2 * Math.PI * 128; f.style.strokeDasharray = Lc; f.style.strokeDashoffset = Lc * (1 - (g.fill || 0.75) * eio(pr(t, 0.2, 1.3)));
      fade($("#k"), t, 0.5);
    },
  };

  /* coût : salarié vs agent */
  T.cost = {
    w: 840, h: 440,
    html: (g) => `<div class="card dark cost" id="c"><div class="kick" style="position:static;text-align:left;margin-bottom:26px">${g.kicker}</div>
      ${g.rows.map((r, i) => `<div class="cr"><div class="crl">${r.emoji ? em(r.emoji, 54) : ""}<span>${r.label}</span></div><div class="crt"><i id="c${i}" style="background:${r.color}"></i></div><b id="v${i}">${r.v}</b></div>`).join("")}
      <div class="cbig" id="g">${g.big}</div></div>`,
    update: (t, g) => {
      pop($("#c"), t, 0, { s0: 0.92, dy: 40 });
      g.rows.forEach((r, i) => { $("#c" + i).style.width = r.w * eio(pr(t, 0.35 + i * 0.35, 0.9)) + "%"; $("#v" + i).style.opacity = eo(pr(t, 0.9 + i * 0.35, 0.3)); });
      pop($("#g"), t, C(g, 0, 1.4), { s0: 0.6, dy: 10 });
    },
  };

  /* prise de rendez-vous : créneau choisi puis confirmé */
  T.booking = {
    w: 760, h: 560,
    html: (g) => `<div class="card book" id="c"><div class="bh">${em("calendar", 70)}<div><b>Appel découverte</b><span>15 min · avec Robin · Luma</span></div></div>
      <div class="bd">${["Lun 13", "Mar 14", "Mer 15", "Jeu 16"].map((d, i) => `<span class="${i === 1 ? "on" : ""}">${d}</span>`).join("")}</div>
      <div class="bs">${["09:30", "11:00", "14:00", "16:30", "17:15", "18:00"].map((s, i) => `<span id="s${i}">${s}</span>`).join("")}</div>
      <div class="bok" id="ok">✓ Rendez-vous confirmé</div></div>`,
    update: (t, g) => {
      pop($("#c"), t, 0, { s0: 0.92, dy: 40 });
      const pick = C(g, 0, 1.6);
      [0, 1, 2, 3, 4, 5].forEach((i) => { const s = $("#s" + i); fade(s, t, 0.4 + i * 0.07, 0.35, 8);
        const k = i === 2 ? eo(pr(t, pick, 0.25)) : 0; s.style.background = k ? `rgba(10,132,255,${k})` : ""; s.style.color = k > 0.5 ? "#fff" : ""; });
      pop($("#ok"), t, pick + 0.5, { s0: 0.7, dy: 12 });
    },
  };

  window.TPL = T;
})();
