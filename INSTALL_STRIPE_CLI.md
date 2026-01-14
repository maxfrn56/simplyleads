# 📥 Installation de Stripe CLI (sans Homebrew)

## Méthode simple : Téléchargement direct

### Pour macOS

1. **Déterminez votre type de processeur** :
   - **Intel** : Processeurs Intel (MacBook Pro, iMac avant 2020)
   - **Apple Silicon** : M1, M2, M3 (MacBook Air/Pro récents)

2. **Téléchargez Stripe CLI** :
   - Allez sur : https://github.com/stripe/stripe-cli/releases/latest
   - Téléchargez :
     - Intel : `stripe_X.X.X_macOS_x86_64.tar.gz`
     - Apple Silicon : `stripe_X.X.X_macOS_arm64.tar.gz`

3. **Extrayez l'archive** :
   - Double-cliquez sur le fichier `.tar.gz` téléchargé
   - Ou en ligne de commande :
     ```bash
     tar -xzf stripe_X.X.X_macOS_x86_64.tar.gz
     ```

4. **Installez le binaire** :
   ```bash
   # Déplacer dans un dossier accessible
   sudo mv stripe /usr/local/bin/
   
   # Ou dans votre dossier utilisateur (si pas de sudo)
   mkdir -p ~/bin
   mv stripe ~/bin/
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

5. **Vérifiez l'installation** :
   ```bash
   stripe --version
   ```
   Vous devriez voir quelque chose comme : `stripe version X.X.X`

---

## Alternative : Installation via npm (si Node.js est installé)

```bash
npm install -g stripe-cli
```

Puis vérifiez :
```bash
stripe --version
```

---

## Alternative : Installation de Homebrew (optionnel)

Si vous voulez installer Homebrew pour faciliter les installations futures :

1. **Installez Homebrew** :
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Suivez les instructions** affichées à la fin de l'installation

3. **Installez Stripe CLI** :
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

---

## Vérification finale

Une fois installé, testez :

```bash
stripe --version
stripe login
```

Si tout fonctionne, vous pouvez passer à l'étape suivante : configurer les webhooks !

---

## 🐛 Dépannage

### "command not found: stripe"
- Vérifiez que le binaire est dans votre PATH
- Essayez : `which stripe` pour voir où il se trouve
- Si nécessaire, ajoutez le dossier au PATH dans `~/.zshrc`

### "Permission denied"
- Utilisez `sudo` pour déplacer dans `/usr/local/bin/`
- Ou changez les permissions : `chmod +x stripe`

### Besoin d'aide ?
Consultez la documentation officielle : https://stripe.com/docs/stripe-cli
