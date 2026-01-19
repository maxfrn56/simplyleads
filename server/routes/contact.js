const express = require('express');
const emailService = require('../services/email');

const router = express.Router();

// Route pour recevoir les messages de contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ 
        error: 'Tous les champs marqués d\'un astérisque sont requis' 
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' });
    }

    // Validation de la longueur du message
    if (message.length < 10) {
      return res.status(400).json({ 
        error: 'Le message doit contenir au moins 10 caractères' 
      });
    }

    // Envoyer l'email de contact
    try {
      console.log('📧 Réception demande de contact:', { firstName, lastName, email, phone: phone || 'non fourni' });
      await emailService.sendContactEmail({
        firstName,
        lastName,
        email,
        phone: phone || null,
        message
      });
      
      res.json({ 
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' 
      });
    } catch (emailError) {
      console.error('Erreur envoi email de contact:', emailError);
      // On retourne quand même un succès pour ne pas révéler l'erreur à l'utilisateur
      // Mais on log l'erreur pour le debug
      res.json({ 
        message: 'Votre message a été reçu. Nous vous répondrons dans les plus brefs délais.' 
      });
    }
  } catch (error) {
    console.error('Erreur traitement formulaire de contact:', error);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
  }
});

module.exports = router;
