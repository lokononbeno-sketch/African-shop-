# African Shop

Plateforme web de découverte de boutiques et de produits, avec commandes WhatsApp et fonctionnalités de commerce intégrées à Supabase.

## Fonctionnalités présentes dans le code

- Catalogue de démonstration, catégories et recherche
- Fiches produits et partage de liens
- Contact et commande via WhatsApp
- Authentification Supabase
- Espace vendeur, publication de produits avec images
- Panier et création de commandes sans paiement en ligne

Ces parcours doivent être testés avant une utilisation en production.

## Démarrage local

Prérequis : Node.js et npm pour utiliser la commande ci-dessous.

```bash
git clone https://github.com/lokononbeno-sketch/African-shop-.git
cd African-shop-
npx serve .
```

Ouvrir l’adresse locale affichée dans le terminal. Utiliser un serveur local plutôt que le protocole file://.

## Fichiers principaux

- `index.html` : page principale
- `app.js` : catalogue, recherche, navigation et commandes WhatsApp
- `commerce.js` : authentification, panier et espace vendeur Supabase
- `boutiques.js` : configuration et données du catalogue
- `manifest.webmanifest` : manifeste de l’application web
- `sw.js` : service worker
- `install.js` : script lié à l’installation

## Configuration Supabase

`commerce.js` utilise une URL Supabase et une clé publishable. Les tables référencées incluent `shops`, `products`, `shopping_carts`, `cart_items` et `orders`. Le code appelle aussi les fonctions `checkout_cart` et `cancel_unpaid_order`, et utilise le bucket `african-shop-products`.

La présence du code client ne garantit pas que ces ressources et leurs permissions soient correctement configurées. Vérifier les politiques RLS, les permissions du stockage et les contrôles des fonctions avant tout déploiement. Ne jamais exposer de clé secrète ou service_role dans le navigateur.

## Vérifications avant production

- Tester les liens de partage et l’ouverture directe des pages produit
- Tester l’authentification et les erreurs réseau
- Vérifier qu’un utilisateur ne peut pas consulter ou modifier les commandes et boutiques des autres
- Vérifier côté base de données les prix, stocks et quantités
- Tester les mises à jour du service worker

## Licence

Aucune licence n’est ajoutée par cette modification. Les conditions de réutilisation restent à préciser par le propriétaire.
