import { test, expect } from '@playwright/test';
import { UserRole } from '../../src/modules/users/enums/user-role.enum';

test.describe('Roles API', () => {
  test('GET /roles devrait retourner la liste des rôles sans authentification', async ({
    request,
  }) => {
    const response = await request.get('/roles');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toEqual(Object.values(UserRole));
    expect(body).toContain(UserRole.STUDENT);
    expect(body).toContain(UserRole.INSTRUCTOR);
    expect(body).toContain(UserRole.ADMIN);
    expect(body).toContain(UserRole.BANNED);
  });

  /**
   * Les tests suivants sont reportés à la version 0.3.0
   * car ils nécessitent l'authentification qui n'est pas encore implémentée
   */
  /*
  test('PATCH /roles/users/:id devrait rejeter les requêtes sans authentification', async ({ request }) => {
    const response = await request.patch('/roles/users/1', {
      data: { role: UserRole.INSTRUCTOR },
    });
    expect(response.status()).toBe(401);
  });

  test('PATCH /roles/users/:id devrait rejeter les requêtes des utilisateurs non-admin', async ({ request }) => {
    // TODO: Implémenter avec l'authentification dans v0.3.0
  });

  test('PATCH /roles/users/:id devrait permettre à un admin de changer le rôle d\'un utilisateur', async ({ request }) => {
    // TODO: Implémenter avec l'authentification dans v0.3.0
  });
  */
});
