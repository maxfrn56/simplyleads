import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ResultsTable from './ResultsTable';
import './SearchHistory.css';

const SearchHistory = ({ onBack }) => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSearches, setExpandedSearches] = useState({});
  const [searchResultsCache, setSearchResultsCache] = useState({});
  const [loadingResults, setLoadingResults] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/search/history');
      setSearches(response.data);
    } catch (err) {
      console.error('Erreur chargement historique:', err);
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const toggleSearch = async (searchId) => {
    // Si déjà ouvert, fermer
    if (expandedSearches[searchId]) {
      setExpandedSearches(prev => ({
        ...prev,
        [searchId]: false
      }));
      return;
    }

    // Si les résultats sont déjà en cache, juste ouvrir
    if (searchResultsCache[searchId]) {
      setExpandedSearches(prev => ({
        ...prev,
        [searchId]: true
      }));
      return;
    }

    // Sinon, charger les résultats
    try {
      setLoadingResults(prev => ({ ...prev, [searchId]: true }));
      setError('');
      const response = await api.get(`/search/${searchId}`);
      
      // Transformer les résultats pour correspondre au format attendu par ResultsTable
      const prospects = response.data.map(result => ({
        companyName: result.company_name,
        city: result.city,
        sector: result.sector,
        phone: result.phone,
        email: result.email,
        websiteUrl: result.website_url,
        opportunityType: result.opportunity_type,
        socialMedia: result.social_media ? (typeof result.social_media === 'string' ? JSON.parse(result.social_media) : result.social_media) : {}
      }));

      // Mettre en cache les résultats
      setSearchResultsCache(prev => ({
        ...prev,
        [searchId]: {
          searchId,
          count: prospects.length,
          prospects
        }
      }));

      // Ouvrir l'accordéon
      setExpandedSearches(prev => ({
        ...prev,
        [searchId]: true
      }));
    } catch (err) {
      console.error('Erreur chargement résultats:', err);
      setError('Erreur lors du chargement des résultats');
    } finally {
      setLoadingResults(prev => ({ ...prev, [searchId]: false }));
    }
  };

  const handleExport = async (format, searchId) => {
    try {
      const endpoint = format === 'csv' 
        ? `/export/csv/${searchId}`
        : `/export/excel/${searchId}`;

      const response = await api.get(endpoint, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prospects_${searchId}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur export:', err);
      alert('Erreur lors de l\'export');
    }
  };

  const getProfileName = (profileType) => {
    const profiles = {
      'developpeur-web': 'Développeur web',
      'web-designer': 'Web designer',
      'graphiste': 'Graphiste',
      'consultant': 'Consultant',
      'commercial': 'Commercial indépendant'
    };
    return profiles[profileType] || profileType;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSearchCriteria = (search) => {
    const criteria = [];
    if (search.city) criteria.push(`Ville: ${search.city}`);
    if (search.department) criteria.push(`Département: ${search.department}`);
    if (search.sector) criteria.push(`Secteur: ${search.sector}`);
    return criteria.length > 0 ? criteria.join(' • ') : 'Tous critères';
  };

  if (loading) {
    return (
      <div className="search-history">
        <div className="search-history-header">
          <button className="btn-back" onClick={onBack}>
            ← Retour au dashboard
          </button>
          <h2>Historique des recherches</h2>
        </div>
        <div className="loading-state">Chargement...</div>
      </div>
    );
  }


  return (
    <div className="search-history">
      <div className="search-history-header">
        <button className="btn-back" onClick={onBack}>
          ← Retour au dashboard
        </button>
        <h2>Historique des recherches</h2>
        <p className="search-history-subtitle">
          Retrouvez toutes vos recherches précédentes et ré-exportez les résultats
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Aucune recherche enregistrée</h3>
          <p>Vos recherches apparaîtront ici une fois que vous aurez effectué votre première recherche.</p>
        </div>
      ) : (
        <div className="searches-list">
          {searches.map((search) => {
            const isExpanded = expandedSearches[search.id];
            const results = searchResultsCache[search.id];
            const isLoading = loadingResults[search.id];

            return (
              <div key={search.id} className="search-item">
                <div className="search-item-header">
                  <div className="search-item-info">
                    <h3 className="search-item-title">
                      {getProfileName(search.profile_type)}
                    </h3>
                    <p className="search-item-criteria">
                      {getSearchCriteria(search)}
                    </p>
                    <p className="search-item-date">
                      {formatDate(search.created_at)}
                    </p>
                  </div>
                  <div className="search-item-stats">
                    <div className="search-item-count">
                      <span className="count-number">{search.result_count || 0}</span>
                      <span className="count-label">résultat{search.result_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="search-item-actions">
                  {(search.result_count > 0) && (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => toggleSearch(search.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Chargement...' : (isExpanded ? 'Masquer les résultats' : 'Voir les résultats')}
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleExport('csv', search.id)}
                      >
                        Export CSV
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleExport('excel', search.id)}
                      >
                        Export Excel
                      </button>
                    </>
                  )}
                </div>
                
                {/* Affichage des résultats en accordéon */}
                {isExpanded && results && (
                  <div className="search-results-accordion">
                    <div className="results-header">
                      <h3>{results.count} résultat{results.count > 1 ? 's' : ''} trouvé{results.count > 1 ? 's' : ''}</h3>
                    </div>
                    <ResultsTable prospects={results.prospects} />
                  </div>
                )}
                
                {isExpanded && isLoading && (
                  <div className="search-results-accordion">
                    <div className="loading-state">Chargement des résultats...</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
