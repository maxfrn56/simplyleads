# Configuration Stripe pour Simplyleads

Ce guide vous explique comment configurer Stripe pour le système de paiement et d'abonnements.

## 📋 Prérequis

1. Un compte Stripe (gratuit) : https://stripe.com
2. Accès au dashboard Stripe

## 🔧 Configuration

### 1. Créer les produits et prix dans Stripe

#### Plan Starter (9,99€/mois)
1. Allez dans **Produits** → **Ajouter un produit**
2. Nom : `Starter Plan`
3. Prix : `9.99 EUR`
4. Type de facturation : `Récurrent` → `Mensuel`
5. Copiez le **Price ID** (commence par `price_...`)

#### Plan Pro (16,99€/mois)
1. Allez dans **Produits** → **Ajouter un produit**
2. Nom : `Pro Plan`
3. Prix : `16.99 EUR`
4. Type de facturation : `Récurrent` → `Mensuel`
5. Copiez le **Price ID** (commence par `price_...`)

### 2. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env` à la racine du projet :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Clé secrète Stripe (mode test)
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Clé publique (pour le frontend si besoin)
STRIPE_PRICE_STARTER=price_...  # Price ID du plan Starter
STRIPE_PRICE_PRO=price_...  # Price ID du plan Pro
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret du webhook (voir étape 3)

# Frontend URL (pour les redirections après paiement)
FRONTEND_URL=http://localhost:3000
```

### 3. Configurer les Webhooks Stripe

#### En développement local

1. Installez Stripe CLI : https://stripe.com/docs/stripe-cli
2. Connectez-vous : `stripe login`
3. Écoutez les webhooks : 
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
4. Copiez le **webhook signing secret** (commence par `whsec_...`)
5. Ajoutez-le dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`

#### En production

1. Allez dans **Développeurs** → **Webhooks** dans votre dashboard Stripe
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** et ajoutez-le dans votre `.env`

### 4. Tester le système

#### Mode test Stripe

- Utilisez les cartes de test Stripe :
  - **Succès** : `4242 4242 4242 4242`
  - **Échec** : `4000 0000 0000 0002`
  - Date d'expiration : n'importe quelle date future
  - CVC : n'importe quel 3 chiffres

#### Flux de test

1. Créez un compte gratuit (5 requêtes)
2. Utilisez vos 5 requêtes
3. Allez sur `/pricing`
4. Choisissez un plan
5. Utilisez une carte de test
6. Vérifiez que le quota est mis à jour dans le dashboard

## 📊 Plans disponibles

| Plan | Prix | Requêtes | Features |
|------|------|----------|----------|
| **Free** | Gratuit | 5 | Accès de base |
| **Starter** | 9,99€/mois | 100/mois | Support email, Export |
| **Pro** | 16,99€/mois | Illimitées | Support prioritaire, Badge Pro |

## 🔄 Logique des quotas

- **Plan Free** : 5 requêtes à l'inscription, pas de renouvellement
- **Plan Starter** : 100 requêtes/mois, réinitialisation automatique
- **Plan Pro** : Requêtes illimitées

## 🛠️ Dépannage

### Les webhooks ne fonctionnent pas

1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
2. Vérifiez que l'endpoint webhook est accessible
3. Consultez les logs Stripe dans le dashboard

### Le quota ne se met pas à jour

1. Vérifiez les logs du serveur
2. Vérifiez que les webhooks sont bien reçus
3. Testez manuellement avec Stripe CLI

### Erreur "Plan non configuré"

1. Vérifiez que `STRIPE_PRICE_STARTER` et `STRIPE_PRICE_PRO` sont définis
2. Vérifiez que les Price IDs sont corrects dans Stripe

## 📝 Notes importantes

- En mode test, les paiements ne sont pas réels
- Passez en mode production avec les clés `sk_live_...` et `pk_live_...`
- Les webhooks doivent être configurés en production pour que le système fonctionne
- Le quota est réinitialisé automatiquement à chaque renouvellement mensuel
