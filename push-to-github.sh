#!/bin/bash

# Script pour pousser le projet sur GitHub
# Usage: bash push-to-github.sh

echo "🚀 Préparation du push vers GitHub..."

# Vérifier que git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le d'abord."
    exit 1
fi

# Initialiser git si nécessaire
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
fi

# Vérifier que .env n'est pas commité
if git ls-files | grep -q "^\.env$"; then
    echo "⚠️  ATTENTION: .env est dans le repository !"
    echo "   Suppression de .env du tracking Git..."
    git rm --cached .env
fi

# Ajouter le remote (ou le mettre à jour)
echo "🔗 Configuration du remote GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/maxfrn56/simplyleads.git

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Vérifier qu'il y a des changements
if git diff --staged --quiet; then
    echo "ℹ️  Aucun changement à commiter."
else
    # Commit
    echo "💾 Création du commit..."
    git commit -m "Initial commit: Simplyleads MVP - SaaS de prospection pour freelances"
    
    # Renommer la branche en main
    git branch -M main
    
    # Push
    echo "⬆️  Push vers GitHub..."
    echo ""
    echo "⚠️  Vous devrez peut-être vous authentifier avec GitHub."
    echo "   Si vous utilisez HTTPS, GitHub vous demandera un token d'accès personnel."
    echo ""
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Push réussi !"
        echo "   Votre code est maintenant sur: https://github.com/maxfrn56/simplyleads"
    else
        echo ""
        echo "❌ Erreur lors du push."
        echo "   Vérifiez vos identifiants GitHub ou utilisez un token d'accès personnel."
    fi
fi
