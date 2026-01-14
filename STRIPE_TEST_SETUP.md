# Configuration Stripe en Mode Test - Guide Complet

Ce guide vous explique comment configurer et tester Stripe en mode test pour Simplyleads.

## 📋 Étape 1 : Créer un compte Stripe (si vous n'en avez pas)

1. Allez sur https://stripe.com
2. Créez un compte gratuit
3. Activez le **mode test** (toggle en haut à droite du dashboard)

## 🔑 Étape 2 : Récupérer vos clés API Stripe

1. Allez dans **Développeurs** → **Clés API** dans votre dashboard Stripe
2. Vous verrez deux clés en mode test :
   - **Clé secrète** : `sk_test_...` (commence par `sk_test_`)
   - **Clé publique** : `pk_test_...` (commence par `pk_test_`)
3. Copiez la **Clé secrète** (vous en aurez besoin pour le backend)

## 💳 Étape 3 : Créer les produits et prix dans Stripe

### Plan Starter (9,99€/mois)

1. Allez dans **Produits** → **Ajouter un produit**
2. Remplissez les informations :
   - **Nom** : `Starter Plan`
   - **Description** : `100 requêtes par mois`
3. Dans la section **Prix** :
   - **Prix** : `9.99`
   - **Devise** : `EUR`
   - **Type de facturation** : `Récurrent`
   - **Intervalle** : `Mensuel`
4. Cliquez sur **Enregistrer**
5. **IMPORTANT** : Copiez le **Price ID** (commence par `price_...`) - vous en aurez besoin !

### Plan Pro (16,99€/mois)

1. Allez dans **Produits** → **Ajouter un produit**
2. Remplissez les informations :
   - **Nom** : `Pro Plan`
   - **Description** : `Requêtes illimitées`
3. Dans la section **Prix** :
   - **Prix** : `16.99`
   - **Devise** : `EUR`
   - **Type de facturation** : `Récurrent`
   - **Intervalle** : `Mensuel`
4. Cliquez sur **Enregistrer**
5. **IMPORTANT** : Copiez le **Price ID** (commence par `price_...`) - vous en aurez besoin !

## ⚙️ Étape 4 : Configurer le fichier .env

Créez ou modifiez le fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration de base
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
GOOGLE_PLACES_API_KEY=votre-clé-api-google-places

# Configuration Stripe (MODE TEST)
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
STRIPE_PRICE_STARTER=price_VOTRE_PRICE_ID_STARTER_ICI
STRIPE_PRICE_PRO=price_VOTRE_PRICE_ID_PRO_ICI

# URL du frontend (pour les redirections)
FRONTEND_URL=http://localhost:3000

# Webhook Secret (voir étape 5)
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI
```

**Remplacez** :
- `sk_test_VOTRE_CLE_SECRETE_ICI` par votre clé secrète Stripe
- `price_VOTRE_PRICE_ID_STARTER_ICI` par le Price ID du plan Starter
- `price_VOTRE_PRICE_ID_PRO_ICI` par le Price ID du plan Pro

## 🔔 Étape 5 : Configurer les Webhooks (pour le développement local)

### Option A : Utiliser Stripe CLI (Recommandé pour le développement)

1. **Installer Stripe CLI** :
   - macOS : `brew install stripe/stripe-cli/stripe`
   - Windows : Téléchargez depuis https://stripe.com/docs/stripe-cli
   - Linux : Suivez les instructions sur https://stripe.com/docs/stripe-cli

2. **Se connecter** :
   ```bash
   stripe login
   ```

3. **Écouter les webhooks** (dans un terminal séparé) :
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. **Copier le webhook signing secret** :
   - Stripe CLI affichera un secret commençant par `whsec_...`
   - Copiez ce secret et ajoutez-le dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`

### Option B : Utiliser le Dashboard Stripe (pour la production)

1. Allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** et ajoutez-le dans votre `.env`

## ✅ Étape 6 : Vérifier la configuration

1. **Vérifiez que Stripe est installé** :
   ```bash
   npm list stripe
   ```

2. **Démarrez le serveur backend** :
   ```bash
   npm run server
   ```

3. **Vérifiez les logs** :
   - Si vous voyez un message d'erreur concernant Stripe, vérifiez votre `.env`
   - Le serveur devrait démarrer sans erreur

## 🧪 Étape 7 : Tester le système

### Cartes de test Stripe

En mode test, utilisez ces cartes :

| Numéro de carte | Résultat | Description |
|----------------|----------|-------------|
| `4242 4242 4242 4242` | ✅ Succès | Carte valide |
| `4000 0000 0000 0002` | ❌ Échec | Carte refusée |
| `4000 0025 0000 3155` | ⚠️ 3D Secure | Nécessite authentification |

**Pour toutes les cartes de test** :
- **Date d'expiration** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code postal valide (ex: 75001)

### Scénario de test complet

1. **Créer un compte gratuit** :
   - Allez sur `http://localhost:3000`
   - Cliquez sur "Connexion" → "Créer un compte"
   - Créez un compte avec un email de test

2. **Utiliser les requêtes gratuites** :
   - Connectez-vous au dashboard
   - Effectuez quelques recherches (vous avez 5 requêtes gratuites)
   - Vérifiez que le compteur diminue

3. **Tester l'abonnement** :
   - Allez sur `/pricing`
   - Cliquez sur "Choisir Starter" ou "Choisir Pro"
   - Vous serez redirigé vers Stripe Checkout
   - Utilisez la carte de test `4242 4242 4242 4242`
   - Date : `12/25`, CVC : `123`
   - Complétez le paiement

4. **Vérifier que ça fonctionne** :
   - Après le paiement, vous serez redirigé vers `/dashboard`
   - Vérifiez que votre quota a été mis à jour
   - Vérifiez que votre plan a changé dans le menu profil

5. **Vérifier les webhooks** :
   - Si vous utilisez Stripe CLI, vous devriez voir les événements dans le terminal
   - Vérifiez les logs du serveur pour confirmer que les webhooks sont reçus

## 🐛 Dépannage

### Erreur : "Stripe n'est pas configuré"

**Solution** :
- Vérifiez que `STRIPE_SECRET_KEY` est défini dans votre `.env`
- Vérifiez que la clé commence bien par `sk_test_`
- Redémarrez le serveur après avoir modifié le `.env`

### Erreur : "Plan non configuré"

**Solution** :
- Vérifiez que `STRIPE_PRICE_STARTER` et `STRIPE_PRICE_PRO` sont définis dans votre `.env`
- Vérifiez que les Price IDs commencent bien par `price_`
- Vérifiez que les Price IDs existent dans votre dashboard Stripe

### Les webhooks ne fonctionnent pas

**Solution** :
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est défini dans votre `.env`
- Si vous utilisez Stripe CLI, vérifiez que la commande `stripe listen` est toujours active
- Vérifiez que l'URL du webhook est correcte : `localhost:3001/api/webhooks/stripe`
- Vérifiez les logs du serveur pour voir les erreurs

### Le quota ne se met pas à jour après le paiement

**Solution** :
- Vérifiez que les webhooks sont bien reçus (logs du serveur)
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Vérifiez les logs Stripe dans le dashboard pour voir si les événements sont envoyés

### Erreur lors du paiement

**Solution** :
- Vérifiez que vous utilisez une carte de test Stripe
- Vérifiez que vous êtes bien en mode test dans Stripe (toggle en haut à droite)
- Vérifiez les logs du serveur pour plus de détails

## 📊 Vérifier dans le Dashboard Stripe

Après avoir effectué un test, vous pouvez vérifier dans votre dashboard Stripe :

1. **Paiements** → Vous devriez voir les paiements de test
2. **Clients** → Vous devriez voir les clients créés
3. **Abonnements** → Vous devriez voir les abonnements actifs
4. **Webhooks** → Vous devriez voir les événements reçus

## 🎯 Checklist de configuration

- [ ] Compte Stripe créé et mode test activé
- [ ] Clé secrète Stripe récupérée (`sk_test_...`)
- [ ] Produit Starter créé avec Price ID (`price_...`)
- [ ] Produit Pro créé avec Price ID (`price_...`)
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Stripe CLI installé et configuré (pour les webhooks locaux)
- [ ] Webhook secret récupéré (`whsec_...`)
- [ ] Serveur backend démarré sans erreur
- [ ] Test de paiement effectué avec succès
- [ ] Quota mis à jour après le paiement

## 📝 Notes importantes

- **Mode test** : Tous les paiements en mode test sont fictifs, aucun argent réel n'est débité
- **Données de test** : Les données créées en mode test sont séparées des données de production
- **Passage en production** : Pour passer en production, utilisez les clés `sk_live_...` et `pk_live_...`
- **Webhooks en production** : Vous devrez configurer les webhooks dans le dashboard Stripe pour la production

## 🆘 Besoin d'aide ?

- Documentation Stripe : https://stripe.com/docs
- Support Stripe : https://support.stripe.com
- Dashboard Stripe : https://dashboard.stripe.com/test
