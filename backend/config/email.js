const nodemailer = require('nodemailer');

let transporter = null;
let transporterReady = null; // will be a Promise

const isRealEmail = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com';

if (isRealEmail) {
  // Use real Gmail / SMTP credentials from .env
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  transporterReady = transporter.verify()
    .then(() => console.log('✅ Email service ready (Gmail)'))
    .catch((err) => console.warn('⚠️  Email service error:', err.message));
} else {
  // Auto-create an Ethereal test account (free, no signup needed)
  transporterReady = nodemailer.createTestAccount().then((testAccount) => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  📧  ETHEREAL TEST EMAIL ACCOUNT (dev mode)             ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  User : ${testAccount.user.padEnd(47)}║`);
    console.log(`║  Pass : ${testAccount.pass.padEnd(47)}║`);
    console.log('║  Inbox: https://ethereal.email/login                    ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✅ Email service ready (Ethereal test mode)');
  }).catch((err) => {
    console.error('⚠️  Could not create Ethereal account:', err.message);
  });
}

/**
 * Get the transporter (waits for Ethereal account to be ready if needed).
 * Returns { transporter, getPreviewUrl }
 */
async function getTransporter() {
  await transporterReady;
  return transporter;
}

/**
 * Helper to get preview URL for Ethereal emails.
 * Returns a URL string or null for real email providers.
 */
function getPreviewUrl(info) {
  if (!isRealEmail && info) {
    return nodemailer.getTestMessageUrl(info);
  }
  return null;
}

module.exports = { getTransporter, getPreviewUrl };
