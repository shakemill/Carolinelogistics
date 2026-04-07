# Guide de Configuration du Fichier .env

## Étape 1 : Créer le fichier .env

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

## Étape 2 : Configurer la Base de Données MySQL

### Option A : MySQL Local

1. **Installez MySQL** (si pas déjà fait) :
   - macOS : `brew install mysql`
   - Linux : `sudo apt-get install mysql-server`
   - Windows : Téléchargez depuis [mysql.com](https://dev.mysql.com/downloads/)

2. **Démarrez MySQL** :
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

3. **Créez la base de données** :
   ```bash
   mysql -u root -p
   ```
   
   Puis dans MySQL :
   ```sql
   CREATE DATABASE carolinelogistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'caroline_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
   GRANT ALL PRIVILEGES ON carolinelogistics.* TO 'caroline_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Configurez DATABASE_URL** dans `.env` :
   ```env
   DATABASE_URL="mysql://caroline_user:votre_mot_de_passe@localhost:3306/carolinelogistics"
   ```

### Option B : MySQL Cloud (PlanetScale, AWS RDS, etc.)

Utilisez la chaîne de connexion fournie par votre hébergeur :

```env
DATABASE_URL="mysql://user:password@host.planetscale.com:3306/database?sslaccept=accept_invalid_certs"
```

## Étape 3 : Générer NEXTAUTH_SECRET

Générez un secret sécurisé pour NextAuth :

**Option 1 : Avec OpenSSL** (recommandé)
```bash
openssl rand -base64 32
```

**Option 2 : En ligne**
Visitez : https://generate-secret.vercel.app/32

**Option 3 : Avec Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copiez le résultat dans `.env` :
```env
NEXTAUTH_SECRET="votre_secret_genere_ici"
```

## Étape 4 : Configurer Stripe (Optionnel pour le développement)

### Pour tester les paiements :

1. **Créez un compte Stripe** : https://dashboard.stripe.com/register

2. **Récupérez les clés de test** :
   - Allez sur : https://dashboard.stripe.com/test/apikeys
   - Copiez la **Secret key** (commence par `sk_test_`)
   - Copiez la **Publishable key** (commence par `pk_test_`)

3. **Configurez dans `.env`** :
   ```env
   STRIPE_SECRET_KEY="sk_test_51..."
   STRIPE_PUBLISHABLE_KEY="pk_test_51..."
   ```

4. **Pour les webhooks en développement** :
   - Installez Stripe CLI : https://stripe.com/docs/stripe-cli
   - Exécutez : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Copiez le `whsec_...` affiché dans votre `.env`

### Pour la production :

1. **Passez en mode live** sur Stripe Dashboard
2. **Récupérez les clés live** (commencent par `sk_live_` et `pk_live_`)
3. **Créez un webhook** pointant vers : `https://votre-domaine.com/api/webhooks/stripe`
4. **Copiez le secret du webhook** (`whsec_...`)

## Étape 5 : Configurer NEXTAUTH_URL

### Développement :
```env
NEXTAUTH_URL="http://localhost:3000"
```

### Production :
```env
NEXTAUTH_URL="https://votre-domaine.com"
```

## Étape 6 : Configurer l'envoi d'emails (SMTP)

Pour le formulaire de contact et les confirmations de commande :

```env
# SMTP - Envoi d'emails
SMTP_HOST="mail89.lwspanel.com"
SMTP_PORT="465"
SMTP_USER="contact@carolinelogistics.fr"
SMTP_PASS="votre_mot_de_passe_smtp"
SMTP_FROM="contact@carolinelogistics.fr"
```

- **SMTP_HOST** : `mail.carolinelogistics.fr` ou `mail89.lwspanel.com`
- **SMTP_PORT** : `465` (SSL) ou `587` (TLS)
- **SMTP_USER** : adresse email complète (authentification requise)
- **SMTP_PASS** : mot de passe du compte email
- **SMTP_FROM** : (optionnel) adresse affichée comme expéditeur

Sans configuration SMTP, les emails ne seront pas envoyés (un avertissement sera loggé).

## Étape 7 : Vérifier la Configuration

Votre fichier `.env` final devrait ressembler à ceci :

```env
# Base de données
DATABASE_URL="mysql://caroline_user:password@localhost:3306/carolinelogistics"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_secret_aleatoire_32_caracteres_minimum"

# Stripe (optionnel en dev)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SMTP - Envoi d'emails
SMTP_HOST="mail89.lwspanel.com"
SMTP_PORT="465"
SMTP_USER="contact@carolinelogistics.fr"
SMTP_PASS="votre_mot_de_passe_smtp"

# Environnement
NODE_ENV="development"
```

## Étape 8 : Tester la Configuration

1. **Testez la connexion à la base de données** :
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

2. **Chargez les données de test** :
   ```bash
   pnpm db:seed
   ```

3. **Démarrez l'application** :
   ```bash
   pnpm dev
   ```

## Dépannage

### Erreur de connexion MySQL
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans DATABASE_URL
- Vérifiez que la base de données existe

### Erreur NEXTAUTH_SECRET
- Assurez-vous que le secret fait au moins 32 caractères
- Régénérez un nouveau secret si nécessaire

### Erreur Stripe
- Vérifiez que les clés commencent par `sk_test_` ou `pk_test_`
- Pour les webhooks, utilisez Stripe CLI en développement

## Sécurité

⚠️ **IMPORTANT** :
- Ne commitez **JAMAIS** le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez des secrets différents pour développement et production
- Ne partagez jamais vos clés API publiquement
