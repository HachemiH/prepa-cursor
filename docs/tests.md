# Guide des Tests

## Tests Unitaires avec Vitest

### Configuration
Les tests unitaires sont configurés avec Vitest et se trouvent dans le dossier `src/__tests__/unit`.

### Exécution
```bash
# Lancer tous les tests unitaires
pnpm test:unit

# Lancer les tests en mode watch
pnpm test:unit:watch

# Générer un rapport de couverture
pnpm test:coverage
```

### Structure d'un Test Unitaire
```typescript
import { describe, it, expect } from 'vitest';

describe('UserService', () => {
  it('should create a new user', () => {
    // Arrange
    const input = { /* ... */ };
    const expected = { /* ... */ };

    // Act
    const result = service.createUser(input);

    // Assert
    expect(result).toEqual(expected);
  });
});
```

## Tests End-to-End avec Playwright

### Configuration
Les tests E2E sont configurés avec Playwright et se trouvent dans le dossier `test/e2e`.

### Exécution
```bash
# Lancer tous les tests E2E
pnpm test:e2e

# Lancer un test spécifique
pnpm test:e2e tests/auth.spec.ts
```

### Structure d'un Test E2E
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ request }) => {
    // Given
    const credentials = { /* ... */ };

    // When
    const response = await request.post('/api/v1/auth/login', {
      data: credentials
    });

    // Then
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
```

## Couverture de Code

Le rapport de couverture est généré avec `pnpm test:coverage` et inclut :
- Couverture des lignes
- Couverture des branches
- Couverture des fonctions
- Couverture des instructions

Le rapport est généré dans le dossier `coverage/`. 