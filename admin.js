/* AFRICAN SHOP — espace administrateur (#/admin). L'accès est protégé côté serveur (Supabase, table admins + RLS). */
(() => {
  "use strict";
  const client = window.supabase.createClient("https://qcraptywhnhmtfrcujge.supabase.co", "sb_publishable_HA1knj5I84aIm9n-tP47fw_wr9ksGnv");
  const app = document.querySelector("#app");
  const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const money = n => Number(n || 0).toLocaleString("fr-FR") + " FCFA";
  const day = d => d ? new Date(d).toLocaleDateString("fr-FR") : "";
  let tab = "shops";
  const isAdminRoute = () => /^#\/admin/.test(location.hash);

  const style = `<style>
  .adm{max-width:960px;margin:26px auto;padding:0 18px 90px;color:var(--text)}
  .adm h1{font-size:1.9rem;margin:8px 0 14px}
  .adm .panel{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;margin:14px 0}
  .adm .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
  .adm .stat{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px}
  .adm .stat b{display:block;font-size:1.6rem;color:var(--orange)}.adm .stat span{color:var(--muted);font-size:.85rem}
  .adm .tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
  .adm .tabs button{padding:10px 16px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--text);font:inherit;font-weight:650;cursor:pointer}
  .adm .tabs button.on{background:var(--orange);border-color:var(--orange);color:#0a0c10}
  .adm .row{display:flex;gap:12px;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:12px 0;flex-wrap:wrap}
  .adm .row:last-child{border-bottom:0}.adm .muted{color:var(--muted);font-size:.88rem}
  .adm .tag{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.75rem;font-weight:700;border:1px solid var(--line)}
  .adm .tag.ok{color:#3ddc84;border-color:#3ddc84}.adm .tag.wait{color:var(--orange);border-color:var(--orange)}.adm .tag.off{color:#ff6b57;border-color:#ff6b57}
  .adm .acts{display:flex;gap:8px;flex-wrap:wrap}
  .adm .acts button{padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:transparent;color:var(--text);font:inherit;cursor:pointer}
  .adm .acts button.go{background:var(--orange);border-color:var(--orange);color:#0a0c10;font-weight:700}
  .adm .acts button.del{color:#ff6b57;border-color:#ff6b57}
  </style>`;
  const shell = body => { app.innerHTML = style + `<div class="adm">${body}</div>`; };
  const tag = s => `<span class="tag ${s==="active"?"ok":s==="pending"?"wait":"off"}">${safe(s)}</span>`;

  async function page() {
    shell(`<h1>Administration</h1><p class="muted">Vérification…</p>`);
    const { data: { user } } = await client.auth.getUser();
    if (!user) { location.hash = "#/compte"; return; }
    const { data: ok } = await client.rpc("is_admin");
    if (ok !== true) { shell(`<h1>Page introuvable</h1><p class="muted">Cette page n'existe pas.</p><p><a href="#/">Retour à l'accueil</a></p>`); return; }
    const [sh, pr, od] = await Promise.all([
      client.from("shops").select("*").order("created_at", { ascending: false }),
      client.from("products").select("id,title,price_fcfa,stock_quantity,status,shop_id,created_at").order("created_at", { ascending: false }),
      client.from("orders").select("id,order_number,status,payment_status,total_fcfa,created_at,buyer_name,buyer_phone,delivery_city").order("created_at", { ascending: false }).limit(100)
    ]);
    const shops = sh.data || [], prods = pr.data || [], orders = od.data || [];
    const shopName = id => (shops.find(s => s.id === id) || {}).name || "—";
    const revenue = orders.filter(o => o.payment_status === "paid").reduce((t, o) => t + Number(o.total_fcfa || 0), 0);
    const pending = shops.filter(s => s.status === "pending").length;
    let list = "";
    if (tab === "shops") list = shops.map(s => `<div class="row"><div><strong>${safe(s.name)}</strong> ${tag(s.status)}<div class="muted">${safe(s.city)} · ${safe(s.category)} · WhatsApp ${safe(s.whatsapp_number)} · ${day(s.created_at)}</div></div><div class="acts">${s.status!=="active"?`<button class="go" data-shop="${s.id}" data-st="active">Valider</button>`:`<button data-shop="${s.id}" data-st="suspended">Suspendre</button>`}<button class="del" data-delshop="${s.id}">Supprimer</button></div></div>`).join("") || `<p class="muted">Aucune boutique.</p>`;
    if (tab === "products") list = prods.map(p => `<div class="row"><div><strong>${safe(p.title)}</strong> ${tag(p.status)}<div class="muted">${safe(shopName(p.shop_id))} · ${money(p.price_fcfa)} · stock ${p.stock_quantity}</div></div><div class="acts">${p.status==="active"?`<button data-prod="${p.id}" data-st="inactive">Masquer</button>`:`<button class="go" data-prod="${p.id}" data-st="active">Réactiver</button>`}<button class="del" data-delprod="${p.id}">Supprimer</button></div></div>`).join("") || `<p class="muted">Aucun produit.</p>`;
    if (tab === "orders") list = orders.map(o => `<div class="row"><div><strong>${safe(o.order_number)}</strong> <span class="tag">${safe(o.status)}</span> <span class="tag ${o.payment_status==="paid"?"ok":"wait"}">${safe(o.payment_status)}</span><div class="muted">${safe(o.buyer_name)} · ${safe(o.buyer_phone)} · ${safe(o.delivery_city)} · ${day(o.created_at)}</div></div><strong>${money(o.total_fcfa)}</strong></div>`).join("") || `<p class="muted">Aucune commande.</p>`;
    const tabs = [["shops", `Boutiques${pending ? " (" + pending + ")" : ""}`], ["products", "Produits"], ["orders", "Commandes"]];
    shell(`<h1>Administration</h1>
      <div class="stats"><div class="stat"><b>${shops.length}</b><span>Boutiques</span></div><div class="stat"><b>${pending}</b><span>À valider</span></div><div class="stat"><b>${prods.length}</b><span>Produits</span></div><div class="stat"><b>${orders.length}</b><span>Commandes</span></div><div class="stat"><b>${money(revenue)}</b><span>Payé (100 dernières)</span></div></div>
      <div class="tabs">${tabs.map(t => `<button class="${tab===t[0]?"on":""}" data-tab="${t[0]}">${t[1]}</button>`).join("")}</div>
      <div class="panel">${list}</div>`);
  }

  async function act(q, label, okMsg) {
    if (label && !confirm(label)) return;
    const r = await q;
    if (r.error) { alert(r.error.message); return; }
    page();
  }

  document.addEventListener("click", e => {
    if (!isAdminRoute()) return;
    const t = e.target.closest("[data-tab],[data-shop],[data-delshop],[data-prod],[data-delprod]");
    if (!t) return;
    const d = t.dataset;
    if (d.tab) { tab = d.tab; page(); }
    else if (d.shop) act(client.from("shops").update({ status: d.st }).eq("id", d.shop));
    else if (d.delshop) act(client.from("shops").delete().eq("id", d.delshop), "Supprimer cette boutique ?");
    else if (d.prod) act(client.from("products").update({ status: d.st }).eq("id", d.prod));
    else if (d.delprod) act(client.from("products").delete().eq("id", d.delprod), "Supprimer ce produit ?");
  });

  /* Raccourci discret dans l'espace vendeur, visible uniquement pour l'administrateur */
  async function shortcut() {
    if (!/^#\/vendeur/.test(location.hash)) return;
    setTimeout(async () => {
      const { data } = await client.rpc("is_admin");
      const box = document.querySelector(".commerce .panel");
      if (data === true && box && !box.querySelector("[data-admin-link]")) box.insertAdjacentHTML("beforeend", `<p><a data-admin-link href="#/admin">Ouvrir l'administration</a></p>`);
    }, 900);
  }

  function route() { if (isAdminRoute()) page(); else shortcut(); }
  window.addEventListener("hashchange", route);
  route();
})();
