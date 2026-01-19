# Configuration Email pour Réinitialisation de Mot de Passe

## Vue d'ensemble

Le système de réinitialisation de mot de passe utilise **Resend** pour envoyer les liens de réinitialisation aux utilisateurs. Resend est un service d'email moderne qui utilise une API REST (pas de SMTP), parfait pour Railway et les plateformes cloud.

## Configuration Resend

### Étape 1 : Créer un compte Resend

1. Allez sur https://resend.com
2. Créez un compte gratuit (3000 emails/mois gratuits)
3. Vérifiez votre email

### Étape 2 : Obtenir votre clé API

1. Dans le dashboard Resend, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez-lui un nom (ex: "Simplyleads Production")
4. Copiez la clé API (commence par `re_...`)

### Étape 3 : Configurer votre domaine (Optionnel mais recommandé)

Pour utiliser votre propre domaine (ex: `noreply@simplyleads.fr`) :

1. Dans Resend, allez dans "Domains"
2. Cliquez sur "Add Domain"
3. Entrez votre domaine (ex: `simplyleads.fr`)
4. Ajoutez les enregistrements DNS fournis par Resend dans votre hébergeur DNS (OVH)
5. Attendez la vérification (quelques minutes)

### Étape 4 : Configurer dans Railway

Ajoutez ces variables d'environnement dans Railway (service Backend) :

```
RESEND_API_KEY=re_VotreCleAPIResend
RESEND_FROM_EMAIL=noreply@simplyleads.fr
```

**Note :** 
- Si vous n'avez pas configuré de domaine, utilisez `onboarding@resend.dev` pour `RESEND_FROM_EMAIL`
- Une fois votre domaine vérifié, vous pouvez utiliser `noreply@simplyleads.fr` ou `contact@simplyleads.fr`

## Mode Développement

En développement local, si `RESEND_API_KEY` n'est pas configuré :
- Les emails ne seront **pas envoyés**
- Le lien de réinitialisation sera **affiché dans les logs du serveur**
- Vous pouvez copier ce lien pour tester

Pour tester en local, ajoutez `RESEND_API_KEY` dans votre fichier `.env` local.

## Test de la Fonctionnalité

1. Allez sur `/forgot-password`
2. Entrez un email existant
3. Vérifiez :
   - En production : votre boîte email (et spams)
   - En développement : les logs du serveur backend

## Sécurité

- Les tokens expirent après **1 heure**
- Les tokens ne peuvent être utilisés **qu'une seule fois**
- Les anciens tokens non utilisés sont automatiquement supprimés
- Pour des raisons de sécurité, on ne révèle pas si un email existe ou non

## Dépannage

**Les emails ne sont pas envoyés :**
- Vérifiez que `RESEND_API_KEY` est configuré dans Railway
- Vérifiez que `RESEND_FROM_EMAIL` est correctement configuré
- Vérifiez les logs Railway pour les erreurs d'envoi Resend
- Vérifiez que `FRONTEND_URL` est correctement configuré
- Vérifiez dans le dashboard Resend que votre quota n'est pas dépassé

**Erreur "Invalid API key" :**
- Vérifiez que la clé API commence par `re_`
- Vérifiez que vous avez copié la clé complète sans espaces

**Erreur "Domain not verified" :**
- Si vous utilisez votre propre domaine, vérifiez qu'il est bien vérifié dans Resend
- Ou utilisez temporairement `onboarding@resend.dev` pour `RESEND_FROM_EMAIL`

**Le lien ne fonctionne pas :**
- Vérifiez que le token n'a pas expiré (1 heure)
- Vérifiez que le token n'a pas déjà été utilisé
- Vérifiez que `FRONTEND_URL` correspond à votre domaine frontend
