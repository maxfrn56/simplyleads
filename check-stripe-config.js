#!/usr/bin/env node

/**
 * Script de vérification de la configuration Stripe
 * Usage: node check-stripe-config.js
 */

require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function check(condition, message, errorMessage) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${errorMessage || message}`);
    return false;
  }
}

function info(message) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}  Vérification de la configuration Stripe${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

let allChecksPassed = true;

// Vérifier que Stripe est installé
try {
  require('stripe');
  check(true, 'Stripe package installé');
} catch (error) {
  check(false, 'Stripe package installé', 'Stripe n\'est pas installé. Exécutez: npm install stripe');
  allChecksPassed = false;
}

console.log('');

// Vérifier les variables d'environnement
info('Vérification des variables d\'environnement...\n');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceStarter = process.env.STRIPE_PRICE_STARTER;
const stripePricePro = process.env.STRIPE_PRICE_PRO;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const frontendUrl = process.env.FRONTEND_URL;

if (!stripeSecretKey) {
  check(false, 'STRIPE_SECRET_KEY défini', 'STRIPE_SECRET_KEY manquant dans .env');
  allChecksPassed = false;
} else if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  warning('STRIPE_SECRET_KEY ne commence pas par sk_test_ ou sk_live_');
  allChecksPassed = false;
} else {
  const mode = stripeSecretKey.startsWith('sk_test_') ? 'TEST' : 'PRODUCTION';
  check(true, `STRIPE_SECRET_KEY défini (mode ${mode})`);
}

if (!stripePriceStarter) {
  check(false, 'STRIPE_PRICE_STARTER défini', 'STRIPE_PRICE_STARTER manquant dans .env');
  allChecksPassed = false;
} else if (!stripePriceStarter.startsWith('price_')) {
  warning('STRIPE_PRICE_STARTER ne commence pas par price_');
  allChecksPassed = false;
} else {
  check(true, `STRIPE_PRICE_STARTER défini (${stripePriceStarter.substring(0, 20)}...)`);
}

if (!stripePricePro) {
  check(false, 'STRIPE_PRICE_PRO défini', 'STRIPE_PRICE_PRO manquant dans .env');
  allChecksPassed = false;
} else if (!stripePricePro.startsWith('price_')) {
  warning('STRIPE_PRICE_PRO ne commence pas par price_');
  allChecksPassed = false;
} else {
  check(true, `STRIPE_PRICE_PRO défini (${stripePricePro.substring(0, 20)}...)`);
}

if (!stripeWebhookSecret) {
  warning('STRIPE_WEBHOOK_SECRET non défini (nécessaire pour les webhooks)');
} else if (!stripeWebhookSecret.startsWith('whsec_')) {
  warning('STRIPE_WEBHOOK_SECRET ne commence pas par whsec_');
} else {
  check(true, `STRIPE_WEBHOOK_SECRET défini (${stripeWebhookSecret.substring(0, 20)}...)`);
}

if (!frontendUrl) {
  warning('FRONTEND_URL non défini (utilisera http://localhost:3000 par défaut)');
} else {
  check(true, `FRONTEND_URL défini (${frontendUrl})`);
}

console.log('');

// Tester la connexion à Stripe
if (stripeSecretKey && stripeSecretKey.startsWith('sk_test_')) {
  info('Test de connexion à Stripe...\n');
  
  try {
    const stripe = require('stripe')(stripeSecretKey);
    
    // Tester en récupérant les prix
    Promise.all([
      stripe.prices.retrieve(stripePriceStarter).catch(() => null),
      stripe.prices.retrieve(stripePricePro).catch(() => null)
    ]).then(([starterPrice, proPrice]) => {
      if (starterPrice) {
        check(true, `Price Starter valide (${starterPrice.unit_amount / 100} ${starterPrice.currency.toUpperCase()})`);
      } else {
        check(false, 'Price Starter valide', `Price Starter invalide ou introuvable: ${stripePriceStarter}`);
        allChecksPassed = false;
      }
      
      if (proPrice) {
        check(true, `Price Pro valide (${proPrice.unit_amount / 100} ${proPrice.currency.toUpperCase()})`);
      } else {
        check(false, 'Price Pro valide', `Price Pro invalide ou introuvable: ${stripePricePro}`);
        allChecksPassed = false;
      }
      
      console.log('');
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      
      if (allChecksPassed) {
        console.log(`${colors.green}✓ Configuration Stripe valide !${colors.reset}`);
        console.log(`${colors.green}  Vous pouvez maintenant tester les paiements.${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ Configuration incomplète${colors.reset}`);
        console.log(`${colors.yellow}  Veuillez corriger les erreurs ci-dessus.${colors.reset}`);
      }
      
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    }).catch(error => {
      console.log(`${colors.red}✗ Erreur lors de la vérification: ${error.message}${colors.reset}`);
      console.log('');
      console.log(`${colors.yellow}Vérifiez que votre clé Stripe est correcte.${colors.reset}`);
    });
  } catch (error) {
    console.log(`${colors.red}✗ Erreur lors de l'initialisation de Stripe: ${error.message}${colors.reset}`);
  }
} else {
  console.log('');
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  if (allChecksPassed) {
    console.log(`${colors.green}✓ Variables d'environnement définies${colors.reset}`);
    console.log(`${colors.yellow}⚠ Impossible de tester la connexion (clé invalide)${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Configuration incomplète${colors.reset}`);
    console.log(`${colors.yellow}  Veuillez corriger les erreurs ci-dessus.${colors.reset}`);
  }
  
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}
