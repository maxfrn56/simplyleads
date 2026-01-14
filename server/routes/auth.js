const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

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
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (user) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur avec plan gratuit (5 requêtes)
      // Exception : compte de test avec accès illimité
      const isTestAccount = email === 'test@test.com';
      const planType = isTestAccount ? 'pro' : 'free';
      const requestLimit = isTestAccount ? -1 : 5; // -1 = illimité
      
      db.run(
        'INSERT INTO users (email, password, first_name, last_name, phone, plan_type, request_limit) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, phone || null, planType, requestLimit],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la création du compte' });
          }

          const token = jwt.sign(
            { id: this.lastID, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            user: { 
              id: this.lastID, 
              email, 
              firstName, 
              lastName, 
              phone 
            }
          });
        }
      );
    });
  } catch (error) {
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

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

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
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
