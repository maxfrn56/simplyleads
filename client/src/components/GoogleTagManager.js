import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleTagManager = () => {
  const location = useLocation();

  // Mettre à jour dataLayer lors des changements de route
  useEffect(() => {
    // Vérifier que dataLayer existe (chargé par GTM)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null; // Ce composant ne rend rien
};

export default GoogleTagManager;
