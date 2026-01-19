import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = ({ trackingId }) => {
  const location = useLocation();

  // Si pas d'ID de suivi, ne rien afficher
  if (!trackingId) {
    return null;
  }

  // Initialiser Google Analytics au chargement
  useEffect(() => {
    // Charger le script gtag.js
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    // Initialiser dataLayer et gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', trackingId, {
      page_path: location.pathname + location.search,
    });

    return () => {
      // Nettoyer le script si le composant est démonté
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
    };
  }, [trackingId]);

  // Mettre à jour le suivi de page lors des changements de route
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', trackingId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, trackingId]);

  return (
    <Helmet>
      {/* Meta tag pour Google Analytics */}
      <meta name="google-analytics" content={trackingId} />
    </Helmet>
  );
};

export default GoogleAnalytics;
