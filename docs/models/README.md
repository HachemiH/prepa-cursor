# Documentation des Modèles de Données

Ce dossier contient la documentation détaillée de tous les modèles de données de l'application.

## Structure

- [User](./user.md) - Modèle de base pour tous les utilisateurs
- [Student](./student.md) - Modèle pour les étudiants
- [Instructor](./instructor.md) - Modèle pour les instructeurs
- [Course](./course.md) - Modèle pour les cours
- [Module](./module.md) - Modèle pour les modules de cours
- [CourseProgress](./course-progress.md) - Modèle pour le suivi de la progression

## Conventions de Nommage

- Les noms de tables sont en minuscules et au pluriel (ex: `users`, `courses`)
- Les clés primaires sont nommées `id`
- Les clés étrangères suivent le format `entityId` (ex: `userId`, `courseId`)
- Les timestamps de création/modification sont nommés `createdAt`/`updatedAt`
- Les champs booléens commencent par `is` (ex: `isActive`, `isPublished`)

## Validation des Données

Tous les modèles utilisent `class-validator` pour la validation des données avec les règles suivantes :

- Les champs requis sont marqués avec `@IsNotEmpty()`
- Les chaînes de caractères ont une longueur minimale avec `@MinLength()`
- Les tableaux ne peuvent pas être vides avec `@ArrayNotEmpty()`
- Les nombres ont des limites avec `@Min()` et `@Max()`
- Les énumérations sont validées avec `@IsEnum()`

## Timestamps

Tous les modèles incluent automatiquement :
- `createdAt` : Date de création (géré par TypeORM avec `@CreateDateColumn()`)
- `updatedAt` : Date de dernière modification (géré par TypeORM avec `@UpdateDateColumn()`) 