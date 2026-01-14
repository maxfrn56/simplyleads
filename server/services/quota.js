const db = require('../database/db');

class QuotaService {
  // Vérifier si l'utilisateur a des requêtes disponibles
  async checkQuota(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT request_count, request_limit, plan_type, email FROM users WHERE id = ?',
        [userId],
        (err, user) => {
          if (err) {
            return reject(err);
          }
          if (!user) {
            return reject(new Error('Utilisateur non trouvé'));
          }

          // Email de test avec accès illimité
          const isTestAccount = user.email === 'test@test.com';
          
          if (isTestAccount) {
            return resolve({
              hasQuota: true,
              requestCount: user.request_count,
              requestLimit: -1, // Illimité
              planType: 'pro',
              remaining: -1 // Illimité
            });
          }

          const hasQuota = user.request_count < user.request_limit;
          resolve({
            hasQuota,
            requestCount: user.request_count,
            requestLimit: user.request_limit,
            planType: user.plan_type,
            remaining: Math.max(0, user.request_limit - user.request_count)
          });
        }
      );
    });
  }

  // Consommer une requête
  async consumeRequest(userId) {
    return new Promise((resolve, reject) => {
      // Vérifier si c'est le compte de test (ne pas consommer de requête)
      db.get('SELECT email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          return reject(err);
        }
        
        // Ne pas consommer de requête pour le compte de test
        if (user && user.email === 'test@test.com') {
          return resolve();
        }
        
        // Consommer une requête pour les autres comptes
        db.run(
          'UPDATE users SET request_count = request_count + 1 WHERE id = ?',
          [userId],
          function(err) {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      });
    });
  }

  // Obtenir les informations de quota de l'utilisateur
  async getUserQuota(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          plan_type, 
          request_count, 
          request_limit, 
          subscription_status,
          subscription_current_period_end,
          email
        FROM users WHERE id = ?`,
        [userId],
        (err, user) => {
          if (err) {
            return reject(err);
          }
          if (!user) {
            return reject(new Error('Utilisateur non trouvé'));
          }

          // Email de test avec accès illimité
          const isTestAccount = user.email === 'test@test.com';
          
          if (isTestAccount) {
            return resolve({
              planType: 'pro',
              requestCount: user.request_count,
              requestLimit: -1, // Illimité
              remaining: -1, // Illimité
              subscriptionStatus: 'active',
              subscriptionCurrentPeriodEnd: null
            });
          }

          resolve({
            planType: user.plan_type,
            requestCount: user.request_count,
            requestLimit: user.request_limit,
            remaining: Math.max(0, user.request_limit - user.request_count),
            subscriptionStatus: user.subscription_status,
            subscriptionCurrentPeriodEnd: user.subscription_current_period_end
          });
        }
      );
    });
  }

  // Réinitialiser le quota mensuel (pour les abonnements)
  async resetMonthlyQuota(userId, newLimit) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET request_count = 0, request_limit = ? WHERE id = ?',
        [newLimit, userId],
        function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  }

  // Mettre à jour le plan utilisateur
  async updateUserPlan(userId, planType, requestLimit, stripeCustomerId = null, stripeSubscriptionId = null) {
    return new Promise((resolve, reject) => {
      const updates = {
        plan_type: planType,
        request_limit: requestLimit,
        request_count: 0 // Réinitialiser le compteur lors du changement de plan
      };

      if (stripeCustomerId) {
        updates.stripe_customer_id = stripeCustomerId;
      }
      if (stripeSubscriptionId) {
        updates.stripe_subscription_id = stripeSubscriptionId;
      }

      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);

      db.run(
        `UPDATE users SET ${fields} WHERE id = ?`,
        [...values, userId],
        function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  }
}

module.exports = new QuotaService();
