const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const stripeService = require('../services/stripe');
const quotaService = require('../services/quota');
const db = require('../database/db');

const router = express.Router();

// Plans disponibles
const PLANS = {
  free: {
    name: 'Gratuit',
    price: 0,
    requestLimit: 5,
    features: ['5 requêtes gratuites', 'Accès de base']
  },
  starter: {
    name: 'Starter',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_STARTER, // À configurer dans .env
    requestLimit: 100,
    features: ['100 requêtes/mois', 'Support email', 'Export CSV/Excel']
  },
  pro: {
    name: 'Pro',
    price: 16.99,
    priceId: process.env.STRIPE_PRICE_PRO, // À configurer dans .env
    requestLimit: -1, // Illimité
    features: ['Requêtes illimitées', 'Support prioritaire', 'Export CSV/Excel', 'Badge Pro']
  }
};

// Obtenir les informations de quota de l'utilisateur
router.get('/quota', authenticateToken, async (req, res) => {
  try {
    const quota = await quotaService.getUserQuota(req.user.id);
    res.json(quota);
  } catch (error) {
    console.error('Erreur récupération quota:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du quota' });
  }
});

// Créer une session Checkout pour un abonnement
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const { planType } = req.body;

    if (!planType || !['starter', 'pro'].includes(planType)) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    const plan = PLANS[planType];
    if (!plan.priceId) {
      return res.status(400).json({ error: 'Plan non configuré côté serveur' });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const session = await stripeService.createCheckoutSession(
      req.user.id,
      plan.priceId,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur création checkout:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
  }
});

// Créer une session Portal pour gérer l'abonnement
router.post('/portal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les infos complètes de l'utilisateur
    const user = await db.get(
      'SELECT stripe_customer_id, plan_type, subscription_status FROM users WHERE id = $1', 
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur a un abonnement actif
    if (!user.stripe_customer_id) {
      return res.status(400).json({ 
        error: 'Aucun abonnement actif trouvé. Veuillez souscrire à un abonnement pour accéder au portail de gestion.' 
      });
    }

    // Vérifier que Stripe est configuré
    if (!stripeService.stripe) {
      console.error('Stripe n\'est pas configuré');
      return res.status(500).json({ 
        error: 'Le service de paiement n\'est pas configuré. Veuillez contacter le support.' 
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/dashboard`;

    console.log(`Création session Portal pour customer: ${user.stripe_customer_id}`);

    const session = await stripeService.createPortalSession(
      user.stripe_customer_id,
      returnUrl
    );

    if (!session || !session.url) {
      throw new Error('Session Stripe Portal créée mais URL manquante');
    }

    console.log(`Session Portal créée avec succès: ${session.id}`);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur création portal:', error);
    const errorMessage = error.message || 'Erreur lors de la création du portail';
    res.status(500).json({ error: errorMessage });
  }
});

// Obtenir les plans disponibles
router.get('/plans', (req, res) => {
  res.json({
    plans: Object.keys(PLANS).map(key => ({
      id: key,
      ...PLANS[key]
    }))
  });
});

module.exports = router;
