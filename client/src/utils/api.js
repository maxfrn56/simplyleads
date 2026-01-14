import axios from 'axios';

// Configuration de base pour axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
