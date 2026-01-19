import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://simplyleads.fr/images/og-image.jpg',
  ogType = 'website',
  canonicalUrl 
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://simplyleads.fr';
  const fullTitle = title ? `${title} | Simplyleads` : 'Simplyleads - La prospection simplifiée pour freelances';
  const fullDescription = description || 'Simplyleads - La prospection simplifiée pour freelances. Trouvez des clients qualifiés sans perdre des heures. Outil de prospection B2B pour freelances.';
  const fullKeywords = keywords || 'prospection freelance, trouver clients freelance, prospection B2B, outil prospection, générer leads freelance, prospects qualifiés';
  const canonical = canonicalUrl || siteUrl;

  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="Simplyleads" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Simplyleads - Interface de prospection pour freelances montrant la recherche de prospects qualifiés" />
      <meta property="og:site_name" content="Simplyleads" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Simplyleads - Interface de prospection pour freelances montrant la recherche de prospects qualifiés" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#00d4ff" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Simplyleads",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          },
          "description": fullDescription,
          "url": siteUrl,
          "author": {
            "@type": "Organization",
            "name": "Simplyleads"
          }
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Simplyleads",
          "url": siteUrl,
          "logo": `${siteUrl}/images/logo-simply.png`,
          "description": fullDescription,
          "sameAs": [
            "https://www.linkedin.com/company/simplyleads",
            "https://twitter.com/simplyleads"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@simplyleads.fr"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
