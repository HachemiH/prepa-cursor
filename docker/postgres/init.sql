-- Création du schéma public s'il n'existe pas
CREATE SCHEMA IF NOT EXISTS public;

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour les recherches full-text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Droits sur le schéma public
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public; 