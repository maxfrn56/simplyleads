import React from 'react';
import './ProfileSelector.css';

const ProfileSelector = ({ profiles, selectedProfile, onSelectProfile }) => {
  // Mapping des icônes et opportunités pour chaque profil
  const profileDetails = {
    'developpeur-web': {
      icon: '💻',
      opportunities: [
        'Entreprises sans site web',
        'Sites sans HTTPS (sécurité)',
        'Présence uniquement sur réseaux sociaux'
      ]
    },
    'web-designer': {
      icon: '🎨',
      opportunities: [
        'Sites non responsive',
        'Designs obsolètes',
        'Branding à améliorer'
      ]
    },
    'graphiste': {
      icon: '🖼️',
      opportunities: [
        'Entreprises sans logo',
        'Logos de mauvaise qualité',
        'Identité visuelle à créer'
      ]
    },
    'consultant': {
      icon: '💼',
      opportunities: [
        'Présence digitale faible',
        'Absence de tunnel de conversion',
        'Stratégie digitale à optimiser'
      ]
    },
    'commercial-independant': {
      icon: '📞',
      opportunities: [
        'Absence de formulaire de contact',
        'Pas de CRM visible',
        'Système de contact à améliorer'
      ]
    }
  };

  return (
    <div className="profile-selector">
      <h2>Sélectionner votre profil</h2>
      <p className="profile-selector-subtitle">Choisissez votre métier pour personnaliser la recherche</p>
      <div className="profiles-grid">
        {profiles.map(profile => {
          const details = profileDetails[profile.id] || { icon: '👤', opportunities: [] };
          const isSelected = selectedProfile === profile.id;

          return (
            <div
              key={profile.id}
              className={`profile-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectProfile(profile.id)}
            >
              <div className="profile-card-header">
                <div className="profile-card-icon">{details.icon}</div>
                <h3>{profile.name}</h3>
                {isSelected && <span className="selected-badge">✓ Sélectionné</span>}
              </div>
              <div className="profile-card-content">
                <p className="profile-card-description">{profile.description}</p>
                <p className="profile-card-opportunity">Opportunités détectées :</p>
                <ul className="profile-card-list">
                  {details.opportunities.map((opp, index) => (
                    <li key={index}>{opp}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSelector;
