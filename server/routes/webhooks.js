const express = require('express');
let stripe;
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
} catch (error) {
  console.warn('⚠️  Stripe non installé. Les webhooks ne fonctionneront pas.');
  stripe = null;
}
const quotaService = require('../services/quota');
const db = require('../database/db');

const router = express.Router();

// Plans et leurs limites
const PLAN_LIMITS = {
  starter: 100,
  pro: -1 // Illimité
};

// Webhook Stripe
router.post('/stripe', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe non configuré' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET non configuré - Les webhooks ne fonctionneront pas');
    console.warn('   Vous pouvez tester le flux de paiement, mais le quota ne sera pas mis à jour automatiquement');
    return res.status(400).json({ 
      error: 'Webhook secret non configuré',
      message: 'Les webhooks sont nécessaires pour mettre à jour automatiquement le quota après paiement. Vous pouvez tester le flux de paiement sans webhooks, mais devrez mettre à jour manuellement le quota.'
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    res.status(500).json({ error: 'Erreur traitement webhook' });
  }
});

// Gérer la complétion d'un checkout
async function handleCheckoutCompleted(session) {
  const userId = parseInt(session.metadata.userId);
  const subscriptionId = session.subscription;

  if (!userId || !subscriptionId) {
    console.error('Données manquantes dans checkout session');
    return;
  }

  // Récupérer l'abonnement pour connaître le plan
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;

  // Déterminer le plan selon le priceId
  let planType = 'starter';
  if (priceId === process.env.STRIPE_PRICE_PRO) {
    planType = 'pro';
  }

  const requestLimit = PLAN_LIMITS[planType];

  // Mettre à jour l'utilisateur
  await quotaService.updateUserPlan(
    userId,
    planType,
    requestLimit,
    session.customer,
    subscriptionId
  );

  // Mettre à jour le statut et la date de renouvellement
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  await db.run(
    `UPDATE users 
     SET subscription_status = $1, subscription_current_period_end = $2
     WHERE id = $3`,
    [subscription.status, currentPeriodEnd.toISOString(), userId]
  );

  console.log(`✅ Abonnement créé pour l'utilisateur ${userId}: ${planType}`);
}

// Gérer la mise à jour d'un abonnement
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  
  // Trouver l'utilisateur par customer_id
  const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = $1', [customerId]);

  if (!user) {
    console.error('Utilisateur non trouvé pour customer:', customerId);
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  let planType = 'starter';
  if (priceId === process.env.STRIPE_PRICE_PRO) {
    planType = 'pro';
  }

  const requestLimit = PLAN_LIMITS[planType];
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Si le renouvellement mensuel, réinitialiser le quota
  if (subscription.status === 'active') {
    await quotaService.resetMonthlyQuota(user.id, requestLimit);
  }

  // Mettre à jour le statut
  await db.run(
    `UPDATE users 
     SET plan_type = $1, request_limit = $2, subscription_status = $3, subscription_current_period_end = $4
     WHERE id = $5`,
    [planType, requestLimit, subscription.status, currentPeriodEnd.toISOString(), user.id]
  );

  console.log(`✅ Abonnement mis à jour pour l'utilisateur ${user.id}: ${planType}`);
}

// Gérer la suppression d'un abonnement
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = $1', [customerId]);

  if (!user) return;

  // Revenir au plan gratuit
  await quotaService.updateUserPlan(user.id, 'free', 5, null, null);

  await db.run(
    `UPDATE users 
     SET subscription_status = NULL, subscription_current_period_end = NULL
     WHERE id = $1`,
    [user.id]
  );

  console.log(`✅ Abonnement annulé pour l'utilisateur ${user.id}`);
}

// Gérer un paiement échoué
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = $1', [customerId]);

  if (!user) return;

  // Mettre à jour le statut
  await db.run(
    `UPDATE users SET subscription_status = 'past_due' WHERE id = $1`,
    [user.id]
  );

  console.log(`⚠️ Paiement échoué pour l'utilisateur ${user.id}`);
}

module.exports = router;
