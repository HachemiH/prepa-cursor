# Modèle Course

Le modèle `Course` représente un cours dans l'application. Il est au cœur du système d'apprentissage, reliant les instructeurs, les étudiants et les modules de cours.

## Table

| Nom          | Type      | Description                                      | Validation                                |
|--------------|-----------|--------------------------------------------------|------------------------------------------|
| id           | UUID      | Identifiant unique                               | Généré automatiquement                    |
| title        | string    | Titre du cours                                  | `@IsNotEmpty()`, `@MinLength(5)`          |
| description  | string    | Description détaillée                           | `@IsNotEmpty()`, `@MinLength(20)`         |
| instructorId | UUID      | Référence vers l'Instructor                     | `@IsNotEmpty()`, Clé étrangère            |
| isPublished  | boolean   | État de publication                             | `@IsBoolean()`, défaut: false             |
| createdAt    | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt    | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Validation

### Titre
- Ne peut pas être vide
- Minimum 5 caractères
- Maximum 100 caractères
- Doit être unique pour un même instructeur

### Description
- Ne peut pas être vide
- Minimum 20 caractères
- Maximum 5000 caractères
- Peut inclure du markdown pour le formatage

### État de Publication
- Par défaut à `false`
- Ne peut être mis à `true` que si :
  - Au moins un module existe
  - La description est complète
  - L'instructeur est validé

## Relations

1. **Instructor** (Many-to-One)
   - Chaque Course appartient à un seul Instructor
   - La relation est obligatoire
   - Suppression en cascade si l'Instructor est supprimé

2. **Student** (Many-to-Many)
   - Un Course peut avoir plusieurs Students inscrits
   - Un Student peut être inscrit à plusieurs Courses
   - Relation gérée via la table de jointure `student_courses`
   - Attributs additionnels : `enrolledAt`

3. **Module** (One-to-Many)
   - Un Course contient plusieurs Modules
   - Les Modules sont ordonnés via le champ `order`
   - Suppression en cascade des Modules si le Course est supprimé

## Hooks

### Avant Insertion
- Vérification de l'unicité du titre pour l'instructeur
- Sanitization du markdown dans la description

### Avant Publication
- Vérification de la présence d'au moins un module
- Vérification de la complétude des informations
- Vérification du statut de l'instructeur

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Foreign Key**
   - `instructorId` (Référence vers la table `instructors`)

3. **Index Composite**
   - `(instructorId, title)` pour l'unicité du titre par instructeur

4. **Index sur isPublished**
   - Pour les requêtes de filtrage des cours publiés

## Exemple d'Utilisation

```typescript
// Création d'un nouveau cours
const course = new CourseEntity();
course.title = 'Introduction à TypeScript';
course.description = 'Un cours complet sur TypeScript pour les débutants...';
course.instructor = instructor;
course.isPublished = false;

const errors = await validate(course);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await courseRepository.save(course);

// Ajout d'un module au cours
const module = new ModuleEntity();
module.title = 'Les bases de TypeScript';
module.course = course;
module.order = 1;
await moduleRepository.save(module);

// Publication du cours
course.isPublished = true;
await courseRepository.save(course);

// Inscription d'un étudiant
course.students = [...course.students, student];
await courseRepository.save(course);
```

## Requêtes Courantes

```typescript
// Trouver tous les cours publiés
const publishedCourses = await courseRepository
  .createQueryBuilder('course')
  .where('course.isPublished = :isPublished', { isPublished: true })
  .getMany();

// Trouver les cours d'un instructeur
const instructorCourses = await courseRepository
  .createQueryBuilder('course')
  .innerJoinAndSelect('course.instructor', 'instructor')
  .where('instructor.id = :instructorId', { instructorId })
  .getMany();

// Trouver les cours avec leur progression pour un étudiant
const coursesWithProgress = await courseRepository
  .createQueryBuilder('course')
  .leftJoinAndSelect('course.modules', 'module')
  .leftJoinAndSelect('module.progress', 'progress', 'progress.studentId = :studentId')
  .where('course.id IN (:...courseIds)', { courseIds })
  .getMany();
```

## Notes Importantes

1. **Publication**
   - Un cours ne peut être publié que s'il est complet
   - La publication est irréversible
   - Les modifications après publication sont tracées

2. **Modules**
   - L'ordre des modules est géré via le champ `order`
   - Les modules peuvent être réordonnés
   - L'ordre est maintenu cohérent automatiquement

3. **Inscriptions**
   - Les inscriptions sont tracées avec une date
   - Un étudiant ne peut s'inscrire qu'une fois
   - Les désinscriptions sont possibles mais tracées 