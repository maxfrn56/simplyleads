const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Debug: logger les headers pour voir ce qui est reçu
  if (!authHeader) {
    console.warn('⚠️  Requête sans header Authorization:', req.path);
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn('⚠️  Token non trouvé dans le header Authorization');
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error('❌ Erreur vérification token:', err.message);
      return res.status(403).json({ 
        error: 'Token invalide ou expiré',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
