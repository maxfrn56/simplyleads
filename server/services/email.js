const { Resend } = require('resend');

// Initialiser Resend avec la clé API
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️  RESEND_API_KEY non configuré. Les emails ne seront pas envoyés.');
}

// Envoyer un email de réinitialisation de mot de passe
async function sendPasswordResetEmail(email, resetToken) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!resend) {
    // Mode développement ou Resend non configuré : log l'email
    console.log('📧 Email de réinitialisation (non envoyé - Resend non configuré):');
    console.log('   Destinataire:', email);
    console.log('   Lien:', resetUrl);
    console.log('   ⚠️  Configurez RESEND_API_KEY dans les variables d\'environnement pour envoyer de vrais emails');
    return { success: true, preview: resetUrl };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Réinitialisation de votre mot de passe - Simplyleads',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container { 
              background-color: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 { 
              color: #00d4ff; 
              margin-top: 0;
              font-size: 24px;
            }
            .button { 
              display: inline-block; 
              padding: 14px 28px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
              font-weight: 600;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .link-box {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
              word-break: break-all;
              font-size: 12px;
              color: #007bff;
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px; 
              color: #666; 
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 15px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔐 Réinitialisation de votre mot de passe</h1>
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>Simplyleads</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <div class="link-box">${resetUrl}</div>
            <div class="warning">
              <strong>⏰ Important :</strong> Ce lien est valide pendant <strong>1 heure</strong> uniquement.
            </div>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe restera inchangé.</p>
            <div class="footer">
              <p>Cordialement,<br><strong>L'équipe Simplyleads</strong></p>
              <p style="margin-top: 10px; font-size: 11px; color: #999;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de votre mot de passe - Simplyleads

        Bonjour,

        Vous avez demandé à réinitialiser votre mot de passe pour votre compte Simplyleads.

        Cliquez sur le lien suivant pour créer un nouveau mot de passe :
        ${resetUrl}

        ⏰ Important : Ce lien est valide pendant 1 heure uniquement.

        Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.

        Cordialement,
        L'équipe Simplyleads
      `,
    });

    if (error) {
      console.error('❌ Erreur envoi email Resend:', error);
      throw error;
    }

    console.log('✅ Email de réinitialisation envoyé à:', email);
    console.log('   Email ID:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

module.exports = {
  sendPasswordResetEmail,
};
