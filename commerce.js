/* African Shop — espace client, panier et espace vendeur */
(() => {
  const SUPABASE_URL = "https://qcraptywhnhmtfrcujge.supabase.co";
  const SUPABASE_KEY = "sb_publishable_HA1knj5I84aIm9n-tP47fw_wr9ksGnv";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const app = document.querySelector("#app");
  const money = n => Number(n || 0).toLocaleString("fr-FR") + " FCFA";
  const imageUrl = path => path ? client.storage.from("african-shop-products").getPublicUrl(path).data.publicUrl : "";
  const productUrl = id => location.origin + location.pathname + "#/p/" + encodeURIComponent(id);
  const shareHtml = p => { const url=productUrl(p.id), text=encodeURIComponent(`${p.title} — ${money(p.price_fcfa)}\n${url}`); return `<div class="share"><a target="_blank" rel="noopener" href="https://wa.me/?text=${text}">Partager WhatsApp</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">Partager Facebook</a></div>`; };
  const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const css = `<style>
  .commerce{max-width:900px;margin:26px auto;padding:0 18px 40px;color:var(--text)}
  .commerce h1{font-size:2rem;margin:8px 0}.commerce h2{font-size:1.35rem;margin:18px 0 10px}
  .commerce .panel{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;margin:14px 0}
  .commerce label{display:block;font-weight:650;margin:10px 0 5px}
  .commerce input,.commerce textarea,.commerce select{width:100%;padding:12px;border:1.5px solid var(--line);border-radius:10px;background:var(--paper);color:var(--text);font:inherit}
  .commerce textarea{min-height:80px}.commerce .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .commerce .rowitem{display:flex;gap:12px;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:12px 0}
  .commerce .muted{color:var(--muted);font-size:.9rem}.commerce .product-thumb{width:76px;height:76px;object-fit:cover;border-radius:10px;background:var(--paper)}.commerce .product-card{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}.commerce .share a{display:inline-block;margin:4px 8px 4px 0}.commerce .msg{padding:12px;border-radius:10px;background:var(--creme);margin:10px 0}
  .commerce button:disabled{opacity:.5}.commerce .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  @media(max-width:560px){.commerce .grid{grid-template-columns:1fr}}
  </style>`;
  const btn = (label, act, cls="") => `<button class="btn ${cls}" type="button" data-commerce="${act}">${label}</button>`;
  let currentUser = null;
  let activeShop = null;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const say = (msg, bad=false) => { const el=document.querySelector("#commerce-msg"); if(el){el.textContent=msg;el.style.color=bad?"#b4472d":"inherit";} else alert(msg); };
  const wrap = (title, body) => { app.innerHTML=css+`<div class="commerce"><p class="fil"><a href="#/">Accueil</a> › African Shop</p><h1 class="serif">${title}</h1><div id="commerce-msg" class="msg" hidden></div>${body}</div>` };
  const message = (s,err=false) => {const e=document.querySelector("#commerce-msg");if(e){e.hidden=false;e.textContent=s;e.style.color=err?"#ff6b57":"inherit";}};
  async function authPage(){
    const {data:{user}}=await client.auth.getUser(); currentUser=user;
    if(user){location.hash="#/vendeur";return;}
    wrap("Mon compte",`<div class="panel">
      <h2>Connexion par e-mail</h2>
      <p>Entre ton adresse e-mail. Nous t'enverrons un code à 6 chiffres. Vérifie aussi les courriers indésirables.</p>
      <form id="email-form"><label>Adresse e-mail</label><input type="email" name="email" autocomplete="email" required placeholder="toi@exemple.com"><div class="actions"><button class="btn" type="submit">Envoyer le code</button></div></form>
      <form id="otp-form" hidden><label>Code à 6 chiffres</label><input name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="123456"><div class="actions"><button class="btn" type="submit">Vérifier le code</button><button class="pbtn" id="resend-code" type="button">Renvoyer le code</button></div></form>
      <p class="muted">Si le code n'arrive pas, vérifie les spams. Un lien de confirmation ne remplace pas le code : le modèle d'e-mail doit afficher {{ .Token }}.</p>
    </div>
    <div class="panel"><h2>Connexion avec numéro de téléphone</h2><p class="muted">Sans SMS : utilise ton numéro et ton mot de passe. Cette méthode fonctionne pour un compte téléphone déjà créé et confirmé.</p><form id="phone-form"><label>Numéro au format international</label><input name="phone" type="tel" autocomplete="tel" placeholder="+22901..." required><label>Mot de passe</label><input name="password" type="password" autocomplete="current-password" required><button class="btn" type="submit">Se connecter avec mon numéro</button></form></div>
    `);
    const sendCode=async email=>{const b=document.querySelector('#email-form button[type="submit"]');if(b)b.disabled=true;try{const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+location.pathname}});if(error)throw error;sessionStorage.setItem("as_email",email);document.querySelector("#otp-form").hidden=false;message("Demande envoyée. Vérifie ta boîte de réception et les spams. Si aucun message n'arrive, le service d'envoi d'e-mails doit être configuré.");}catch(err){message(err.message||"Envoi impossible.",true);}finally{if(b)b.disabled=false;}};
    document.querySelector("#email-form").onsubmit=async e=>{e.preventDefault();await sendCode(String(new FormData(e.target).get("email")).trim().toLowerCase());};
    document.querySelector("#resend-code").onclick=async()=>{const email=sessionStorage.getItem("as_email");if(email)await sendCode(email);else message("Saisis d'abord ton adresse e-mail.",true);};
    document.querySelector("#otp-form").onsubmit=async e=>{e.preventDefault();const email=sessionStorage.getItem("as_email");const token=String(new FormData(e.target).get("token")).trim();if(!email){message("Demande d'abord un code avec ton adresse e-mail.",true);return;}const b=e.target.querySelector('button[type="submit"]');b.disabled=true;try{const {error}=await client.auth.verifyOtp({email,token,type:"email"});if(error)throw error;sessionStorage.removeItem("as_email");location.hash="#/vendeur";}catch(err){message(err.message||"Code invalide ou expiré.",true);}finally{b.disabled=false;}};
    document.querySelector("#phone-form").onsubmit=async e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));const b=e.target.querySelector('button[type="submit"]');const phone=String(v.phone||"").trim().replace(/[\s().-]/g,"");b.disabled=true;b.textContent="Connexion…";try{if(!/^\+[1-9]\d{7,14}$/.test(phone))throw new Error("Saisis ton numéro au format international, par exemple +229XXXXXXXX.");const {error}=await client.auth.signInWithPassword({phone,password:v.password});if(error)throw error;location.hash="#/vendeur";}catch(err){message(err.message||"Connexion téléphone impossible.",true);}finally{b.disabled=false;b.textContent="Se connecter avec mon numéro";}};
  }
  async function getCart(){
    const {data:{user}}=await client.auth.getUser();if(!user){location.hash="#/compte";return null;}
    let {data:cart,error}=await client.from("shopping_carts").select("id").eq("user_id",user.id).eq("status","open").maybeSingle();
    if(error)throw error;
    if(!cart){const r=await client.from("shopping_carts").insert({user_id:user.id}).select("id").single();if(r.error)throw r.error;cart=r.data;}
    return cart.id;
  }
  async function addCart(productId,qty=1){
    qty=Math.max(1,Math.min(99,Math.floor(Number(qty))||1));
    const cartId=await getCart();if(!cartId)return;
    const {data:existing}=await client.from("cart_items").select("id,quantity").eq("cart_id",cartId).eq("product_id",productId).maybeSingle();
    const r=existing?await client.from("cart_items").update({quantity:existing.quantity+qty}).eq("id",existing.id):await client.from("cart_items").insert({cart_id:cartId,product_id:productId,quantity:qty});
    if(r.error)throw r.error;message("Produit ajouté au panier.");location.hash="#/panier";
  }
  async function articlePage(id){
    app.innerHTML=css+'<div class="commerce"><p class="muted">Chargement…</p></div>';
    try{
      if(!UUID.test(id)){wrap("Article introuvable",'<div class="panel"><p>Cet article n\'existe pas ou n\'est plus disponible.</p><a class="btn" href="#/">Retour à l\'accueil</a></div>');return;}
      const {data:p,error}=await client.from("products").select("id,title,description,price_fcfa,image_path,stock_quantity,status,category,shops(name,city,district,whatsapp_number,status)").eq("id",id).maybeSingle();
      if(error)throw error;
      if(!p){wrap("Article introuvable",'<div class="panel"><p>Cet article n\'existe pas ou n\'est plus disponible.</p><a class="btn" href="#/">Retour à l\'accueil</a></div>');return;}
      const shop=p.shops||{};
      const dispo=p.status==="active"&&Number(p.stock_quantity)>0;
      const img=p.image_path?imageUrl(p.image_path):"";
      const lieu=[shop.district,shop.city].filter(Boolean).join(", ");
      const num=String(shop.whatsapp_number||"").replace(/\D/g,"");
      const waMsg=`Bonjour ${shop.name||""} 👋 Je suis intéressé(e) par « ${p.title} » (${money(p.price_fcfa)}) vu sur African Shop : ${productUrl(p.id)}`;
      document.title=p.title+" | African Shop";
      app.innerHTML=css+`<div class="wrap page"><a class="retour" href="#/produits"><svg class="ic" aria-hidden="true"><use href="#i-back"/></svg>Produits</a>
        <div id="commerce-msg" class="msg" hidden></div>
        <div class="fiche"><div><div class="vis" style="--h:${(parseInt(p.id.slice(0,4),16)||0)%360}"><svg class="ic" aria-hidden="true"><use href="#i-bag"/></svg>${img?`<img src="${safe(img)}" alt="${safe(p.title)}" onerror="this.remove()">`:""}${dispo?"":'<div class="rupture">Indisponible</div>'}</div></div>
        <div style="display:grid;gap:14px">
          <div><h1 style="margin-bottom:6px">${safe(p.title)}</h1><p class="prix">${money(p.price_fcfa)}</p><p class="etat${dispo?"":" non"}" style="margin-top:6px">${dispo?"En stock":"Indisponible"}</p></div>
          ${p.description?`<p style="color:#d3d8dd">${safe(p.description)}</p>`:""}
          ${shop.name?`<div class="lien-b"><span><strong>${safe(shop.name)}</strong><small>${safe(lieu)}</small></span></div>`:""}
          ${dispo?`<div class="qte"><span>Quantité</span><div class="stepper"><button type="button" data-aqte="-1" aria-label="Moins">−</button><output id="aq" data-max="${Number(p.stock_quantity)}" data-price="${Number(p.price_fcfa)}">1</output><button type="button" data-aqte="1" aria-label="Plus">+</button></div><span class="total" id="aq-total">${money(p.price_fcfa)}</span></div>
          <button class="btn bloc" id="add-article" type="button" data-article="${safe(p.id)}"><svg class="ic" aria-hidden="true"><use href="#i-cart"/></svg>Ajouter au panier</button>`:'<p class="note">Cet article est indisponible pour le moment.</p>'}
          ${num?`<a class="btn noir bloc" target="_blank" rel="noopener" href="https://wa.me/${num}?text=${encodeURIComponent(waMsg)}"><svg class="ic" aria-hidden="true"><use href="#i-chat"/></svg>Contacter le vendeur</a>`:""}
          <div class="partage"><h3>Partager cet article</h3><div class="pbtns" style="margin-top:10px">${shareHtml(p).replace(/<div class="share">|<\/div>/g,"").replace(/<a /g,'<a class="pbtn" ')}</div></div>
        </div></div></div>`;
      document.querySelectorAll("[data-n]").forEach(el=>el.classList.toggle("actif",el.dataset.n==="produits"));
    }catch(e){wrap("Article",'<div class="panel">'+safe(e.message)+'</div>');}
  }
  async function cartPage(){
    try {
      const cartId=await getCart(); if(!cartId)return;
      const q=await client.from("cart_items").select("id,quantity,products(id,title,price_fcfa,image_path,stock_quantity,status,shops(name,whatsapp_number))").eq("cart_id",cartId);
      if(q.error)throw q.error;
      const items=(q.data||[]).filter(x=>x.products);
      const total=items.reduce((n,x)=>n+x.quantity*x.products.price_fcfa,0);
      const ord=await client.from("orders").select("id,order_number,status,payment_status,total_fcfa,created_at").order("created_at",{ascending:false}).limit(20);
      if(ord.error)throw ord.error;
      const lines=items.map(x=>'<div class="rowitem"><div><strong>'+safe(x.products.title)+'</strong><div class="muted">'+money(x.products.price_fcfa)+' · Quantité : '+x.quantity+'</div></div><div>'+money(x.products.price_fcfa*x.quantity)+'<br><button class="pbtn" data-remove="'+x.id+'">Retirer</button></div></div>').join("");
      const history=(ord.data||[]).map(o=>'<div class="rowitem"><div><strong>'+safe(o.order_number)+'</strong><div class="muted">'+new Date(o.created_at).toLocaleDateString("fr-FR")+' · '+safe(o.status)+' · '+safe(o.payment_status)+'</div><strong>'+money(o.total_fcfa)+'</strong></div>'+(o.status==="pending_payment"&&o.payment_status==="unpaid"?'<button class="pbtn" data-cancel-order="'+o.id+'">Annuler</button>':'')+'</div>').join("");
      const firstShop=items[0]?.products?.shops||{};
      const waMessage="Bonjour "+(firstShop.name||"African Shop")+" 👋\nJe souhaite commander :\n"+items.map(x=>"• "+x.products.title+" × "+x.quantity+" — "+money(x.products.price_fcfa*x.quantity)).join("\n")+"\nTotal : "+money(total)+"\n(vu sur African Shop)\nPouvez-vous me confirmer la disponibilité, le paiement et la livraison ?";
      const waNumber=String(firstShop.whatsapp_number||"").replace(/\D/g,"");
      const waLink="https://wa.me/"+(waNumber||"2290149293939")+"?text="+encodeURIComponent(waMessage);
      wrap("Mon panier",(items.length?'<div class="panel">'+lines+'<h2>Total provisoire : '+money(total)+'</h2><div style="display:grid;gap:10px;margin:14px 0"><a class="btn wa bloc" href="'+waLink+'" target="_blank" rel="noopener">💬 Envoyer ma commande sur WhatsApp</a></div><p class="muted">Paiement en ligne désactivé. La commande sera enregistrée comme non payée.</p><form id="checkout-form"><label>Nom complet</label><input name="buyer_name" required minlength="2"><label>Téléphone</label><input name="buyer_phone" required minlength="6"><label>Ville de livraison</label><input name="delivery_city" required minlength="2"><label>Adresse de livraison</label><textarea name="delivery_address" required minlength="3"></textarea><button class="btn" type="submit">Confirmer la commande (sans paiement)</button></form></div>':'<div class="panel">Ton panier est vide pour le moment.</div>')+'<div class="panel"><h2>Mes commandes récentes</h2>'+(history||'<p class="muted">Aucune commande pour le moment.</p>')+'</div>');
      document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=async()=>{const r=await client.from("cart_items").delete().eq("id",b.dataset.remove);if(r.error)message(r.error.message,true);else cartPage();});
      const cf=document.querySelector("#checkout-form");
      if(cf)cf.onsubmit=async e=>{e.preventDefault();const b=cf.querySelector('button[type="submit"]');b.disabled=true;try{const v=Object.fromEntries(new FormData(cf));const r=await client.rpc("checkout_cart",{p_buyer_name:v.buyer_name,p_buyer_phone:v.buyer_phone,p_delivery_city:v.delivery_city,p_delivery_address:v.delivery_address});if(r.error)throw r.error;message("Commande créée. Elle est en attente et non payée.");cartPage();}catch(err){message(err.message,true);b.disabled=false;}};
      document.querySelectorAll("[data-cancel-order]").forEach(b=>b.onclick=async()=>{if(!confirm("Annuler cette commande et remettre les articles en stock ?"))return;b.disabled=true;const r=await client.rpc("cancel_unpaid_order",{p_order_id:b.dataset.cancelOrder});if(r.error){message(r.error.message,true);b.disabled=false;}else{message("Commande annulée et stock restauré.");cartPage();}});
    } catch(e) { wrap("Mon panier",'<div class="panel">'+safe(e.message)+'</div>'); }
  }
  async function vendorPage(){
    const {data:{user}}=await client.auth.getUser();currentUser=user;
    if(!user){location.hash="#/compte";return;}
    const {data:shops,error}=await client.from("shops").select("*").eq("owner_id",user.id).order("created_at");
    if(error){wrap("Espace vendeur",safe(error.message));return;}
    activeShop=shops?.[0]||null;
    const shopForm=`<div class="panel"><h2>Créer une boutique</h2><form id="shop-form"><label>Nom de la boutique</label><input name="name" required><div class="grid"><div><label>Catégorie</label><select name="category"><option>Mode</option><option>Beauté</option><option>Alimentation</option><option>Électronique</option><option>Maison</option><option>Artisanat</option><option>Autre</option></select></div><div><label>Ville</label><input name="city" required></div></div><label>Quartier</label><input name="district"><label>WhatsApp (format international, ex. 22901...)</label><input name="whatsapp_number"><label>Description</label><textarea name="description"></textarea><button class="btn" type="submit">Envoyer la boutique pour validation</button></form></div>`;
    const shopInfo=activeShop?`<div class="panel"><h2>${safe(activeShop.name)}</h2><p class="muted">Statut : ${safe(activeShop.status)} · ${safe(activeShop.city)}</p><p>${safe(activeShop.description)}</p><h2>Ajouter un produit</h2><form id="product-form"><label>Photo du produit</label><input name="product_image" type="file" accept="image/jpeg,image/png,image/webp" required><label>Nom du produit</label><input name="title" required><label>Description</label><textarea name="description"></textarea><div class="grid"><div><label>Catégorie</label><input name="category" required></div><div><label>Prix (FCFA)</label><input name="price_fcfa" type="number" min="1" required></div><div><label>Stock</label><input name="stock_quantity" type="number" min="0" value="1"></div></div><button class="btn" type="submit">Publier le produit</button></form></div>`:"";
    const {data:products}=activeShop?await client.from("products").select("*").eq("shop_id",activeShop.id).order("created_at",{ascending:false}):{data:[]};
    wrap("Espace vendeur",`<div class="panel"><p>Connecté : <strong>${safe(user.email)}</strong></p>${btn("Me déconnecter","logout","sec")}</div>${activeShop?shopInfo:shopForm}<div class="panel"><h2>Mes produits</h2>${(products||[]).map(p=>`<div class="product-card">${p.image_path?`<img class="product-thumb" src="${safe(imageUrl(p.image_path))}" alt="">`:""}<div style="flex:1"><strong>${safe(p.title)}</strong><div><strong>${money(p.price_fcfa)}</strong></div><div class="muted">Stock ${p.stock_quantity} · ${safe(p.status)}</div>${shareHtml(p)}</div><div class="actions"><button class="pbtn" data-edit="${p.id}">Modifier</button><button class="pbtn" data-delete="${p.id}">Supprimer</button></div></div>`).join("")||'<p class="muted">Aucun produit publié.</p>'}</div><div class="panel"><h2>Mes commandes</h2><p class="muted">Les commandes et paiements seront activés après validation du parcours de paiement.</p></div>`);
    const sf=document.querySelector("#shop-form");if(sf)sf.onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(sf));const slug=f.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")+"-"+Math.random().toString(36).slice(2,7);const {error}=await client.from("shops").insert({...f,slug,owner_id:user.id,status:"pending"});if(error)message(error.message,true);else{message("Boutique envoyée. Elle sera visible après validation.");vendorPage();}};
    const pf=document.querySelector("#product-form");if(pf)pf.onsubmit=async e=>{e.preventDefault();const submit=pf.querySelector('button[type="submit"]');submit.disabled=true;let uploadedPath=null;try{const fd=new FormData(pf);const file=fd.get("product_image");if(!file||!file.size)throw new Error("Ajoute une photo du produit.");if(file.size>5*1024*1024)throw new Error("La photo ne doit pas dépasser 5 Mo.");if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Format accepté : JPG, PNG ou WebP.");const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";uploadedPath=activeShop.id+"/"+crypto.randomUUID()+"."+ext;const up=await client.storage.from("african-shop-products").upload(uploadedPath,file,{contentType:file.type,upsert:false});if(up.error)throw up.error;const f={title:String(fd.get("title")).trim(),description:String(fd.get("description")||"").trim(),category:String(fd.get("category")).trim(),price_fcfa:Number(fd.get("price_fcfa")),stock_quantity:Number(fd.get("stock_quantity")),shop_id:activeShop.id,status:"active",image_path:uploadedPath};const {error}=await client.from("products").insert(f);if(error)throw error;message("Produit publié avec sa photo.");vendorPage();}catch(err){if(uploadedPath)await client.storage.from("african-shop-products").remove([uploadedPath]);message(err.message||"Impossible d'enregistrer le produit.",true);submit.disabled=false;}};
    document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(!confirm("Supprimer ce produit ?"))return;const {error}=await client.from("products").delete().eq("id",b.dataset.delete);if(error)message(error.message,true);else vendorPage();});
    document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=async()=>{const p=products.find(x=>x.id===b.dataset.edit);const title=prompt("Nom du produit",p.title);if(title===null)return;const price=prompt("Prix en FCFA",p.price_fcfa);if(price===null)return;const {error}=await client.from("products").update({title,price_fcfa:Number(price)}).eq("id",p.id);if(error)message(error.message,true);else vendorPage();});
  }
  document.addEventListener("click",async e=>{
    const action=e.target.closest("[data-commerce]")?.dataset.commerce;
    if(action==="logout"){await client.auth.signOut();location.hash="#/compte";}
    /* Produits de démonstration (boutiques.js) : laisser WhatsApp s'ouvrir normalement. */
    const add=e.target.closest("#cmd[data-p]");
    if(add&&!UUID.test(add.dataset.p))return;
    if(add){
      e.preventDefault();e.stopImmediatePropagation();
      const q=parseInt(document.querySelector("#qte")?.textContent,10)||1;
      try{await addCart(add.dataset.p,q);}catch(err){alert(err.message);}
      return;
    }
    /* Page article Supabase : quantité et ajout au panier. */
    const aq=e.target.closest("[data-aqte]");
    if(aq){
      const o=document.querySelector("#aq");if(!o)return;
      const max=Math.max(1,Number(o.dataset.max)||99);
      const q=Math.max(1,Math.min(max,99,(parseInt(o.textContent,10)||1)+Number(aq.dataset.aqte)));
      o.textContent=q;
      const t=document.querySelector("#aq-total");if(t)t.textContent=money(q*Number(o.dataset.price));
      return;
    }
    const addA=e.target.closest("#add-article");
    if(addA){
      const q=parseInt(document.querySelector("#aq")?.textContent,10)||1;
      addA.disabled=true;
      try{await addCart(addA.dataset.article,q);}catch(err){message(err.message||"Ajout impossible.",true);addA.disabled=false;}
    }
  },true);
  async function render(){
    const path = location.hash.replace(/^#\/?/, "").split("/")[0];
    if(path==="compte")await authPage();
    if(path==="panier")await cartPage();
    if(path==="vendeur")await vendorPage();
  }
  window.addEventListener("hashchange",render);
  client.auth.onAuthStateChange(()=>{if(["compte","vendeur","panier"].includes(location.hash.replace(/^#\/?/,"").split("/")[0]))render();});
  if(["compte","vendeur","panier"].includes(location.hash.replace(/^#\/?/,"").split("/")[0]))render();
  document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('a[href="#/ouvrir"]').forEach(a=>{a.href="#/vendeur";a.textContent=a.textContent.replace("Ouvrir ma boutique","Espace vendeur");});});
  /* Fiche d'un produit Supabase : liens de partage #/p/<id> et #/article/<id> */
  function renderArticle(){
    const parts=location.hash.replace(/^#\/?/,"").split("/").map(x=>{try{return decodeURIComponent(x);}catch(e){return x;}});
    if(parts[1]&&(parts[0]==="article"||(parts[0]==="p"&&UUID.test(parts[1]))))articlePage(parts[1]);
  }
  window.addEventListener("hashchange",renderArticle);
  renderArticle();
})();