/* =====================================================================
   AFRICAN SHOP — programme. Pas besoin d'y toucher.
   Tes boutiques et tes produits sont dans boutiques.js.
   ===================================================================== */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => Number(n).toLocaleString("fr-FR") + " FCFA";
  const norm = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const cat = id => CATEGORIES.find(c => c.id === id) || { id: id, nom: id, icone: "🛍️" };
  const bout = id => BOUTIQUES.find(b => b.id === id);
  const prodsDe = id => PRODUITS.filter(p => p.boutique === id);
  const numero = b => (b && b.whatsapp) || SHOP.whatsapp;
  const base = () => location.origin + location.pathname;
  const wa = (n, msg) => "https://wa.me/" + n + "?text=" + encodeURIComponent(msg);
  const teinte = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const initiales = nom => String(nom).replace(/[^\p{L}\s]/gu, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const estExemple = p => !!(p.exemple || (bout(p.boutique) || {}).exemple);

  /* ---------- Éléments d'interface ---------- */
  const visuel = p => `<div class="vis" style="--h:${teinte(p.id)}"><span aria-hidden="true">${cat(p.categorie).icone}</span>${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.nom)}" loading="lazy" onerror="this.remove()">` : ""}${p.dispo === false ? '<div class="rupture">Indisponible</div>' : ""}</div>`;
  const avatar = (b, grand) => `<span class="av${grand ? " g" : ""}" style="--h:${teinte(b.id)}">${esc(initiales(b.nom))}${b.logo ? `<img src="${esc(b.logo)}" alt="" onerror="this.remove()">` : ""}</span>`;
  const lieu = b => [b.quartier, b.ville].filter(Boolean).join(", ");
  const carteProduit = p => { const b = bout(p.boutique) || {}; return `<a class="prod" href="#/p/${esc(p.id)}">${estExemple(p) ? '<em class="tag">Exemple</em>' : ""}${visuel(p)}<h3>${esc(p.nom)}</h3><p class="prix">${fmt(p.prix)}</p><p class="de">${esc(b.nom || "")}</p></a>`; };
  const carteBoutique = b => `<a class="bout" href="#/b/${esc(b.id)}">${avatar(b)}<div><h3 class="serif">${esc(b.nom)}${b.exemple ? ' <em class="tag" style="position:static;display:inline-block;vertical-align:middle">Exemple</em>' : ""}</h3><p>${esc(lieu(b))}</p><p>${b.categories.map(c => cat(c).icone + " " + cat(c).nom).join(" · ")}</p></div><span class="go" aria-hidden="true">→</span></a>`;
  const chips = actif => `<div class="chips">${CATEGORIES.map(c => `<a class="chip${c.id === actif ? " actif" : ""}" href="#/c/${esc(c.id)}"><span aria-hidden="true">${c.icone}</span>${esc(c.nom)}</a>`).join("")}</div>`;
  const note = '<p class="note">Ceci est un exemple de démonstration : il sera remplacé par de vraies boutiques et de vrais produits.</p>';

  function partage(lien, texte, titre) {
    const l = encodeURIComponent(lien), t = encodeURIComponent(texte + " " + lien);
    const gen = navigator.share ? `<button class="pbtn" type="button" data-act="partager" data-lien="${esc(lien)}" data-texte="${esc(texte)}">Partager…</button>` : "";
    return `<div class="partage"><h3 class="serif">${esc(titre)}</h3><p>Envoie-le à tes amis en un clic.</p><div class="pbtns">${gen}<a class="pbtn" href="https://wa.me/?text=${t}" target="_blank" rel="noopener">WhatsApp</a><a class="pbtn" href="https://www.facebook.com/sharer/sharer.php?u=${l}" target="_blank" rel="noopener">Facebook</a><button class="pbtn" type="button" data-act="copier" data-lien="${esc(lien)}">Copier le lien</button></div></div>`;
  }

  function pied() {
    return `<footer class="pied"><div class="wrap"><a class="marque" href="#/"><i></i>AFRICAN SHOP</a><p>${esc(SHOP.slogan)} Pensé pour le commerce africain 🇧🇯</p><div class="liens"><a href="#/boutiques">Boutiques</a><a href="#/ouvrir">Ouvrir ma boutique</a><a href="#/conditions">Conditions et conseils</a><a href="${wa(SHOP.whatsapp, "Bonjour African Shop, j'ai une question.")}" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a></div><p>© ${new Date().getFullYear()} African Shop. African Shop met en relation acheteurs et commerçants : la vente se conclut entre eux.</p></div></footer>`;
  }

  /* ---------- Commande ---------- */
  function lienCommande(p, q) {
    const b = bout(p.boutique);
    const msg = `Bonjour ${b ? b.nom : ""} 👋\nJe souhaite commander :\n• ${p.nom} × ${q}\nTotal : ${fmt(p.prix * q)}\n(vu sur African Shop : ${base()}#/p/${p.id})\nPouvez-vous me confirmer la disponibilité, le paiement et la livraison ?`;
    return wa(numero(b), msg);
  }

  /* ---------- Pages ---------- */
  function accueil() {
    const bs = BOUTIQUES.slice(0, 4), ps = PRODUITS.slice(0, 8);
    return { t: "Le commerce africain", n: "accueil", h: `
<section class="hero"><div class="wrap">
  <p class="eyebrow">African Shop · Bénin</p>
  <h1 class="serif">Les boutiques de <mark>chez nous</mark>, à portée de WhatsApp.</h1>
  <p class="sous">${esc(SHOP.slogan)} Découvre des produits, choisis, et commande directement auprès du commerçant.</p>
  <div class="boutons"><a class="btn" href="#/boutiques">Explorer les boutiques</a><a class="btn clair" href="#/ouvrir">Ouvrir ma boutique</a></div>
</div><div class="wax"></div></section>
<div class="wrap">
  <div class="rassure"><div><span>🛒</span>Commande en un clic</div><div><span>💬</span>Directement sur WhatsApp</div><div><span>🤝</span>Paiement convenu avec le commerçant</div></div>
  <section class="s"><div class="tete"><h2 class="serif">Catégories</h2></div>${chips("")}</section>
  <section class="s"><div class="tete"><h2 class="serif">Boutiques à découvrir</h2><a href="#/boutiques">Toutes →</a></div><div class="bouts">${bs.map(carteBoutique).join("")}</div></section>
  <section class="s"><div class="tete"><h2 class="serif">Produits à découvrir</h2><a href="#/produits">Tous →</a></div><div class="prods">${ps.map(carteProduit).join("")}</div></section>
  <section class="s"><div class="tete"><h2 class="serif">Comment ça marche</h2></div><div class="etapes">
    <div class="etape"><div><h3>Choisis</h3><p>Parcours les boutiques et trouve le produit qui te plaît.</p></div></div>
    <div class="etape"><div><h3>Commande sur WhatsApp</h3><p>Un bouton ouvre la conversation avec le commerçant, ta commande déjà écrite.</p></div></div>
    <div class="etape"><div><h3>Convenez ensemble</h3><p>Paiement, livraison ou retrait : vous vous mettez d'accord directement.</p></div></div>
  </div></section>
  <div class="vendre"><div class="in"><h2 class="serif">Tu es commerçant ? Ouvre ta boutique.</h2><p>Présente tes produits à des clients près de chez toi, et reçois les commandes directement sur ton WhatsApp.</p><a class="btn" href="#/ouvrir">Ouvrir ma boutique</a></div><div class="wax"></div></div>
</div>` };
  }

  function listeBoutiques() {
    return { t: "Boutiques", n: "boutiques", h: `<div class="wrap page"><h1 class="serif">Boutiques</h1><p class="lead">${BOUTIQUES.length} boutique${BOUTIQUES.length > 1 ? "s" : ""} près de chez toi.</p>${chips("")}<div class="bouts" style="margin-top:14px">${BOUTIQUES.map(carteBoutique).join("")}</div></div>` };
  }

  function listeProduits() {
    return { t: "Produits", n: "produits", h: `<div class="wrap page"><h1 class="serif">Tous les produits</h1><p class="lead">${PRODUITS.length} produit${PRODUITS.length > 1 ? "s" : ""}.</p>${chips("")}<div class="prods" style="margin-top:14px">${PRODUITS.map(carteProduit).join("")}</div></div>` };
  }

  function categorie(id) {
    const c = cat(id), ps = PRODUITS.filter(p => p.categorie === id), bs = BOUTIQUES.filter(b => b.categories.includes(id));
    return { t: c.nom, n: "produits", h: `<div class="wrap page"><p class="fil"><a href="#/produits">Produits</a> › ${esc(c.nom)}</p><h1 class="serif">${c.icone} ${esc(c.nom)}</h1>${chips(id)}
      ${bs.length ? `<h2 class="serif" style="margin:18px 0 10px;font-size:1.25rem">Boutiques</h2><div class="bouts">${bs.map(carteBoutique).join("")}</div>` : ""}
      <h2 class="serif" style="margin:22px 0 10px;font-size:1.25rem">Produits</h2>
      ${ps.length ? `<div class="prods">${ps.map(carteProduit).join("")}</div>` : '<p class="vide">Aucun produit dans cette catégorie pour le moment.</p>'}</div>` };
  }

  function boutique(id) {
    const b = bout(id); if (!b) return introuvable();
    const ps = prodsDe(id);
    const msg = `Bonjour ${b.nom} 👋 Je vous écris depuis African Shop (${base()}#/b/${b.id}).`;
    return { t: b.nom, n: "boutiques", h: `<div class="wrap page"><p class="fil"><a href="#/boutiques">Boutiques</a> › ${esc(b.nom)}</p>
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:14px">${avatar(b, true)}<div><h1 class="serif" style="margin:0">${esc(b.nom)}</h1><p class="lead" style="margin:2px 0 0">${esc(lieu(b))}</p></div></div>
      ${b.exemple ? note : ""}
      <p style="margin-bottom:12px">${esc(b.description)}</p>
      <div class="infos" style="margin-bottom:16px">${b.horaires ? `<div><span>🕒</span><span>${esc(b.horaires)}</span></div>` : ""}${b.livraison ? `<div><span>🚚</span><span>${esc(b.livraison)}</span></div>` : ""}</div>
      <a class="btn wa bloc" href="${wa(numero(b), msg)}" target="_blank" rel="noopener">💬 Écrire à la boutique</a>
      <h2 class="serif" style="margin:26px 0 12px;font-size:1.3rem">Produits de la boutique</h2>
      ${ps.length ? `<div class="prods">${ps.map(carteProduit).join("")}</div>` : '<p class="vide">Cette boutique n\'a pas encore publié de produit.</p>'}
      <div style="margin-top:24px">${partage(base() + "#/b/" + b.id, "Découvre « " + b.nom + " » sur African Shop.", "Partager cette boutique")}</div></div>` };
  }

  function produit(id) {
    const p = PRODUITS.find(x => x.id === id); if (!p) return introuvable();
    const b = bout(p.boutique) || {}, c = cat(p.categorie), dispo = p.dispo !== false;
    const autres = prodsDe(p.boutique).filter(x => x.id !== p.id).slice(0, 4);
    return { t: p.nom, n: "produits", h: `<div class="wrap page"><p class="fil"><a href="#/c/${esc(c.id)}">${esc(c.nom)}</a> › ${esc(p.nom)}</p>
      <div class="fiche"><div>${visuel(p)}</div><div style="display:grid;gap:14px">
        <div><h1 class="serif" style="margin-bottom:4px">${esc(p.nom)}</h1><p class="prix">${fmt(p.prix)}</p></div>
        ${estExemple(p) ? note : ""}
        <p>${esc(p.description)}</p>
        ${b.id ? `<a class="lien-b" href="#/b/${esc(b.id)}">${avatar(b)}<span><strong>${esc(b.nom)}</strong><small>${esc(lieu(b))}</small></span></a>` : ""}
        ${dispo ? `<div class="qte"><span>Quantité</span><div class="stepper"><button type="button" data-act="qte" data-d="-1" aria-label="Moins">−</button><output id="qte">1</output><button type="button" data-act="qte" data-d="1" aria-label="Plus">+</button></div><span class="total" id="total">${fmt(p.prix)}</span></div>
        <a class="btn wa bloc" id="cmd" data-p="${esc(p.id)}" href="${lienCommande(p, 1)}" target="_blank" rel="noopener">💬 Commander sur WhatsApp</a>
        <p style="font-size:.84rem;color:var(--muted)">Ta commande s'écrit toute seule dans WhatsApp. Le paiement et la livraison se décident avec le commerçant.</p>` : '<p class="note">Ce produit est indisponible pour le moment.</p>'}
        ${partage(base() + "#/p/" + p.id, "Regarde « " + p.nom + " » sur African Shop : " + fmt(p.prix) + ".", "Partager ce produit")}
      </div></div>
      ${autres.length ? `<h2 class="serif" style="margin:30px 0 12px;font-size:1.3rem">Autres produits de la boutique</h2><div class="prods">${autres.map(carteProduit).join("")}</div>` : ""}</div>` };
  }

  function resultats(q) {
    const n = norm(q).trim(); if (!n) return '<p class="vide">Tape un mot : un produit, une boutique, une catégorie…</p>';
    const ps = PRODUITS.filter(p => norm([p.nom, p.description, cat(p.categorie).nom, (bout(p.boutique) || {}).nom].join(" ")).includes(n));
    const bs = BOUTIQUES.filter(b => norm([b.nom, b.description, b.ville, b.quartier, b.categories.map(c => cat(c).nom).join(" ")].join(" ")).includes(n));
    if (!ps.length && !bs.length) return '<p class="vide">Aucun résultat. Essaie un autre mot.</p>';
    return (bs.length ? `<h2 class="serif" style="margin:18px 0 10px;font-size:1.2rem">Boutiques</h2><div class="bouts">${bs.map(carteBoutique).join("")}</div>` : "") +
           (ps.length ? `<h2 class="serif" style="margin:22px 0 10px;font-size:1.2rem">Produits</h2><div class="prods">${ps.map(carteProduit).join("")}</div>` : "");
  }
  function chercher() {
    return { t: "Chercher", n: "chercher", h: `<div class="wrap page"><h1 class="serif">Chercher</h1><div class="recherche" style="margin-top:12px"><input id="q" type="search" placeholder="Un produit, une boutique, un quartier…" autocomplete="off" aria-label="Chercher"></div><div id="res">${resultats("")}</div></div>` };
  }

  function ouvrir() {
    const msg = "Bonjour African Shop, je voudrais ouvrir ma boutique.\nNom de la boutique :\nVille / quartier :\nCe que je vends :";
    return { t: "Ouvrir ma boutique", n: "vendre", h: `<div class="wrap page"><h1 class="serif">Ouvre ta boutique sur African Shop</h1>
      <p class="lead">Présente tes produits à des clients près de chez toi, et reçois les commandes directement sur ton WhatsApp.</p>
      <div class="etapes" style="margin-bottom:22px">
        <div class="etape"><div><h3>Écris-nous sur WhatsApp</h3><p>Dis-nous qui tu es et ce que tu vends.</p></div></div>
        <div class="etape"><div><h3>Envoie tes produits</h3><p>Pour chaque produit : une belle photo, le nom, le prix en FCFA et une courte description.</p></div></div>
        <div class="etape"><div><h3>Ta boutique est publiée</h3><p>Une fois vérifiée, elle apparaît sur African Shop avec un bouton de commande.</p></div></div>
      </div>
      <h2 class="serif" style="font-size:1.25rem;margin-bottom:8px">Ce qu'il nous faut</h2>
      <div class="texte"><p>• Le nom de ta boutique, ton quartier et ta ville</p><p>• Ton numéro WhatsApp pour recevoir les commandes</p><p>• Tes horaires et ton mode de livraison (ou retrait sur place)</p><p>• Les photos et prix de tes produits</p></div>
      <p class="note" style="margin-top:14px">${esc(SHOP.offre)}</p>
      <a class="btn wa bloc" style="margin-top:6px" href="${wa(SHOP.whatsapp, msg)}" target="_blank" rel="noopener">💬 Ouvrir ma boutique sur WhatsApp</a></div>` };
  }

  function conditions() {
    return { t: "Conditions et conseils", n: "", h: `<div class="wrap page texte"><h1 class="serif">Conditions et conseils</h1>${CONDITIONS.map(([t, x]) => `<h3 class="serif">${esc(t)}</h3>${x.split("\n").map(l => `<p>${esc(l)}</p>`).join("")}`).join("")}</div>` };
  }
  function introuvable() {
    return { t: "Page introuvable", n: "", h: '<div class="wrap page"><h1 class="serif">Page introuvable</h1><p class="lead">Cette page n\'existe pas ou n\'existe plus.</p><a class="btn" href="#/">Retour à l\'accueil</a></div>' };
  }

  /* ---------- Navigation ---------- */
  function route() {
    let p;
    try { p = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent); } catch (e) { p = ["?"]; }
    const [a, b] = p;
    const page = !a ? accueil() : a === "boutiques" ? listeBoutiques() : a === "produits" ? listeProduits()
      : a === "c" ? categorie(b) : a === "b" ? boutique(b) : a === "p" ? produit(b)
      : a === "chercher" ? chercher() : a === "ouvrir" ? ouvrir() : a === "conditions" ? conditions() : introuvable();
    $("#app").innerHTML = page.h + pied();
    document.title = (page.n === "accueil" ? "African Shop | " : "") + page.t + (page.n === "accueil" ? "" : " | African Shop");
    document.querySelectorAll("[data-n]").forEach(el => el.classList.toggle("actif", el.dataset.n === page.n));
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act;
    if (act === "qte") {
      const o = $("#qte"), cmd = $("#cmd"); if (!o || !cmd) return;
      const q = Math.max(1, Math.min(99, (parseInt(o.textContent, 10) || 1) + parseInt(b.dataset.d, 10)));
      const p = PRODUITS.find(x => x.id === cmd.dataset.p);
      o.textContent = q; $("#total").textContent = fmt(p.prix * q); cmd.href = lienCommande(p, q);
    } else if (act === "partager") {
      navigator.share({ title: "African Shop", text: b.dataset.texte, url: b.dataset.lien }).catch(() => {});
    } else if (act === "copier") {
      (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.lien).then(() => { b.textContent = "Lien copié ✓"; }) : Promise.reject())
        .catch(() => window.prompt("Copie le lien :", b.dataset.lien));
    }
  });
  document.addEventListener("input", e => { if (e.target.id === "q") $("#res").innerHTML = resultats(e.target.value); });
  window.addEventListener("hashchange", route);
  route();
})();
