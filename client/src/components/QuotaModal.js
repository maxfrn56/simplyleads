import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuotaModal.css';

const QuotaModal = ({ isOpen, onClose, quota }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  const handleManageSubscription = () => {
    onClose();
    // TODO: Implémenter la gestion d'abonnement via Stripe Portal
    navigate('/pricing');
  };

  return (
    <div className="quota-modal-overlay" onClick={onClose}>
      <div className="quota-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quota-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="quota-modal-content">
          <div className="quota-modal-icon">⚠️</div>
          
          <h2 className="quota-modal-title">Quota atteint</h2>
          
          <p className="quota-modal-message">
            Vous avez utilisé toutes vos requêtes {quota?.planType === 'free' ? 'gratuites' : 'mensuelles'}.
          </p>

          {quota?.planType === 'free' && (
            <div className="quota-modal-info">
              <p>
                <strong>Vous avez utilisé {quota?.requestCount} requêtes sur {quota?.requestLimit}</strong>
              </p>
              <p>
                Passez à un abonnement pour continuer à trouver des prospects qualifiés.
              </p>
            </div>
          )}

          {quota?.planType !== 'free' && (
            <div className="quota-modal-info">
              <p>
                Votre quota mensuel sera réinitialisé le {quota?.subscriptionCurrentPeriodEnd 
                  ? new Date(quota.subscriptionCurrentPeriodEnd).toLocaleDateString('fr-FR')
                  : 'prochain mois'}.
              </p>
            </div>
          )}

          <div className="quota-modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
            <button 
              className="btn btn-primary" 
              onClick={quota?.planType === 'free' ? handleUpgrade : handleManageSubscription}
            >
              {quota?.planType === 'free' ? 'Voir les abonnements' : 'Gérer mon abonnement'}
            </button>
          </div>

          <p className="quota-modal-note">
            💡 Sans engagement • Annulable à tout moment
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotaModal;
