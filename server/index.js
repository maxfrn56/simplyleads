const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const exportRoutes = require('./routes/export');
const profileRoutes = require('./routes/profiles');
const subscriptionRoutes = require('./routes/subscription');
const webhookRoutes = require('./routes/webhooks');
const userRoutes = require('./routes/user');

// Charger les variables d'environnement AVANT tout autre import
dotenv.config();

// Vérifier que la clé API est chargée
if (process.env.GOOGLE_PLACES_API_KEY) {
  console.log('✅ Clé API Google Places détectée dans .env');
} else {
  console.warn('⚠️  GOOGLE_PLACES_API_KEY non trouvée dans .env');
  console.warn('   Le système utilisera les données mockées');
}

// Vérifier la configuration Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceStarter = process.env.STRIPE_PRICE_STARTER;
const stripePricePro = process.env.STRIPE_PRICE_PRO;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (stripeSecretKey) {
  if (stripeSecretKey.startsWith('sk_test_')) {
    console.log('✅ Stripe configuré en MODE TEST');
  } else if (stripeSecretKey.startsWith('sk_live_')) {
    console.log('⚠️  Stripe configuré en MODE PRODUCTION');
  } else {
    console.warn('⚠️  STRIPE_SECRET_KEY ne semble pas valide');
  }
  
  if (!stripePriceStarter) {
    console.warn('⚠️  STRIPE_PRICE_STARTER non configuré');
  } else {
    console.log('✅ STRIPE_PRICE_STARTER configuré');
  }
  
  if (!stripePricePro) {
    console.warn('⚠️  STRIPE_PRICE_PRO non configuré');
  } else {
    console.log('✅ STRIPE_PRICE_PRO configuré');
  }
  
  if (!stripeWebhookSecret) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET non configuré (webhooks ne fonctionneront pas)');
    console.warn('   Pour le développement local, utilisez: stripe listen --forward-to localhost:3001/api/webhooks/stripe');
  } else {
    console.log('✅ STRIPE_WEBHOOK_SECRET configuré');
  }
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY non configuré dans .env');
  console.warn('   Les fonctionnalités de paiement ne seront pas disponibles');
  console.warn('   Consultez QUICK_STRIPE_SETUP.md pour configurer Stripe');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// Webhooks Stripe (doit être AVANT express.json() pour recevoir le body brut)
// Le body brut est nécessaire pour vérifier la signature Stripe
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API (doivent être définies avant les fichiers statiques)
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Vérification de la configuration API
app.get('/api/config', (req, res) => {
  const hasApiKey = !!process.env.GOOGLE_PLACES_API_KEY;
  res.json({
    googlePlacesApiConfigured: hasApiKey,
    apiKeyPreview: hasApiKey ? process.env.GOOGLE_PLACES_API_KEY.substring(0, 20) + '...' : null,
    jwtSecretConfigured: !!process.env.JWT_SECRET
  });
});

// Endpoint de test pour vérifier le token (sans authentification)
app.post('/api/test-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.json({ 
      valid: false, 
      error: 'Aucun token fourni',
      header: authHeader 
    });
  }

  const jwt = require('jsonwebtoken');
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ 
      valid: true, 
      decoded: decoded,
      secretUsed: jwtSecret.substring(0, 10) + '...'
    });
  } catch (err) {
    res.json({ 
      valid: false, 
      error: err.message,
      secretUsed: jwtSecret.substring(0, 10) + '...'
    });
  }
});

// Note: La landing page est maintenant intégrée dans React
// Plus besoin de servir les fichiers statiques de la landing page

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
