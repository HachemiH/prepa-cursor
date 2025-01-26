# Modèle User

Le modèle `User` est le modèle de base pour tous les utilisateurs de l'application. Il contient les informations communes à tous les types d'utilisateurs.

## Table

| Nom        | Type      | Description                                      | Validation                                |
|------------|-----------|--------------------------------------------------|------------------------------------------|
| id         | UUID      | Identifiant unique                               | Généré automatiquement                    |
| email      | string    | Adresse email (unique)                          | `@IsEmail()`, unique                      |
| password   | string    | Mot de passe hashé                              | `@MinLength(8)`, hashé avec bcrypt        |
| firstName  | string    | Prénom                                          | `@IsNotEmpty()`, `@MinLength(2)`          |
| lastName   | string    | Nom                                             | `@IsNotEmpty()`, `@MinLength(2)`          |
| role       | enum      | Rôle (ADMIN, INSTRUCTOR, STUDENT)               | `@IsEnum(UserRole)`                       |
| isActive   | boolean   | Statut du compte                                | `@IsBoolean()`, défaut: true              |
| createdAt  | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt  | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Énumérations

### UserRole

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}
```

## Validation

### Email
- Doit être une adresse email valide
- Doit être unique dans la base de données
- Est automatiquement converti en minuscules

### Mot de passe
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial
- Est hashé avant stockage avec bcrypt

### Nom et Prénom
- Ne peuvent pas être vides
- Minimum 2 caractères
- Maximum 50 caractères
- Sont nettoyés des espaces superflus

## Relations

Le modèle `User` est la base pour deux types d'utilisateurs spécialisés :

1. **Student** (One-to-One)
   - Un User avec le rôle STUDENT peut avoir un profil Student associé
   - La relation est gérée via une clé étrangère dans la table `students`

2. **Instructor** (One-to-One)
   - Un User avec le rôle INSTRUCTOR peut avoir un profil Instructor associé
   - La relation est gérée via une clé étrangère dans la table `instructors`

## Hooks

### Avant Insertion
- Le mot de passe est hashé
- L'email est converti en minuscules
- Les espaces sont supprimés des noms/prénoms

### Avant Mise à Jour
- Si le mot de passe est modifié, il est hashé
- L'email est converti en minuscules si modifié
- Les espaces sont supprimés des noms/prénoms si modifiés

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Unique Indexes**
   - `email` (Pour garantir l'unicité des adresses email)

## Exemple d'Utilisation

```typescript
const user = new UserEntity();
user.email = 'john.doe@example.com';
user.password = 'Password1@';
user.firstName = 'John';
user.lastName = 'Doe';
user.role = UserRole.STUDENT;
user.isActive = true;

const errors = await validate(user);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await userRepository.save(user);
``` 