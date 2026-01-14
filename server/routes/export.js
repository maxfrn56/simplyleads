const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const XLSX = require('xlsx');
const db = require('../database/db');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Export CSV
router.get('/csv/:searchId', authenticateToken, async (req, res) => {
  try {
    const { searchId } = req.params;
    const userId = req.user.id;

    // Vérifier que la recherche appartient à l'utilisateur
    db.get(
      'SELECT * FROM searches WHERE id = ? AND user_id = ?',
      [searchId, userId],
      (err, search) => {
        if (err || !search) {
          return res.status(404).json({ error: 'Recherche non trouvée' });
        }

        // Récupérer les résultats
        db.all(
          'SELECT * FROM search_results WHERE search_id = ?',
          [searchId],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: 'Erreur lors de l\'export' });
            }

            const csvWriter = createCsvWriter({
              path: `export_${searchId}.csv`,
              header: [
                { id: 'companyName', title: 'Nom entreprise' },
                { id: 'city', title: 'Ville' },
                { id: 'sector', title: 'Secteur' },
                { id: 'phone', title: 'Téléphone' },
                { id: 'email', title: 'Email' },
                { id: 'websiteUrl', title: 'Site web' },
                { id: 'opportunityType', title: 'Type d\'opportunité' }
              ]
            });

            const csvData = results.map(r => ({
              companyName: r.company_name,
              city: r.city,
              sector: r.sector,
              phone: r.phone || '',
              email: r.email || '',
              websiteUrl: r.website_url || '',
              opportunityType: r.opportunity_type
            }));

            csvWriter.writeRecords(csvData).then(() => {
              const filePath = path.join(__dirname, `../../export_${searchId}.csv`);
              res.download(filePath, `prospects_${searchId}.csv`, (err) => {
                if (err) {
                  console.error('Erreur téléchargement:', err);
                }
                // Nettoyer le fichier après téléchargement
                setTimeout(() => {
                  if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                  }
                }, 1000);
              });
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'export CSV' });
  }
});

// Export Excel
router.get('/excel/:searchId', authenticateToken, async (req, res) => {
  try {
    const { searchId } = req.params;
    const userId = req.user.id;

    db.get(
      'SELECT * FROM searches WHERE id = ? AND user_id = ?',
      [searchId, userId],
      (err, search) => {
        if (err || !search) {
          return res.status(404).json({ error: 'Recherche non trouvée' });
        }

        db.all(
          'SELECT * FROM search_results WHERE search_id = ?',
          [searchId],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: 'Erreur lors de l\'export' });
            }

            const excelData = results.map(r => ({
              'Nom entreprise': r.company_name,
              'Ville': r.city,
              'Secteur': r.sector,
              'Téléphone': r.phone || '',
              'Email': r.email || '',
              'Site web': r.website_url || '',
              'Type d\'opportunité': r.opportunity_type
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Prospects');

            const filePath = path.join(__dirname, `../../export_${searchId}.xlsx`);
            XLSX.writeFile(wb, filePath);

            res.download(filePath, `prospects_${searchId}.xlsx`, (err) => {
              if (err) {
                console.error('Erreur téléchargement:', err);
              }
              setTimeout(() => {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              }, 1000);
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'export Excel' });
  }
});

module.exports = router;
