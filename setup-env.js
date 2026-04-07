#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Générer un secret NextAuth sécurisé
const generateSecret = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Lire le fichier .env existant
let existingEnv = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      existingEnv[key.trim()] = value.trim();
    }
  });
}

// Variables requises avec valeurs par défaut
const requiredVars = {
  DATABASE_URL: existingEnv.DATABASE_URL || 'mysql://root:password@localhost:3306/carolinelogistics',
  NEXTAUTH_URL: existingEnv.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: existingEnv.NEXTAUTH_SECRET || generateSecret(),
  STRIPE_SECRET_KEY: existingEnv.STRIPE_SECRET_KEY || 'sk_test_...',
  STRIPE_PUBLISHABLE_KEY: existingEnv.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  STRIPE_WEBHOOK_SECRET: existingEnv.STRIPE_WEBHOOK_SECRET || 'whsec_...',
  NODE_ENV: existingEnv.NODE_ENV || 'development',
};

// Construire le contenu du fichier .env
let envContent = `# ============================================
# BASE DE DONNÉES MySQL
# ============================================
# Format: mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="${requiredVars.DATABASE_URL}"

# ============================================
# NEXTAUTH.JS (Authentification)
# ============================================
# URL de base de votre application
NEXTAUTH_URL="${requiredVars.NEXTAUTH_URL}"

# Secret pour signer les tokens JWT (généré automatiquement)
NEXTAUTH_SECRET="${requiredVars.NEXTAUTH_SECRET}"

# ============================================
# STRIPE (Paiement)
# ============================================
# Clés API Stripe - Récupérez-les sur: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="${requiredVars.STRIPE_SECRET_KEY}"
STRIPE_PUBLISHABLE_KEY="${requiredVars.STRIPE_PUBLISHABLE_KEY}"

# Secret du webhook Stripe
# Récupérez-le sur: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET="${requiredVars.STRIPE_WEBHOOK_SECRET}"

# ============================================
# ENVIRONNEMENT
# ============================================
NODE_ENV="${requiredVars.NODE_ENV}"
`;

// Écrire le fichier .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Fichier .env configuré avec succès !\n');
console.log('📝 Variables configurées :');
console.log(`   DATABASE_URL: ${requiredVars.DATABASE_URL}`);
console.log(`   NEXTAUTH_URL: ${requiredVars.NEXTAUTH_URL}`);
console.log(`   NEXTAUTH_SECRET: ${requiredVars.NEXTAUTH_SECRET.substring(0, 20)}... (généré)`);
console.log(`   NODE_ENV: ${requiredVars.NODE_ENV}\n`);

console.log('⚠️  Actions requises :');
console.log('   1. Vérifiez et modifiez DATABASE_URL avec vos identifiants MySQL');
console.log('   2. Configurez vos clés Stripe (optionnel pour le développement)');
console.log('   3. Créez la base de données MySQL si elle n\'existe pas :');
console.log('      mysql -u root -p -e "CREATE DATABASE carolinelogistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"\n');

console.log('📚 Pour plus d\'informations, consultez ENV_SETUP.md');
