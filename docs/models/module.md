# Modèle Module

Le modèle `Module` représente une unité d'apprentissage dans un cours. Il contient le contenu pédagogique et est organisé de manière séquentielle dans un cours.

## Table

| Nom         | Type      | Description                                      | Validation                                |
|-------------|-----------|--------------------------------------------------|------------------------------------------|
| id          | UUID      | Identifiant unique                               | Généré automatiquement                    |
| title       | string    | Titre du module                                 | `@IsNotEmpty()`, `@MinLength(5)`          |
| description | string    | Description détaillée                           | `@IsNotEmpty()`, `@MinLength(20)`         |
| courseId    | UUID      | Référence vers le Course                        | `@IsNotEmpty()`, Clé étrangère            |
| order       | number    | Position dans le cours                          | `@IsNumber()`, `@Min(0)`                  |
| content     | string    | Contenu du module                               | `@IsNotEmpty()`, `@MinLength(20)`         |
| createdAt   | Date      | Date de création                                | Généré automatiquement                     |
| updatedAt   | Date      | Date de dernière modification                   | Généré automatiquement                     |

## Validation

### Titre
- Ne peut pas être vide
- Minimum 5 caractères
- Maximum 100 caractères
- Doit être unique dans le cours

### Description
- Ne peut pas être vide
- Minimum 20 caractères
- Maximum 1000 caractères
- Doit décrire les objectifs d'apprentissage

### Ordre
- Doit être un nombre positif
- Doit être unique dans le cours
- Est automatiquement ajusté lors de l'insertion/modification

### Contenu
- Ne peut pas être vide
- Minimum 20 caractères
- Peut contenir du markdown
- Peut inclure des liens vers des ressources externes

## Relations

1. **Course** (Many-to-One)
   - Chaque Module appartient à un seul Course
   - La relation est obligatoire
   - Suppression en cascade si le Course est supprimé

2. **CourseProgress** (One-to-Many)
   - Un Module peut avoir plusieurs CourseProgress
   - Permet de suivre la progression des étudiants
   - Suppression en cascade des progrès si le Module est supprimé

## Hooks

### Avant Insertion
- Calcul automatique de l'ordre si non spécifié
- Ajustement des ordres existants si nécessaire
- Sanitization du markdown dans le contenu

### Avant Mise à Jour
- Réorganisation des ordres si l'ordre est modifié
- Mise à jour du timestamp du cours parent

### Après Suppression
- Réorganisation des ordres des modules restants

## Indexes

1. **Primary Key**
   - `id` (UUID)

2. **Foreign Key**
   - `courseId` (Référence vers la table `courses`)

3. **Index Composite Unique**
   - `(courseId, order)` pour garantir l'unicité de l'ordre dans un cours

## Exemple d'Utilisation

```typescript
// Création d'un nouveau module
const module = new ModuleEntity();
module.title = 'Introduction aux Types';
module.description = 'Découvrez les types de base en TypeScript';
module.course = course;
module.order = 1;
module.content = 'Contenu détaillé du module...';

const errors = await validate(module);
if (errors.length > 0) {
  // Gestion des erreurs de validation
}

await moduleRepository.save(module);

// Réorganisation des modules
const modules = await moduleRepository.find({
  where: { courseId: course.id },
  order: { order: 'ASC' }
});

// Déplacement d'un module
module.order = 2; // Déclenche la réorganisation automatique
await moduleRepository.save(module);
```

## Requêtes Courantes

```typescript
// Trouver tous les modules d'un cours dans l'ordre
const modules = await moduleRepository
  .createQueryBuilder('module')
  .where('module.courseId = :courseId', { courseId })
  .orderBy('module.order', 'ASC')
  .getMany();

// Trouver le prochain module non complété pour un étudiant
const nextModule = await moduleRepository
  .createQueryBuilder('module')
  .leftJoinAndSelect('module.progress', 'progress', 'progress.studentId = :studentId')
  .where('module.courseId = :courseId', { courseId })
  .andWhere('progress.completed IS NULL OR progress.completed = false')
  .orderBy('module.order', 'ASC')
  .getOne();

// Calculer la progression globale dans un cours
const progress = await moduleRepository
  .createQueryBuilder('module')
  .leftJoin('module.progress', 'progress', 'progress.studentId = :studentId')
  .where('module.courseId = :courseId', { courseId })
  .select([
    'COUNT(module.id) as total',
    'COUNT(progress.id) FILTER (WHERE progress.completed = true) as completed'
  ])
  .getRawOne();
```

## Notes Importantes

1. **Ordonnancement**
   - L'ordre est maintenu automatiquement
   - Les trous dans la séquence sont évités
   - La réorganisation est atomique

2. **Contenu**
   - Le markdown est sanitisé
   - Les liens sont validés
   - Les ressources externes sont vérifiées

3. **Progression**
   - La progression est calculée par module
   - Un module est considéré comme complété uniquement quand marqué explicitement
   - La progression est utilisée pour débloquer les modules suivants 