import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      console.error('Erreur demande réinitialisation:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/login" className="back-to-home">
          ← Retour à la connexion
        </Link>
        <h1>Mot de passe oublié</h1>
        <p className="subtitle">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {success ? (
          <div className="success-message">
            <p>✅ Si cet email existe dans notre système, vous recevrez un email avec les instructions de réinitialisation.</p>
            <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              Vérifiez votre boîte de réception (et vos spams) dans les prochaines minutes.
            </p>
            <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
