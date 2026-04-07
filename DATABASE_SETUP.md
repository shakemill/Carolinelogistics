# Configuration de la Base de Données MySQL

## Prérequis

- MySQL 5.7+ ou MySQL 8.0+ (recommandé)
- Node.js et pnpm installés

## Format de la DATABASE_URL

La variable d'environnement `DATABASE_URL` doit suivre ce format pour MySQL :

```
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslaccept=accept_invalid_certs"
```

### Exemples

**Local (sans SSL) :**
```
DATABASE_URL="mysql://root:password@localhost:3306/carolinelogistics"
```

**Local avec utilisateur spécifique :**
```
DATABASE_URL="mysql://caroline_user:secure_password@localhost:3306/carolinelogistics"
```

**Production (avec SSL) :**
```
DATABASE_URL="mysql://user:password@your-db-host.com:3306/carolinelogistics?sslaccept=accept_invalid_certs"
```

**PlanetScale / MySQL Cloud :**
```
DATABASE_URL="mysql://user:password@host.planetscale.com:3306/database?sslaccept=accept_invalid_certs"
```

## Configuration

1. Créez un fichier `.env` à la racine du projet :

```bash
# Database
DATABASE_URL="mysql://root:password@localhost:3306/carolinelogistics"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NODE_ENV="development"
```

2. Créez la base de données MySQL :

```sql
CREATE DATABASE carolinelogistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Exécutez les migrations Prisma :

```bash
pnpm db:migrate
```

4. Chargez les données de seed :

```bash
pnpm db:seed
```

## Commandes Prisma utiles

- `pnpm db:generate` - Génère le client Prisma
- `pnpm db:migrate` - Crée et applique les migrations
- `pnpm db:push` - Pousse le schéma vers la DB (dev uniquement)
- `pnpm db:seed` - Charge les données de test
- `pnpm db:studio` - Ouvre Prisma Studio (interface graphique)

## Notes importantes pour MySQL

- **Charset** : La base de données doit utiliser `utf8mb4` pour supporter les emojis et caractères spéciaux
- **JSON** : MySQL 5.7+ supporte le type JSON natif
- **Enums** : Prisma convertit les enums TypeScript en ENUM MySQL
- **Index** : Les index sont automatiquement créés selon le schéma Prisma

## Dépannage

### Erreur de connexion
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans DATABASE_URL
- Vérifiez que la base de données existe

### Erreur de charset
```sql
ALTER DATABASE carolinelogistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Réinitialiser la base de données
```bash
# Supprimer toutes les tables
pnpm prisma migrate reset

# Ou manuellement
mysql -u root -p -e "DROP DATABASE carolinelogistics; CREATE DATABASE carolinelogistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```
