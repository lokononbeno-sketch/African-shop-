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
- `commerce.js` : code e-mail OTP, espace vendeur, création de boutiques et dépôt de médias.
- `admin.js` : point d'entrée administratif; les actions sont gérées par `commerce.js`.
- `app.js` : catalogue de démonstration et navigation existants.
- `boutiques.js` : données de démonstration.

## Important — état de migration

La connexion Supabase a été retirée des fichiers principaux `index.html`, `commerce.js` et `admin.js`. La base Appwrite et le stockage sont créés.

La lecture du catalogue public est maintenant reliée à TablesDB via `catalogue-appwrite.js`. Les données d'exemple locales sont masquées dès le chargement : seules les boutiques et produits `active` ayant des permissions de lecture publique peuvent apparaître. Le panier et le flux complet de commandes restent à relier. Les permissions de publication et le rôle administrateur doivent être finalisés et testés avant ouverture publique. Les produits et commandes repartent de zéro; aucune donnée de l'ancien Supabase n'a été copiée.

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
