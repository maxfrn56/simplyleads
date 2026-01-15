const db = require('../database/db');

class QuotaService {
  // Vérifier si l'utilisateur a des requêtes disponibles
  async checkQuota(userId) {
    try {
      const user = await db.get(
        'SELECT request_count, request_limit, plan_type, email FROM users WHERE id = $1',
        [userId]
      );

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Email de test avec accès illimité
      const isTestAccount = user.email === 'test@test.com';
      
      if (isTestAccount) {
        return {
          hasQuota: true,
          requestCount: user.request_count,
          requestLimit: -1, // Illimité
          planType: 'pro',
          remaining: -1 // Illimité
        };
      }

      const hasQuota = user.request_count < user.request_limit;
      return {
        hasQuota,
        requestCount: user.request_count,
        requestLimit: user.request_limit,
        planType: user.plan_type,
        remaining: Math.max(0, user.request_limit - user.request_count)
      };
    } catch (error) {
      throw error;
    }
  }

  // Consommer une requête
  async consumeRequest(userId) {
    try {
      // Vérifier si c'est le compte de test (ne pas consommer de requête)
      const user = await db.get('SELECT email FROM users WHERE id = $1', [userId]);
      
      // Ne pas consommer de requête pour le compte de test
      if (user && user.email === 'test@test.com') {
        return;
      }
      
      // Consommer une requête pour les autres comptes
      await db.run(
        'UPDATE users SET request_count = request_count + 1 WHERE id = $1',
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Obtenir les informations de quota de l'utilisateur
  async getUserQuota(userId) {
    try {
      const user = await db.get(
        `SELECT 
          plan_type, 
          request_count, 
          request_limit, 
          subscription_status,
          subscription_current_period_end,
          email
        FROM users WHERE id = $1`,
        [userId]
      );

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Email de test avec accès illimité
      const isTestAccount = user.email === 'test@test.com';
      
      if (isTestAccount) {
        return {
          planType: 'pro',
          requestCount: user.request_count,
          requestLimit: -1, // Illimité
          remaining: -1, // Illimité
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: null
        };
      }

      return {
        planType: user.plan_type,
        requestCount: user.request_count,
        requestLimit: user.request_limit,
        remaining: Math.max(0, user.request_limit - user.request_count),
        subscriptionStatus: user.subscription_status,
        subscriptionCurrentPeriodEnd: user.subscription_current_period_end
      };
    } catch (error) {
      throw error;
    }
  }

  // Réinitialiser le quota mensuel (pour les abonnements)
  async resetMonthlyQuota(userId, newLimit) {
    try {
      await db.run(
        'UPDATE users SET request_count = 0, request_limit = $1 WHERE id = $2',
        [newLimit, userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le plan utilisateur
  async updateUserPlan(userId, planType, requestLimit, stripeCustomerId = null, stripeSubscriptionId = null) {
    try {
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

      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);

      await db.run(
        `UPDATE users SET ${fields} WHERE id = $${values.length + 1}`,
        [...values, userId]
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuotaService();
