/* African Shop — catalogue public synchronisé avec Appwrite TablesDB */
(() => {
  "use strict";
  const C=window.AS_APPWRITE;
  if(!C||!window.Appwrite||typeof BOUTIQUES==="undefined"||typeof PRODUITS==="undefined") return;
  const client=new Appwrite.Client().setEndpoint(C.endpoint).setProject(C.projectId);
  const tables=new Appwrite.TablesDB(client);
  const storage=new Appwrite.Storage(client);
  const {Query}=Appwrite;
  const mediaUrl=id=>{try{return id?storage.getFileView({bucketId:C.bucketId,fileId:id}).href:"";}catch(e){return "";}};
  async function load(){
    BOUTIQUES.splice(0,BOUTIQUES.length);
    PRODUITS.splice(0,PRODUITS.length);
    try{
      const [shopsResult,productsResult]=await Promise.all([
        tables.listRows({databaseId:C.databaseId,tableId:"shops",queries:[Query.equal("status","active"),Query.limit(100)]}),
        tables.listRows({databaseId:C.databaseId,tableId:"products",queries:[Query.equal("status","active"),Query.limit(200)]})
      ]);
      const shops=(shopsResult.rows||[]).map(s=>({
        id:s.$id,nom:s.name,ville:s.city||"",quartier:s.district||"",
        categories:s.category?[s.category]:[],description:s.description||"",
        horaires:"",livraison:"À convenir avec le commerçant.",
        whatsapp:s.whatsapp_number||"",logo:mediaUrl(s.logo_file_id),cover:mediaUrl(s.cover_file_id),exemple:false
      }));
      const shopIds=new Set(shops.map(s=>s.id));
      const products=(productsResult.rows||[]).filter(p=>shopIds.has(p.shop_id)).map(p=>({
        id:p.$id,boutique:p.shop_id,categorie:p.category||"autres",
        nom:p.title,prix:Number(p.price_fcfa||0),
        photo:mediaUrl(p.image_file_id),dispo:Number(p.stock_quantity||0)>0,
        description:p.description||""
      }));
      BOUTIQUES.splice(0,BOUTIQUES.length,...shops);
      PRODUITS.splice(0,PRODUITS.length,...products);
      window.dispatchEvent(new Event("hashchange"));
      window.dispatchEvent(new CustomEvent("africanshop:catalog-loaded",{detail:{shops:shops.length,products:products.length}}));
    }catch(error){
      console.error("African Shop : catalogue Appwrite indisponible",error);
      window.dispatchEvent(new CustomEvent("africanshop:catalog-error",{detail:{message:error.message||"Erreur de lecture Appwrite"}}));
    }
  }
  load();
  window.addEventListener("africanshop:refresh-catalog",load);
})();