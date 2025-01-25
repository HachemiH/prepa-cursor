# Roadmap PREPA CURSOR API - Version Simplifiée

![NestJS](https://img.shields.io/badge/NestJS-10.0.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## État d'Avancement Global
🟢 Terminé    | ⚪️ Non commencé    | 🟡 En cours    | 🔵 Prêt à démarrer
:-------------|:-------------------|:---------------|:-------------------

## Version 0.x.x (Développement MVP)

### Phase 0 - Installation et Configuration

#### 🟢 v0.0.1 : Setup Initial
**Description:** Configuration initiale du projet

1. Configuration du Projet
   - [x] Installation des dépendances via PNPM
   - [x] Configuration de TypeScript
   - [x] Configuration de ESLint
   - [x] Configuration de Prettier
   - [x] Configuration de Vitest pour les tests unitaires en local
   - [x] Configuration de Playwright pour les tests E2E en local

2. Configuration de l'Environnement
   - [x] Configuration des variables d'environnement
     - [x] Création du fichier .env
     - [x] Création du fichier .env.example
     - [x] Documentation des variables d'environnement
   - [x] Configuration de la base de données PostgreSQL
     - [x] Création de la base de données
     - [x] Configuration de TypeORM
   - [x] Configuration de Redis

3. Scripts de Base
   - [x] Scripts PNPM
     - [x] build
     - [x] dev
     - [x] test:unit (exécution locale avec Vitest)
     - [x] test:e2e (exécution locale avec Playwright)
     - [x] test:coverage (rapport de couverture local)
     - [x] lint
     - [x] format
   - [x] Scripts Base de données
     - [x] cleanup
     - [x] migrate
     - [x] seed

4. Documentation
   - [x] Guide d'installation
   - [x] Documentation de configuration
   - [x] Documentation des scripts disponibles
   - [x] Documentation des conventions de code
   - [x] Documentation des tests
     - [x] Guide des tests unitaires
     - [x] Guide des tests E2E
     - [x] Guide de la couverture de code

#### 🟢 v0.0.2 : Configuration Docker Development
**Description:** Mise en place de l'environnement Docker pour le développement

1. Configuration des Conteneurs
   - [x] Dockerfile pour l'API NestJS
     - [x] Configuration du hot reload
     - [x] Configuration des volumes
   - [x] Dockerfile pour PostgreSQL
     - [x] Configuration des volumes pour la persistance
     - [x] Configuration des variables d'environnement
   - [x] Dockerfile pour Redis
     - [x] Configuration des volumes pour la persistance
   - [x] Docker Compose pour l'environnement de développement
     - [x] Configuration des services (API, PostgreSQL, Redis)
     - [x] Configuration des réseaux
     - [x] Configuration des volumes
     - [x] Configuration des variables d'environnement

2. Scripts Docker
   - [x] docker-compose up development
   - [x] docker-compose down

3. Documentation Docker
   - [x] Guide d'installation avec Docker
   - [x] Documentation de la configuration Docker
   - [x] Documentation des commandes Docker utiles

### Phase 1 - Infrastructure de Base

#### ⚪️ v0.1.0 : Configuration Base de Données
**Description:** Mise en place de la base de données et des entités principales

1. Configuration TypeORM
   - [x] Configuration de la connexion PostgreSQL
   - [x] Configuration des migrations
   - [x] Tests de connexion
   - [x] Documentation technique

2. Entités de Base
   - [x] Entité User (Base commune)
     - id: UUID
     - email: string (unique)
     - password: string (hashé)
     - firstName: string
     - lastName: string
     - role: enum (ADMIN, INSTRUCTOR, STUDENT)
     - isActive: boolean
     - createdAt: Date
     - updatedAt: Date

   - [x] Entité Student (hérite de User)
     - enrolledCourses: relation many-to-many avec Course
     - progress: relation one-to-many avec CourseProgress
     - lastLoginAt: Date

   - [x] Entité Instructor (hérite de User)
     - bio: string
     - expertise: string[]
     - courses: relation one-to-many avec Course
     - rating: number

   - [x] Entité Course
     - id: UUID
     - title: string
     - description: string
     - instructor: relation many-to-one avec Instructor
     - students: relation many-to-many avec Student
     - modules: relation one-to-many avec Module
     - isPublished: boolean
     - createdAt: Date
     - updatedAt: Date

   - [x] Entité Module
     - id: UUID
     - title: string
     - description: string
     - course: relation many-to-one avec Course
     - order: number
     - content: string
     - createdAt: Date
     - updatedAt: Date

   - [x] Entité CourseProgress
     - id: UUID
     - student: relation many-to-one avec Student
     - module: relation many-to-one avec Module
     - completed: boolean
     - completedAt: Date
     - createdAt: Date
     - updatedAt: Date

3. Tests et Documentation
   - [x] Tests unitaires des entités
   - [x] Tests des relations entre entités
   - [x] Documentation des modèles de données
   - [x] Documentation des relations
   - [x] Diagramme des relations

4. Migrations
   - [x] Migration initiale des entités
   - [x] Migration des relations
   - [x] Tests des migrations
   - [x] Documentation des migrations

#### ⚪️ v0.2.0 : Système d'Authentification
**Description:** Mise en place de l'authentification sécurisée
- [x] Authentification JWT
- [x] Hachage des mots de passe
- [x] Protection CORS
- [x] Rate limiting de base
- [x] Tests E2E route register
- [x] Tests E2E route login
- [x] Tests E2E route logout
- [x] Tests unitaires protection CORS
- [x] Tests unitaires rate limiting
- [x] Tests unitaires validation email
- [x] Tests unitaires validation mot de passe
- [x] Tests unitaires validation prénom/nom
- [x] Tests E2E validation données utilisateur
- [x] Tests E2E gestion erreurs
- [x] Tests unitaires conversion email minuscules
- [x] Tests E2E email déjà utilisé
- [x] Tests E2E email invalide
- [x] Tests E2E mot de passe faible
- [x] Tests E2E prénom invalide
- [x] Tests E2E nom invalide
- [x] Tests E2E données manquantes

#### ⚪️ v0.3.0 : Gestion des Rôles
**Description:** Système de gestion des rôles et permissions

1. Configuration de base
   - [x] Modèle Role et Permission (enums)
   - [x] Configuration des permissions par rôle
   - [x] Tests unitaires modèle Role et Permission
   - [x] Ajout du rôle BANNED avec gestion des transitions

2. Système de vérification
   - [x] Guard de vérification des rôles
   - [x] Tests unitaires guard des rôles
   - [x] Tests unitaires gestion SUPER_ADMIN
   - [x] Tests unitaires accès routes publiques
   - [x] Tests unitaires accès routes protégées
   - [x] Tests unitaires gestion erreurs permissions

3. Validation des rôles
   - [x] Validation basique des rôles (entité)
   - [x] Validation avancée des rôles (service)
   - [x] Tests unitaires validation des rôles
   - [x] Tests unitaires validation des rôles requis
   - [x] Tests unitaires permissions utilisateur
   - [x] Tests des transitions vers/depuis BANNED

4. API de consultation et gestion
   - [x] Endpoint GET pour lister les rôles disponibles
   - [x] Endpoint PATCH pour mettre à jour le rôle d'un utilisateur
   - [x] Tests unitaires des endpoints
   - [x] Tests E2E de la lecture des rôles
   - [x] Tests E2E de la mise à jour des rôles
   - [x] Tests unitaires sécurité des rôles

#### ⚪️ v0.4.0 : Setup Docker Development
**Description:** Configuration Docker pour le développement
- [x] Dockerfile API NestJS
- [x] Dockerfile PostgreSQL
- [x] Docker Compose avec hot reload
- [x] Variables d'environnement
- [x] Tests unitaires configuration Docker

#### ⚪️ v0.5.0 : Pipeline CI/CD basique
**Description:** Intégration continue initiale
- [x] Configuration Github Actions de base
- [x] Tests automatisés essentiels
- [x] Analyse de code basique
- [x] Build automatisé des images Docker
- [x] Tests unitaires pipeline CI/CD

### Phase 2 - Gestion Utilisateurs

#### ⚪️ v0.6.0 : Profils Utilisateurs
**Description:** Gestion complète des profils utilisateurs

1. Gestion du profil de base
   - [x] Modèle Profile avec validation
   - [x] Endpoint GET /users/me (profil courant)
   - [x] Endpoint PATCH /users/me (prénom et nom)
   - [x] Endpoint PATCH /users/me/email
   - [x] Endpoint POST /auth/change-password
   - [x] Tests E2E modification profil
   - [x] Tests E2E modification email

2. Gestion des avatars
   - [x] Configuration du stockage (local/cloud)
   - [x] Service de gestion des fichiers
   - [x] Endpoint POST /users/me/avatar
   - [x] Endpoint DELETE /users/me/avatar
   - [x] Validation et sécurisation des uploads
   - [x] Optimisation et redimensionnement des images
   - [x] Tests E2E upload avatar
   - [x] Tests E2E suppression avatar

3. Tests unitaires
   - [x] Tests validation email
   - [x] Tests validation mot de passe
   - [x] Tests validation prénom/nom
   - [x] Tests conversion email minuscules
   - [x] Tests gestion erreurs base de données
   - [x] Tests changement de mot de passe
   - [x] Tests gestion des fichiers avatars
   - [x] Tests sécurité et permissions

### Phase 2.5 - Gestion de Contenu

#### ⚪️ v0.7.0 : Système de Pages
**Description:** Système de gestion de contenu modulaire avec focus SEO

##### v0.7.1 : Core Models
###### Content Model
- [x] Créer l'entité Content
  - [x] Propriétés de base : id, type, title, slug, status, created_at, updated_at
  - [x] Validateurs class-validator
  - [x] Décorateurs TypeORM
  - [x] Documentation technique
    - [x] JSDoc complet de l'entité et ses propriétés
    - [x] Documentation des validateurs et contraintes
  - [x] Documentation Swagger/OpenAPI
    - [x] Schémas de l'entité
    - [x] Exemples de réponses API

- [x] Tests unitaires Content
  - [x] content.entity.spec.ts
  - [x] content.entity.validation.spec.ts
  - [x] Documentation des tests
    - [x] Description des scénarios de test
    - [x] Description des cas limites

- [x] Migration Content
  - [x] CreateContentTable
  - [x] Tests migration
  - [x] Documentation technique
    - [x] Description des changements de schéma
    - [x] Procédure de rollback

###### ContentMeta Model
- [x] Créer l'entité ContentMeta
  - [x] Propriétés : id, key, value, content_id
  - [x] Relation avec Content
  - [x] Validateurs class-validator
  - [x] Décorateurs TypeORM
  - [x] Documentation technique
    - [x] JSDoc complet de l'entité
    - [x] Documentation des relations
  - [x] Documentation Swagger/OpenAPI
    - [x] Schémas avec relations
    - [x] Exemples de réponses API

###### ContentRelations Model
- [x] Créer l'entité ContentRelations
  - [x] Propriétés : id, parent_id, child_id, order
  - [x] Relations avec Content
  - [x] Validateurs class-validator
  - [x] Décorateurs TypeORM
  - [x] Documentation technique
    - [x] JSDoc complet de l'entité
    - [x] Documentation des relations
  - [x] Documentation Swagger/OpenAPI
    - [x] Schémas des relations
    - [x] Exemples de hiérarchies

##### v0.7.2 : SEO Foundation ✅
###### SEO Models
- [x] Créer l'entité SEOMetadata
  - [x] Champs obligatoires (meta_title, meta_description, canonical_url)
  - [x] Champs Open Graph et Twitter Cards
  - [x] Documentation technique
    - [x] JSDoc complet de l'entité
    - [x] Documentation des règles de validation
  - [x] Documentation Swagger/OpenAPI
    - [x] Schémas des métadonnées SEO
    - [x] Exemples de réponses

###### SEO Validation Service
- [x] Créer SEOValidationService
  - [x] Validation meta_title (max 60 chars)
  - [x] Validation meta_description (max 160 chars)
  - [x] Validation URLs (canonical, og_image)
  - [x] Documentation technique
    - [x] JSDoc des validateurs
    - [x] Documentation des règles métier
  - [x] Documentation Swagger/OpenAPI
    - [x] Schémas de validation
    - [x] Exemples d'erreurs

##### v0.7.3 : Content Service Layer ✅
###### Content Service ✅
- [x] Créer ContentService
  - [x] Méthode create
  - [x] Méthode findOne
  - [x] Méthode findAll avec pagination
  - [x] Méthode update
  - [x] Méthode delete
  - [x] Documentation technique
    - [x] JSDoc des méthodes
    - [x] Documentation des paramètres et retours
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des opérations CRUD
    - [x] Exemples de requêtes/réponses
  - [x] Tests unitaires
    - [x] Tests de création de contenu
    - [x] Tests de recherche de contenu
    - [x] Tests de pagination
    - [x] Tests de mise à jour
    - [x] Tests de suppression
    - [x] Tests de gestion des erreurs
    - [x] Tests des relations entre contenus
    - [x] Tests d'intégration avec SEO

###### Content Controller ✅
- [x] Créer ContentController
  - [x] POST /content
  - [x] GET /content/:id
  - [x] GET /content avec pagination
  - [x] PATCH /content/:id
  - [x] DELETE /content/:id
  - [x] Documentation technique
    - [x] JSDoc des endpoints
    - [x] Documentation des DTOs
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des routes
    - [x] Schémas des DTOs
    - [x] Exemples de requêtes/réponses
  - [x] Tests E2E
    - [x] Tests authentification
      - [x] 401 si non authentifié
      - [x] 403 si permissions insuffisantes
    - [x] Tests CRUD
      - [x] Création de contenu
      - [x] Lecture d'un contenu
      - [x] Liste des contenus avec pagination
      - [x] Mise à jour d'un contenu
      - [x] Suppression d'un contenu
    - [x] Tests validation
      - [x] Validation des données d'entrée
      - [x] Gestion des slugs uniques
      - [x] Validation des types et statuts
    - [x] Tests relations
      - [x] Création de relations parent-enfant
      - [x] Validation des relations existantes
      - [x] Suppression avec relations

##### v0.7.4 : SEO Service Layer ✅
###### SEO Service
- [x] Créer SEOService
  - [x] Génération automatique meta_title
  - [x] Génération automatique meta_description
  - [x] Gestion des images Open Graph
  - [x] Documentation technique
    - [x] JSDoc des méthodes
    - [x] Documentation des algorithmes
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des opérations SEO
    - [x] Exemples d'optimisations

###### SEO Controller
- [x] Créer SEOController
  - [x] GET /content/:id/seo
  - [x] PATCH /content/:id/seo
  - [x] GET /content/:id/seo-preview
  - [x] Documentation technique
    - [x] JSDoc des endpoints
    - [x] Documentation des DTOs
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des routes SEO
    - [x] Exemples de métadonnées

##### v0.7.5 : Relations Management ✅
###### Relations Service
- [x] Créer ContentRelationsService
  - [x] Ajout relation parent/enfant
  - [x] Validation relations circulaires
  - [x] Gestion ordre d'affichage
  - [x] Documentation technique
    - [x] JSDoc des méthodes
    - [x] Documentation des validations
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des opérations
    - [x] Exemples de structures

###### Relations Controller
- [x] Créer ContentRelationsController
  - [x] POST /content/:id/relations
  - [x] GET /content/:id/children
  - [x] GET /content/:id/parents
  - [x] PATCH /content/:id/order
  - [x] Documentation technique
    - [x] JSDoc des endpoints
    - [x] Documentation des DTOs
  - [x] Tests E2E
    - [x] Tests création de relations
    - [x] Tests validation relations circulaires
    - [x] Tests gestion de l'ordre
    - [x] Tests validation des ordres consécutifs
  - [x] Documentation Swagger/OpenAPI
    - [x] Description des routes
    - [x] Exemples de hiérarchies

##### v0.7.6 : SEO Technical ✅
###### Sitemap Generator ✅
- [x] Créer SitemapService
  - [x] Génération sitemap.xml dynamique
  - [x] Gestion priorités URLs
    - [x] Configuration priorité de base (0.9)
    - [x] Configuration fréquence de base (monthly)
    - [x] Priorités par type de contenu
    - [x] Ajustement selon l'âge du contenu
    - [x] Ajustement selon les métadonnées SEO
  - [x] Support des images
    - [x] Intégration Google Image Sitemap
    - [x] Extraction des images du contenu
    - [x] Gestion des métadonnées d'images
  - [x] Documentation technique
    - [x] JSDoc du service
    - [x] Documentation du format XML
  - [x] Documentation Swagger/OpenAPI
    - [x] Description de l'endpoint sitemap
    - [x] Exemples de sitemaps
  - [x] Tests E2E
    - [x] Test de génération du sitemap
    - [x] Test du cache avec ETag
    - [x] Test de la compression gzip
    - [x] Test des headers de réponse
    - [x] Test du status 304 Not Modified

###### Robots Handler ✅
- [x] Créer RobotsService
  - [x] Configuration robots.txt
  - [x] Gestion des règles par environnement
    - [x] Production : Autoriser avec sitemap
    - [x] Staging : Bloquer tout
    - [x] Development : Bloquer tout
  - [x] Optimisations
    - [x] Cache avec ETag
    - [x] Compression gzip
    - [x] Headers appropriés
  - [x] Documentation technique
    - [x] JSDoc du service
    - [x] Documentation des règles
    - [x] Documentation dans /docs/seo.md
  - [x] Documentation Swagger/OpenAPI
    - [x] Description de l'endpoint robots
    - [x] Exemples de configurations
  - [x] Tests
    - [x] Tests unitaires du service
    - [x] Tests e2e de l'endpoint
    - [x] Tests de cache et compression
    - [x] Tests des différents environnements

##### v0.7.7 : Content Cache Service ✅
###### Cache Service
- [x] Implémentation du service de cache Redis
  - [x] Configuration du client Redis
  - [x] Gestion des TTL dynamiques
  - [x] Documentation technique
    - [x] JSDoc des méthodes
    - [x] Documentation des stratégies de cache

###### Content Cache Service
- [x] Implémentation du service de cache de contenu
  - [x] Mise en cache à la création
  - [x] Invalidation à la mise à jour
  - [x] Invalidation à la suppression
  - [x] Cache par slug et par ID
  - [x] Tests E2E
    - [x] Tests de mise en cache
    - [x] Tests d'invalidation
  - [x] Documentation technique
    - [x] JSDoc des méthodes
    - [x] Documentation des stratégies de cache

#### 🟢 v0.8.0 : Bibliothèque de Ressources
**Description:** Système de gestion des ressources (images, fichiers)

1. Configuration de base
   - [x] Service de gestion des fichiers
   - [x] Configuration du stockage local
   - [x] Validation des types MIME
   - [x] Limitation de taille des fichiers
   - [x] Tests E2E upload de fichiers
   - [x] Tests E2E suppression de fichiers

2. Gestion des images
   - [x] Service de traitement d'images
   - [x] Génération de versions (thumbnail, preview)
   - [x] Optimisation des images
   - [x] Tests E2E upload d'images
   - [x] Tests E2E suppression d'images et versions
   - [x] Tests E2E validation des formats
   - [x] Tests E2E validation des tailles

3. API RESTful
   - [x] Endpoint POST /resources/upload/images
   - [x] Endpoint POST /resources/upload/files
   - [x] Endpoint DELETE /resources/images/:path
   - [x] Endpoint DELETE /resources/files/:path
   - [x] Tests E2E des endpoints
   - [x] Tests E2E gestion des erreurs

### Phase 3 - Trading

#### ⚪️ v0.9.0 : Calculateur de positions de Trading
**Description:** API pour la validation des calculs de positions de trading

##### v0.9.1 : Core Trading Types
**Description:** Types et interfaces pour les calculs de position
- [x] Création des interfaces de base
  - [x] Interface `Position` (capital, riskPercent, entryPrice, stopLoss, targetRR)
  - [x] Interface `PositionResult` (quantity, takeProfit, engagedCapital, riskAmount, potentialGain)
  - [x] Interface `ValidationResult` (isValid, errors, warnings)
  - [x] Catalogue d'erreurs standardisé (codes et messages)
- [x] Tests unitaires
  - [x] Tests de typage
  - [x] Tests des cas limites
  - [x] Tests des messages d'erreur

##### v0.9.2 : Trading Calculator Validation Layer
**Description:** Service de validation des calculs de position
- [x] Création du `TradingCalculatorValidationService`
  - [x] Validation des règles métier
    - [x] Validation du capital (min: 100, max: 1M)
    - [x] Validation du risque (0.1-100%, alertes > 3% et > 10%)
    - [x] Validation du prix d'entrée (> 0.00001)
    - [x] Validation du stop loss (< prix d'entrée)
    - [x] Validation du RR (min 1:1, max 10:1, alertes < 1.5 et > 5)
  - [x] Gestion des erreurs métier
  - [x] Logs des validations
- [x] Tests unitaires
  - [x] Tests des règles métier
  - [x] Tests des cas d'erreur
  - [x] Tests de performance

##### v0.9.3 : Public Validation API
**Description:** API publique de validation
- [x] Création du `TradingCalculatorController`
  - [x] Endpoint POST /calculator/validate
  - [x] DTOs de validation
  - [x] Documentation Swagger
- [x] Sécurité et Monitoring
  - [x] Rate limiting (100 req/min)
  - [x] Logs des validations
  - [x] Métriques d'utilisation
  - [x] Alertes de sécurité
- [x] Tests E2E
  - [x] Tests des validations
  - [x] Tests de rate limiting
  - [x] Tests de charge

##### v0.9.4 : Trading Journal Integration
**Description:** Intégration avec le futur journal de trading
- [x] Création de l'entité `Trade`
  - [x] Conversion Position validée vers Trade
  - [x] Statut du trade (PENDING, OPEN, CLOSED, CANCELLED)
  - [x] Relations avec User
  - [x] Métadonnées

#### ⚪️ v0.10.0 : Journal de Trading
**Description:** Module de journal de trading pour sauvegarder l'historique des trades
- [x] Entité `Trade`
  - [x] Champs de base (repris du calculateur)
    - [x] Capital initial
    - [x] Pourcentage de risque
    - [x] Prix d'entrée
    - [x] Stop loss
    - [x] Take profit
    - [x] Quantité
    - [x] Capital engagé
  - [x] Cycle de vie du trade
    - [x] Statut (PENDING, OPEN, CLOSED, CANCELLED)
    - [x] Dates de changement de statut
    - [x] Mode de clôture (MANUAL, AUTOMATIC)
    - [x] Règles de transition
      - [x] PENDING → OPEN (entrée dans le trade)
      - [x] PENDING → CANCELLED (annulation avant entrée)
      - [x] OPEN → CLOSED (sortie du trade)
      - [x] OPEN → CANCELLED (annulation exceptionnelle)
    - [x] Validation des transitions
      - [x] Vérification du statut actuel
      - [x] Vérification des données requises
      - [x] Blocage des transitions invalides
      - [x] Validation du mode de clôture
  - [x] Informations d'entrée
    - [x] Date et heure d'entrée (timestamp UTC)
    - [x] Symbole/Nom de l'actif
    - [x] Prix d'entrée prévu vs réel
  - [x] Informations de sortie
    - [x] Prix de sortie réel
    - [x] Date et heure de sortie (timestamp UTC)
    - [x] Type de sortie (TP atteint, SL atteint, Sortie manuelle)
    - [x] Raison de sortie si manuelle
  - [x] Résultat du trade (uniquement pour les trades CLOSED)
    - [x] Gain/Perte en montant
    - [x] Gain/Perte en pourcentage
    - [x] R:R réel obtenu
    - [x] Performance vs plan initial (% du TP atteint)
    - [x] Durée du trade (calculée)
  - [x] Métadonnées
    - [x] Notes personnelles
    - [x] Tags/Catégories
  - [x] Relations
    - [x] Utilisateur (ManyToOne)
- [x] Service de gestion des trades
  - [x] Création du trade (PENDING)
  - [x] Ouverture du trade (OPEN)
    - [x] Validation du prix d'entrée réel
    - [x] Enregistrement date réelle
  - [x] Clôture du trade (CLOSED)
    - [x] Calcul automatique des résultats
    - [x] Validation des données de sortie
  - [x] Annulation du trade (CANCELLED)
  - [x] Mise à jour des métadonnées
  - [x] Suppression logique
- [x] API REST
  - [x] Endpoints CRUD
  - [x] Endpoints de changement de statut
    - [x] POST /trades/:id/open
    - [x] POST /trades/:id/close
    - [x] POST /trades/:id/cancel
  - [x] Filtres par statut
  - [x] Pagination
  - [x] Validation des entrées
- [x] Tests
  - [x] Tests unitaires CRUD
  - [x] Tests des changements de statut
  - [x] Tests des calculs de résultats
  - [x] Tests des différents scénarios de sortie
  - [x] Tests d'intégration
  - [x] Tests E2E

#### ⚪️ v0.10.4 : Sources de Prix
**Description:** Service de connexion aux sources de données de prix
- [x] Configuration des sources
  - [x] Interface `PriceSource`
  - [x] Gestion des API keys
  - [x] Sélection des sources par symbole
- [x] Connecteurs de prix
  - [x] Implémentation WebSocket
  - [x] Implémentation REST fallback
  - [x] Gestion des reconnexions
  - [x] Validation des données
- [x] Tests
  - [x] Tests des connexions
  - [x] Tests de fallback
  - [x] Tests de validation des données
  - [x] Tests de résilience

#### ⚪️ v0.10.5 : Surveillance Automatique des Trades
**Description:** Système optimisé de surveillance automatique des trades ouverts
- [x] Service de gestion des symboles
  - [x] Cache Redis des symboles surveillés
  - [x] Regroupement des trades par symbole
  - [x] Utilisation des connecteurs de prix
  - [x] Gestion des déconnexions
- [x] Service de surveillance des prix
  - [x] Réception des prix en temps réel
  - [x] Mise à jour du cache Redis
  - [x] Validation des données reçues
  - [x] Gestion des erreurs
- [x] Service de vérification
  - [x] Vérification en mémoire des TP/SL
  - [x] Traitement par lots des clôtures
  - [x] File d'attente pour les clôtures
  - [x] Gestion des conflits
- [x] Monitoring et Performance
  - [x] Métriques de performance
  - [x] Alertes de latence
  - [x] Logs des clôtures automatiques
  - [x] Statistiques d'utilisation
- [x] Tests
  - [x] Tests de performance avec volume
  - [x] Tests de résilience
  - [x] Tests des scénarios de clôture
  - [x] Tests de charge (5000+ trades)

#### ⚪️ v0.11.0 : Visibilité du Journal
**Description:** Gestion de la visibilité du journal de trading
- [x] Modèles de visibilité et permissions
- [x] Options de visibilité dans le profil
- [x] Statut de visibilité par trade
- [x] Filtres de visibilité dans l'API
- [x] Affichage des trades publics
- [x] Tests unitaires CRUD visibilité
- [x] Tests unitaires validation visibilité
- [x] Tests E2E création visibilité
- [x] Tests E2E mise à jour visibilité
- [x] Tests E2E suppression visibilité

#### ⚪️ v0.12.0 : Statistiques Basiques
**Description:** Statistiques essentielles du journal de trading
- [x] Modèle de statistiques (StatsEntity)
- [x] Modèles de cache et d'historique
- [x] Endpoints REST statistiques
- [x] Calculs en temps réel
- [x] Mise en cache des statistiques
- [x] Tâches planifiées de recalcul
- [x] Tests unitaires CRUD statistiques
- [x] Tests unitaires calculs en temps réel
- [x] Tests E2E création statistique
- [x] Tests E2E mise à jour statistique
- [x] Tests E2E suppression statistique

### Phase 4 - Formation

#### ⚪️ v0.13.0 : Modèles Formation
**Description:** Modèles de données pour les formations
- [x] Entité Formation avec ses champs
- [x] Entité Section avec ses champs
- [x] Entité Leçon avec ses champs
- [x] Relations entre entités
- [x] Migrations
- [x] Tests unitaires CRUD formations
- [x] Tests unitaires validation relations
- [x] Tests unitaires génération migrations
- [x] Tests unitaires relations entre entités
- [x] Tests E2E création formation
- [x] Tests E2E création section
- [x] Tests E2E création leçon

#### ⚪️ v0.14.0 : API CRUD Formation
**Description:** API pour la gestion des formations
- [x] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [x] DTOs et validation
- [x] Filtres et pagination
- [x] Tests unitaires CRUD formations
- [x] Tests unitaires validation DTOs
- [x] Tests unitaires implémentation filtres
- [x] Tests E2E création formation
- [x] Tests E2E mise à jour formation
- [x] Tests E2E suppression formation

#### ⚪️ v0.15.0 : API CRUD Sections
**Description:** API pour la gestion des sections
- [x] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [x] Gestion de l'ordre des sections
- [x] Relations avec les formations
- [x] Tests unitaires CRUD sections
- [x] Tests unitaires gestion ordre sections
- [x] Tests E2E création section
- [x] Tests E2E mise à jour section
- [x] Tests E2E suppression section

#### ⚪️ v0.16.0 : API CRUD Leçons
**Description:** API pour la gestion des leçons
- [x] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [x] Support de contenu Markdown
- [x] Gestion des médias
- [x] Tests unitaires CRUD leçons
- [x] Tests unitaires validation Markdown
- [x] Tests E2E création leçon
- [x] Tests E2E mise à jour leçon
- [x] Tests E2E suppression leçon

#### ⚪️ v0.17.0 : Progression Utilisateur
**Description:** Suivi de la progression des utilisateurs
- [x] Modèle de progression
- [x] Suivi de statut par formation/section/leçon
- [x] Système de completion
- [x] Historique d'apprentissage
- [x] Tests unitaires calcul progression
- [x] Tests unitaires suivi statut
- [x] Tests E2E création progression
- [x] Tests E2E mise à jour progression
- [x] Tests E2E suppression progression

### Phase 5 - Infrastructure Avancée

#### ⚪️ v0.18.0 : Configuration Production
**Description:** Configuration production
- [x] Optimisation Dockerfiles
- [x] Configuration Nginx
- [x] Sécurisation variables d'environnement
- [x] Scripts de déploiement
- [x] Tests unitaires configuration Nginx
- [x] Tests unitaires sécurité variables d'environnement
- [x] Tests unitaires scripts de déploiement

#### ⚪️ v0.19.0 : Sécurité Infrastructure avancée
**Description:** Sécurité avancée de l'API
- [x] Configuration SSL/TLS avancée
- [x] Pare-feu applicatif avancé
- [x] Monitoring des accès avancé
- [x] Alertes de sécurité
- [x] Tests unitaires SSL/TLS avancés
- [x] Tests unitaires pare-feu applicatif avancé
- [x] Tests unitaires monitoring accès
- [x] Tests unitaires alertes

## Version 1.0.0 (Release MVP)
**Description:** Release stable du MVP avec tests complets et documentation
- [x] Tests E2E complets
- [x] Documentation API (Swagger/OpenAPI)
- [x] Documentation technique
- [x] Documentation utilisateur
- [x] Documentation déploiement
- [x] Revue de sécurité
- [x] Optimisations de performance
- [x] Correction des bugs identifiés
- [x] Tests de non-régression
- [x] Tests de documentation
- [x] Tests unitaires revue sécurité
- [x] Tests unitaires correction bugs

#### ⚪️ v1.16.0 : Préférences Utilisateur
**Description:** Configuration des préférences utilisateur après implémentation des fonctionnalités principales

1. Préférences de notification
   - [x] Configuration des notifications par type d'événement
   - [x] Tests des préférences de notification

2. Préférences d'affichage
   - [x] Configuration de la visibilité (journal, profil)
   - [x] Configuration des badges affichés
   - [x] Tests des préférences d'affichage

3. Visibilité du profil
   - [x] Configuration de la visibilité (public/privé)
   - [x] Endpoint GET /users/:id (profil public)
   - [x] Endpoint PATCH /users/me/visibility
   - [x] Tests E2E visibilité profil
   - [x] Tests validation préférences de visibilité

4. Préférences de langue et localisation
   - [x] Choix de la langue (préparation internationalisation future)
   - [x] Configuration du fuseau horaire
   - [x] Tests des préférences de localisation

### Phase 6 - Blog et Actualités

#### ⚪️ v1.1.0 : Système de Blog
**Description:** Gestion complète des articles et actualités
- [x] Modèle Article et migrations
- [x] Système de publication
- [x] Gestion des catégories
- [x] Gestion des tags
- [x] Support médias enrichis
- [x] Système de commentaires
- [x] Modération de contenu
- [x] Tests unitaires CRUD articles
- [x] Tests unitaires publication
- [x] Tests E2E blog complet

[Les versions suivantes restent inchangées...]