const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Servir le sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  try {
    // Chemin vers le sitemap dans le build du frontend
    const sitemapPath = path.join(__dirname, '../../client/build/sitemap.xml');
    
    // Si le fichier existe dans le build, le servir
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(sitemapPath);
    } else {
      // Sinon, servir le sitemap depuis public (pour développement)
      const publicSitemapPath = path.join(__dirname, '../../client/public/sitemap.xml');
      if (fs.existsSync(publicSitemapPath)) {
        res.setHeader('Content-Type', 'application/xml');
        res.sendFile(publicSitemapPath);
      } else {
        // Sitemap par défaut si le fichier n'existe pas
        const defaultSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://simplyleads.fr/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://simplyleads.fr/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://simplyleads.fr/pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://simplyleads.fr/mentions-legales</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://simplyleads.fr/politique-confidentialite</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://simplyleads.fr/rgpd</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
        res.setHeader('Content-Type', 'application/xml');
        res.send(defaultSitemap);
      }
    }
  } catch (error) {
    console.error('Erreur lecture sitemap:', error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
