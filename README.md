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

La lecture du catalogue public est maintenant reliée à TablesDB via `catalogue-appwrite.js`. Les données d'exemple locales sont masquées dès le chargement : seules les boutiques et produits `active` ayant des permissions de lecture publique peuvent apparaître. Chaque compte vendeur peut créer plusieurs boutiques indépendantes, sélectionner celle qu'il veut gérer et publier ses propres produits avec photos et vidéos. L'espace vendeur fournit des liens de partage de chaque boutique et de chaque produit vers WhatsApp, Facebook et par copie de lien. Les pages publiques sont alimentées par le catalogue Appwrite et n'affichent que les boutiques et produits validés. Le panier fonctionne côté navigateur (stockage local sur l'appareil). Le passage de commande connecté écrit une commande dans `orders` et ses lignes dans `order_items`; les permissions de lecture sont attribuées à l'acheteur et aux vendeurs concernés. L'espace vendeur affiche maintenant les lignes de commande propres à sa boutique (produit, quantité, prix et identifiant de commande). Par sécurité, les coordonnées et l'adresse de livraison restent privées dans la commande principale et ne sont pas exposées au vendeur par cette première vue. Il reste à ajouter un flux serveur qui transmet uniquement les informations de livraison nécessaires au vendeur concerné, à gérer les statuts par boutique, à traiter les commandes multi-boutiques proprement et à tester le parcours réel avant ouverture publique. Les liens partagés ouvrent les pages de l'application ; l'affichage automatique d'une grande image ou fiche d'aperçu dans Facebook et WhatsApp demandera une couche de métadonnées Open Graph côté serveur. Le stock n'est pas encore décrémenté et aucun paiement n'est collecté en ligne. Les produits et commandes repartent de zéro; aucune donnée de l'ancien Supabase n'a été copiée.

## Fiche de boutique personnalisable

- Les vendeurs peuvent modifier le nom, la catégorie, la ville, le quartier, le WhatsApp et la description de leur boutique.
- Les champs Appwrite facultatifs `logo_file_id` et `cover_file_id` sont présents dans `shops`.
- Les images de logo et de couverture sont déposées dans le bucket `african_shop_media`; le catalogue Appwrite récupère le logo et l'image de couverture pour les pages publiques.
- La page publique `#/b/{id}` affiche maintenant la couverture lorsqu'elle existe. Les pages `#/b/{id}` et `#/p/{id}` sont bien reconnues par le routeur de `app.js`.
- Limite importante : le contrôle de validation administrateur et l'attribution des permissions publiques d'une boutique doivent encore être fiabilisés côté serveur. Les lignes de la table `shops` ont actuellement `rowSecurity: true` et aucune permission publique au niveau de la table; une boutique en attente ne doit donc pas être considérée comme publiquement accessible simplement parce que son lien existe.
- Les modifications de code sont enregistrées dans GitHub. Le déploiement et le parcours réel de modification d'une boutique avec upload d'images restent à tester dans le navigateur.

## État de la sécurisation de la modération — vérification du 13 novembre 2026

- La fonction Appwrite `african-shop-api` existe et son dernier déploiement est indiqué `ready`.
- Le test réel de `POST /moderation/queue` échoue encore avec HTTP 500 et le message `Configuration serveur Appwrite incomplète.`. La modération serveur n'est donc pas opérationnelle et aucune validation ne doit être considérée comme fiable.
- La table `shops` utilise `rowSecurity: true` et n'a pas de permission globale. Les boutiques sont créées avec des permissions de lecture/modification réservées à leur propriétaire. Le code d'administration du navigateur tente encore de modifier directement les lignes; il devra être remplacé par un appel serveur qui vérifie le rôle administrateur et attribue explicitement la lecture publique après validation.
- Le code actuel de validation des boutiques ne leur attribue pas la permission `read(any)`, contrairement au chemin de validation des produits. Une boutique passée à `active` ne devient donc pas automatiquement lisible par les visiteurs.
- Le catalogue Appwrite a retourné zéro boutique et zéro produit lors de cette vérification. Aucun parcours réel d'approbation ou d'achat n'a été possible.
- Les essais de configuration n'ont pas résolu l'erreur. Aucune clé API durable n'a été conservée; les variables de test et la clé temporairement créée ont été supprimées. Ne jamais placer une clé serveur dans le navigateur.

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
