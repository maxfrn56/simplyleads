# Guide de démarrage - Simplyleads

## 🚨 Problème : ERR_CONNECTION_REFUSED

Si vous voyez des erreurs `ERR_CONNECTION_REFUSED` sur le port 3001, c'est que le backend n'est pas démarré.

## 📦 Étape 1 : Installer les dépendances

### Installer Stripe (obligatoire pour le système de paiement)

```bash
cd /Users/maximefarineau/Desktop/scrapping
npm install stripe
```

Si vous avez des erreurs de permissions, essayez :
```bash
sudo npm install stripe
```

### Installer toutes les dépendances

```bash
npm install
cd client
npm install
cd ..
```

## 🚀 Étape 2 : Démarrer les serveurs

### Option A : Démarrer les deux serveurs ensemble

```bash
npm run dev
```

### Option B : Démarrer séparément (recommandé pour le débogage)

**Terminal 1 - Backend :**
```bash
npm run server
```

Vous devriez voir :
```
🚀 Server running on port 3001
```

**Terminal 2 - Frontend :**
```bash
npm run client
```

Vous devriez voir :
```
Compiled successfully!
```

## ✅ Vérification

1. **Backend** : Ouvrez http://localhost:3001/api/health
   - Devrait retourner : `{"status":"ok","message":"API is running"}`

2. **Frontend** : Ouvrez http://localhost:3000
   - Devrait afficher la landing page

## 🔧 Si le backend ne démarre pas

### Vérifier les erreurs dans le terminal

Les erreurs courantes :

1. **"Cannot find module 'stripe'"**
   → Solution : `npm install stripe`

2. **"Port 3001 already in use"**
   → Solution : Arrêtez le processus ou changez le port dans `.env`

3. **"STRIPE_SECRET_KEY is not defined"**
   → Solution : Ajoutez `STRIPE_SECRET_KEY=sk_test_dummy` dans `.env` (même en mode test)

### Vérifier que le port 3001 est libre

```bash
lsof -ti:3001
```

Si un processus est retourné, tuez-le :
```bash
kill -9 $(lsof -ti:3001)
```

## 📝 Configuration minimale pour démarrer

Créez un fichier `.env` à la racine avec au minimum :

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Stripe (même en mode test, ajoutez des valeurs par défaut)
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_PRICE_STARTER=price_dummy
STRIPE_PRICE_PRO=price_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
```

**Note** : Même avec des valeurs "dummy", le serveur démarrera. Vous pourrez tester les recherches sans Stripe. Configurez Stripe plus tard selon `STRIPE_SETUP.md`.

## 🎯 Test rapide

1. Démarrer le backend : `npm run server`
2. Dans un autre terminal, tester : `curl http://localhost:3001/api/health`
3. Si ça retourne `{"status":"ok","message":"API is running"}`, le backend fonctionne !

## 💡 Astuce

Si vous voulez juste tester les recherches sans Stripe :
- Le système fonctionnera en mode gratuit (5 requêtes)
- Les fonctionnalités de paiement ne seront pas disponibles
- Mais vous pourrez tester le reste de l'application
