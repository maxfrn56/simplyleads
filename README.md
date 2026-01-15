# Simplyleads - MVP SaaS B2B

**La prospection simplifiée pour freelances**

MVP SaaS B2B pour faciliter la prospection commerciale des freelances français (développeurs web, web designers, graphistes, consultants, commerciaux indépendants).

## 🎯 Fonctionnalités

- **Authentification simple** : Email + mot de passe
- **Sélection de profil** : 5 profils freelance disponibles
- **Recherche de prospects** : Par ville, département, secteur
- **Détection d'opportunités** : Selon le profil sélectionné
- **Export** : CSV ou Excel

## 🚀 Installation

### Prérequis

- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# 1. Installer les dépendances backend
npm install

# 2. Installer les dépendances frontend
cd client
npm install
cd ..

# 3. Créer le fichier .env
# Créer un fichier .env à la racine avec :
# PORT=3001
# JWT_SECRET=your-secret-key-change-in-production
# NODE_ENV=development
# GOOGLE_PLACES_API_KEY=votre-clé-api-google-places
# 
# Configuration Stripe (voir STRIPE_SETUP.md pour les détails) :
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PRICE_STARTER=price_...
# STRIPE_PRICE_PRO=price_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# FRONTEND_URL=http://localhost:3000
```

### Démarrage

**Option 1 : Démarrer les deux serveurs ensemble**
```bash
npm run dev
```

**Option 2 : Démarrer séparément (recommandé pour le débogage)**

Terminal 1 - Backend :
```bash
npm run server
# Backend démarré sur http://localhost:3001
```

Terminal 2 - Frontend :
```bash
npm run client
# Frontend démarré sur http://localhost:3000
```


### Vérification

1. Backend : Ouvrir http://localhost:3001/api/health
   - Devrait retourner : `{"status":"ok","message":"API is running"}`

2. Frontend : Ouvrir http://localhost:3000
   - Devrait afficher la landing page
   - Cliquez sur "Commencer gratuitement" pour accéder à la connexion

### Problèmes courants

Si le frontend ne démarre pas :
- Vérifier que le port 3000 est libre
- Vérifier que les dépendances sont installées : `cd client && npm install`
- Vérifier que Node.js est en version 16+

## 📁 Structure du projet

```
scrapping/
├── server/                 # Backend Node.js/Express
│   ├── index.js           # Point d'entrée serveur
│   ├── database/          # Configuration base de données PostgreSQL
│   │   └── db.js          # Pool PostgreSQL et initialisation
│   ├── middleware/         # Middleware d'authentification
│   ├── routes/             # Routes API
│   │   ├── auth.js        # Authentification
│   │   ├── search.js      # Recherche de prospects
│   │   ├── export.js      # Export CSV/Excel
│   │   ├── profiles.js    # Liste des profils
│   │   ├── subscription.js # Gestion abonnements
│   │   ├── user.js        # Profil utilisateur
│   │   └── webhooks.js    # Webhooks Stripe
│   └── services/          # Services métier
│       ├── scraper.js     # Scraper de prospects
│       ├── quota.js       # Gestion des quotas
│       └── stripe.js      # Service Stripe
├── client/                 # Frontend React
│   ├── public/
│   └── src/
│       ├── components/     # Composants React (Landing, Login, Dashboard, etc.)
│       ├── utils/          # Utilitaires (API, etc.)
│       └── App.js          # Application principale avec routing
├── render.yaml             # Configuration Render pour déploiement
└── package.json
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Recherche
- `POST /api/search` - Rechercher des prospects (requiert auth)
- `GET /api/search` - Historique des recherches (requiert auth)
- `GET /api/search/:searchId` - Résultats d'une recherche (requiert auth)

### Export
- `GET /api/export/csv/:searchId` - Export CSV (requiert auth)
- `GET /api/export/excel/:searchId` - Export Excel (requiert auth)

### Abonnements
- `GET /api/subscription/quota` - Obtenir le quota utilisateur (requiert auth)
- `POST /api/subscription/checkout` - Créer une session Checkout (requiert auth)
- `POST /api/subscription/portal` - Créer une session Portal (requiert auth)
- `GET /api/subscription/plans` - Liste des plans disponibles

### Utilisateur
- `GET /api/user/profile` - Profil complet utilisateur (requiert auth)
- `DELETE /api/user/account` - Supprimer le compte (requiert auth)

### Profils
- `GET /api/profiles` - Liste des profils disponibles

### Webhooks
- `POST /api/webhooks/stripe` - Webhook Stripe (pas d'auth requise, vérification signature)

## 🧩 Profils disponibles

1. **Développeur web** : Détecte sites absents, sans HTTPS, redirigés vers réseaux sociaux
2. **Web designer** : Identifie sites non responsive, design daté, branding faible
3. **Graphiste** : Repère absence de logo, logo pixelisé, présence uniquement réseaux sociaux
4. **Consultant** : Détecte absence de tunnel clair, formulaire manquant, présence digitale faible
5. **Commercial indépendant** : Identifie absence de formulaire, pas de CRM visible, contact uniquement téléphone/email

## 💳 Système de paiement

Simplyleads inclut un système complet de paiement avec Stripe :

- **Plan gratuit** : 5 requêtes gratuites à l'inscription
- **Plan Starter** : 10€/mois pour 100 requêtes
- **Plan Pro** : 20€/mois pour requêtes illimitées

Voir `STRIPE_SETUP.md` pour la configuration détaillée.

## 🚀 Déploiement sur Railway

Le projet est configuré pour être déployé facilement sur Railway. Railway détecte automatiquement les projets Node.js et gère le déploiement sans configuration complexe.

### Étapes de déploiement

1. **Créer un compte Railway et connecter GitHub**
   - Allez sur https://railway.app
   - Créez un compte (avec GitHub recommandé)
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository `simplyleads`

2. **Créer la base de données PostgreSQL**
   - Dans votre projet Railway, cliquez sur "+ New"
   - Sélectionnez "Database" → "Add PostgreSQL"
   - Railway créera automatiquement une base PostgreSQL
   - La variable `DATABASE_URL` sera automatiquement ajoutée à vos variables d'environnement

3. **Configurer le service backend**
   - Railway détectera automatiquement votre projet Node.js
   - Le service backend sera créé automatiquement
   - Configurez les variables d'environnement dans l'onglet "Variables" :
     
     **Obligatoires :**
     - `NODE_ENV` = `production`
     - `PORT` = Railway définit automatiquement le PORT (pas besoin de le définir manuellement)
     - `JWT_SECRET` = Générez une clé aléatoire sécurisée (ex: `openssl rand -base64 32`)
     - `DATABASE_URL` = Déjà configuré automatiquement par Railway (depuis la base PostgreSQL)
     
     **Stripe (obligatoire pour les paiements) :**
     - `STRIPE_SECRET_KEY` = votre clé secrète Stripe (ex: `sk_test_...`)
     - `STRIPE_PUBLISHABLE_KEY` = votre clé publique Stripe (ex: `pk_test_...`)
     - `STRIPE_PRICE_STARTER` = l'ID du prix Starter dans Stripe (ex: `price_...`)
     - `STRIPE_PRICE_PRO` = l'ID du prix Pro dans Stripe (ex: `price_...`)
     - `STRIPE_WEBHOOK_SECRET` = vous le récupérerez après avoir créé le webhook (étape 5)
     
     **URLs (à configurer après le déploiement du frontend) :**
     - `FRONTEND_URL` = URL de votre frontend Railway (ex: `https://simplyleads-frontend.railway.app`)
     
     **Optionnel :**
     - `GOOGLE_PLACES_API_KEY` = votre clé API Google Places (si vous en avez une)

4. **Déployer le frontend**
   - Dans votre projet Railway, cliquez sur "+ New"
   - Sélectionnez "GitHub Repo" et choisissez le même repository
   - Railway créera un nouveau service
   - Dans les paramètres du service frontend :
     - **Root Directory** : `client`
     - **Build Command** : `npm install && npm run build`
     - **Start Command** : `npx serve -s build` (ou utilisez un service statique)
   - **Alternative (recommandée)** : Utilisez Railway Static pour servir le build React
     - Créez un nouveau service "Static"
     - Configurez le dossier de build : `client/build`
   - Variables d'environnement pour le build :
     - `REACT_APP_API_URL` = URL de votre backend Railway (ex: `https://simplyleads-backend.railway.app`)
     - `REACT_APP_STRIPE_PUBLISHABLE_KEY` = votre clé publique Stripe

5. **Configurer les domaines publics**
   - Pour chaque service (backend et frontend), allez dans "Settings" → "Generate Domain"
   - Railway générera automatiquement un domaine `.railway.app`
   - Notez ces URLs pour les variables d'environnement

6. **Mettre à jour les variables d'environnement**
   - Retournez dans les variables du backend
   - Mettez à jour `FRONTEND_URL` avec l'URL du frontend Railway

7. **Configurer Stripe Webhooks**
   - Dans le dashboard Stripe, allez dans "Developers" → "Webhooks"
   - Cliquez sur "Add endpoint"
   - Endpoint URL : `https://votre-backend.railway.app/api/webhooks/stripe`
     - Remplacez `votre-backend` par le nom réel de votre service backend Railway
   - Sélectionnez les événements :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Cliquez sur "Add endpoint"
   - Copiez le "Signing secret" (commence par `whsec_...`)
   - Retournez dans Railway, dans les variables d'environnement du backend
   - Ajoutez ou mettez à jour : `STRIPE_WEBHOOK_SECRET` = le Signing secret copié

8. **Vérifier le déploiement**
   - Backend : Ouvrez `https://votre-backend.railway.app/api/health`
     - Vous devriez voir : `{"status":"ok","message":"API is running"}`
   - Frontend : Ouvrez l'URL de votre frontend Railway
     - La landing page devrait s'afficher
   - Base de données : Les tables sont créées automatiquement au premier démarrage du backend
     - Vérifiez les logs du backend pour voir : `✅ Base de données PostgreSQL initialisée`

### Avantages de Railway

- ✅ Déploiement automatique à chaque push sur GitHub
- ✅ Base de données PostgreSQL intégrée facilement
- ✅ Variables d'environnement gérées automatiquement
- ✅ Logs en temps réel
- ✅ Pas de configuration complexe nécessaire
- ✅ Plan gratuit généreux pour commencer

### Variables d'environnement requises

Voir la section "Étapes de déploiement" ci-dessus pour la liste complète des variables nécessaires.

## 📝 Notes MVP

- Le scraper utilise Google Places API pour rechercher des entreprises réelles
- En cas d'absence de clé API, le système utilise des données mockées comme fallback
- Base de données PostgreSQL pour la production (compatible avec Railway)
- Authentification JWT simple (7 jours de validité)
- Landing page intégrée dans React pour une expérience utilisateur fluide
- Système de quotas et abonnements avec Stripe

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT pour l'authentification
- Validation des entrées utilisateur
- CORS configuré

## 📄 Licence

MIT
