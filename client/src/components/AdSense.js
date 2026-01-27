import { useEffect } from 'react';

const AdSense = ({ clientId }) => {
  useEffect(() => {
    // Vérifier si le script n'existe pas déjà
    if (document.querySelector(`script[src*="adsbygoogle"]`)) {
      return;
    }

    // Créer et ajouter le script AdSense
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', clientId);
    
    document.head.appendChild(script);

    // Nettoyer le script lors du démontage (optionnel, mais bon pour la propreté)
    return () => {
      const existingScript = document.querySelector(`script[src*="adsbygoogle"]`);
      if (existingScript) {
        // Ne pas supprimer le script car il peut être utilisé ailleurs
        // document.head.removeChild(existingScript);
      }
    };
  }, [clientId]);

  return null; // Ce composant ne rend rien
};

export default AdSense;
