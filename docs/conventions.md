# Conventions de Code

## TypeScript

### Principes de Base
- Utiliser l'anglais pour tout le code et la documentation
- Toujours déclarer les types (éviter `any`)
- Utiliser les interfaces pour définir les contrats
- Documenter les classes et méthodes publiques avec JSDoc

### Nomenclature
- Classes : PascalCase (ex: `UserService`)
- Variables et fonctions : camelCase (ex: `getUserById`)
- Fichiers et dossiers : kebab-case (ex: `user-service.ts`)
- Variables d'environnement : UPPERCASE (ex: `DB_HOST`)
- Constantes : UPPERCASE (ex: `MAX_RETRIES`)

### Fonctions
- Nommer avec un verbe + complément (ex: `createUser`)
- Pour les booléens, utiliser is/has/can (ex: `isActive`, `hasPermission`)
- Maximum 20 instructions par fonction
- Un seul niveau d'abstraction par fonction
- Éviter les blocs imbriqués (early returns)

### Classes
- Suivre les principes SOLID
- Préférer la composition à l'héritage
- Maximum 200 lignes par classe
- Maximum 10 méthodes publiques
- Maximum 10 propriétés

## Tests

### Tests Unitaires (Vitest)
- Un fichier de test par fichier source (`*.spec.ts`)
- Utiliser la convention AAA (Arrange-Act-Assert)
- Nommer les variables de test clairement (input/mock/actual/expected)
- Tester chaque fonction publique
- Utiliser des mocks pour simuler les dépendances

### Tests E2E (Playwright)
- Suivre la convention Given-When-Then
- Un fichier de test par fonctionnalité (`*.e2e-spec.ts`)
- Tester les cas d'erreur et les cas limites

## Git

### Messages de Commit
Format : `type(scope): description`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Mise en forme du code
- `refactor` : Refactoring
- `perf` : Optimisation
- `test` : Tests
- `chore` : Maintenance

### Branches
- `main` : Production
- `develop` : Développement
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `release/*` : Préparation des releases 