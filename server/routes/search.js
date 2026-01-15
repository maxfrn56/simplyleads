const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const scraper = require('../services/scraper');
const db = require('../database/db');

const router = express.Router();

// Recherche de prospects
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { city, department, sector, profileType } = req.body;
    const userId = req.user.id;

    if (!profileType) {
      return res.status(400).json({ error: 'Type de profil requis' });
    }

    // Vérifier le quota avant la recherche
    const quotaService = require('../services/quota');
    const quota = await quotaService.checkQuota(userId);

    if (!quota.hasQuota) {
      return res.status(403).json({
        error: 'Quota atteint',
        quota: {
          requestCount: quota.requestCount,
          requestLimit: quota.requestLimit,
          planType: quota.planType,
          remaining: 0
        }
      });
    }

    // Recherche des prospects
    const result = await scraper.searchProspects(city, department, sector, profileType);
    const { prospects, stats } = result;

    // Consommer une requête
    await quotaService.consumeRequest(userId);

    // Sauvegarder la recherche
    const searchResult = await db.run(
      'INSERT INTO searches (user_id, profile_type, city, department, sector) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, profileType, city || null, department || null, sector || null]
    );

    const searchId = searchResult.lastID;

    // Sauvegarder les résultats
    if (prospects.length > 0) {
      // Utiliser une insertion par lot pour PostgreSQL
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        
        for (const prospect of prospects) {
          const socialMediaJson = prospect.socialMedia ? JSON.stringify(prospect.socialMedia) : null;
          await client.query(
            'INSERT INTO search_results (search_id, company_name, city, sector, phone, email, website_url, opportunity_type, social_media) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [
              searchId,
              prospect.companyName,
              prospect.city,
              prospect.sector,
              prospect.phone,
              prospect.email,
              prospect.websiteUrl,
              prospect.opportunityType,
              socialMediaJson
            ]
          );
        }
        
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    res.json({
      searchId,
      count: prospects.length,
      prospects,
      stats: {
        totalPlacesFound: stats.totalPlacesFound,
        sitesAnalyzed: stats.sitesAnalyzed,
        sitesWithWebsite: stats.sitesWithWebsite,
        resultsAfterFiltering: stats.resultsAfterFiltering,
        searchMethod: stats.searchMethod
      }
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Historique des recherches
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const searches = await db.all(
      `SELECT s.*, COUNT(sr.id) as result_count
       FROM searches s
       LEFT JOIN search_results sr ON s.id = sr.search_id
       WHERE s.user_id = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json(searches);
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Récupérer les résultats d'une recherche précédente
router.get('/:searchId', authenticateToken, async (req, res) => {
  try {
    const { searchId } = req.params;
    const userId = req.user.id;

    const results = await db.all(
      `SELECT sr.* FROM search_results sr
       JOIN searches s ON sr.search_id = s.id
       WHERE s.id = $1 AND s.user_id = $2`,
      [searchId, userId]
    );
    
    // Transformer les résultats pour correspondre au format attendu
    const formattedResults = results.map(result => ({
      company_name: result.company_name,
      city: result.city,
      sector: result.sector,
      phone: result.phone,
      email: result.email,
      website_url: result.website_url,
      opportunity_type: result.opportunity_type,
      social_media: result.social_media
    }));
    
    res.json(formattedResults);
  } catch (error) {
    console.error('Erreur récupération résultats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

module.exports = router;
