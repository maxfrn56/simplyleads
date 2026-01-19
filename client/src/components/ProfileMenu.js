import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './ProfileMenu.css';

const ProfileMenu = ({ user, quota, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user/profile');
        setUserDetails(response.data);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    };

    // Charger les détails au montage pour avoir les initiales correctes
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  const handleContact = () => {
    setIsOpen(false);
    window.location.href = '/#contact';
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.'
    );

    if (!confirmDelete) return;

    const secondConfirm = window.confirm(
      'Dernière confirmation : Supprimer définitivement votre compte ?'
    );

    if (!secondConfirm) return;

    try {
      setLoading(true);
      await api.delete('/user/account');
      alert('Votre compte a été supprimé avec succès');
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Erreur suppression compte:', error);
      alert('Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planType) => {
    const plans = {
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro'
    };
    return plans[planType] || planType;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button 
        className="profile-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu profil"
      >
        <div className="profile-avatar">
          {getInitials(user?.email)}
        </div>
        <span className="profile-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {userDetails?.firstName && userDetails?.lastName
                ? `${userDetails.firstName.charAt(0)}${userDetails.lastName.charAt(0)}`.toUpperCase()
                : getInitials(user?.email)}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {userDetails?.firstName && userDetails?.lastName
                  ? `${userDetails.firstName} ${userDetails.lastName}`
                  : user?.email}
              </div>
              <div className="profile-email">{user?.email}</div>
              <div className="profile-plan">
                <span className={`plan-badge plan-${quota?.planType || 'free'}`}>
                  {getPlanName(quota?.planType || 'free')}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-section">
              <h3>Informations du compte</h3>
              {userDetails?.firstName && (
                <div className="profile-detail-item">
                  <span className="detail-label">Prénom :</span>
                  <span className="detail-value">{userDetails.firstName}</span>
                </div>
              )}
              {userDetails?.lastName && (
                <div className="profile-detail-item">
                  <span className="detail-label">Nom :</span>
                  <span className="detail-value">{userDetails.lastName}</span>
                </div>
              )}
              <div className="profile-detail-item">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{user?.email || 'N/A'}</span>
              </div>
              {userDetails?.phone && (
                <div className="profile-detail-item">
                  <span className="detail-label">Téléphone :</span>
                  <span className="detail-value">{userDetails.phone}</span>
                </div>
              )}
              <div className="profile-detail-item">
                <span className="detail-label">Plan :</span>
                <span className="detail-value">{getPlanName(quota?.planType || 'free')}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Requêtes restantes :</span>
                <span className="detail-value">
                  {quota?.requestLimit === -1 ? 'Illimité' : `${quota?.remaining || 0}`}
                </span>
              </div>
              {quota?.subscriptionCurrentPeriodEnd && (
                <div className="profile-detail-item">
                  <span className="detail-label">Renouvellement :</span>
                  <span className="detail-value">
                    {formatDate(quota.subscriptionCurrentPeriodEnd)}
                  </span>
                </div>
              )}
              {userDetails?.createdAt && (
                <div className="profile-detail-item">
                  <span className="detail-label">Membre depuis :</span>
                  <span className="detail-value">
                    {formatDate(userDetails.createdAt)}
                  </span>
                </div>
              )}
            </div>

            {userDetails?.paymentMethod && (
              <div className="profile-section">
                <h3>Moyen de paiement</h3>
                <div className="profile-detail-item">
                  <span className="detail-label">Type :</span>
                  <span className="detail-value">
                    {userDetails.paymentMethod.brand || 'N/A'}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Derniers 4 chiffres :</span>
                  <span className="detail-value">
                    {userDetails.paymentMethod.last4 || 'N/A'}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Expiration :</span>
                  <span className="detail-value">
                    {userDetails.paymentMethod.expMonth && userDetails.paymentMethod.expYear
                      ? `${userDetails.paymentMethod.expMonth}/${userDetails.paymentMethod.expYear}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button 
              className="profile-action-btn"
              onClick={handleContact}
            >
              Nous contacter
            </button>
            {(quota?.planType === 'starter' || quota?.planType === 'pro') && (
              <button 
                className="profile-action-btn"
                onClick={handleManageSubscription}
              >
                Gérer mon abonnement
              </button>
            )}
            <button 
              className="profile-action-btn profile-action-danger"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? 'Suppression...' : 'Supprimer mon compte'}
            </button>
            <button 
              className="profile-action-btn profile-action-logout"
              onClick={onLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
