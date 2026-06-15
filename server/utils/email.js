const nodemailer = require('nodemailer');

// Configuración del transportador para IONOS SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.mx',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Enviar un correo al cliente.
 * @param {string} to - Dirección de correo electrónico del cliente.
 * @param {string} subject - Asunto del correo.
 * @param {string} htmlContent - Contenido HTML del correo.
 */
const sendEmail = async (to, subject, htmlContent) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_USER o SMTP_PASS no están configurados. El correo no se enviará.');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SanSah Bikes" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`✉️ Correo enviado a ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo SMTP:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
};
