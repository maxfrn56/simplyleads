import axios from 'axios';

// Configuration de base pour axios
let baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// S'assurer que l'URL se termine par /api
if (baseURL && !baseURL.endsWith('/api')) {
  // Si l'URL ne se termine pas par /api, l'ajouter
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

// Log pour debug (toujours afficher pour diagnostiquer)
console.log('🔗 API Base URL configurée:', baseURL);
console.log('🔗 REACT_APP_API_URL depuis env:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes de timeout (augmenté pour mobile/connexions lentes)
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Préserver le signal si présent (pour l'annulation des requêtes)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur 401 = Session expirée (vraie erreur d'authentification)
    if (error.response?.status === 401) {
      console.error('Erreur authentification:', error.response?.data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Rediriger vers login seulement si on n'est pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Erreur 403 peut être soit authentification, soit quota atteint
    // On laisse le composant gérer selon le contexte (quota vs auth)
    // Ne pas rediriger automatiquement pour les 403
    
    return Promise.reject(error);
  }
);

export default api;
