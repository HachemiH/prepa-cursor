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

- `pnpm migrate` : Lance les migrations en attente
- `pnpm migrate:create [name]` : Crée une nouvelle migration
- `pnpm migrate:revert` : Annule la dernière migration
- `pnpm seed` : Remplit la base de données avec des données de test
- `pnpm cleanup` : Nettoie la base de données (⚠️ Supprime toutes les données)