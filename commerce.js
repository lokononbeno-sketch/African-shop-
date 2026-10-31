/* African Shop — espace client, panier et espace vendeur */
(() => {
  const SUPABASE_URL = "https://qcraptywhnhmtfrcujge.supabase.co";
  const SUPABASE_KEY = "sb_publishable_HA1knj5I84aIm9n-tP47fw_wr9ksGnv";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const app = document.querySelector("#app");
  const money = n => Number(n || 0).toLocaleString("fr-FR") + " FCFA";
  const imageUrl = path => path ? client.storage.from("african-shop-products").getPublicUrl(path).data.publicUrl : "";
  const productUrl = id => location.origin + location.pathname + "#/article/" + encodeURIComponent(id);
  const shareHtml = p => { const url=productUrl(p.id), text=encodeURIComponent(`${p.title} — ${money(p.price_fcfa)}\n${url}`); return `<div class="share"><a target="_blank" rel="noopener" href="https://wa.me/?text=${text}">Partager WhatsApp</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">Partager Facebook</a></div>`; };
  const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
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
  const say = (msg, bad=false) => { const el=document.querySelector("#commerce-msg"); if(el){el.textContent=msg;el.style.color=bad?"#b4472d":"inherit";} else alert(msg); };
  const wrap = (title, body) => { app.innerHTML=css+`<div class="commerce"><p class="fil"><a href="#/">Accueil</a> › African Shop</p><h1 class="serif">${title}</h1><div id="commerce-msg" class="msg" hidden></div>${body}</div>` };
  const message = (s,err=false) => {const e=document.querySelector("#commerce-msg");if(e){e.hidden=false;e.textContent=s;e.style.color=err?"#b4472d":"inherit";}};
  async function authPage(){
    const {data:{user}}=await client.auth.getUser(); currentUser=user;
    if(user){location.hash="#/vendeur";return;}
    wrap("Mon compte",`<div class="panel"><p>Connecte-toi ou crée ton compte avec ton adresse e-mail. Tu recevras un code à 6 chiffres. Aucun SMS ne sera envoyé.</p>
      <form id="email-form"><label>Adresse e-mail</label><input type="email" name="email" required placeholder="toi@exemple.com"><div class="actions"><button class="btn" type="submit">Recevoir mon code</button></div></form>
      <form id="otp-form" hidden><label>Code reçu par e-mail</label><input name="token" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required placeholder="123456"><div class="actions"><button class="btn" type="submit">Valider le code</button></div></form><p class="muted">Pense à vérifier les courriers indésirables.</p></div>`);
    document.querySelector("#email-form").onsubmit=async e=>{e.preventDefault();const email=new FormData(e.target).get("email").trim();const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:true}});if(error)message(error.message,true);else{sessionStorage.setItem("as_email",email);document.querySelector("#otp-form").hidden=false;message("Code envoyé. Consulte ta boîte e-mail.");}};
    document.querySelector("#otp-form").onsubmit=async e=>{e.preventDefault();const email=sessionStorage.getItem("as_email");const token=new FormData(e.target).get("token").trim();const {error}=await client.auth.verifyOtp({email,token,type:"email"});if(error)message(error.message,true);else{sessionStorage.removeItem("as_email");location.hash="#/vendeur";}};
  }
  async function getCart(){
    const {data:{user}}=await client.auth.getUser();if(!user){location.hash="#/compte";return null;}
    let {data:cart,error}=await client.from("shopping_carts").select("id").eq("user_id",user.id).eq("status","open").maybeSingle();
    if(error)throw error;
    if(!cart){const r=await client.from("shopping_carts").insert({user_id:user.id}).select("id").single();if(r.error)throw r.error;cart=r.data;}
    return cart.id;
  }
  async function addCart(productId){
    const cartId=await getCart();if(!cartId)return;
    const {data:existing}=await client.from("cart_items").select("id,quantity").eq("cart_id",cartId).eq("product_id",productId).maybeSingle();
    const r=existing?await client.from("cart_items").update({quantity:existing.quantity+1}).eq("id",existing.id):await client.from("cart_items").insert({cart_id:cartId,product_id:productId,quantity:1});
    if(r.error)throw r.error;message("Produit ajouté au panier.");location.hash="#/panier";
  }
  async function cartPage(){
    try{
      const cartId=await getCart();if(!cartId)return;
      const {data,error}=await client.from("cart_items").select("id,quantity,products(id,title,price_fcfa,image_path,stock_quantity,status,shops(name,status))").eq("cart_id",cartId);
      if(error)throw error;
      const items=(data||[]).filter(x=>x.products);
      const total=items.reduce((s,x)=>s+x.quantity*x.products.price_fcfa,0);
      wrap("Mon panier",items.length?`<div class="panel">${items.map(x=>`<div class="rowitem"><div><strong>${safe(x.products.title)}</strong><div class="muted">${money(x.products.price_fcfa)} · Quantité : ${x.quantity}</div></div><div>${money(x.products.price_fcfa*x.quantity)}<br><button class="pbtn" data-remove="${x.id}">Retirer</button></div></div>`).join("")}<h2>Total provisoire : ${money(total)}</h2><p class="muted">Le paiement en ligne est temporairement désactivé. Tu peux conserver ton panier.</p></div>`:'<div class="panel">Ton panier est vide pour le moment.</div>');
      document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=async()=>{const r=await client.from("cart_items").delete().eq("id",b.dataset.remove);if(r.error)message(r.error.message,true);else cartPage();});
    }catch(e){wrap("Mon panier",`<div class="panel">${safe(e.message)}</div>`);}
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
    const sf=document.querySelector("#shop-form");if(sf)sf.onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(sf));const slug=f.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")+"-"+Math.random().toString(36).slice(2,7);const {error}=await client.from("shops").insert({...f,slug,owner_id:user.id,status:"pending"});if(error)message(error.message,true);else{message("Boutique envoyée. Elle sera visible après validation.");vendorPage();}};
    const pf=document.querySelector("#product-form");if(pf)pf.onsubmit=async e=>{e.preventDefault();const submit=pf.querySelector('button[type="submit"]');submit.disabled=true;let uploadedPath=null;try{const fd=new FormData(pf);const file=fd.get("product_image");if(!file||!file.size)throw new Error("Ajoute une photo du produit.");if(file.size>5*1024*1024)throw new Error("La photo ne doit pas dépasser 5 Mo.");if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Format accepté : JPG, PNG ou WebP.");const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";uploadedPath=activeShop.id+"/"+crypto.randomUUID()+"."+ext;const up=await client.storage.from("african-shop-products").upload(uploadedPath,file,{contentType:file.type,upsert:false});if(up.error)throw up.error;const f={title:String(fd.get("title")).trim(),description:String(fd.get("description")||"").trim(),category:String(fd.get("category")).trim(),price_fcfa:Number(fd.get("price_fcfa")),stock_quantity:Number(fd.get("stock_quantity")),shop_id:activeShop.id,status:"active",image_path:uploadedPath};const {error}=await client.from("products").insert(f);if(error)throw error;message("Produit publié avec sa photo.");vendorPage();}catch(err){if(uploadedPath)await client.storage.from("african-shop-products").remove([uploadedPath]);message(err.message||"Impossible d'enregistrer le produit.",true);submit.disabled=false;}};
    document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(!confirm("Supprimer ce produit ?"))return;const {error}=await client.from("products").delete().eq("id",b.dataset.delete);if(error)message(error.message,true);else vendorPage();});
    document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=async()=>{const p=products.find(x=>x.id===b.dataset.edit);const title=prompt("Nom du produit",p.title);if(title===null)return;const price=prompt("Prix en FCFA",p.price_fcfa);if(price===null)return;const {error}=await client.from("products").update({title,price_fcfa:Number(price)}).eq("id",p.id);if(error)message(error.message,true);else vendorPage();});
  }
  document.addEventListener("click",async e=>{
    const action=e.target.closest("[data-commerce]")?.dataset.commerce;
    if(action==="logout"){await client.auth.signOut();location.hash="#/compte";}
    const add=e.target.closest("#cmd[data-p]");
    if(add){e.preventDefault();e.stopImmediatePropagation();try{await addCart(add.dataset.p);}catch(err){alert(err.message);}}
  },true);
  async function render(){
    const path=location.hash.replace(/^#\/?/,"").split("/")[0];
    if(path==="compte")await authPage();
    if(path==="panier")await cartPage();
    if(path==="vendeur")await vendorPage();
    if(path==="article"&&parts[1])await articlePage(parts[1]);
  }
  window.addEventListener("hashchange",render);
  client.auth.onAuthStateChange(()=>{if(["compte","vendeur","panier"].includes(location.hash.replace(/^#\/?/,"").split("/")[0]))render();});
  if(["compte","vendeur","panier"].includes(location.hash.replace(/^#\/?/,"").split("/")[0]))render();
  document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('a[href="#/ouvrir"]').forEach(a=>{a.href="#/vendeur";a.textContent=a.textContent.replace("Ouvrir ma boutique","Espace vendeur");});});
})();