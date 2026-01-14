const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../database/db');
const stripeService = require('../services/stripe');
const quotaService = require('../services/quota');

const router = express.Router();

// Récupérer le profil complet de l'utilisateur
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les infos de base de l'utilisateur
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, email, first_name, last_name, phone, plan_type, request_count, request_limit, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_current_period_end, created_at FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Récupérer le quota
    const quota = await quotaService.getUserQuota(userId);

    // Récupérer les infos de paiement depuis Stripe si disponible
    let paymentMethod = null;
    if (user.stripe_customer_id && stripeService.stripe) {
      try {
        const customer = await stripeService.stripe.customers.retrieve(user.stripe_customer_id);
        
        if (customer.invoice_settings?.default_payment_method) {
          const pm = await stripeService.stripe.paymentMethods.retrieve(
            customer.invoice_settings.default_payment_method
          );
          paymentMethod = {
            brand: pm.card?.brand || 'N/A',
            last4: pm.card?.last4 || 'N/A',
            expMonth: pm.card?.exp_month || null,
            expYear: pm.card?.exp_year || null
          };
        } else if (customer.default_source) {
          // Fallback pour les anciennes méthodes de paiement
          const source = await stripeService.stripe.customers.retrieveSource(
            user.stripe_customer_id,
            customer.default_source
          );
          if (source.card) {
            paymentMethod = {
              brand: source.card.brand || 'N/A',
              last4: source.card.last4 || 'N/A',
              expMonth: source.card.exp_month || null,
              expYear: source.card.exp_year || null
            };
          }
        }
      } catch (stripeError) {
        console.error('Erreur récupération Stripe:', stripeError);
        // On continue même si Stripe échoue
      }
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      planType: user.plan_type,
      requestCount: user.request_count,
      requestLimit: user.request_limit,
      subscriptionStatus: user.subscription_status,
      subscriptionCurrentPeriodEnd: user.subscription_current_period_end,
      createdAt: user.created_at,
      quota: {
        planType: quota.planType,
        requestCount: quota.requestCount,
        requestLimit: quota.requestLimit,
        remaining: quota.remaining,
        subscriptionStatus: quota.subscriptionStatus,
        subscriptionCurrentPeriodEnd: quota.subscriptionCurrentPeriodEnd
      },
      paymentMethod
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// Supprimer le compte utilisateur
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les infos Stripe de l'utilisateur
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT stripe_customer_id, stripe_subscription_id FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Annuler l'abonnement Stripe si présent
    if (user.stripe_subscription_id && stripeService.stripe) {
      try {
        await stripeService.stripe.subscriptions.cancel(user.stripe_subscription_id);
        console.log(`Abonnement ${user.stripe_subscription_id} annulé`);
      } catch (stripeError) {
        console.error('Erreur annulation abonnement Stripe:', stripeError);
        // On continue même si l'annulation Stripe échoue
      }
    }

    // Supprimer le client Stripe si présent
    if (user.stripe_customer_id && stripeService.stripe) {
      try {
        await stripeService.stripe.customers.del(user.stripe_customer_id);
        console.log(`Client Stripe ${user.stripe_customer_id} supprimé`);
      } catch (stripeError) {
        console.error('Erreur suppression client Stripe:', stripeError);
        // On continue même si la suppression Stripe échoue
      }
    }

    // Supprimer toutes les recherches et résultats associés
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // Récupérer les IDs des recherches
        db.all('SELECT id FROM searches WHERE user_id = ?', [userId], (err, searches) => {
          if (err) {
            reject(err);
            return;
          }

          // Supprimer les résultats de chaque recherche
          const searchIds = searches.map(s => s.id);
          if (searchIds.length > 0) {
            const placeholders = searchIds.map(() => '?').join(',');
            db.run(
              `DELETE FROM search_results WHERE search_id IN (${placeholders})`,
              searchIds,
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }

                // Supprimer les recherches
                db.run('DELETE FROM searches WHERE user_id = ?', [userId], (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }

                  // Supprimer l'utilisateur
                  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                  });
                });
              }
            );
          } else {
            // Pas de recherches, supprimer directement l'utilisateur
            db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      });
    });

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
});

module.exports = router;
