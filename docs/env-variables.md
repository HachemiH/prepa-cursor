# Variables d'Environnement

Ce document décrit les variables d'environnement utilisées dans l'application.

## Application

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| NODE_ENV | Environnement d'exécution | development, production, test | development |
| PORT | Port du serveur HTTP | 1-65535 | 3000 |
| API_PREFIX | Préfixe des routes API | string | api |
| API_VERSION | Version de l'API | string | v1 |

## Base de données

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| DB_HOST | Hôte de la base de données | string | localhost |
| DB_PORT | Port de la base de données | 1-65535 | 5432 |
| DB_USERNAME | Nom d'utilisateur | string | postgres |
| DB_PASSWORD | Mot de passe | string | postgres |
| DB_DATABASE | Nom de la base de données | string | prepa_cursor_dev |
| DB_SCHEMA | Schéma de la base de données | string | public |

## Redis

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| REDIS_HOST | Hôte Redis | string | localhost |
| REDIS_PORT | Port Redis | 1-65535 | 6379 |
| REDIS_PASSWORD | Mot de passe Redis | string | - |
| REDIS_DB | Index de la base Redis | number | 0 |

## JWT

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| JWT_SECRET | Clé secrète pour les tokens | string | - |
| JWT_EXPIRES_IN | Durée de validité des tokens | string (ex: 1h, 1d) | 1h |
| JWT_REFRESH_SECRET | Clé secrète pour les refresh tokens | string | - |
| JWT_REFRESH_EXPIRES_IN | Durée de validité des refresh tokens | string (ex: 7d) | 7d |

## Rate Limiting

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| THROTTLE_TTL | Durée de la fenêtre de limitation (secondes) | number | 60 |
| THROTTLE_LIMIT | Nombre maximum de requêtes par fenêtre | number | 100 |

## Logging

| Variable | Description | Valeurs possibles | Par défaut |
|----------|-------------|-------------------|------------|
| LOG_LEVEL | Niveau de détail des logs | error, warn, info, debug | debug |

## Sécurité

⚠️ **Important:**
- Ne jamais commiter le fichier `.env` dans le dépôt Git
- Utiliser des valeurs sécurisées en production
- Changer les secrets JWT en production
- Utiliser des mots de passe forts pour la base de données et Redis en production 