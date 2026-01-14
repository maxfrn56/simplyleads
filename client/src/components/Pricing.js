import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Pricing.css';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.get('/subscription/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Erreur chargement plans:', error);
    }
  };

  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/subscription/checkout', { planType: planId });
      // Rediriger vers Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Erreur création checkout:', error);
      alert('Erreur lors de la création de la session de paiement');
      setLoading(false);
    }
  };

  const getPlanFeatures = (planId) => {
    const featuresMap = {
      free: ['5 requêtes gratuites', 'Accès de base', 'Sans engagement'],
      starter: ['100 requêtes/mois', 'Support email', 'Export CSV/Excel', 'Renouvellement automatique'],
      pro: ['Requêtes illimitées', 'Support prioritaire', 'Export CSV/Excel', 'Badge Pro', 'Renouvellement automatique']
    };
    return featuresMap[planId] || [];
  };

  const getPlanIcon = (planId) => {
    const icons = {
      free: '🎁',
      starter: '🟢',
      pro: '🔵'
    };
    return icons[planId] || '📦';
  };

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {isAuthenticated && (
          <Link to="/dashboard" className="pricing-back-button">
            ← Retour au dashboard
          </Link>
        )}
        
        <div className="pricing-header">
          <h1>Choisissez votre plan</h1>
          <p className="pricing-subtitle">
            <strong>La prospection simplifiée pour freelances</strong><br />
            Essayez gratuitement, sans carte bancaire
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.id === 'pro' ? 'featured' : ''}`}
            >
              {plan.id === 'pro' && (
                <div className="badge-pro">Recommandé</div>
              )}
              
              <div className="plan-icon">{getPlanIcon(plan.id)}</div>
              
              <h2 className="plan-name">{plan.name}</h2>
              
              <div className="plan-price">
                {plan.price === 0 ? (
                  <span className="price-amount">Gratuit</span>
                ) : (
                  <>
                    <span className="price-amount">{plan.price.toFixed(2).replace('.', ',')}€</span>
                    <span className="price-period">/mois</span>
                  </>
                )}
              </div>

              <div className="plan-limit">
                {plan.requestLimit === -1 ? (
                  <span className="limit-unlimited">Requêtes illimitées</span>
                ) : (
                  <span>{plan.requestLimit} requêtes/mois</span>
                )}
              </div>

              <ul className="plan-features">
                {getPlanFeatures(plan.id).map((feature, index) => (
                  <li key={index}>
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="plan-cta">
                {plan.id === 'free' ? (
                  <Link to="/login" className="btn btn-outline btn-block">
                    Commencer gratuitement
                  </Link>
                ) : (
                  <button
                    className={`btn btn-primary btn-block ${plan.id === 'pro' ? 'btn-featured' : ''}`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading}
                  >
                    {loading ? 'Chargement...' : `Choisir ${plan.name}`}
                  </button>
                )}
              </div>

              {plan.id !== 'free' && (
                <p className="plan-note">
                  Sans engagement • Annulable à tout moment
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p>Tous les plans incluent un essai gratuit de 5 requêtes</p>
          <p className="pricing-security">
            🔒 Paiement sécurisé par Stripe • Vos données sont protégées
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
