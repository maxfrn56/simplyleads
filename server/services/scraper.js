const axios = require('axios');
const cheerio = require('cheerio');

class ProspectScraper {
  constructor() {
    this.cache = new Map();
    this.googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    // Log pour débogage
    if (this.googleApiKey) {
      console.log('✅ Clé API Google Places chargée:', this.googleApiKey.substring(0, 20) + '...');
    } else {
      console.warn('⚠️  Clé API Google Places non trouvée dans les variables d\'environnement');
    }
  }

  // Recherche de prospects avec Google Places API
  async searchProspects(city, department, sector, profileType) {
    const stats = {
      totalPlacesFound: 0,
      sitesAnalyzed: 0,
      sitesWithWebsite: 0,
      resultsAfterFiltering: 0,
      searchMethod: 'mock'
    };

    try {
      // Recharger la clé API à chaque recherche (au cas où elle serait ajoutée après le démarrage)
      const apiKey = process.env.GOOGLE_PLACES_API_KEY || this.googleApiKey;
      
      // Si pas de clé API, utiliser les données mockées
      if (!apiKey) {
        console.warn('⚠️  Clé API Google non configurée, utilisation des données mockées');
        console.warn('   Vérifiez que GOOGLE_PLACES_API_KEY est bien défini dans votre fichier .env');
        const result = await this.searchMockProspects(city, department, sector, profileType);
        stats.resultsAfterFiltering = result.length;
        stats.totalPlacesFound = result.length;
        return { prospects: result, stats };
      }

      console.log(`🔍 Recherche Google Places: ${sector || ''} ${city || department || 'France'}`);
      stats.searchMethod = 'google_places';

      // Recherche avec Google Places API
      const places = await this.searchGooglePlaces(city, department, sector, apiKey);
      stats.totalPlacesFound = places.length;
      
      // Convertir les résultats Google Places en prospects
      const prospects = await Promise.all(
        places.map(place => this.convertPlaceToProspect(place, city, sector))
      );

      // Compter les sites avec site web
      stats.sitesWithWebsite = prospects.filter(p => p.website).length;

      // Analyser chaque prospect selon le profil (avec analyse des sites web)
      const analyzedProspects = [];
      for (let i = 0; i < prospects.length; i++) {
        const prospect = prospects[i];
        if (prospect.website) {
          stats.sitesAnalyzed++;
        }
        const analyzed = await this.analyzeProspect(prospect, profileType);
        analyzedProspects.push(analyzed);
      }

      const filteredProspects = analyzedProspects.filter(p => p.opportunityType !== null);
      stats.resultsAfterFiltering = filteredProspects.length;

      console.log(`📊 Statistiques: ${stats.totalPlacesFound} lieux trouvés, ${stats.sitesAnalyzed} sites analysés, ${stats.resultsAfterFiltering} résultats après filtrage`);

      return { prospects: filteredProspects, stats };
    } catch (error) {
      console.error('Erreur recherche Google Places:', error);
      // En cas d'erreur, utiliser les données mockées
      const result = await this.searchMockProspects(city, department, sector, profileType);
      stats.resultsAfterFiltering = result.length;
      stats.totalPlacesFound = result.length;
      return { prospects: result, stats };
    }
  }

  // Recherche avec Google Places API
  async searchGooglePlaces(city, department, sector, apiKey) {
    const query = this.buildSearchQuery(city, department, sector);
    const places = [];
    const key = apiKey || this.googleApiKey;

    console.log(`📡 Appel Google Places API avec la requête: "${query}"`);

    try {
      // Utiliser Text Search API de Google Places
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: query,
          key: key,
          language: 'fr',
          region: 'fr'
        }
      });

      console.log(`📊 Réponse Google Places API - Status: ${response.data.status}`);

      if (response.data.status === 'OK' && response.data.results) {
        // Limiter à 20 résultats pour le MVP
        const results = response.data.results.slice(0, 20);
        console.log(`✅ ${results.length} résultats trouvés par Google Places`);
        
        // Enrichir avec les détails de chaque lieu
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
          try {
            const details = await this.getPlaceDetails(place.place_id, key);
            places.push({ ...place, details });
            if ((i + 1) % 5 === 0) {
              console.log(`   ${i + 1}/${results.length} lieux enrichis...`);
            }
          } catch (err) {
            // Si erreur détails, utiliser les infos de base
            places.push(place);
          }
        }
        console.log(`✅ ${places.length} prospects préparés`);
      } else {
        console.error('❌ Erreur Google Places API:', response.data.status);
        if (response.data.error_message) {
          console.error('   Message:', response.data.error_message);
        }
        throw new Error(`Google Places API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Erreur appel Google Places API:', error.message);
      throw error;
    }

    return places;
  }

  // Obtenir les détails d'un lieu (téléphone, site web, etc.)
  async getPlaceDetails(placeId, apiKey) {
    const key = apiKey || this.googleApiKey;
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_phone_number,website,formatted_address,types,international_phone_number',
          key: key,
          language: 'fr'
        }
      });

      if (response.data.status === 'OK' && response.data.result) {
        return response.data.result;
      }
      return null;
    } catch (error) {
      console.error('Erreur détails lieu:', error.message);
      return null;
    }
  }

  // Extraire l'email depuis un site web
  async extractEmailFromWebsite(url) {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Chercher les emails dans le HTML
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const text = $.text();
      const emails = text.match(emailRegex) || [];
      
      // Filtrer les emails valides (exclure les emails génériques)
      const validEmails = emails.filter(email => {
        const lowerEmail = email.toLowerCase();
        return !lowerEmail.includes('example.com') &&
               !lowerEmail.includes('test.com') &&
               !lowerEmail.includes('placeholder') &&
               !lowerEmail.includes('noreply') &&
               !lowerEmail.includes('no-reply');
      });
      
      return validEmails.length > 0 ? validEmails[0] : null;
    } catch (error) {
      // Si erreur, essayer de chercher dans les liens mailto
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const $ = cheerio.load(response.data);
        const mailtoLinks = $('a[href^="mailto:"]');
        if (mailtoLinks.length > 0) {
          const email = mailtoLinks.first().attr('href').replace('mailto:', '').split('?')[0];
          return email || null;
        }
      } catch (e) {
        // Ignorer les erreurs
      }
      return null;
    }
  }

  // Extraire les réseaux sociaux depuis un site web
  async extractSocialMediaFromWebsite(url) {
    const socialMedia = {
      facebook: null,
      instagram: null,
      linkedin: null,
      twitter: null,
      youtube: null
    };

    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Chercher les liens vers les réseaux sociaux
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href').toLowerCase();
        const text = $(elem).text().toLowerCase();
        
        // Facebook
        if (href.includes('facebook.com') || text.includes('facebook')) {
          if (!socialMedia.facebook && href.includes('facebook.com')) {
            socialMedia.facebook = href.startsWith('http') ? href : `https://${href}`;
          }
        }
        
        // Instagram
        if (href.includes('instagram.com') || text.includes('instagram')) {
          if (!socialMedia.instagram && href.includes('instagram.com')) {
            socialMedia.instagram = href.startsWith('http') ? href : `https://${href}`;
          }
        }
        
        // LinkedIn
        if (href.includes('linkedin.com') || text.includes('linkedin')) {
          if (!socialMedia.linkedin && href.includes('linkedin.com')) {
            socialMedia.linkedin = href.startsWith('http') ? href : `https://${href}`;
          }
        }
        
        // Twitter/X
        if (href.includes('twitter.com') || href.includes('x.com') || text.includes('twitter') || text.includes('x.com')) {
          if (!socialMedia.twitter && (href.includes('twitter.com') || href.includes('x.com'))) {
            socialMedia.twitter = href.startsWith('http') ? href : `https://${href}`;
          }
        }
        
        // YouTube
        if (href.includes('youtube.com') || href.includes('youtu.be') || text.includes('youtube')) {
          if (!socialMedia.youtube && (href.includes('youtube.com') || href.includes('youtu.be'))) {
            socialMedia.youtube = href.startsWith('http') ? href : `https://${href}`;
          }
        }
      });
      
      // Nettoyer les URLs (enlever les paramètres inutiles)
      Object.keys(socialMedia).forEach(key => {
        if (socialMedia[key]) {
          socialMedia[key] = socialMedia[key].split('?')[0].split('#')[0];
        }
      });
      
    } catch (error) {
      // Ignorer les erreurs silencieusement
    }
    
    return socialMedia;
  }

  // Construire la requête de recherche
  buildSearchQuery(city, department, sector) {
    let query = '';
    
    if (sector) {
      query += `${sector} `;
    }
    
    if (city) {
      query += `${city}`;
    } else if (department) {
      query += `département ${department}`;
    } else {
      query += 'France';
    }

    return query.trim();
  }

  // Convertir un résultat Google Places en prospect
  async convertPlaceToProspect(place, city, sector) {
    const details = place.details || {};
    const address = place.formatted_address || place.vicinity || '';
    const extractedCity = this.extractCityFromAddress(address, city);
    const website = details.website || null;

    // Extraire email et réseaux sociaux depuis le site web si disponible
    let email = null;
    let socialMedia = {
      facebook: null,
      instagram: null,
      linkedin: null,
      twitter: null,
      youtube: null
    };

    if (website) {
      try {
        // Extraire l'email
        email = await this.extractEmailFromWebsite(website);
        
        // Extraire les réseaux sociaux
        socialMedia = await this.extractSocialMediaFromWebsite(website);
      } catch (error) {
        // Ignorer les erreurs silencieusement
        console.log(`⚠️  Impossible d'extraire les données de ${website}`);
      }
    }

    return {
      name: place.name || details.name || 'Entreprise',
      city: extractedCity,
      department: this.extractDepartment(address),
      sector: sector || this.extractSectorFromTypes(place.types || details.types || []),
      phone: details.formatted_phone_number || null,
      email: email,
      website: website,
      socialMedia: socialMedia
    };
  }

  // Extraire la ville de l'adresse
  extractCityFromAddress(address, defaultCity) {
    if (defaultCity) return defaultCity;
    
    // Format typique: "123 Rue Example, 75001 Paris, France"
    const match = address.match(/(\d{5})\s+([^,]+)/);
    if (match) {
      return match[2].trim();
    }
    return address.split(',').slice(-2, -1)[0]?.trim() || 'Inconnu';
  }

  // Extraire le département de l'adresse
  extractDepartment(address) {
    const match = address.match(/\b(\d{2})\d{3}\b/);
    return match ? match[1] : null;
  }

  // Extraire le secteur depuis les types Google Places
  extractSectorFromTypes(types) {
    const sectorMap = {
      'restaurant': 'Restauration',
      'store': 'Commerce',
      'beauty_salon': 'Beauté',
      'hair_care': 'Coiffure',
      'gym': 'Sport',
      'lawyer': 'Juridique',
      'accounting': 'Comptabilité',
      'real_estate_agency': 'Immobilier',
      'travel_agency': 'Voyage',
      'car_dealer': 'Automobile',
      'pharmacy': 'Pharmacie',
      'hospital': 'Santé',
      'school': 'Éducation',
      'bank': 'Banque'
    };

    for (const type of types) {
      const cleanType = type.replace('_', '');
      if (sectorMap[cleanType]) {
        return sectorMap[cleanType];
      }
    }
    return 'Commerce';
  }

  // Recherche avec données mockées (fallback)
  async searchMockProspects(city, department, sector, profileType) {
    const prospects = this.generateMockProspects(city, department, sector, profileType);
    
    const analyzedProspects = await Promise.all(
      prospects.map(prospect => this.analyzeProspect(prospect, profileType))
    );

    return analyzedProspects.filter(p => p.opportunityType !== null);
  }

  generateMockProspects(city, department, sector, profileType) {
    // Génère des prospects de test réalistes
    const mockCompanies = [
      {
        name: `Entreprise ${sector || 'Générale'} ${city || 'Paris'}`,
        city: city || 'Paris',
        department: department || '75',
        sector: sector || 'Commerce',
        phone: '01 23 45 67 89',
        email: 'contact@example.com',
        website: 'http://example.com' // Pas de HTTPS
      },
      {
        name: `Boutique ${city || 'Lyon'}`,
        city: city || 'Lyon',
        department: department || '69',
        sector: sector || 'Retail',
        phone: '04 12 34 56 78',
        email: null,
        website: null // Pas de site
      },
      {
        name: `Service ${sector || 'Services'} ${city || 'Marseille'}`,
        city: city || 'Marseille',
        department: department || '13',
        sector: sector || 'Services',
        phone: '04 91 23 45 67',
        email: 'info@service.fr',
        website: 'https://service.fr' // Site moderne
      },
      {
        name: `Artisan ${city || 'Toulouse'}`,
        city: city || 'Toulouse',
        department: department || '31',
        sector: sector || 'Artisanat',
        phone: '05 61 23 45 67',
        email: null,
        website: 'https://facebook.com/artisan' // Réseaux sociaux uniquement
      },
      {
        name: `Consulting ${city || 'Bordeaux'}`,
        city: city || 'Bordeaux',
        department: department || '33',
        sector: sector || 'Consulting',
        phone: '05 56 12 34 56',
        email: 'contact@consulting.fr',
        website: 'http://consulting.fr' // Site sans HTTPS
      }
    ];

    return mockCompanies;
  }

  async analyzeProspect(prospect, profileType) {
    let opportunityType = null;
    let websiteUrl = prospect.website || '';
    
    // Analyser le site web si disponible
    let websiteAnalysis = null;
    if (websiteUrl && !websiteUrl.includes('facebook.com') && !websiteUrl.includes('instagram.com')) {
      try {
        websiteAnalysis = await this.analyzeWebsite(websiteUrl);
      } catch (error) {
        // Ignorer les erreurs d'analyse
      }
    }

    // Analyse selon le profil
    switch (profileType) {
      case 'developpeur-web':
        if (!prospect.website) {
          opportunityType = 'Pas de site';
        } else if (prospect.website.startsWith('http://')) {
          opportunityType = 'Site sans HTTPS';
        } else if (prospect.website.includes('facebook.com') || prospect.website.includes('instagram.com')) {
          opportunityType = 'Réseaux sociaux uniquement';
        } else if (websiteAnalysis && !websiteAnalysis.hasHttps) {
          opportunityType = 'Site sans HTTPS';
        } else {
          opportunityType = 'Site à moderniser';
        }
        break;

      case 'web-designer':
        if (!prospect.website) {
          opportunityType = 'Pas de site';
        } else if (prospect.website.startsWith('http://')) {
          opportunityType = 'Site non sécurisé (design potentiellement daté)';
        } else if (websiteAnalysis && !websiteAnalysis.isResponsive) {
          opportunityType = 'Site non responsive';
        } else {
          opportunityType = 'Design à améliorer';
        }
        break;

      case 'graphiste':
        if (!prospect.website) {
          opportunityType = 'Pas de logo visible';
        } else if (prospect.website.includes('facebook.com') || prospect.website.includes('instagram.com')) {
          opportunityType = 'Présence uniquement réseaux sociaux';
        } else if (websiteAnalysis && !websiteAnalysis.hasLogo) {
          opportunityType = 'Pas de logo visible';
        } else {
          opportunityType = 'Logo à améliorer';
        }
        break;

      case 'consultant':
        if (!prospect.website) {
          opportunityType = 'Présence digitale faible';
        } else if (!prospect.email && (!websiteAnalysis || !websiteAnalysis.hasForm)) {
          opportunityType = 'Absence de formulaire de contact';
        } else {
          opportunityType = 'Tunnel de conversion à optimiser';
        }
        break;

      case 'commercial-independant':
        if (!prospect.email && (!websiteAnalysis || !websiteAnalysis.hasForm)) {
          opportunityType = 'Absence de formulaire de contact';
        } else if (!prospect.website) {
          opportunityType = 'Pas de CRM visible';
        } else {
          opportunityType = 'Système de contact à améliorer';
        }
        break;

      default:
        opportunityType = 'Opportunité générale';
    }

    return {
      companyName: prospect.name,
      city: prospect.city,
      sector: prospect.sector,
      phone: prospect.phone,
      email: prospect.email,
      websiteUrl: websiteUrl,
      socialMedia: prospect.socialMedia || {
        facebook: null,
        instagram: null,
        linkedin: null,
        twitter: null,
        youtube: null
      },
      opportunityType: opportunityType
    };
  }

  // Méthode pour analyser un site web réel
  async analyzeWebsite(url) {
    try {
      if (!url || url.includes('facebook.com') || url.includes('instagram.com')) {
        return { hasHttps: false, isResponsive: false, hasForm: false, hasLogo: false };
      }

      // Normaliser l'URL
      let normalizedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        normalizedUrl = 'https://' + url;
      }

      const response = await axios.get(normalizedUrl, {
        timeout: 8000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        validateStatus: function (status) {
          return status < 500; // Accepter les codes < 500
        }
      });

      const $ = cheerio.load(response.data);
      const html = response.data.toLowerCase();

      // Vérifier HTTPS
      const hasHttps = normalizedUrl.startsWith('https://') || response.request.res.responseUrl?.startsWith('https://');

      // Vérifier responsive design
      const viewportMeta = $('meta[name="viewport"]').attr('content') || '';
      const isResponsive = viewportMeta.includes('width') || 
                          html.includes('responsive') || 
                          html.includes('mobile') ||
                          $('link[rel*="stylesheet"][media*="screen"]').length > 0;

      // Vérifier formulaire de contact
      const hasForm = $('form').length > 0 || 
                     html.includes('contact') || 
                     html.includes('formulaire') ||
                     $('a[href*="contact"]').length > 0 ||
                     $('a[href*="mailto"]').length > 0;

      // Vérifier logo
      const hasLogo = $('img[alt*="logo" i], img[alt*="Logo" i]').length > 0 ||
                     $('.logo, #logo, [class*="logo" i]').length > 0 ||
                     $('img[src*="logo" i]').length > 0;

      return {
        hasHttps: hasHttps,
        isResponsive: isResponsive,
        hasForm: hasForm,
        hasLogo: hasLogo
      };
    } catch (error) {
      // En cas d'erreur, retourner des valeurs par défaut
      return { 
        hasHttps: url.startsWith('https://'), 
        isResponsive: false, 
        hasForm: false, 
        hasLogo: false,
        error: error.message 
      };
    }
  }
}

module.exports = new ProspectScraper();
