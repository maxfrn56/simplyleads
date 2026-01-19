import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import './LegalPages.css';

export const MentionsLegales = () => {
  return (
    <div className="legal-page">
      <SEO 
        title="Mentions Légales"
        description="Mentions légales de Simplyleads - Informations sur l'éditeur, hébergement et conditions d'utilisation."
        canonicalUrl="https://simplyleads.fr/mentions-legales"
      />
      <div className="legal-container">
        <Link to="/" className="legal-back-link">← Retour à l'accueil</Link>
        
        <h1>Mentions Légales</h1>
        
        <section className="legal-section">
          <h2>1. Informations sur l'éditeur</h2>
          <p>
            Le site <strong>Simplyleads</strong> est édité par :
          </p>
          <div className="legal-info-box">
            <p><strong>Raison sociale :</strong> Simplyleads</p>
            <p><strong>Forme juridique :</strong> [À compléter selon votre statut]</p>
            <p><strong>Siège social :</strong> [Adresse complète]</p>
            <p><strong>SIRET :</strong> [Numéro SIRET]</p>
            <p><strong>RCS :</strong> [Ville du RCS]</p>
            <p><strong>Email :</strong> contact@simplyleads.fr</p>
            <p><strong>Directeur de publication :</strong> [Nom du directeur]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par :
          </p>
          <div className="legal-info-box">
            <p><strong>Hébergeur :</strong> [Nom de l'hébergeur]</p>
            <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
            <p><strong>Téléphone :</strong> [Numéro de téléphone]</p>
            <p><strong>Site web :</strong> [URL de l'hébergeur]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu du site Simplyleads (textes, images, vidéos, logos, icônes, etc.) 
            est la propriété exclusive de Simplyleads, sauf mention contraire.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, adaptation de tout ou 
            partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est 
            interdite sans autorisation écrite préalable de Simplyleads.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Responsabilité</h2>
          <p>
            Simplyleads s'efforce d'assurer l'exactitude et la mise à jour des informations 
            diffusées sur le site. Toutefois, Simplyleads ne peut garantir l'exactitude, 
            la précision ou l'exhaustivité des informations mises à disposition sur le site.
          </p>
          <p>
            Simplyleads ne saurait être tenu responsable des dommages directs ou indirects 
            causés au matériel de l'utilisateur lors de l'accès au site, et résultant soit 
            de l'utilisation d'un matériel ne répondant pas aux spécifications, soit de 
            l'apparition d'un bug ou d'une incompatibilité.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites présents sur 
            le réseau Internet. Les liens vers ces autres ressources vous font quitter le 
            site Simplyleads.
          </p>
          <p>
            Il est possible de créer un lien vers la page de présentation de ce site sans 
            autorisation expresse de l'éditeur. Aucune autorisation ni demande d'information 
            préalable ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite 
            établir un lien vers le site de l'éditeur.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de 
            litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux 
            français conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Contact</h2>
          <p>
            Pour toute question concernant les présentes mentions légales, vous pouvez 
            nous contacter à l'adresse suivante : <strong>contact@simplyleads.fr</strong>
          </p>
        </section>

        <div className="legal-footer">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};

export const RGPD = () => {
  return (
    <div className="legal-page">
      <SEO 
        title="RGPD"
        description="Conformité RGPD de Simplyleads - Vos droits concernant vos données personnelles et leur traitement."
        canonicalUrl="https://simplyleads.fr/rgpd"
      />
      <div className="legal-container">
        <Link to="/" className="legal-back-link">← Retour à l'accueil</Link>
        
        <h1>Politique de Protection des Données Personnelles (RGPD)</h1>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Simplyleads s'engage à protéger la confidentialité et la sécurité des données 
            personnelles de ses utilisateurs conformément au Règlement Général sur la 
            Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
          <p>
            La présente politique explique comment nous collectons, utilisons, stockons 
            et protégeons vos données personnelles.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Responsable du traitement</h2>
          <div className="legal-info-box">
            <p><strong>Responsable du traitement :</strong> Simplyleads</p>
            <p><strong>Adresse :</strong> [Adresse complète]</p>
            <p><strong>Email :</strong> contact@simplyleads.fr</p>
            <p><strong>Délégué à la protection des données (DPO) :</strong> [Nom et coordonnées si applicable]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>3. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Données d'identification :</strong> adresse email, mot de passe (hashé)</li>
            <li><strong>Données de connexion :</strong> adresse IP, logs de connexion</li>
            <li><strong>Données d'abonnement :</strong> type d'abonnement, historique des paiements</li>
            <li><strong>Données d'utilisation :</strong> recherches effectuées, résultats consultés</li>
            <li><strong>Données de paiement :</strong> gérées par notre prestataire Stripe (conformément à leur politique de confidentialité)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Finalités du traitement</h2>
          <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
          <ul>
            <li>Gestion de votre compte utilisateur</li>
            <li>Fourniture du service de prospection</li>
            <li>Gestion des abonnements et facturation</li>
            <li>Amélioration de nos services</li>
            <li>Respect de nos obligations légales et réglementaires</li>
            <li>Prévention de la fraude et sécurisation du site</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Base légale du traitement</h2>
          <p>Le traitement de vos données personnelles est fondé sur :</p>
          <ul>
            <li><strong>L'exécution d'un contrat :</strong> pour la fourniture de nos services</li>
            <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing (si applicable)</li>
            <li><strong>L'intérêt légitime :</strong> pour l'amélioration de nos services et la sécurité</li>
            <li><strong>L'obligation légale :</strong> pour la conservation des données de facturation</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Durée de conservation</h2>
          <p>Vos données personnelles sont conservées :</p>
          <ul>
            <li><strong>Données de compte :</strong> pendant toute la durée de votre abonnement et 3 ans après la fermeture du compte</li>
            <li><strong>Données de facturation :</strong> 10 ans conformément aux obligations comptables</li>
            <li><strong>Données de connexion :</strong> 12 mois</li>
            <li><strong>Données de recherche :</strong> jusqu'à suppression par l'utilisateur ou fermeture du compte</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Destinataires des données</h2>
          <p>Vos données peuvent être transmises à :</p>
          <ul>
            <li><strong>Stripe :</strong> pour le traitement des paiements (conformément à leur politique de confidentialité)</li>
            <li><strong>Google Places API :</strong> pour la recherche de prospects (données anonymisées)</li>
            <li><strong>Hébergeur :</strong> pour le stockage des données</li>
            <li><strong>Autorités compétentes :</strong> en cas d'obligation légale</li>
          </ul>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins commerciales.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> vous pouvez obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> vous pouvez corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> vous pouvez demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> vous pouvez demander la limitation du traitement</li>
            <li><strong>Droit à la portabilité :</strong> vous pouvez récupérer vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous pouvez vous opposer au traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <strong>contact@simplyleads.fr</strong>
          </p>
          <p>
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL 
            (Commission Nationale de l'Informatique et des Libertés) : 
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"> www.cnil.fr</a>
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
            pour protéger vos données personnelles contre la perte, l'utilisation abusive, 
            l'accès non autorisé, la divulgation, l'altération ou la destruction.
          </p>
          <p>Ces mesures incluent notamment :</p>
          <ul>
            <li>Chiffrement des mots de passe (hachage bcrypt)</li>
            <li>Utilisation de connexions sécurisées (HTTPS)</li>
            <li>Authentification par token (JWT)</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Sauvegardes régulières</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Transferts internationaux</h2>
          <p>
            Certains de nos prestataires (notamment Stripe et Google) peuvent être situés 
            en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des 
            garanties appropriées sont en place conformément au RGPD.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Cookies</h2>
          <p>
            Nous utilisons des cookies techniques nécessaires au fonctionnement du site. 
            Pour plus d'informations, consultez notre politique de confidentialité.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier la présente politique de protection 
            des données à tout moment. Les modifications entrent en vigueur dès leur 
            publication sur le site.
          </p>
        </section>

        <div className="legal-footer">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};

export const PolitiqueConfidentialite = () => {
  return (
    <div className="legal-page">
      <SEO 
        title="Politique de Confidentialité"
        description="Politique de confidentialité de Simplyleads - Comment nous collectons, utilisons et protégeons vos données personnelles."
        canonicalUrl="https://simplyleads.fr/politique-confidentialite"
      />
      <div className="legal-container">
        <Link to="/" className="legal-back-link">← Retour à l'accueil</Link>
        
        <h1>Politique de Confidentialité</h1>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Simplyleads ("nous", "notre", "nos") s'engage à protéger et respecter votre 
            vie privée. Cette politique de confidentialité explique comment nous 
            collectons, utilisons, divulguons et protégeons vos informations lorsque 
            vous utilisez notre service.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Informations que nous collectons</h2>
          
          <h3>2.1. Informations que vous nous fournissez</h3>
          <ul>
            <li><strong>Lors de l'inscription :</strong> adresse email, mot de passe</li>
            <li><strong>Lors de l'utilisation du service :</strong> critères de recherche (ville, département, secteur)</li>
            <li><strong>Lors du paiement :</strong> informations de facturation (gérées par Stripe)</li>
          </ul>

          <h3>2.2. Informations collectées automatiquement</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type de navigateur et version</li>
            <li>Pages visitées et temps passé sur le site</li>
            <li>Date et heure de connexion</li>
            <li>Données de navigation et préférences</li>
          </ul>

          <h3>2.3. Informations provenant de tiers</h3>
          <ul>
            <li><strong>Stripe :</strong> informations de paiement et statut d'abonnement</li>
            <li><strong>Google Places API :</strong> données publiques sur les entreprises recherchées</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Comment nous utilisons vos informations</h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul>
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Fournir, maintenir et améliorer nos services</li>
            <li>Traiter vos transactions et gérer vos abonnements</li>
            <li>Vous envoyer des notifications importantes concernant votre compte</li>
            <li>Répondre à vos demandes et fournir un support client</li>
            <li>Détecter, prévenir et résoudre les problèmes techniques</li>
            <li>Respecter nos obligations légales</li>
            <li>Protéger nos droits et notre sécurité</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Partage de vos informations</h2>
          <p>Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations avec :</p>
          
          <h3>4.1. Prestataires de services</h3>
          <ul>
            <li><strong>Stripe :</strong> traitement des paiements et gestion des abonnements</li>
            <li><strong>Google :</strong> service de recherche d'entreprises (Google Places API)</li>
            <li><strong>Hébergeurs :</strong> stockage et hébergement de nos données</li>
          </ul>
          <p>
            Ces prestataires sont tenus de protéger vos informations et ne peuvent les 
            utiliser que dans le cadre de la fourniture de leurs services.
          </p>

          <h3>4.2. Obligations légales</h3>
          <p>
            Nous pouvons divulguer vos informations si la loi l'exige ou si nous 
            estimons de bonne foi qu'une telle divulgation est nécessaire pour :
          </p>
          <ul>
            <li>Respecter une obligation légale</li>
            <li>Protéger nos droits ou notre propriété</li>
            <li>Prévenir ou enquêter sur des activités frauduleuses</li>
            <li>Protéger la sécurité de nos utilisateurs</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Sécurité de vos informations</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger 
            vos informations personnelles contre l'accès non autorisé, l'altération, 
            la divulgation ou la destruction.
          </p>
          <p>Ces mesures incluent :</p>
          <ul>
            <li>Chiffrement des mots de passe avec bcrypt</li>
            <li>Connexions sécurisées HTTPS</li>
            <li>Authentification par tokens sécurisés (JWT)</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Surveillance régulière de nos systèmes</li>
            <li>Sauvegardes sécurisées</li>
          </ul>
          <p>
            Cependant, aucune méthode de transmission sur Internet ou de stockage 
            électronique n'est totalement sécurisée. Bien que nous nous efforcions 
            d'utiliser des moyens commercialement acceptables pour protéger vos 
            informations, nous ne pouvons garantir leur sécurité absolue.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Vos choix et droits</h2>
          <p>Vous avez le droit de :</p>
          <ul>
            <li>Accéder à vos informations personnelles</li>
            <li>Corriger vos informations inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Vous opposer au traitement de vos données</li>
            <li>Demander la portabilité de vos données</li>
            <li>Retirer votre consentement à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <strong>contact@simplyleads.fr</strong>
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Cookies et technologies similaires</h2>
          <p>
            Nous utilisons des cookies et technologies similaires pour améliorer votre 
            expérience sur notre site. Les cookies sont de petits fichiers texte stockés 
            sur votre appareil.
          </p>
          <h3>Types de cookies utilisés :</h3>
          <ul>
            <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (authentification)</li>
            <li><strong>Cookies de préférences :</strong> mémorisent vos choix et préférences</li>
          </ul>
          <p>
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela 
            peut affecter certaines fonctionnalités du site.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Données des mineurs</h2>
          <p>
            Notre service n'est pas destiné aux personnes de moins de 18 ans. Nous ne 
            collectons pas sciemment d'informations personnelles auprès de mineurs. Si 
            nous apprenons qu'un mineur nous a fourni des informations personnelles, 
            nous les supprimerons immédiatement.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Conservation des données</h2>
          <p>
            Nous conservons vos informations personnelles aussi longtemps que nécessaire 
            pour fournir nos services et respecter nos obligations légales. Lorsque vous 
            supprimez votre compte, nous supprimons ou anonymisons vos données personnelles, 
            sauf si la loi nous oblige à les conserver plus longtemps.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Modifications de cette politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité de temps à autre. 
            Nous vous informerons de tout changement en publiant la nouvelle politique 
            sur cette page et en mettant à jour la date de "dernière mise à jour".
          </p>
          <p>
            Nous vous encourageons à consulter régulièrement cette politique pour rester 
            informé de la façon dont nous protégeons vos informations.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contact</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité, 
            vous pouvez nous contacter :
          </p>
          <div className="legal-info-box">
            <p><strong>Email :</strong> contact@simplyleads.fr</p>
            <p><strong>Adresse :</strong> [Adresse complète]</p>
          </div>
        </section>

        <div className="legal-footer">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};
