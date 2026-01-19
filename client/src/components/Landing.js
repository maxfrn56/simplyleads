import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingEffects } from './LandingEffects';
import ContactForm from './ContactForm';
import SEO from './SEO';
import './Landing.css';

const Landing = () => {
  useLandingEffects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      <SEO 
        title="Accueil"
        description="Simplyleads - La prospection simplifiée pour freelances. Trouvez des clients qualifiés sans perdre des heures. Outil de prospection B2B pour développeurs web, designers, graphistes et consultants."
        keywords="prospection freelance, trouver clients freelance, prospection B2B, outil prospection, générer leads freelance, prospects qualifiés"
      />
      {/* Navigation */}
      <header>
        <nav className="navbar" role="navigation" aria-label="Navigation principale">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <img src={`${process.env.PUBLIC_URL}/images/logo-texte.png`} alt="" className="logo-icon" />
            </div>
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <a href="#fonctionnalites" onClick={closeMobileMenu}>Fonctionnalités</a>
              <a href="#comment-ca-marche" onClick={closeMobileMenu}>Comment ça marche</a>
              <a href="#metiers" onClick={closeMobileMenu}>Métiers</a>
              <a href="#contact" onClick={closeMobileMenu}>Contact</a>
              <Link to="/login" className="btn-nav" onClick={closeMobileMenu}>Connexion</Link>
            </div>
          </div>
        </div>
      </nav>
      </header>

      {/* Hero Section */}
      <main>
      <section className="hero" aria-label="Section principale">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Trouvez des clients,<br />
                <span className="gradient-text">pas des excuses.</span>
              </h1>
              <p className="hero-subtitle">
                <strong>La prospection simplifiée pour freelances</strong><br />
                Des prospects qualifiés, sans perdre des heures.
              </p>
              <div className="hero-cta">
                <Link to="/login" className="btn btn-primary btn-large">
                  Commencer gratuitement
                </Link>
                <a href="#comment-ca-marche" className="btn btn-secondary btn-large">
                  Découvrir comment
                </a>
              </div>
              <div className="hero-trust">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Données publiques uniquement</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Conforme RGPD</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="macbook-container">
                <div className="macbook-screen">
                  <div className="macbook-menu-bar">
                    <div className="macbook-menu-dots">
                      <span className="macbook-dot macbook-dot-red"></span>
                      <span className="macbook-dot macbook-dot-yellow"></span>
                      <span className="macbook-dot macbook-dot-green"></span>
                    </div>
                    <div className="macbook-menu-title">Simplyleads</div>
                  </div>
                  <div className="macbook-content">
                    <video 
                      className="hero-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label="Démonstration de Simplyleads - Interface de prospection pour freelances montrant la recherche de prospects qualifiés"
                    >
                      <source src="/videos/hero-film.mp4" type="video/mp4" />
                      Votre navigateur ne supporte pas la vidéo. Cette vidéo présente une démonstration de l'interface Simplyleads pour la prospection de clients qualifiés.
                    </video>
                  </div>
                </div>
                <div className="macbook-base"></div>
                <div className="macbook-shadow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Problème */}
      <section className="problem-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">La prospection freelance est chronophage et inefficace</h2>
            <p className="section-subtitle">
              Vous passez plus de temps à chercher qu'à travailler<br />
              <strong>Simplyleads : La prospection simplifiée pour freelances</strong>
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">⏰</div>
              <h3>Recherche manuelle longue</h3>
              <p>Des heures passées à parcourir Google, LinkedIn, les annuaires...</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">❓</div>
              <h3>Difficulté à savoir qui contacter</h3>
              <p>Qui a vraiment besoin de vos services ? Difficile à identifier.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📧</div>
              <h3>Trop de refus</h3>
              <p>Prospection à froid inefficace, taux de réponse faible.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">💸</div>
              <h3>Perte de temps non facturable</h3>
              <p>Le temps passé à prospecter, c'est du temps que vous ne facturez pas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Solution */}
      <section className="solution-section" id="fonctionnalites">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Une solution pensée pour les freelances</h2>
            <p className="section-subtitle">
              <strong>La prospection simplifiée pour freelances</strong><br />
              Automatisez votre prospection et concentrez-vous sur ce qui compte
            </p>
          </div>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">🔍</div>
              <h3>Recherche automatisée</h3>
              <p>Notre plateforme identifie automatiquement les entreprises qui correspondent à votre profil.</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🎯</div>
              <h3>Opportunités claires</h3>
              <p>Chaque prospect est accompagné d'une opportunité concrète : pourquoi les contacter ?</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3>Données publiques</h3>
              <p>Nous utilisons uniquement des données publiques et légales, conformes RGPD.</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">⚡</div>
              <h3>Prospection ciblée</h3>
              <p>Filtrez par ville, secteur, département. Trouvez exactement ce que vous cherchez.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="how-it-works" id="comment-ca-marche">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">En 3 étapes simples, trouvez vos prochains clients</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">👤</div>
              <h3>Choisissez votre métier</h3>
              <p>Sélectionnez votre profil : développeur web, designer, graphiste, consultant...</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🔎</div>
              <h3>Lancez une recherche</h3>
              <p>Indiquez la ville, le département ou le secteur qui vous intéresse.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">📋</div>
              <h3>Contactez des prospects</h3>
              <p>Recevez une liste de prospects qualifiés avec leurs coordonnées et l'opportunité identifiée.</p>
            </div>
          </div>
          <div className="cta-center">
            <Link to="/login" className="btn btn-primary btn-large">Essayer maintenant</Link>
          </div>
        </div>
      </section>

      {/* Section Métiers */}
      <section className="metiers-section" id="metiers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Des opportunités adaptées à votre métier</h2>
            <p className="section-subtitle">Chaque profil freelance a ses propres opportunités</p>
          </div>
          <div className="metiers-grid">
            <div className="metier-card">
              <div className="metier-header">
                <div className="metier-icon">💻</div>
                <h3>Développeur web</h3>
              </div>
              <div className="metier-content">
                <p className="metier-opportunity">Opportunités détectées :</p>
                <ul className="metier-list">
                  <li>Entreprises sans site web</li>
                  <li>Sites sans HTTPS (sécurité)</li>
                  <li>Présence uniquement sur réseaux sociaux</li>
                </ul>
              </div>
            </div>
            <div className="metier-card">
              <div className="metier-header">
                <div className="metier-icon">🎨</div>
                <h3>Web designer</h3>
              </div>
              <div className="metier-content">
                <p className="metier-opportunity">Opportunités détectées :</p>
                <ul className="metier-list">
                  <li>Sites non responsive</li>
                  <li>Designs obsolètes</li>
                  <li>Branding à améliorer</li>
                </ul>
              </div>
            </div>
            <div className="metier-card">
              <div className="metier-header">
                <div className="metier-icon">🖼️</div>
                <h3>Graphiste</h3>
              </div>
              <div className="metier-content">
                <p className="metier-opportunity">Opportunités détectées :</p>
                <ul className="metier-list">
                  <li>Entreprises sans logo</li>
                  <li>Logos de mauvaise qualité</li>
                  <li>Identité visuelle à créer</li>
                </ul>
              </div>
            </div>
            <div className="metier-card">
              <div className="metier-header">
                <div className="metier-icon">💼</div>
                <h3>Consultant</h3>
              </div>
              <div className="metier-content">
                <p className="metier-opportunity">Opportunités détectées :</p>
                <ul className="metier-list">
                  <li>Présence digitale faible</li>
                  <li>Absence de tunnel de conversion</li>
                  <li>Stratégie digitale à optimiser</li>
                </ul>
              </div>
            </div>
            <div className="metier-card">
              <div className="metier-header">
                <div className="metier-icon">📞</div>
                <h3>Commercial indépendant</h3>
              </div>
              <div className="metier-content">
                <p className="metier-opportunity">Opportunités détectées :</p>
                <ul className="metier-list">
                  <li>Absence de formulaire de contact</li>
                  <li>Pas de CRM visible</li>
                  <li>Système de contact à améliorer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Bénéfices */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pourquoi choisir Simplyleads ?</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">⏱️</div>
              <h3>Gagnez du temps</h3>
              <p>Réduisez votre temps de prospection de 80%. Concentrez-vous sur votre travail.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>Prospects qualifiés</h3>
              <p>Chaque prospect a une opportunité réelle et identifiée. Plus de prospection à l'aveugle.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <h3>Taux de réponse amélioré</h3>
              <p>Contactez des entreprises qui ont vraiment besoin de vos services.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💼</div>
              <h3>Export facile</h3>
              <p>Exportez vos résultats en CSV ou Excel pour votre CRM ou votre suivi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contenu SEO */}
      <section className="seo-content-section" aria-label="Informations détaillées">
        <div className="container">
          <article itemScope itemType="https://schema.org/Article">
            <h2>Simplyleads : L'outil de prospection B2B pour freelances</h2>
            <p>
              <strong>Simplyleads</strong> est la solution de prospection simplifiée conçue spécialement pour les freelances qui souhaitent trouver des clients qualifiés sans perdre des heures en recherche manuelle. Que vous soyez développeur web, designer, graphiste, consultant ou commercial indépendant, notre plateforme vous permet d'identifier rapidement les entreprises qui ont réellement besoin de vos services.
            </p>
            
            <h3>Pourquoi utiliser Simplyleads pour votre prospection freelance ?</h3>
            <p>
              La prospection B2B pour freelances est souvent chronophage et peu efficace. Vous passez des heures à parcourir Google, LinkedIn et les annuaires professionnels pour trouver des prospects, sans savoir s'ils ont vraiment besoin de vos services. Avec Simplyleads, fini la prospection à l'aveugle : notre algorithme analyse les sites web des entreprises et identifie automatiquement les opportunités réelles selon votre profil métier.
            </p>
            
            <h3>Comment fonctionne la prospection avec Simplyleads ?</h3>
            <p>
              Le processus est simple et rapide. Après avoir sélectionné votre profil freelance (développeur web, web designer, graphiste, consultant ou commercial indépendant), vous lancez une recherche en indiquant la zone géographique qui vous intéresse (ville, département ou secteur d'activité). Notre système analyse alors les sites web des entreprises et détecte les opportunités spécifiques à votre métier. Vous recevez une liste de prospects qualifiés avec leurs coordonnées complètes (email, téléphone, site web) et l'opportunité identifiée, prête à être exploitée.
            </p>
            
            <h3>Des opportunités adaptées à chaque profil freelance</h3>
            <p>
              Simplyleads détecte des opportunités différentes selon votre métier. Pour les développeurs web, nous identifions les entreprises sans site web, les sites sans HTTPS ou ceux qui n'ont qu'une présence sur les réseaux sociaux. Pour les web designers, nous repérons les sites non responsive ou avec des designs obsolètes. Les graphistes trouveront des entreprises sans logo ou avec une identité visuelle à améliorer. Les consultants identifieront les entreprises avec une présence digitale faible ou une stratégie à optimiser.
            </p>
            
            <h3>Exportez vos prospects pour votre CRM</h3>
            <p>
              Une fois vos recherches effectuées, vous pouvez exporter vos résultats au format CSV ou Excel pour les intégrer dans votre CRM ou votre système de suivi. Plus besoin de copier-coller manuellement les coordonnées : tout est automatisé pour vous faire gagner du temps.
            </p>
            
            <h3>Conforme RGPD et données publiques uniquement</h3>
            <p>
              Simplyleads respecte strictement le RGPD et n'utilise que des données publiques disponibles sur les sites web des entreprises. Aucune donnée personnelle n'est collectée sans consentement, et toutes les informations sont accessibles publiquement. Vous pouvez utiliser notre plateforme en toute confiance pour votre prospection freelance.
            </p>
            
            <h3>Commencez gratuitement dès aujourd'hui</h3>
            <p>
              Rejoignez les freelances qui utilisent Simplyleads pour simplifier leur prospection et trouver des clients qualifiés. Notre plan gratuit vous offre 5 requêtes pour tester la plateforme, sans carte bancaire et sans engagement. Passez ensuite à un plan Starter (100 requêtes/mois) ou Pro (illimité) selon vos besoins.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Arrêtez de chercher des clients au hasard</h2>
            <p className="cta-subtitle">
              <strong>La prospection simplifiée pour freelances</strong><br />
              Rejoignez les freelances qui utilisent Simplyleads
            </p>
            <Link to="/login" className="btn btn-primary btn-large btn-white">
              Créer mon compte gratuitement
            </Link>
            <p className="cta-note">Sans carte bancaire • Essai gratuit • Sans engagement</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <img src={`${process.env.PUBLIC_URL}/images/logo-texte.png`} alt="" className="logo-icon" />
              </div>
              <p>La prospection simplifiée pour freelances</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Produit</h4>
                <a href="#fonctionnalites">Fonctionnalités</a>
                <a href="#comment-ca-marche">Comment ça marche</a>
                <a href="#metiers">Métiers</a>
              </div>
              <div className="footer-column">
                <h4>Légal</h4>
                <Link to="/mentions-legales">Mentions légales</Link>
                <Link to="/politique-confidentialite">Politique de confidentialité</Link>
                <Link to="/rgpd">RGPD</Link>
              </div>
              <div className="footer-column">
                <h4>Contact</h4>
                <a href="#contact">Formulaire de contact</a>
                <a href="mailto:support@simplyleads.fr">Support</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Simplyleads. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
};

export default Landing;
