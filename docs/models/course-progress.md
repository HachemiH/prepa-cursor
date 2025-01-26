# Modèle CourseProgress

Le modèle `CourseProgress` permet de suivre la progression des étudiants dans les modules des cours. Il enregistre l'état de complétion et la date de réalisation.

## Table

| Nom         | Type      | Description                                      | Validation                                |
|-------------|-----------|--------------------------------------------------|------------------------------------------|
| id          | UUID      | Identifiant unique                               | Généré automatiquement                    |
| studentId   | UUID      | Référence vers le Student                       | `@IsNotEmpty()`, Clé étrangère            |
| moduleId    | UUID      | Référence vers le Module                        | `@IsNotEmpty()`, Clé étrangère            |
| completed   | boolean   | État de complétion                              | `@IsBoolean()`, défaut: false             |
| completedAt | Date      | Date de complétion                              | Optionnel, requis si completed = true     |
| createdAt   | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt   | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Validation

### État de Complétion
- Doit être un booléen
- Si true, completedAt doit être défini
- Si false, completedAt doit être null

### Date de Complétion
- Doit être une date valide
- Ne peut pas être dans le futur
- Requise uniquement si completed = true

## Relations

1. **Student** (Many-to-One)
   - Chaque CourseProgress appartient à un seul Student
   - La relation est obligatoire
   - Suppression en cascade si le Student est supprimé

2. **Module** (Many-to-One)
   - Chaque CourseProgress est lié à un seul Module
   - La relation est obligatoire
   - Suppression en cascade si le Module est supprimé

## Hooks

### Avant Insertion
- Vérification que le Student est inscrit au Course du Module
- Initialisation de completed à false
- Initialisation de completedAt à null

### Avant Mise à Jour
- Si completed passe à true, définition de completedAt
- Si completed passe à false, réinitialisation de completedAt à null
- Vérification des conditions de complétion du module

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Foreign Keys**
   - `studentId` (Référence vers la table `students`)
   - `moduleId` (Référence vers la table `modules`)

3. **Index Composite Unique**
   - `(studentId, moduleId)` pour garantir une seule progression par étudiant et module

## Exemple d'Utilisation

```typescript
// Création d'une nouvelle progression
const progress = new CourseProgressEntity();
progress.student = student;
progress.module = module;
progress.completed = false;

const errors = await validate(progress);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await courseProgressRepository.save(progress);

// Marquer un module comme complété
progress.completed = true;
progress.completedAt = new Date();
await courseProgressRepository.save(progress);

// Réinitialiser la progression
progress.completed = false;
progress.completedAt = null;
await courseProgressRepository.save(progress);
```

## Requêtes Courantes

```typescript
// Trouver la progression d'un étudiant dans un cours
const progress = await courseProgressRepository
  .createQueryBuilder('progress')
  .innerJoinAndSelect('progress.module', 'module')
  .where('progress.studentId = :studentId', { studentId })
  .andWhere('module.courseId = :courseId', { courseId })
  .orderBy('module.order', 'ASC')
  .getMany();

// Calculer le pourcentage de complétion d'un cours
const completion = await courseProgressRepository
  .createQueryBuilder('progress')
  .innerJoin('progress.module', 'module')
  .where('progress.studentId = :studentId', { studentId })
  .andWhere('module.courseId = :courseId', { courseId })
  .select([
    'COUNT(progress.id) FILTER (WHERE progress.completed = true)::float / COUNT(progress.id) * 100 as percentage'
  ])
  .getRawOne();

// Trouver les derniers modules complétés
const recentProgress = await courseProgressRepository
  .createQueryBuilder('progress')
  .innerJoinAndSelect('progress.module', 'module')
  .innerJoinAndSelect('module.course', 'course')
  .where('progress.studentId = :studentId', { studentId })
  .andWhere('progress.completed = true')
  .orderBy('progress.completedAt', 'DESC')
  .take(5)
  .getMany();
```

## Notes Importantes

1. **Unicité**
   - Un étudiant ne peut avoir qu'une seule progression par module
   - La progression est créée automatiquement lors de la première consultation du module

2. **Validation de la Complétion**
   - La complétion peut être soumise à des conditions (quiz, exercices, etc.)
   - Ces conditions sont vérifiées avant de permettre la complétion
   - La date de complétion est automatiquement gérée

3. **Calcul de la Progression**
   - La progression globale est calculée en pourcentage
   - Les modules peuvent avoir des poids différents
   - La progression débloque l'accès aux modules suivants

4. **Historique**
   - Les changements d'état sont tracés via updatedAt
   - La date de complétion est préservée même si le module est réinitialisé
   - Un historique détaillé peut être maintenu dans une table séparée 