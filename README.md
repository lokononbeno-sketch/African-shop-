# African Shop

Plateforme de découverte de boutiques et de produits, avec pages publiques, panier et commandes à confirmer directement avec les commerçants.

## Périmètre et configuration

Ce dépôt concerne African Shop uniquement.

- Dépôt GitHub : [lokononbeno-sketch/African-shop-](https://github.com/lokononbeno-sketch/African-shop-)
- Projet Appwrite : `6af6ffad001c6379a9da` (région Frankfurt)
- Base TablesDB : `african_shop_db`
- Bucket médias : `african_shop_media`
- Plateforme web déclarée : `lokononbeno-sketch.github.io`

Tables présentes : `profiles`, `shops`, `products`, `shopping_carts`, `cart_items`, `orders` et `order_items`.

## Parcours de l’application

- Connexion par e-mail avec code à usage unique.
- Espace vendeur multi-boutiques : un compte peut créer et gérer plusieurs boutiques.
- Fiche boutique : modification du nom, de la catégorie, de la ville, du quartier, du numéro WhatsApp et de la description.
- Médias de boutique : aperçu du logo et de la couverture actuels, remplacement ou retrait explicite. Les fichiers doivent être des images JPG, PNG, WebP ou GIF, de 50 Mo maximum.
- Produits : création avec jusqu’à 12 photos ou vidéos, 50 Mo maximum par fichier.
- Pages publiques : les liens utilisent les routes hash `#/b/{id}` pour les boutiques et `#/p/{id}` pour les produits.
- Catalogue : seuls les éléments au statut `active` sont chargés; les produits ne sont affichés que si leur boutique est active.
- Partage : liens copiables et partage vers WhatsApp/Facebook. Les aperçus enrichis Open Graph ne sont pas générés par les routes hash statiques.

La connexion téléphonique est affichée comme indisponible dans l’interface actuelle. Le panier est conservé localement sur l’appareil.

## API serveur et sécurité

La fonction Appwrite `african-shop-api` est activée sur Node.js 22. Au 18 novembre 2026, le déploiement actif vérifié est `6afdaeb17bc20a729517`, état `ready`. La fonction dispose des scopes TablesDB rows read/write et Storage files read/write.

Toutes les routes métier exigent un JWT de session Appwrite transmis dans `x-appwrite-user-jwt`. La fonction vérifie ce JWT auprès de l’endpoint Account.

- `POST /shops/create` crée une boutique en attente.
- `POST /shops/update` vérifie le propriétaire avant de modifier les informations et les références du logo/couverture.
- `POST /products/create` vérifie la boutique propriétaire, le type MIME réel des fichiers et le visuel principal.
- `GET /moderation/queue` et `POST /moderation/approve` exigent un profil dont le rôle serveur est `admin`.
- L’approbation attribue la lecture publique aux lignes et médias concernés. Le rejet retire la lecture publique des médias traités.
- `POST /orders/create` relit produits et boutiques, vérifie les stocks, recalcule les montants, décrémente les stocks et écrit commande et lignes dans une transaction TablesDB.
- `POST /seller/order-status` vérifie que le vendeur possède la boutique de la ligne, applique les transitions permises et recalcule le statut global de la commande.

Les tables sensibles utilisent `rowSecurity: true`. Les commandes principales sont lisibles par l’acheteur; les lignes sont lisibles par l’acheteur et le vendeur concerné. Les données d’adresse et de téléphone ne sont pas exposées dans les lignes vendeur.

Le bucket `african_shop_media` utilise `fileSecurity: true`, autorise la création par les utilisateurs connectés et accepte la lecture publique au niveau du bucket. La visibilité effective de chaque média dépend de ses permissions de fichier : les fichiers privés restent limités à leur propriétaire et les médias approuvés reçoivent `read("any")` par le serveur. Avant toute association à une boutique ou à un produit, le serveur exige que le compte vendeur possède à la fois les permissions de lecture et de suppression sur le fichier; un média simplement partagé en lecture seule ne peut pas être republié par ce vendeur.

## Vérifications observées le 18 novembre 2026

- Schéma `shops` : `logo_file_id` et `cover_file_id` sont disponibles.
- Schéma `products` : `media_file_ids` et `media_mime_types` sont disponibles en tableaux.
- Tables `shops`, `products`, `orders`, `order_items`, `shopping_carts` et `cart_items` : aucune ligne métier présente lors du contrôle.
- Table `profiles` : un profil administrateur est présent; sa ligne est protégée par des permissions individuelles.
- Bucket `african_shop_media` : fichiers sécurisés, taille maximale 50 Mo, extensions image et vidéo déclarées.
- Test d’exécution réel sans JWT sur `GET /moderation/queue` : HTTP 401 `Connexion requise.` avec le déploiement actif. Cela vérifie le démarrage et le garde d’authentification, pas le parcours administrateur authentifié.
- Les fichiers JavaScript du front-end et de la fonction sont contrôlés syntaxiquement avant les commits.

- Lorsqu’un vendeur refuse une ligne encore en attente, le serveur restaure atomiquement la quantité réservée dans le stock, dans la même transaction que le changement de statut.
- Le catalogue ne vide plus les données déjà affichées avant le chargement Appwrite : il remplace les listes après le succès des deux lectures et ignore les réponses d’un rafraîchissement devenu obsolète.

## Limites non vérifiées

- Aucun compte acheteur ou vendeur de test n’a été utilisé pour un parcours complet authentifié.
- Aucun téléversement réel de logo/couverture ou de galerie produit n’a été réalisé depuis l’interface.
- Aucune boutique ni aucun produit n’étant présent, l’affichage réel des pages publiques et des médias n’a pas été validé avec des données.
- Les validations administrateur n’ont pas été testées avec une session administrateur réelle.
- Les commandes, transitions et réservations de stock n’ont pas été testées avec des comptes acheteur/vendeur réels.
- Aucun paiement en ligne n’est configuré; paiement et livraison sont convenus directement entre acheteur et commerçant.
- Aucun déploiement du site GitHub Pages n’est affirmé dans ce compte rendu.

## Fichiers principaux

- `index.html` : SDK Appwrite et configuration du projet.
- `commerce.js` : authentification, espace vendeur, modération et commandes.
- `functions/african-shop-api/index.js` : API serveur et contrôles d’accès.
- `catalogue-appwrite.js` : synchronisation du catalogue public.
- `app.js` : pages publiques et navigation.
- `admin.js` : point d’entrée administratif.
