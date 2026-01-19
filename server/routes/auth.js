const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database/db');
const emailService = require('../services/email');

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Prénom et nom requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.get('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec plan gratuit (5 requêtes)
    // Exception : compte de test avec accès illimité
    const isTestAccount = email === 'test@test.com';
    const planType = isTestAccount ? 'pro' : 'free';
    const requestLimit = isTestAccount ? -1 : 5; // -1 = illimité
    
    const result = await db.run(
      'INSERT INTO users (email, password, first_name, last_name, phone, plan_type, request_limit) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [email, hashedPassword, firstName, lastName, phone || null, planType, requestLimit]
    );

    const userId = result.lastID;

    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: { 
        id: userId, 
        email, 
        firstName, 
        lastName, 
        phone 
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = $1', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { 
        id: user.id, 
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Demander une réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await db.get('SELECT id, email FROM users WHERE email = $1', [email]);

    // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
    // On répond toujours de la même manière
    if (!user) {
      // Attendre un peu pour éviter les attaques de timing
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.json({ 
        message: 'Si cet email existe dans notre système, vous recevrez un email avec les instructions de réinitialisation.' 
      });
    }

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Valide pendant 1 heure

    // Supprimer les anciens tokens non utilisés pour cet utilisateur
    await db.run(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE',
      [user.id]
    );

    // Créer le nouveau token
    await db.run(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetToken, expiresAt]
    );

    // Envoyer l'email de réinitialisation
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On continue quand même, l'utilisateur peut utiliser le token depuis les logs en dev
    }

    res.json({ 
      message: 'Si cet email existe dans notre système, vous recevrez un email avec les instructions de réinitialisation.' 
    });
  } catch (error) {
    console.error('Erreur demande réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Réinitialiser le mot de passe avec un token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token et mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier le token
    const resetToken = await db.get(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
      [token]
    );

    if (!resetToken) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await db.run(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, resetToken.user_id]
    );

    // Marquer le token comme utilisé
    await db.run(
      'UPDATE password_reset_tokens SET used = TRUE WHERE id = $1',
      [resetToken.id]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
