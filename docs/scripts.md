# Scripts Disponibles

## Scripts de Base

- `pnpm build` : Compile le projet TypeScript
- `pnpm dev` : Lance l'application en mode développement avec hot reload
- `pnpm start` : Lance l'application en mode production

## Scripts de Test

- `pnpm test:unit` : Lance les tests unitaires avec Vitest
- `pnpm test:e2e` : Lance les tests end-to-end avec Playwright
- `pnpm test:coverage` : Génère un rapport de couverture de code

## Scripts de Qualité de Code

- `pnpm lint` : Vérifie le code avec ESLint
- `pnpm format` : Formate le code avec Prettier

## Scripts de Base de Données

### Migrations TypeORM

- `pnpm migration:generate nom-migration` : Génère une nouvelle migration à partir des changements d'entités
  - Exemple : `pnpm migration:generate create-users-table`
  - Crée un fichier horodaté dans `src/migrations/`
  - Analyse les différences entre les entités et la base de données

- `pnpm migration:run` : Exécute les migrations en attente
  - Met à jour le schéma de la base de données
  - Enregistre les migrations exécutées dans la table `migrations`
  - Affiche les logs SQL en mode développement

- `pnpm migration:revert` : Annule la dernière migration exécutée
  - Restaure l'état précédent de la base de données
  - Supprime l'entrée de la table `migrations`
  - À utiliser avec précaution en production

### Autres Scripts Base de Données

- `pnpm db:seed` : Remplit la base de données avec des données de test
- `pnpm db:cleanup` : Nettoie la base de données (⚠️ Supprime toutes les données)
- `pnpm db:reset` : Réinitialise la base de données (cleanup + seed)