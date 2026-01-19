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
    console.log('   RESEND_API_KEY présent:', !!process.env.RESEND_API_KEY);
    console.log('   ⚠️  Configurez RESEND_API_KEY dans les variables d\'environnement pour envoyer de vrais emails');
    return { success: true, preview: resetUrl };
  }

  console.log('📧 Envoi email via Resend...');
  console.log('   De:', fromEmail);
  console.log('   À:', email);
  console.log('   RESEND_API_KEY présent:', !!process.env.RESEND_API_KEY);

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
      console.error('   Type d\'erreur:', error.name);
      console.error('   Message:', error.message);
      if (error.message) {
        console.error('   Détails complets:', JSON.stringify(error, null, 2));
      }
      throw error;
    }

    console.log('✅ Email de réinitialisation envoyé à:', email);
    console.log('   Email ID:', data?.id);
    console.log('   Lien de réinitialisation:', resetUrl);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('❌ Erreur envoi email (catch):', error);
    console.error('   Type:', error.constructor.name);
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
    throw error;
  }
}

// Envoyer un email de contact
async function sendContactEmail(contactData) {
  const { firstName, lastName, email, phone, message } = contactData;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const contactEmail = process.env.CONTACT_EMAIL || 'contact@maximefarineau.com';

  if (!resend) {
    console.log('📧 Email de contact (non envoyé - Resend non configuré):');
    console.log('   De:', `${firstName} ${lastName} <${email}>`);
    console.log('   À:', contactEmail);
    console.log('   Message:', message);
    return { success: true, preview: 'Email non envoyé (Resend non configuré)' };
  }

  console.log('📧 Envoi email de contact via Resend...');
  console.log('   De:', fromEmail);
  console.log('   À:', contactEmail);
  console.log('   Contact:', `${firstName} ${lastName} <${email}>`);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [contactEmail],
      replyTo: email,
      subject: `Nouveau message de contact - ${firstName} ${lastName}`,
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
            .info-box {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
              border-left: 4px solid #00d4ff;
            }
            .info-item {
              margin: 8px 0;
            }
            .info-label {
              font-weight: 600;
              color: #555;
            }
            .message-box {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
              border: 1px solid #e0e0e0;
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px; 
              color: #666; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📧 Nouveau message de contact</h1>
            <p>Vous avez reçu un nouveau message depuis le formulaire de contact de Simplyleads.</p>
            
            <div class="info-box">
              <div class="info-item">
                <span class="info-label">Nom :</span> ${firstName} ${lastName}
              </div>
              <div class="info-item">
                <span class="info-label">Email :</span> <a href="mailto:${email}">${email}</a>
              </div>
              ${phone ? `<div class="info-item"><span class="info-label">Téléphone :</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
            </div>

            <div class="message-box">
              <strong>Message :</strong>
              <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
            </div>

            <div class="footer">
              <p>Pour répondre à ce message, répondez simplement à cet email.</p>
              <p style="margin-top: 10px; font-size: 11px; color: #999;">
                Message envoyé depuis le formulaire de contact de Simplyleads
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Nouveau message de contact - Simplyleads

        Vous avez reçu un nouveau message depuis le formulaire de contact de Simplyleads.

        Nom : ${firstName} ${lastName}
        Email : ${email}
        ${phone ? `Téléphone : ${phone}` : ''}

        Message :
        ${message}

        Pour répondre à ce message, répondez simplement à cet email.
      `,
    });

    if (error) {
      console.error('❌ Erreur envoi email de contact Resend:', error);
      console.error('   Type d\'erreur:', error.name);
      console.error('   Message:', error.message);
      throw error;
    }

    console.log('✅ Email de contact envoyé à:', contactEmail);
    console.log('   Email ID:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('❌ Erreur envoi email de contact (catch):', error);
    console.error('   Type:', error.constructor.name);
    console.error('   Message:', error.message);
    throw error;
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendContactEmail,
};
