import { test, expect } from '@playwright/test';
import { UserRole } from '../../src/modules/users/enums/user-role.enum';

test.describe('Roles API', () => {
  const API_URL = 'http://localhost:3000';

  test.describe('GET /roles', () => {
    test('devrait retourner la liste des rôles sans authentification', async ({ request }) => {
      const response = await request.get(`${API_URL}/roles`);
      expect(response.ok()).toBeTruthy();
      
      const roles = await response.json();
      expect(roles).toEqual(expect.arrayContaining(Object.values(UserRole)));
      expect(roles.length).toBe(Object.values(UserRole).length);
    });
  });

  // TODO: v0.3.0 - Ces tests nécessitent l'authentification
  /*
  test.describe('PATCH /roles/users/:id', () => {
    test('devrait rejeter la requête sans authentification', async ({ request }) => {
      const response = await request.patch(`${API_URL}/roles/users/123`, {
        data: { role: UserRole.INSTRUCTOR }
      });
      expect(response.status()).toBe(401);
    });

    test('devrait rejeter la requête avec un utilisateur non admin', async ({ request }) => {
      const response = await request.patch(`${API_URL}/roles/users/123`, {
        data: { role: UserRole.INSTRUCTOR },
        headers: {
          'Authorization': 'Bearer student-token'
        }
      });
      expect(response.status()).toBe(403);
    });

    test('devrait permettre à un admin de changer le rôle d\'un utilisateur', async ({ request }) => {
      const response = await request.patch(`${API_URL}/roles/users/123`, {
        data: { role: UserRole.INSTRUCTOR },
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toEqual({
        message: 'Rôle mis à jour avec succès',
        role: UserRole.INSTRUCTOR
      });
    });

    test('devrait rejeter une transition de rôle invalide', async ({ request }) => {
      const response = await request.patch(`${API_URL}/roles/users/123`, {
        data: { role: UserRole.ADMIN },
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      expect(response.status()).toBe(403);
    });
  });
  */
}); 