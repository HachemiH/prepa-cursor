# Modèle Instructor

Le modèle `Instructor` représente un instructeur dans l'application. Il étend le modèle `User` avec des fonctionnalités spécifiques aux instructeurs.

## Table

| Nom         | Type      | Description                                      | Validation                                |
|-------------|-----------|--------------------------------------------------|------------------------------------------|
| id          | UUID      | Identifiant unique                               | Généré automatiquement                    |
| userId      | UUID      | Référence vers le User                          | `@IsNotEmpty()`, Clé étrangère            |
| bio         | string    | Biographie de l'instructeur                     | `@IsNotEmpty()`, `@MinLength(100)`        |
| expertise   | string[]  | Domaines d'expertise                            | `@ArrayNotEmpty()`, `@IsString()`         |
| rating      | float     | Note moyenne                                    | `@Min(0)`, `@Max(5)`, défaut: 0           |
| createdAt   | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt   | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Validation

### Biographie
- Ne peut pas être vide
- Minimum 100 caractères
- Maximum 2000 caractères
- Doit inclure l'expérience et les compétences

### Expertise
- Au moins un domaine d'expertise
- Chaque élément doit être une chaîne non vide
- Maximum 10 domaines d'expertise

### Note
- Comprise entre 0 et 5
- Précision à une décimale
- Calculée automatiquement à partir des évaluations des étudiants

## Relations

1. **User** (One-to-One)
   - Chaque Instructor est lié à un User unique
   - La relation est obligatoire
   - Suppression en cascade si le User est supprimé

2. **Course** (One-to-Many)
   - Un Instructor peut créer plusieurs Courses
   - Chaque Course est lié à un seul Instructor
   - Relation directe via la clé étrangère dans Course

## Hooks

### Avant Insertion
- Vérification que le User associé a le rôle INSTRUCTOR
- Initialisation de la note à 0

### Avant Mise à Jour
- Recalcul automatique de la note moyenne lors de nouvelles évaluations

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Foreign Key**
   - `userId` (Référence vers la table `users`)

3. **Index sur rating**
   - Pour les requêtes de tri et de filtrage par note

## Exemple d'Utilisation

```typescript
// Création d'un nouvel instructeur
const instructor = new InstructorEntity();
instructor.user = user; // User existant avec rôle INSTRUCTOR
instructor.bio = 'Développeur senior avec 10 ans d\'expérience dans le développement web. Spécialisé dans les technologies JavaScript modernes et l\'architecture des applications. Passionné par l\'enseignement et le partage des connaissances...';
instructor.expertise = ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Architecture'];
instructor.rating = 0;

const errors = await validate(instructor);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await instructorRepository.save(instructor);

// Création d'un nouveau cours
const course = new CourseEntity();
course.instructor = instructor;
course.title = 'Introduction à TypeScript';
course.description = 'Un cours complet sur TypeScript...';
await courseRepository.save(course);

// Mise à jour de la note
instructor.rating = 4.5; // Calculé à partir des évaluations
await instructorRepository.save(instructor);
```

## Requêtes Courantes

```typescript
// Trouver tous les cours d'un instructeur
const courses = await courseRepository
  .createQueryBuilder('course')
  .innerJoinAndSelect('course.instructor', 'instructor')
  .where('instructor.id = :instructorId', { instructorId })
  .getMany();

// Trouver les instructeurs les mieux notés
const topInstructors = await instructorRepository
  .createQueryBuilder('instructor')
  .orderBy('instructor.rating', 'DESC')
  .take(10)
  .getMany();

// Trouver les instructeurs par domaine d'expertise
const experts = await instructorRepository
  .createQueryBuilder('instructor')
  .where(':expertise = ANY(instructor.expertise)', { expertise: 'TypeScript' })
  .getMany();
```

## Notes Importantes

1. **Calcul de la Note**
   - La note est une moyenne des évaluations des étudiants
   - Elle est mise à jour automatiquement via un trigger
   - Les évaluations individuelles sont stockées séparément

2. **Validation de l'Expertise**
   - Les domaines d'expertise sont normalisés (minuscules, sans espaces)
   - Les doublons sont automatiquement supprimés
   - Les domaines invalides sont rejetés

3. **Biographie**
   - Doit être professionnelle et détaillée
   - Peut inclure du markdown pour le formatage
   - Est sanitisée avant stockage 