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
    db.run(
      'INSERT INTO searches (user_id, profile_type, city, department, sector) VALUES (?, ?, ?, ?, ?)',
      [userId, profileType, city || null, department || null, sector || null],
      function(err) {
        if (err) {
          console.error('Erreur sauvegarde recherche:', err);
        }

        const searchId = this.lastID;

        // Sauvegarder les résultats
        const stmt = db.prepare(
          'INSERT INTO search_results (search_id, company_name, city, sector, phone, email, website_url, opportunity_type, social_media) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        prospects.forEach(prospect => {
          const socialMediaJson = prospect.socialMedia ? JSON.stringify(prospect.socialMedia) : null;
          stmt.run(
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
            ],
            (err) => {
              if (err) console.error('Erreur sauvegarde résultat:', err);
            }
          );
        });

        stmt.finalize();

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
      }
    );
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Historique des recherches (doit être AVANT /:searchId)
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT s.*, COUNT(sr.id) as result_count
     FROM searches s
     LEFT JOIN search_results sr ON s.id = sr.search_id
     WHERE s.user_id = ?
     GROUP BY s.id
     ORDER BY s.created_at DESC
     LIMIT 50`,
    [userId],
    (err, searches) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération' });
      }
      res.json(searches);
    }
  );
});

// Récupérer les résultats d'une recherche précédente
router.get('/:searchId', authenticateToken, (req, res) => {
  const { searchId } = req.params;
  const userId = req.user.id;

  db.all(
    `SELECT sr.* FROM search_results sr
     JOIN searches s ON sr.search_id = s.id
     WHERE s.id = ? AND s.user_id = ?`,
    [searchId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération' });
      }
      
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
    }
  );
});

module.exports = router;
