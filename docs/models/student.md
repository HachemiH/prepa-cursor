# Modèle Student

Le modèle `Student` représente un étudiant dans l'application. Il étend le modèle `User` avec des fonctionnalités spécifiques aux étudiants.

## Table

| Nom         | Type      | Description                                      | Validation                                |
|-------------|-----------|--------------------------------------------------|------------------------------------------|
| id          | UUID      | Identifiant unique                               | Généré automatiquement                    |
| userId      | UUID      | Référence vers le User                          | `@IsNotEmpty()`, Clé étrangère            |
| bio         | string    | Biographie de l'étudiant                        | `@IsNotEmpty()`, `@MinLength(20)`         |
| interests   | string[]  | Centres d'intérêt                               | `@ArrayNotEmpty()`, `@IsString()`         |
| level       | enum      | Niveau de l'étudiant                            | `@IsEnum(StudentLevel)`                   |
| lastLoginAt | Date      | Dernière connexion                              | Optionnel                                 |
| createdAt   | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt   | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Énumérations

### StudentLevel

```typescript
enum StudentLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}
```

## Validation

### Biographie
- Ne peut pas être vide
- Minimum 20 caractères
- Maximum 1000 caractères

### Centres d'intérêt
- Au moins un centre d'intérêt
- Chaque élément doit être une chaîne non vide
- Maximum 10 centres d'intérêt

### Niveau
- Doit être une valeur valide de l'énumération StudentLevel

## Relations

1. **User** (One-to-One)
   - Chaque Student est lié à un User unique
   - La relation est obligatoire
   - Suppression en cascade si le User est supprimé

2. **Course** (Many-to-Many)
   - Un Student peut être inscrit à plusieurs Courses
   - Un Course peut avoir plusieurs Students
   - Relation gérée via la table de jointure `student_courses`
   - Attributs additionnels : `enrolledAt`

3. **CourseProgress** (One-to-Many)
   - Un Student peut avoir plusieurs CourseProgress
   - Chaque CourseProgress est lié à un seul Student
   - Permet de suivre la progression dans les modules

## Hooks

### Avant Insertion
- Vérification que le User associé a le rôle STUDENT
- Initialisation du niveau par défaut à BEGINNER si non spécifié

### Avant Mise à Jour
- Mise à jour automatique du lastLoginAt lors de la connexion

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Foreign Key**
   - `userId` (Référence vers la table `users`)

3. **Index sur lastLoginAt**
   - Pour les requêtes de tri et de filtrage par dernière connexion

## Exemple d'Utilisation

```typescript
// Création d'un nouvel étudiant
const student = new StudentEntity();
student.user = user; // User existant avec rôle STUDENT
student.bio = 'Passionné par l\'apprentissage du développement web...';
student.interests = ['JavaScript', 'TypeScript', 'Node.js'];
student.level = StudentLevel.BEGINNER;

const errors = await validate(student);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await studentRepository.save(student);

// Inscription à un cours
const course = await courseRepository.findOne(courseId);
student.enrolledCourses = [...student.enrolledCourses, course];
await studentRepository.save(student);

// Mise à jour de la dernière connexion
student.lastLoginAt = new Date();
await studentRepository.save(student);
```

## Requêtes Courantes

```typescript
// Trouver tous les étudiants inscrits à un cours spécifique
const students = await studentRepository
  .createQueryBuilder('student')
  .innerJoinAndSelect('student.enrolledCourses', 'course')
  .where('course.id = :courseId', { courseId })
  .getMany();

// Trouver la progression d'un étudiant dans un cours
const progress = await courseProgressRepository
  .createQueryBuilder('progress')
  .innerJoinAndSelect('progress.module', 'module')
  .where('progress.studentId = :studentId', { studentId })
  .andWhere('module.courseId = :courseId', { courseId })
  .getMany();
``` 