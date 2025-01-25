# Guide d'Installation

## Prérequis

- Node.js (v18 ou supérieur)
- PNPM (v8 ou supérieur)
- PostgreSQL (v15 ou supérieur)
- Redis (v7 ou supérieur)

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd prepa-cursor
```

2. Installer les dépendances :
```bash
pnpm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Voir [Configuration des Variables d'Environnement](./env-variables.md) pour plus de détails.

4. Créer la base de données :
```bash
createdb prepa_cursor_dev
```

5. Lancer les migrations :
```bash
pnpm migrate
```

## Démarrage

1. Démarrer Redis :
```bash
redis-server
```

2. Démarrer l'application en mode développement :
```bash
pnpm dev
```

L'API sera disponible sur `http://localhost:3000/api/v1` 