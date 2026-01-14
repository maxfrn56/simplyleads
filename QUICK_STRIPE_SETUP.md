# Configuration Rapide Stripe Mode Test

## ✅ État actuel de la configuration

Stripe est **déjà intégré** dans le projet et prêt à fonctionner en mode test. Il vous suffit d'ajouter vos clés API.

## 🚀 Configuration en 5 minutes

### Étape 1 : Récupérer vos clés Stripe (mode test)

1. Allez sur https://dashboard.stripe.com/test
2. Connectez-vous à votre compte Stripe
3. Allez dans **Développeurs** → **Clés API**
4. Copiez la **Clé secrète** (commence par `sk_test_...`)

### Étape 2 : Créer les produits et prix

#### Plan Starter (9,99€/mois)
1. Allez dans **Produits** → **Ajouter un produit**
2. Nom : `Starter Plan`
3. Prix : `9.99 EUR`
4. Type : `Récurrent` → `Mensuel`
5. **Copiez le Price ID** (commence par `price_...`)

#### Plan Pro (16,99€/mois)
1. Allez dans **Produits** → **Ajouter un produit**
2. Nom : `Pro Plan`
3. Prix : `16.99 EUR`
4. Type : `Récurrent` → `Mensuel`
5. **Copiez le Price ID** (commence par `price_...`)

### Étape 3 : Configurer le fichier .env

Créez ou modifiez le fichier `.env` à la racine du projet :

```env
# Stripe Configuration (MODE TEST)
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
STRIPE_PRICE_STARTER=price_VOTRE_PRICE_ID_STARTER_ICI
STRIPE_PRICE_PRO=price_VOTRE_PRICE_ID_PRO_ICI

# Webhook Secret (voir étape 4)
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

### Étape 4 : Configurer les Webhooks (pour le développement local)

**Option recommandée : Stripe CLI**

> 📖 **Guide détaillé** : Consultez `WEBHOOK_SECRET_GUIDE.md` pour plus d'informations

1. Installez Stripe CLI :

   **Option A : Téléchargement direct (recommandé si pas de Homebrew)**
   - Allez sur : https://github.com/stripe/stripe-cli/releases/latest
   - Téléchargez le fichier pour macOS (Intel ou Apple Silicon selon votre Mac)
   - Extrayez l'archive
   - Déplacez le binaire `stripe` dans `/usr/local/bin/` :
     ```bash
     sudo mv stripe /usr/local/bin/
     ```
   - Vérifiez : `stripe --version`

   **Option B : Avec Homebrew (si installé)**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Connectez-vous :
   ```bash
   stripe login
   ```

3. Dans un terminal séparé, écoutez les webhooks :
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. **Copiez le webhook signing secret** affiché dans le terminal (commence par `whsec_...`)
   ```
   > Ready! Your webhook signing secret is whsec_1234567890abcdef...
   ```

5. Ajoutez-le dans votre `.env` comme `STRIPE_WEBHOOK_SECRET` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
   ```

   ⚠️ **Important** : Gardez le terminal `stripe listen` ouvert pendant vos tests !

### Étape 5 : Vérifier la configuration

Exécutez le script de vérification :

```bash
npm run check-stripe
```

Vous devriez voir :
- ✓ Stripe package installé
- ✓ STRIPE_SECRET_KEY défini (mode TEST)
- ✓ STRIPE_PRICE_STARTER défini
- ✓ STRIPE_PRICE_PRO défini
- ✓ Price Starter valide
- ✓ Price Pro valide

### Étape 6 : Tester

1. **Démarrez les serveurs** :
   ```bash
   npm run dev
   ```

2. **Créez un compte** sur http://localhost:3000

3. **Allez sur la page Pricing** (`/pricing`)

4. **Choisissez un plan** (Starter ou Pro)

5. **Utilisez une carte de test Stripe** :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/25` (ou toute date future)
   - CVC : `123`
   - Code postal : `75001`

6. **Vérifiez** :
   - Vous êtes redirigé vers `/dashboard` après le paiement
   - Votre quota est mis à jour
   - Votre plan a changé dans le menu profil

## 🧪 Cartes de test Stripe

| Numéro | Résultat | Description |
|--------|----------|-------------|
| `4242 4242 4242 4242` | ✅ Succès | Carte valide |
| `4000 0000 0000 0002` | ❌ Échec | Carte refusée |
| `4000 0025 0000 3155` | ⚠️ 3D Secure | Nécessite authentification |

**Pour toutes les cartes** :
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres
- Code postal : N'importe quel code postal valide

## ⚠️ Points importants

1. **Mode test** : Assurez-vous d'utiliser les clés `sk_test_...` (pas `sk_live_...`)
2. **Webhooks** : Les webhooks sont nécessaires pour mettre à jour automatiquement le quota après paiement
3. **Price IDs** : Les Price IDs doivent correspondre exactement à ceux créés dans Stripe
4. **Redémarrage** : Après avoir modifié le `.env`, redémarrez le serveur backend

## 🐛 Dépannage

### Erreur "Stripe n'est pas configuré"
- Vérifiez que `STRIPE_SECRET_KEY` est dans votre `.env`
- Redémarrez le serveur après avoir modifié le `.env`

### Erreur "Plan non configuré"
- Vérifiez que `STRIPE_PRICE_STARTER` et `STRIPE_PRICE_PRO` sont définis
- Vérifiez que les Price IDs commencent par `price_`

### Le quota ne se met pas à jour
- Vérifiez que Stripe CLI est en cours d'exécution (`stripe listen`)
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Consultez les logs du serveur pour voir les erreurs

## 📝 Checklist

- [ ] Clé secrète Stripe récupérée (`sk_test_...`)
- [ ] Produit Starter créé avec Price ID (`price_...`)
- [ ] Produit Pro créé avec Price ID (`price_...`)
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Stripe CLI installé et configuré
- [ ] Webhook secret récupéré (`whsec_...`)
- [ ] Script de vérification exécuté avec succès (`npm run check-stripe`)
- [ ] Test de paiement effectué avec une carte de test

## 🎯 Prochaines étapes après configuration

Une fois configuré, vous pouvez :
1. Tester les paiements avec des cartes de test
2. Vérifier que les webhooks fonctionnent
3. Vérifier que le quota se met à jour automatiquement
4. Tester la gestion d'abonnement via le menu profil
