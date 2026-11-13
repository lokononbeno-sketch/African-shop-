/* AFRICAN SHOP — animations : apparition au défilement, chargement, retour d'ajout au panier */
(function () {
  "use strict";
  var root = document.documentElement;
  var app = document.getElementById("app");
  if (!app) return;
  var reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) {}

  /* Éléments qui apparaissent en glissant */
  var SEL = [
    ".hero .eyebrow", ".hero h1", ".hero .sous", ".hero .recherche-pill", ".hero .boutons",
    ".rassure", ".cat", ".promo", ".s .tete", ".prod", ".bout", ".etape", ".vendre",
    ".page h1", ".page .lead", ".page .retour", ".page .chips", ".boutique-tete", ".fiche > div",
    ".sous-titre", ".partage", ".infos", ".recherche", ".commerce h1", ".commerce .panel"
  ].join(",");

  var splash = root.classList.contains("sp");
  var ready = !splash;
  var seen = typeof WeakSet === "function" ? new WeakSet() : null;
  var io = null;

  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.setProperty("--d", Math.min(n++, 8) * 60 + "ms");
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  }

  function scan() {
    if (reduce) return;
    app.querySelectorAll(SEL).forEach(function (el) {
      if (seen && seen.has(el)) return;
      if (seen) seen.add(el);
      el.classList.add("rv");
      if (!io) { el.classList.add("in"); return; }
      if (ready) io.observe(el);
    });
  }
  function observePending() {
    if (!io) return;
    app.querySelectorAll(".rv:not(.in)").forEach(function (el) { io.observe(el); });
  }

  /* Squelette à la place des « Chargement… » */
  function skeleton() {
    var s = '<div class="skel" role="status" aria-label="Chargement"><i class="sk sk-t"></i><i class="sk sk-l"></i><div class="sk-g"><i class="sk sk-c"></i><i class="sk sk-c"></i></div></div>';
    var v = app.querySelector(".vide, .commerce > p.muted");
    if (v && /^Chargement/.test((v.textContent || "").trim())) v.outerHTML = s;
  }

  function glow() {
    if (reduce) return;
    var h = app.querySelector(".hero");
    if (h && !h.querySelector(".hero-glow")) {
      var g = document.createElement("span");
      g.className = "hero-glow"; g.setAttribute("aria-hidden", "true");
      h.insertBefore(g, h.firstChild);
    }
  }

  function refresh() { skeleton(); glow(); scan(); }

  new MutationObserver(function () {
    window.requestAnimationFrame(refresh);
  }).observe(app, { childList: true });
  refresh();

  /* Fin de l'écran d'accueil */
  if (splash) {
    setTimeout(function () { ready = true; observePending(); }, 1000);
    setTimeout(function () {
      root.classList.remove("sp");
      var s = document.getElementById("splash"); if (s) s.remove();
    }, 1800);
  }

  /* Barre de progression et ombre de l'en-tête */
  var bar = null;
  if (!reduce) { bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar); }
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var max = root.scrollHeight - root.clientHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      var hd = document.querySelector("header.top");
      if (hd) hd.classList.toggle("scrolled", window.scrollY > 8);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", onScroll);
  onScroll();

  /* Retour visuel quand un article est ajouté au panier (on arrive alors sur #/panier) */
  var pendingAdd = 0;
  function mark() { pendingAdd = Date.now(); }
  document.addEventListener("pointerdown", function (e) { if (e.target.closest("#add-article,#cmd")) mark(); });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest("#add-article,#cmd")) mark();
  });
  window.addEventListener("hashchange", function () {
    if (!pendingAdd || Date.now() - pendingAdd > 10000) return;
    if (!/^#\/panier/.test(location.hash)) return;
    pendingAdd = 0;
    if (!reduce) {
      document.querySelectorAll('a[href="#/panier"] .ic').forEach(function (el) {
        el.classList.remove("bump"); void el.getBoundingClientRect(); el.classList.add("bump");
        el.addEventListener("animationend", function () { el.classList.remove("bump"); }, { once: true });
      });
    }
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>Ajouté au panier';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2500);
  });
})();
