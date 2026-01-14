let stripe;
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
} catch (error) {
  console.warn('⚠️  Stripe non installé. Installez-le avec: npm install stripe');
  stripe = null;
}

class StripeService {
  get stripe() {
    return stripe;
  }

  // Créer une session Checkout pour un abonnement
  async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
    if (!stripe) {
      throw new Error('Stripe n\'est pas configuré. Installez-le avec: npm install stripe');
    }
    try {
      // Récupérer ou créer un customer Stripe
      const db = require('../database/db');
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT stripe_customer_id, email FROM users WHERE id = ?', [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      let customerId = user.stripe_customer_id;

      // Créer un customer Stripe si nécessaire
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: userId.toString() }
        });
        customerId = customer.id;

        // Sauvegarder le customer ID
        await new Promise((resolve, reject) => {
          db.run('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [customerId, userId], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      // Créer la session Checkout
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId.toString()
        }
      });

      return session;
    } catch (error) {
      console.error('Erreur création session Stripe:', error);
      throw error;
    }
  }

  // Créer un portal de gestion d'abonnement
  async createPortalSession(customerId, returnUrl) {
    if (!stripe) {
      throw new Error('Stripe n\'est pas configuré');
    }
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error('Erreur création portal Stripe:', error);
      throw error;
    }
  }

  // Vérifier le statut d'un abonnement
  async getSubscriptionStatus(subscriptionId) {
    if (!stripe) {
      throw new Error('Stripe n\'est pas configuré');
    }
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
