# Étape de développement
FROM node:18-alpine AS development

# Installation de PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances
RUN pnpm install

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["pnpm", "dev"] 