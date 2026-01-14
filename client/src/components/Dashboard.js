import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProfileSelector from './ProfileSelector';
import SearchForm from './SearchForm';
import ResultsTable from './ResultsTable';
import QuotaModal from './QuotaModal';
import ProfileMenu from './ProfileMenu';
import SearchHistory from './SearchHistory';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Charger les profils disponibles
    api.get('/profiles')
      .then(res => setProfiles(res.data))
      .catch(err => console.error('Erreur chargement profils:', err));

    // Charger le quota
    loadQuota();

    // Vérifier si on revient d'un checkout Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      // Recharger le quota après un paiement réussi
      setTimeout(() => {
        loadQuota();
        navigate('/dashboard');
      }, 1000);
    }
  }, [navigate]);

  const loadQuota = async () => {
    try {
      const response = await api.get('/subscription/quota');
      setQuota(response.data);
    } catch (error) {
      console.error('Erreur chargement quota:', error);
    }
  };

  const handleSearch = async (searchData) => {
    if (!selectedProfile) {
      setError('Veuillez sélectionner un profil freelance');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/search', {
        ...searchData,
        profileType: selectedProfile
      });

      setSearchResults(response.data);
      // Recharger le quota après une recherche réussie
      await loadQuota();
    } catch (err) {
      console.error('Erreur recherche:', err);
      
      // Erreur 403 = Quota atteint (pas une erreur d'authentification)
      if (err.response?.status === 403) {
        // Recharger le quota pour avoir les dernières données
        await loadQuota();
        
        // Afficher le modal de quota
        setShowQuotaModal(true);
        
        // Ne pas afficher d'erreur, le modal s'en charge
        setError('');
      } 
      // Erreur 401 = Session expirée (vraie erreur d'authentification)
      else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      } 
      // Autres erreurs
      else {
        setError(err.response?.data?.error || 'Erreur lors de la recherche');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!searchResults?.searchId) {
      setError('Aucune recherche à exporter');
      return;
    }

    try {
      const endpoint = format === 'csv' 
        ? `/export/csv/${searchResults.searchId}`
        : `/export/excel/${searchResults.searchId}`;

      const response = await api.get(endpoint, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prospects_${searchResults.searchId}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Erreur lors de l\'export');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const getPlanName = (planType) => {
    const plans = {
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro'
    };
    return plans[planType] || 'Gratuit';
  };

  const getQuotaPercentage = () => {
    if (!quota || quota.requestLimit === -1) return 0;
    return Math.min(100, (quota.requestCount / quota.requestLimit) * 100);
  };

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-content">
          <h1>Simplyleads</h1>
          <div className="user-info">
            {quota && (
              <div className="quota-info-header">
                <span className={`plan-badge plan-${quota.planType}`}>
                  {quota.planType === 'pro' && '🔵 '}
                  {getPlanName(quota.planType)}
                </span>
                <span className="quota-text-header">
                  {quota.requestLimit === -1 ? 'Illimité' : `${quota.remaining} requêtes restantes`}
                </span>
              </div>
            )}
            <ProfileMenu 
              user={user} 
              quota={quota} 
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {/* Affichage du quota */}
        {quota && (
          <div className="card quota-card">
            <div className="quota-header">
              <div>
                <h3>Votre plan : {getPlanName(quota.planType)}</h3>
                {quota.subscriptionCurrentPeriodEnd && (
                  <p className="quota-renewal">
                    Renouvellement le {new Date(quota.subscriptionCurrentPeriodEnd).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
              {(quota.planType === 'starter' || quota.planType === 'pro') && (
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/pricing')}
                >
                  Gérer mon abonnement
                </button>
              )}
            </div>
            
            {quota.requestLimit !== -1 && (
              <div className="quota-progress">
                <div className="quota-progress-info">
                  <span className="quota-used">{quota.requestCount} / {quota.requestLimit} requêtes utilisées</span>
                  <span className="quota-remaining">{quota.remaining} restantes</span>
                </div>
                <div className="quota-progress-bar">
                  <div 
                    className="quota-progress-fill"
                    style={{ width: `${getQuotaPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}

            {quota.requestLimit === -1 && (
              <div className="quota-unlimited">
                <span className="quota-unlimited-icon">∞</span>
                <span>Requêtes illimitées</span>
              </div>
            )}

            {quota.remaining === 0 && quota.planType === 'free' && (
              <div className="quota-upgrade-cta">
                <p>Vous avez utilisé toutes vos requêtes gratuites</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/pricing')}
                >
                  Passer à un abonnement
                </button>
              </div>
            )}
          </div>
        )}

        {showHistory ? (
          <SearchHistory onBack={() => setShowHistory(false)} />
        ) : (
          <>
            <div className="dashboard-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setShowHistory(true)}
              >
                📋 Historique des recherches
              </button>
            </div>

            <div className="card">
              <ProfileSelector
                profiles={profiles}
                selectedProfile={selectedProfile}
                onSelectProfile={setSelectedProfile}
              />
            </div>

            {selectedProfile && (
              <>
                <SearchForm onSearch={handleSearch} loading={loading} />

                {searchResults && (
                  <div className="card">
                    <div className="results-header">
                      <h2>Résultats de la recherche</h2>
                      <div className="export-buttons">
                        <button
                          className="btn btn-success"
                          onClick={() => handleExport('csv')}
                        >
                          Exporter CSV
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => handleExport('excel')}
                        >
                          Exporter Excel
                        </button>
                      </div>
                    </div>
                    
                    {searchResults.stats && (
                      <div className="search-stats">
                        <div className="stat-item">
                          <span className="stat-label">Lieux trouvés:</span>
                          <span className="stat-value">{searchResults.stats.totalPlacesFound}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Sites analysés:</span>
                          <span className="stat-value">{searchResults.stats.sitesAnalyzed}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Résultats après filtrage:</span>
                          <span className="stat-value highlight">{searchResults.stats.resultsAfterFiltering}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Méthode:</span>
                          <span className="stat-value">
                            {searchResults.stats.searchMethod === 'google_places' ? '🔍 Google Places API' : '📝 Données de test'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <p className="results-count">
                      {searchResults.count} prospect(s) trouvé(s)
                    </p>
                    <ResultsTable prospects={searchResults.prospects} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <QuotaModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        quota={quota}
      />
    </div>
  );
};

export default Dashboard;
