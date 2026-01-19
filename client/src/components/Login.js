import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from './SEO';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email, password }
        : { email, password, firstName, lastName, phone };
      const response = await api.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setIsAuthenticated(true);
      } else {
        throw new Error('Token manquant dans la réponse');
      }
    } catch (err) {
      console.error('Erreur connexion/inscription:', err);
      console.error('URL API utilisée:', api.defaults.baseURL);
      console.error('Détails erreur:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('Impossible de se connecter au serveur. Vérifiez votre connexion et que le serveur est démarré.');
      } else {
        setError(`Une erreur est survenue: ${err.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <SEO 
        title={isLogin ? "Connexion" : "Inscription"}
        description={isLogin ? "Connectez-vous à votre compte Simplyleads pour accéder à vos recherches de prospects." : "Créez votre compte Simplyleads gratuitement et commencez à trouver des clients qualifiés dès aujourd'hui."}
        canonicalUrl={`https://simplyleads.fr/login`}
      />
      <div className="login-card">
        <Link to="/" className="back-to-home">
          ← Retour au site
        </Link>
        <h1>Simplyleads</h1>
        <p className="subtitle">La prospection simplifiée pour freelances</p>

        <div className="auth-tabs">
          <button
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setFirstName('');
              setLastName('');
              setPhone('');
            }}
          >
            Connexion
          </button>
          <button
            className={!isLogin ? 'tab active' : 'tab'}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Téléphone (optionnel)</label>
                <input
                  type="tel"
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
          </button>

          {isLogin && (
            <div className="forgot-password-link">
              <Link to="/forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
