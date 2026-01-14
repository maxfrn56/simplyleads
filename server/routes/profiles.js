const express = require('express');
const router = express.Router();

// Liste des profils disponibles
router.get('/', (req, res) => {
  const profiles = [
    {
      id: 'developpeur-web',
      name: 'Développeur web',
      description: 'Détecte les sites absents, sans HTTPS, ou redirigés vers réseaux sociaux'
    },
    {
      id: 'web-designer',
      name: 'Web designer',
      description: 'Identifie les sites non responsive, design daté, ou branding faible'
    },
    {
      id: 'graphiste',
      name: 'Graphiste',
      description: 'Repère l\'absence de logo, logo pixelisé, ou présence uniquement sur réseaux sociaux'
    },
    {
      id: 'consultant',
      name: 'Consultant',
      description: 'Détecte l\'absence de tunnel clair, formulaire manquant, ou présence digitale faible'
    },
    {
      id: 'commercial-independant',
      name: 'Commercial indépendant',
      description: 'Identifie l\'absence de formulaire, pas de CRM visible, ou contact uniquement téléphone/email'
    }
  ];

  res.json(profiles);
});

module.exports = router;
