import { useEffect } from 'react';

// Effets et animations pour la landing page
export const useLandingEffects = () => {
  useEffect(() => {
    // Gestion du scroll de la navbar
    const navbar = document.querySelector('.landing-page .navbar');
    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll);
      // Vérifier l'état initial
      handleScroll();

      // Smooth scroll pour les ancres
      const handleAnchorClick = (e) => {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      };

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
      });

      // Animation au scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      // Observer les éléments à animer
      document.querySelectorAll('.problem-card, .solution-card, .step, .metier-card, .benefit-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.removeEventListener('click', handleAnchorClick);
        });
      };
    }
  }, []);
};
