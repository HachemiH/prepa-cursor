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

#### 🟡 v0.1.0 : Configuration Base de Données
**Description:** Mise en place de la base de données et des entités principales

1. Configuration TypeORM
   - [x] Configuration de la connexion PostgreSQL
   - [x] Configuration des migrations
   - [x] Tests de connexion
   - [x] Tests des migrations
   - [x] Documentation technique
   - [x] Documentation des commandes

2. Entités de Base
   - [ ] Entité User (Base commune)
     - id: UUID
     - email: string (unique)
     - password: string (hashé)
     - firstName: string
     - lastName: string
     - role: enum (ADMIN, INSTRUCTOR, STUDENT)
     - isActive: boolean
     - createdAt: Date
     - updatedAt: Date

   - [ ] Entité Student (hérite de User)
     - enrolledCourses: relation many-to-many avec Course
     - progress: relation one-to-many avec CourseProgress
     - lastLoginAt: Date

   - [ ] Entité Instructor (hérite de User)
     - bio: string
     - expertise: string[]
     - courses: relation one-to-many avec Course
     - rating: number

   - [ ] Entité Course
     - id: UUID
     - title: string
     - description: string
     - instructor: relation many-to-one avec Instructor
     - students: relation many-to-many avec Student
     - modules: relation one-to-many avec Module
     - isPublished: boolean
     - createdAt: Date
     - updatedAt: Date

   - [ ] Entité Module
     - id: UUID
     - title: string
     - description: string
     - course: relation many-to-one avec Course
     - order: number
     - content: string
     - createdAt: Date
     - updatedAt: Date

   - [ ] Entité CourseProgress
     - id: UUID
     - student: relation many-to-one avec Student
     - module: relation many-to-one avec Module
     - completed: boolean
     - completedAt: Date
     - createdAt: Date
     - updatedAt: Date

3. Tests et Documentation
   - [ ] Tests unitaires des entités
   - [ ] Tests des relations entre entités
   - [ ] Documentation des modèles de données
   - [ ] Documentation des relations
   - [ ] Diagramme des relations

4. Migrations
   - [ ] Migration initiale des entités
   - [ ] Migration des relations
   - [ ] Tests des migrations
   - [ ] Documentation des migrations

#### ⚪️ v0.2.0 : Système d'Authentification
**Description:** Mise en place de l'authentification sécurisée
- [ ] Authentification JWT
- [ ] Hachage des mots de passe
- [ ] Protection CORS
- [ ] Rate limiting de base
- [ ] Tests E2E route register
- [ ] Tests E2E route login
- [ ] Tests E2E route logout
- [ ] Tests unitaires protection CORS
- [ ] Tests unitaires rate limiting
- [ ] Tests unitaires validation email
- [ ] Tests unitaires validation mot de passe
- [ ] Tests unitaires validation prénom/nom
- [ ] Tests E2E validation données utilisateur
- [ ] Tests E2E gestion erreurs
- [ ] Tests unitaires conversion email minuscules
- [ ] Tests E2E email déjà utilisé
- [ ] Tests E2E email invalide
- [ ] Tests E2E mot de passe faible
- [ ] Tests E2E prénom invalide
- [ ] Tests E2E nom invalide
- [ ] Tests E2E données manquantes

#### ⚪️ v0.3.0 : Gestion des Rôles
**Description:** Système de gestion des rôles et permissions

1. Configuration de base
   - [ ] Modèle Role et Permission (enums)
   - [ ] Configuration des permissions par rôle
   - [ ] Tests unitaires modèle Role et Permission
   - [ ] Ajout du rôle BANNED avec gestion des transitions

2. Système de vérification
   - [ ] Guard de vérification des rôles
   - [ ] Tests unitaires guard des rôles
   - [ ] Tests unitaires gestion SUPER_ADMIN
   - [ ] Tests unitaires accès routes publiques
   - [ ] Tests unitaires accès routes protégées
   - [ ] Tests unitaires gestion erreurs permissions

3. Validation des rôles
   - [ ] Validation basique des rôles (entité)
   - [ ] Validation avancée des rôles (service)
   - [ ] Tests unitaires validation des rôles
   - [ ] Tests unitaires validation des rôles requis
   - [ ] Tests unitaires permissions utilisateur
   - [ ] Tests des transitions vers/depuis BANNED

4. API de consultation et gestion
   - [ ] Endpoint GET pour lister les rôles disponibles
   - [ ] Endpoint PATCH pour mettre à jour le rôle d'un utilisateur
   - [ ] Tests unitaires des endpoints
   - [ ] Tests E2E de la lecture des rôles
   - [ ] Tests E2E de la mise à jour des rôles
   - [ ] Tests unitaires sécurité des rôles

#### ⚪️ v0.4.0 : Setup Docker Development
**Description:** Configuration Docker pour le développement
- [ ] Dockerfile API NestJS
- [ ] Dockerfile PostgreSQL
- [ ] Docker Compose avec hot reload
- [ ] Variables d'environnement
- [ ] Tests unitaires configuration Docker

#### ⚪️ v0.5.0 : Pipeline CI/CD basique
**Description:** Intégration continue initiale
- [ ] Configuration Github Actions de base
- [ ] Tests automatisés essentiels
- [ ] Analyse de code basique
- [ ] Build automatisé des images Docker
- [ ] Tests unitaires pipeline CI/CD

### Phase 2 - Gestion Utilisateurs

#### ⚪️ v0.6.0 : Profils Utilisateurs
**Description:** Gestion complète des profils utilisateurs

1. Gestion du profil de base
   - [ ] Modèle Profile avec validation
   - [ ] Endpoint GET /users/me (profil courant)
   - [ ] Endpoint PATCH /users/me (prénom et nom)
   - [ ] Endpoint PATCH /users/me/email
   - [ ] Endpoint POST /auth/change-password
   - [ ] Tests E2E modification profil
   - [ ] Tests E2E modification email

2. Gestion des avatars
   - [ ] Configuration du stockage (local/cloud)
   - [ ] Service de gestion des fichiers
   - [ ] Endpoint POST /users/me/avatar
   - [ ] Endpoint DELETE /users/me/avatar
   - [ ] Validation et sécurisation des uploads
   - [ ] Optimisation et redimensionnement des images
   - [ ] Tests E2E upload avatar
   - [ ] Tests E2E suppression avatar

3. Tests unitaires
   - [ ] Tests validation email
   - [ ] Tests validation mot de passe
   - [ ] Tests validation prénom/nom
   - [ ] Tests conversion email minuscules
   - [ ] Tests gestion erreurs base de données
   - [ ] Tests changement de mot de passe
   - [ ] Tests gestion des fichiers avatars
   - [ ] Tests sécurité et permissions

### Phase 2.5 - Gestion de Contenu

#### ⚪️ v0.7.0 : Système de Pages
**Description:** Système de gestion de contenu modulaire avec focus SEO

##### v0.7.1 : Core Models
###### Content Model
- [ ] Créer l'entité Content
  - [ ] Propriétés de base : id, type, title, slug, status, created_at, updated_at
  - [ ] Validateurs class-validator
  - [ ] Décorateurs TypeORM
  - [ ] Documentation technique
    - [ ] JSDoc complet de l'entité et ses propriétés
    - [ ] Documentation des validateurs et contraintes
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Schémas de l'entité
    - [ ] Exemples de réponses API

- [ ] Tests unitaires Content
  - [ ] content.entity.spec.ts
  - [ ] content.entity.validation.spec.ts
  - [ ] Documentation des tests
    - [ ] Description des scénarios de test
    - [ ] Description des cas limites

- [ ] Migration Content
  - [ ] CreateContentTable
  - [ ] Tests migration
  - [ ] Documentation technique
    - [ ] Description des changements de schéma
    - [ ] Procédure de rollback

###### ContentMeta Model
- [ ] Créer l'entité ContentMeta
  - [ ] Propriétés : id, key, value, content_id
  - [ ] Relation avec Content
  - [ ] Validateurs class-validator
  - [ ] Décorateurs TypeORM
  - [ ] Documentation technique
    - [ ] JSDoc complet de l'entité
    - [ ] Documentation des relations
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Schémas avec relations
    - [ ] Exemples de réponses API

###### ContentRelations Model
- [ ] Créer l'entité ContentRelations
  - [ ] Propriétés : id, parent_id, child_id, order
  - [ ] Relations avec Content
  - [ ] Validateurs class-validator
  - [ ] Décorateurs TypeORM
  - [ ] Documentation technique
    - [ ] JSDoc complet de l'entité
    - [ ] Documentation des relations
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Schémas des relations
    - [ ] Exemples de hiérarchies

##### v0.7.2 : SEO Foundation ✅
###### SEO Models
- [ ] Créer l'entité SEOMetadata
  - [ ] Champs obligatoires (meta_title, meta_description, canonical_url)
  - [ ] Champs Open Graph et Twitter Cards
  - [ ] Documentation technique
    - [ ] JSDoc complet de l'entité
    - [ ] Documentation des règles de validation
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Schémas des métadonnées SEO
    - [ ] Exemples de réponses

###### SEO Validation Service
- [ ] Créer SEOValidationService
  - [ ] Validation meta_title (max 60 chars)
  - [ ] Validation meta_description (max 160 chars)
  - [ ] Validation URLs (canonical, og_image)
  - [ ] Documentation technique
    - [ ] JSDoc des validateurs
    - [ ] Documentation des règles métier
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Schémas de validation
    - [ ] Exemples d'erreurs

##### v0.7.3 : Content Service Layer ✅
###### Content Service ✅
- [ ] Créer ContentService
  - [ ] Méthode create
  - [ ] Méthode findOne
  - [ ] Méthode findAll avec pagination
  - [ ] Méthode update
  - [ ] Méthode delete
  - [ ] Documentation technique
    - [ ] JSDoc des méthodes
    - [ ] Documentation des paramètres et retours
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des opérations CRUD
    - [ ] Exemples de requêtes/réponses
  - [ ] Tests unitaires
    - [ ] Tests de création de contenu
    - [ ] Tests de recherche de contenu
    - [ ] Tests de pagination
    - [ ] Tests de mise à jour
    - [ ] Tests de suppression
    - [ ] Tests de gestion des erreurs
    - [ ] Tests des relations entre contenus
    - [ ] Tests d'intégration avec SEO

###### Content Controller ✅
- [ ] Créer ContentController
  - [ ] POST /content
  - [ ] GET /content/:id
  - [ ] GET /content avec pagination
  - [ ] PATCH /content/:id
  - [ ] DELETE /content/:id
  - [ ] Documentation technique
    - [ ] JSDoc des endpoints
    - [ ] Documentation des DTOs
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des routes
    - [ ] Schémas des DTOs
    - [ ] Exemples de requêtes/réponses
  - [ ] Tests E2E
    - [ ] Tests authentification
      - [ ] 401 si non authentifié
      - [ ] 403 si permissions insuffisantes
    - [ ] Tests CRUD
      - [ ] Création de contenu
      - [ ] Lecture d'un contenu
      - [ ] Liste des contenus avec pagination
      - [ ] Mise à jour d'un contenu
      - [ ] Suppression d'un contenu
    - [ ] Tests validation
      - [ ] Validation des données d'entrée
      - [ ] Gestion des slugs uniques
      - [ ] Validation des types et statuts
    - [ ] Tests relations
      - [ ] Création de relations parent-enfant
      - [ ] Validation des relations existantes
      - [ ] Suppression avec relations

##### v0.7.4 : SEO Service Layer ✅
###### SEO Service
- [ ] Créer SEOService
  - [ ] Génération automatique meta_title
  - [ ] Génération automatique meta_description
  - [ ] Gestion des images Open Graph
  - [ ] Documentation technique
    - [ ] JSDoc des méthodes
    - [ ] Documentation des algorithmes
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des opérations SEO
    - [ ] Exemples d'optimisations

###### SEO Controller
- [ ] Créer SEOController
  - [ ] GET /content/:id/seo
  - [ ] PATCH /content/:id/seo
  - [ ] GET /content/:id/seo-preview
  - [ ] Documentation technique
    - [ ] JSDoc des endpoints
    - [ ] Documentation des DTOs
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des routes SEO
    - [ ] Exemples de métadonnées

##### v0.7.5 : Relations Management ✅
###### Relations Service
- [ ] Créer ContentRelationsService
  - [ ] Ajout relation parent/enfant
  - [ ] Validation relations circulaires
  - [ ] Gestion ordre d'affichage
  - [ ] Documentation technique
    - [ ] JSDoc des méthodes
    - [ ] Documentation des validations
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des opérations
    - [ ] Exemples de structures

###### Relations Controller
- [ ] Créer ContentRelationsController
  - [ ] POST /content/:id/relations
  - [ ] GET /content/:id/children
  - [ ] GET /content/:id/parents
  - [ ] PATCH /content/:id/order
  - [ ] Documentation technique
    - [ ] JSDoc des endpoints
    - [ ] Documentation des DTOs
  - [ ] Tests E2E
    - [ ] Tests création de relations
    - [ ] Tests validation relations circulaires
    - [ ] Tests gestion de l'ordre
    - [ ] Tests validation des ordres consécutifs
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description des routes
    - [ ] Exemples de hiérarchies

##### v0.7.6 : SEO Technical ✅
###### Sitemap Generator ✅
- [ ] Créer SitemapService
  - [ ] Génération sitemap.xml dynamique
  - [ ] Gestion priorités URLs
    - [ ] Configuration priorité de base (0.9)
    - [ ] Configuration fréquence de base (monthly)
    - [ ] Priorités par type de contenu
    - [ ] Ajustement selon l'âge du contenu
    - [ ] Ajustement selon les métadonnées SEO
  - [ ] Support des images
    - [ ] Intégration Google Image Sitemap
    - [ ] Extraction des images du contenu
    - [ ] Gestion des métadonnées d'images
  - [ ] Documentation technique
    - [ ] JSDoc du service
    - [ ] Documentation du format XML
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description de l'endpoint sitemap
    - [ ] Exemples de sitemaps
  - [ ] Tests E2E
    - [ ] Test de génération du sitemap
    - [ ] Test du cache avec ETag
    - [ ] Test de la compression gzip
    - [ ] Test des headers de réponse
    - [ ] Test du status 304 Not Modified

###### Robots Handler ✅
- [ ] Créer RobotsService
  - [ ] Configuration robots.txt
  - [ ] Gestion des règles par environnement
    - [ ] Production : Autoriser avec sitemap
    - [ ] Staging : Bloquer tout
    - [ ] Development : Bloquer tout
  - [ ] Optimisations
    - [ ] Cache avec ETag
    - [ ] Compression gzip
    - [ ] Headers appropriés
  - [ ] Documentation technique
    - [ ] JSDoc du service
    - [ ] Documentation des règles
    - [ ] Documentation dans /docs/seo.md
  - [ ] Documentation Swagger/OpenAPI
    - [ ] Description de l'endpoint robots
    - [ ] Exemples de configurations
  - [ ] Tests
    - [ ] Tests unitaires du service
    - [ ] Tests e2e de l'endpoint
    - [ ] Tests de cache et compression
    - [ ] Tests des différents environnements

##### v0.7.7 : Content Cache Service ✅
###### Cache Service
- [ ] Implémentation du service de cache Redis
  - [ ] Configuration du client Redis
  - [ ] Gestion des TTL dynamiques
  - [ ] Documentation technique
    - [ ] JSDoc des méthodes
    - [ ] Documentation des stratégies de cache

###### Content Cache Service
- [ ] Implémentation du service de cache de contenu
  - [ ] Mise en cache à la création
  - [ ] Invalidation à la mise à jour
  - [ ] Invalidation à la suppression
  - [ ] Cache par slug et par ID
  - [ ] Tests E2E
    - [ ] Tests de mise en cache
    - [ ] Tests d'invalidation
  - [ ] Documentation technique
    - [ ] JSDoc des méthodes
    - [ ] Documentation des stratégies de cache

#### ⚪️ v0.8.0 : Bibliothèque de Ressources
**Description:** Système de gestion des ressources (images, fichiers)

1. Configuration de base
   - [ ] Service de gestion des fichiers
   - [ ] Configuration du stockage local
   - [ ] Validation des types MIME
   - [ ] Limitation de taille des fichiers
   - [ ] Tests E2E upload de fichiers
   - [ ] Tests E2E suppression de fichiers

2. Gestion des images
   - [ ] Service de traitement d'images
   - [ ] Génération de versions (thumbnail, preview)
   - [ ] Optimisation des images
   - [ ] Tests E2E upload d'images
   - [ ] Tests E2E suppression d'images et versions
   - [ ] Tests E2E validation des formats
   - [ ] Tests E2E validation des tailles

3. API RESTful
   - [ ] Endpoint POST /resources/upload/images
   - [ ] Endpoint POST /resources/upload/files
   - [ ] Endpoint DELETE /resources/images/:path
   - [ ] Endpoint DELETE /resources/files/:path
   - [ ] Tests E2E des endpoints
   - [ ] Tests E2E gestion des erreurs

### Phase 3 - Trading

#### ⚪️ v0.9.0 : Calculateur de positions de Trading
**Description:** API pour la validation des calculs de positions de trading

##### v0.9.1 : Core Trading Types
**Description:** Types et interfaces pour les calculs de position
- [ ] Création des interfaces de base
  - [ ] Interface `Position` (capital, riskPercent, entryPrice, stopLoss, targetRR)
  - [ ] Interface `PositionResult` (quantity, takeProfit, engagedCapital, riskAmount, potentialGain)
  - [ ] Interface `ValidationResult` (isValid, errors, warnings)
  - [ ] Catalogue d'erreurs standardisé (codes et messages)
- [ ] Tests unitaires
  - [ ] Tests de typage
  - [ ] Tests des cas limites
  - [ ] Tests des messages d'erreur

##### v0.9.2 : Trading Calculator Validation Layer
**Description:** Service de validation des calculs de position
- [ ] Création du `TradingCalculatorValidationService`
  - [ ] Validation des règles métier
    - [ ] Validation du capital (min: 100, max: 1M)
    - [ ] Validation du risque (0.1-100%, alertes > 3% et > 10%)
    - [ ] Validation du prix d'entrée (> 0.00001)
    - [ ] Validation du stop loss (< prix d'entrée)
    - [ ] Validation du RR (min 1:1, max 10:1, alertes < 1.5 et > 5)
  - [ ] Gestion des erreurs métier
  - [ ] Logs des validations
- [ ] Tests unitaires
  - [ ] Tests des règles métier
  - [ ] Tests des cas d'erreur
  - [ ] Tests de performance

##### v0.9.3 : Public Validation API
**Description:** API publique de validation
- [ ] Création du `TradingCalculatorController`
  - [ ] Endpoint POST /calculator/validate
  - [ ] DTOs de validation
  - [ ] Documentation Swagger
- [ ] Sécurité et Monitoring
  - [ ] Rate limiting (100 req/min)
  - [ ] Logs des validations
  - [ ] Métriques d'utilisation
  - [ ] Alertes de sécurité
- [ ] Tests E2E
  - [ ] Tests des validations
  - [ ] Tests de rate limiting
  - [ ] Tests de charge

##### v0.9.4 : Trading Journal Integration
**Description:** Intégration avec le futur journal de trading
- [ ] Création de l'entité `Trade`
  - [ ] Conversion Position validée vers Trade
  - [ ] Statut du trade (PENDING, OPEN, CLOSED, CANCELLED)
  - [ ] Relations avec User
  - [ ] Métadonnées

#### ⚪️ v0.10.0 : Journal de Trading
**Description:** Module de journal de trading pour sauvegarder l'historique des trades
- [ ] Entité `Trade`
  - [ ] Champs de base (repris du calculateur)
    - [ ] Capital initial
    - [ ] Pourcentage de risque
    - [ ] Prix d'entrée
    - [ ] Stop loss
    - [ ] Take profit
    - [ ] Quantité
    - [ ] Capital engagé
  - [ ] Cycle de vie du trade
    - [ ] Statut (PENDING, OPEN, CLOSED, CANCELLED)
    - [ ] Dates de changement de statut
    - [ ] Mode de clôture (MANUAL, AUTOMATIC)
    - [ ] Règles de transition
      - [ ] PENDING → OPEN (entrée dans le trade)
      - [ ] PENDING → CANCELLED (annulation avant entrée)
      - [ ] OPEN → CLOSED (sortie du trade)
      - [ ] OPEN → CANCELLED (annulation exceptionnelle)
    - [ ] Validation des transitions
      - [ ] Vérification du statut actuel
      - [ ] Vérification des données requises
      - [ ] Blocage des transitions invalides
      - [ ] Validation du mode de clôture
  - [ ] Informations d'entrée
    - [ ] Date et heure d'entrée (timestamp UTC)
    - [ ] Symbole/Nom de l'actif
    - [ ] Prix d'entrée prévu vs réel
  - [ ] Informations de sortie
    - [ ] Prix de sortie réel
    - [ ] Date et heure de sortie (timestamp UTC)
    - [ ] Type de sortie (TP atteint, SL atteint, Sortie manuelle)
    - [ ] Raison de sortie si manuelle
  - [ ] Résultat du trade (uniquement pour les trades CLOSED)
    - [ ] Gain/Perte en montant
    - [ ] Gain/Perte en pourcentage
    - [ ] R:R réel obtenu
    - [ ] Performance vs plan initial (% du TP atteint)
    - [ ] Durée du trade (calculée)
  - [ ] Métadonnées
    - [ ] Notes personnelles
    - [ ] Tags/Catégories
  - [ ] Relations
    - [ ] Utilisateur (ManyToOne)
- [ ] Service de gestion des trades
  - [ ] Création du trade (PENDING)
  - [ ] Ouverture du trade (OPEN)
    - [ ] Validation du prix d'entrée réel
    - [ ] Enregistrement date réelle
  - [ ] Clôture du trade (CLOSED)
    - [ ] Calcul automatique des résultats
    - [ ] Validation des données de sortie
  - [ ] Annulation du trade (CANCELLED)
  - [ ] Mise à jour des métadonnées
  - [ ] Suppression logique
- [ ] API REST
  - [ ] Endpoints CRUD
  - [ ] Endpoints de changement de statut
    - [ ] POST /trades/:id/open
    - [ ] POST /trades/:id/close
    - [ ] POST /trades/:id/cancel
  - [ ] Filtres par statut
  - [ ] Pagination
  - [ ] Validation des entrées
- [ ] Tests
  - [ ] Tests unitaires CRUD
  - [ ] Tests des changements de statut
  - [ ] Tests des calculs de résultats
  - [ ] Tests des différents scénarios de sortie
  - [ ] Tests d'intégration
  - [ ] Tests E2E

#### ⚪️ v0.10.4 : Sources de Prix
**Description:** Service de connexion aux sources de données de prix
- [ ] Configuration des sources
  - [ ] Interface `PriceSource`
  - [ ] Gestion des API keys
  - [ ] Sélection des sources par symbole
- [ ] Connecteurs de prix
  - [ ] Implémentation WebSocket
  - [ ] Implémentation REST fallback
  - [ ] Gestion des reconnexions
  - [ ] Validation des données
- [ ] Tests
  - [ ] Tests des connexions
  - [ ] Tests de fallback
  - [ ] Tests de validation des données
  - [ ] Tests de résilience

#### ⚪️ v0.10.5 : Surveillance Automatique des Trades
**Description:** Système optimisé de surveillance automatique des trades ouverts
- [ ] Service de gestion des symboles
  - [ ] Cache Redis des symboles surveillés
  - [ ] Regroupement des trades par symbole
  - [ ] Utilisation des connecteurs de prix
  - [ ] Gestion des déconnexions
- [ ] Service de surveillance des prix
  - [ ] Réception des prix en temps réel
  - [ ] Mise à jour du cache Redis
  - [ ] Validation des données reçues
  - [ ] Gestion des erreurs
- [ ] Service de vérification
  - [ ] Vérification en mémoire des TP/SL
  - [ ] Traitement par lots des clôtures
  - [ ] File d'attente pour les clôtures
  - [ ] Gestion des conflits
- [ ] Monitoring et Performance
  - [ ] Métriques de performance
  - [ ] Alertes de latence
  - [ ] Logs des clôtures automatiques
  - [ ] Statistiques d'utilisation
- [ ] Tests
  - [ ] Tests de performance avec volume
  - [ ] Tests de résilience
  - [ ] Tests des scénarios de clôture
  - [ ] Tests de charge (5000+ trades)

#### ⚪️ v0.11.0 : Visibilité du Journal
**Description:** Gestion de la visibilité du journal de trading
- [ ] Modèles de visibilité et permissions
- [ ] Options de visibilité dans le profil
- [ ] Statut de visibilité par trade
- [ ] Filtres de visibilité dans l'API
- [ ] Affichage des trades publics
- [ ] Tests unitaires CRUD visibilité
- [ ] Tests unitaires validation visibilité
- [ ] Tests E2E création visibilité
- [ ] Tests E2E mise à jour visibilité
- [ ] Tests E2E suppression visibilité

#### ⚪️ v0.12.0 : Statistiques Basiques
**Description:** Statistiques essentielles du journal de trading
- [ ] Modèle de statistiques (StatsEntity)
- [ ] Modèles de cache et d'historique
- [ ] Endpoints REST statistiques
- [ ] Calculs en temps réel
- [ ] Mise en cache des statistiques
- [ ] Tâches planifiées de recalcul
- [ ] Tests unitaires CRUD statistiques
- [ ] Tests unitaires calculs en temps réel
- [ ] Tests E2E création statistique
- [ ] Tests E2E mise à jour statistique
- [ ] Tests E2E suppression statistique

### Phase 4 - Formation

#### ⚪️ v0.13.0 : Modèles Formation
**Description:** Modèles de données pour les formations
- [ ] Entité Formation avec ses champs
- [ ] Entité Section avec ses champs
- [ ] Entité Leçon avec ses champs
- [ ] Relations entre entités
- [ ] Migrations
- [ ] Tests unitaires CRUD formations
- [ ] Tests unitaires validation relations
- [ ] Tests unitaires génération migrations
- [ ] Tests unitaires relations entre entités
- [ ] Tests E2E création formation
- [ ] Tests E2E création section
- [ ] Tests E2E création leçon

#### ⚪️ v0.14.0 : API CRUD Formation
**Description:** API pour la gestion des formations
- [ ] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [ ] DTOs et validation
- [ ] Filtres et pagination
- [ ] Tests unitaires CRUD formations
- [ ] Tests unitaires validation DTOs
- [ ] Tests unitaires implémentation filtres
- [ ] Tests E2E création formation
- [ ] Tests E2E mise à jour formation
- [ ] Tests E2E suppression formation

#### ⚪️ v0.15.0 : API CRUD Sections
**Description:** API pour la gestion des sections
- [ ] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [ ] Gestion de l'ordre des sections
- [ ] Relations avec les formations
- [ ] Tests unitaires CRUD sections
- [ ] Tests unitaires gestion ordre sections
- [ ] Tests E2E création section
- [ ] Tests E2E mise à jour section
- [ ] Tests E2E suppression section

#### ⚪️ v0.16.0 : API CRUD Leçons
**Description:** API pour la gestion des leçons
- [ ] Endpoints REST (GET, POST, PUT, PATCH, DELETE)
- [ ] Support de contenu Markdown
- [ ] Gestion des médias
- [ ] Tests unitaires CRUD leçons
- [ ] Tests unitaires validation Markdown
- [ ] Tests E2E création leçon
- [ ] Tests E2E mise à jour leçon
- [ ] Tests E2E suppression leçon

#### ⚪️ v0.17.0 : Progression Utilisateur
**Description:** Suivi de la progression des utilisateurs
- [ ] Modèle de progression
- [ ] Suivi de statut par formation/section/leçon
- [ ] Système de completion
- [ ] Historique d'apprentissage
- [ ] Tests unitaires calcul progression
- [ ] Tests unitaires suivi statut
- [ ] Tests E2E création progression
- [ ] Tests E2E mise à jour progression
- [ ] Tests E2E suppression progression

### Phase 5 - Infrastructure Avancée

#### ⚪️ v0.18.0 : Configuration Production
**Description:** Configuration production
- [ ] Optimisation Dockerfiles
- [ ] Configuration Nginx
- [ ] Sécurisation variables d'environnement
- [ ] Scripts de déploiement
- [ ] Tests unitaires configuration Nginx
- [ ] Tests unitaires sécurité variables d'environnement
- [ ] Tests unitaires scripts de déploiement

#### ⚪️ v0.19.0 : Sécurité Infrastructure avancée
**Description:** Sécurité avancée de l'API
- [ ] Configuration SSL/TLS avancée
- [ ] Pare-feu applicatif avancé
- [ ] Monitoring des accès avancé
- [ ] Alertes de sécurité
- [ ] Tests unitaires SSL/TLS avancés
- [ ] Tests unitaires pare-feu applicatif avancé
- [ ] Tests unitaires monitoring accès
- [ ] Tests unitaires alertes

## Version 1.0.0 (Release MVP)
**Description:** Release stable du MVP avec tests complets et documentation
- [ ] Tests E2E complets
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Documentation technique
- [ ] Documentation utilisateur
- [ ] Documentation déploiement
- [ ] Revue de sécurité
- [ ] Optimisations de performance
- [ ] Correction des bugs identifiés
- [ ] Tests de non-régression
- [ ] Tests de documentation
- [ ] Tests unitaires revue sécurité
- [ ] Tests unitaires correction bugs

#### ⚪️ v1.16.0 : Préférences Utilisateur
**Description:** Configuration des préférences utilisateur après implémentation des fonctionnalités principales

1. Préférences de notification
   - [ ] Configuration des notifications par type d'événement
   - [ ] Tests des préférences de notification

2. Préférences d'affichage
   - [ ] Configuration de la visibilité (journal, profil)
   - [ ] Configuration des badges affichés
   - [ ] Tests des préférences d'affichage

3. Visibilité du profil
   - [ ] Configuration de la visibilité (public/privé)
   - [ ] Endpoint GET /users/:id (profil public)
   - [ ] Endpoint PATCH /users/me/visibility
   - [ ] Tests E2E visibilité profil
   - [ ] Tests validation préférences de visibilité

4. Préférences de langue et localisation
   - [ ] Choix de la langue (préparation internationalisation future)
   - [ ] Configuration du fuseau horaire
   - [ ] Tests des préférences de localisation

### Phase 6 - Blog et Actualités

#### ⚪️ v1.1.0 : Système de Blog
**Description:** Gestion complète des articles et actualités
- [ ] Modèle Article et migrations
- [ ] Système de publication
- [ ] Gestion des catégories
- [ ] Gestion des tags
- [ ] Support médias enrichis
- [ ] Système de commentaires
- [ ] Modération de contenu
- [ ] Tests unitaires CRUD articles
- [ ] Tests unitaires publication
- [ ] Tests E2E blog complet

[Les versions suivantes restent inchangées...]