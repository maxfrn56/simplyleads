import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingEffects } from './LandingEffects';
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
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Simplyleads</span>
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
              <Link to="/login" className="btn-nav" onClick={closeMobileMenu}>Connexion</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
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
                    >
                      <source src="/videos/hero-film.mp4" type="video/mp4" />
                      Votre navigateur ne supporte pas la vidéo.
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">🎯</span>
                <span className="logo-text">Simplyleads</span>
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
                <a href="mailto:support@simplyleads.fr">Support</a>
                <a href="mailto:contact@simplyleads.fr">Nous contacter</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Simplyleads. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
