# African Shop

Plateforme de découverte de boutiques et produits, avec contact et commandes WhatsApp.

## Backend actuel : Appwrite

Le projet African Shop utilise son propre projet Appwrite. Les autres applications du propriétaire ne sont pas concernées.

- Projet Appwrite : `6af6ffad001c6379a9da`
- Région : Frankfurt (`fra`)
- Base TablesDB : `african_shop_db`
- Bucket médias : `african_shop_media`
- Tables créées : `profiles`, `shops`, `products`, `shopping_carts`, `cart_items`, `orders`, `order_items`
- Plateforme Web autorisée : `lokononbeno-sketch.github.io`

## Authentification

- E-mail : demande de code et vérification du code.
- Téléphone : connexion par numéro et mot de passe, sans SMS, pour un compte téléphone déjà provisionné.
- La création autonome d'un compte téléphone sans SMS nécessite un endpoint serveur sécurisé. Ne jamais placer de clé API secrète Appwrite dans le JavaScript du navigateur.

## Fichiers principaux

- `index.html` : configuration du SDK Appwrite et chargement de l'application.
- `catalogue-appwrite.js` : charge uniquement les boutiques et produits validés depuis Appwrite, sans données de démonstration.
- `commerce.js` : code e-mail OTP, espace vendeur multi-boutiques, création de boutiques, dépôt de médias et partage social.
- `admin.js` : point d'entrée administratif; les actions sont gérées par `commerce.js`.
- `app.js` : catalogue de démonstration et navigation existants.
- `boutiques.js` : données de démonstration.

## Important — état de migration

La connexion Supabase a été retirée des fichiers principaux `index.html`, `commerce.js` et `admin.js`. La base Appwrite et le stockage sont créés.

La lecture du catalogue public est maintenant reliée à TablesDB via `catalogue-appwrite.js`. Les données d'exemple locales sont masquées dès le chargement : seules les boutiques et produits `active` ayant des permissions de lecture publique peuvent apparaître. Chaque compte vendeur peut créer plusieurs boutiques indépendantes, sélectionner celle qu'il veut gérer et publier ses propres produits avec photos et vidéos. L'espace vendeur fournit des liens de partage de chaque boutique et de chaque produit vers WhatsApp, Facebook et par copie de lien. Les pages publiques sont alimentées par le catalogue Appwrite et n'affichent que les boutiques et produits validés. Le panier reste stocké localement sur l'appareil. La création de commande connectée passe désormais par la fonction serveur `POST /orders/create`, qui relit les produits et boutiques, vérifie leur état et le stock, puis recalcule les montants avant d'écrire `orders` et `order_items`. La commande principale est lisible par l'acheteur; chaque ligne est lisible par l'acheteur et le vendeur concerné, sans exposer au vendeur l'adresse et le téléphone stockés dans la commande principale. Les vendeurs peuvent modifier le statut de leurs propres lignes par `POST /seller/order-status`, avec des transitions contrôlées côté serveur. Les liens partagés ouvrent les pages de l'application ; l'affichage automatique d'une grande image ou fiche d'aperçu dans Facebook et WhatsApp demandera une couche de métadonnées Open Graph côté serveur. Le stock est contrôlé au moment de la commande mais n'est pas encore réservé ni décrémenté de manière transactionnelle; aucun paiement n'est collecté en ligne. Les produits et commandes repartent de zéro; aucune donnée de l'ancien Supabase n'a été copiée.

## Fiche de boutique personnalisable

- Les vendeurs peuvent modifier le nom, la catégorie, la ville, le quartier, le WhatsApp et la description de leur boutique.
- Les champs Appwrite facultatifs `logo_file_id` et `cover_file_id` sont présents dans `shops`.
- Les images de logo et de couverture sont déposées dans le bucket `african_shop_media`; le catalogue Appwrite récupère le logo et l'image de couverture pour les pages publiques.
- La page publique `#/b/{id}` affiche maintenant la couverture lorsqu'elle existe. Les pages `#/b/{id}` et `#/p/{id}` sont bien reconnues par le routeur de `app.js`.
- La modération et l'attribution des permissions publiques sont maintenant gérées par la fonction serveur après contrôle du rôle administrateur. Les tables `shops` et `products` gardent `rowSecurity: true`; seules les lignes approuvées doivent recevoir une permission `read("any")`. Aucun test authentifié d'approbation ni publication réelle de boutique n'a encore été réalisé.
- Les modifications de code sont enregistrées dans GitHub. Le déploiement et le parcours réel de modification d'une boutique avec upload d'images restent à tester dans le navigateur.

## État de la sécurisation de la modération — vérification du 14 novembre 2026

- La fonction Appwrite `african-shop-api` est activée; son déploiement actif `6af874062b66adbd0029` est indiqué `ready` (Node 22).
- Le routage de la fonction vers `/moderation/queue` est reconnu. Une exécution de contrôle sans session utilisateur répond HTTP 401 `Connexion requise.`, ce qui est le comportement attendu pour une route protégée; aucun test authentifié avec un compte administrateur n'a été réalisé.
- Le code de création de profil contenait une faute `toISOstring()` qui empêchait l'initialisation d'un profil neuf. Elle est corrigée en `toISOString()`.
- Les routes vendeur vérifient désormais que les fichiers logo, couverture et médias de produit portent une permission de lecture ou suppression attribuée au propriétaire avant de les associer à une boutique ou à un produit. Cela évite qu'un vendeur puisse publier le fichier privé d'un autre compte en devinant son identifiant.
- Lorsqu'un vendeur remplace ou retire le logo ou la couverture d'une boutique déjà active, l'ancienne image perd sa permission publique après l'enregistrement; un échec de nettoyage est journalisé sans annuler la mise à jour.
- Les tables `shops`, `products` et `orders` ont `rowSecurity: true`. Les boutiques et produits sont filtrés par `status = active` pour le catalogue. La base ne contient actuellement aucune boutique ni aucun produit; les tests réels d'approbation, de publication média et d'achat restent donc impossibles.
- Les transitions de statut par ligne de commande sont contrôlées côté serveur. Le statut global d'une commande multi-boutiques n'est pas encore agrégé; le stock n'est pas réservé/décrémenté transactionnellement et aucun paiement en ligne n'est collecté. Aucune transaction d'achat réelle n'est déclarée opérationnelle.

## Commandes et transitions sécurisées — vérification du 14 novembre 2026

- La création d'une commande passe par la fonction Appwrite `african-shop-api` via `POST /orders/create`. Le serveur relit chaque produit et sa boutique, vérifie leur statut actif et le stock courant, recalcule les prix et le total depuis TablesDB, puis écrit la commande et ses lignes.
- La commande principale est lisible par l'acheteur uniquement. Chaque ligne est lisible par l'acheteur et le propriétaire de la boutique concernée; les données d'adresse et de téléphone de livraison ne sont pas exposées dans les lignes vendeur.
- Les vendeurs font évoluer l'état de leurs propres lignes via `POST /seller/order-status`. Le serveur vérifie la propriété de la boutique et n'accepte que les transitions prévues : à confirmer → confirmée/refusée → préparation → prête au retrait ou en livraison → livrée.
- En cas d'échec pendant l'écriture de la commande, le serveur tente de supprimer les lignes déjà créées puis la commande principale.
- Limites restantes : le stock est vérifié mais pas réservé ni décrémenté de manière transactionnelle; des commandes simultanées peuvent donc encore dépasser le stock. Le statut global de la commande multi-boutiques n'est pas recalculé à partir des lignes. Aucun paiement en ligne n'est collecté.
- Les tests authentifiés de création et de changement d'état nécessitent une session utilisateur réelle. Les exécutions de contrôle sans session confirment que `/moderation/queue`, `/orders/create` et `/seller/order-status` sont rejetées en HTTP 401.

## Démarrage local

```bash
git clone https://github.com/lokononbeno-sketch/African-shop-.git
cd African-shop-
npx serve .
``

## Sécurité avant production

- Vérifier les permissions de chaque table et de chaque ligne.
- Ne jamais faire confiance à un rôle administrateur stocké sans contrôle serveur.
- Ne jamais exposer une clé API secrète ou service_role dans le navigateur.
- Tester l'authentification, les médias, les droits vendeurs et les commandes avant de publier.
