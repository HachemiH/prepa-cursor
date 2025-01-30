import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extension UUID (doit être créée dans le schéma public)
    await queryRunner.query(`SET search_path TO public`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Retour au schéma de l'application
    const schemaResult = await queryRunner.query(`SELECT current_schema()`);
    const schema = schemaResult[0].current_schema;

    // Création des énumérations dans le bon schéma
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = '${schema}' AND t.typname = 'user_role_enum') THEN
          CREATE TYPE "${schema}"."user_role_enum" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = '${schema}' AND t.typname = 'student_level_enum') THEN
          CREATE TYPE "${schema}"."student_level_enum" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
        END IF;
      END$$;
    `);

    // Table users
    await queryRunner.query(`
      CREATE TABLE "${schema}"."users" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "role" ${schema}.user_role_enum NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Table students
    await queryRunner.query(`
      CREATE TABLE "${schema}"."students" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "userId" UUID NOT NULL UNIQUE,
        "bio" TEXT NOT NULL,
        "interests" TEXT[] NOT NULL,
        "level" ${schema}.student_level_enum NOT NULL DEFAULT 'BEGINNER',
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_student_user" FOREIGN KEY ("userId") REFERENCES "${schema}"."users"("id") ON DELETE CASCADE
      )
    `);

    // Table instructors
    await queryRunner.query(`
      CREATE TABLE "${schema}"."instructors" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "userId" UUID NOT NULL UNIQUE,
        "bio" TEXT NOT NULL,
        "expertise" TEXT[] NOT NULL,
        "rating" FLOAT NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_instructor_user" FOREIGN KEY ("userId") REFERENCES "${schema}"."users"("id") ON DELETE CASCADE
      )
    `);

    // Table courses
    await queryRunner.query(`
      CREATE TABLE "${schema}"."courses" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "title" VARCHAR NOT NULL,
        "description" TEXT NOT NULL,
        "instructorId" UUID NOT NULL,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_course_instructor" FOREIGN KEY ("instructorId") REFERENCES "${schema}"."instructors"("id") ON DELETE CASCADE
      )
    `);

    // Table modules
    await queryRunner.query(`
      CREATE TABLE "${schema}"."modules" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "title" VARCHAR NOT NULL,
        "description" TEXT NOT NULL,
        "courseId" UUID NOT NULL,
        "order" INTEGER NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_module_course" FOREIGN KEY ("courseId") REFERENCES "${schema}"."courses"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_module_course_order" UNIQUE ("courseId", "order")
      )
    `);

    // Table course_progress
    await queryRunner.query(`
      CREATE TABLE "${schema}"."course_progress" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "studentId" UUID NOT NULL,
        "moduleId" UUID NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "completedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_progress_student" FOREIGN KEY ("studentId") REFERENCES "${schema}"."students"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_progress_module" FOREIGN KEY ("moduleId") REFERENCES "${schema}"."modules"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_progress_student_module" UNIQUE ("studentId", "moduleId")
      )
    `);

    // Table student_courses (relation many-to-many)
    await queryRunner.query(`
      CREATE TABLE "${schema}"."student_courses" (
        "studentId" UUID NOT NULL,
        "courseId" UUID NOT NULL,
        "enrolledAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("studentId", "courseId"),
        CONSTRAINT "fk_student_courses_student" FOREIGN KEY ("studentId") REFERENCES "${schema}"."students"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_student_courses_course" FOREIGN KEY ("courseId") REFERENCES "${schema}"."courses"("id") ON DELETE CASCADE
      )
    `);

    // Indexes pour les clés étrangères
    await queryRunner.query(
      `CREATE INDEX "idx_student_user" ON "${schema}"."students"("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_instructor_user" ON "${schema}"."instructors"("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_course_instructor" ON "${schema}"."courses"("instructorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_module_course" ON "${schema}"."modules"("courseId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_progress_student" ON "${schema}"."course_progress"("studentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_progress_module" ON "${schema}"."course_progress"("moduleId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_student_courses_student" ON "${schema}"."student_courses"("studentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_student_courses_course" ON "${schema}"."student_courses"("courseId")`,
    );

    // Index pour la recherche par email (case insensitive)
    await queryRunner.query(
      `CREATE INDEX "idx_user_email_lower" ON "${schema}"."users" (LOWER(email))`,
    );

    // Index pour la recherche de cours publiés
    await queryRunner.query(
      `CREATE INDEX "idx_course_published" ON "${schema}"."courses"("isPublished")`,
    );

    // Index pour la recherche par expertise
    await queryRunner.query(
      `CREATE INDEX "idx_instructor_expertise" ON "${schema}"."instructors" USING GIN ("expertise")`,
    );

    // Index pour la recherche par centres d'intérêt
    await queryRunner.query(
      `CREATE INDEX "idx_student_interests" ON "${schema}"."students" USING GIN ("interests")`,
    );

    // Trigger pour mettre à jour updatedAt
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ${schema}.update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updatedAt = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Application du trigger sur toutes les tables
    const tables = [
      'users',
      'students',
      'instructors',
      'courses',
      'modules',
      'course_progress',
    ];
    for (const table of tables) {
      await queryRunner.query(`
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON "${schema}"."${table}"
          FOR EACH ROW
          EXECUTE FUNCTION ${schema}.update_updated_at_column();
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Récupération du schéma courant
    const schemaResult = await queryRunner.query(`SELECT current_schema()`);
    const schema = schemaResult[0].current_schema;

    // Suppression des triggers
    const tables = [
      'users',
      'students',
      'instructors',
      'courses',
      'modules',
      'course_progress',
    ];
    for (const table of tables) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS update_${table}_updated_at ON "${schema}"."${table}"`,
      );
    }

    // Suppression de la fonction trigger
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS ${schema}.update_updated_at_column`,
    );

    // Suppression des tables dans l'ordre inverse de leur création
    await queryRunner.query(
      `DROP TABLE IF EXISTS "${schema}"."student_courses"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "${schema}"."course_progress"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."modules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."courses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."instructors"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."students"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."users"`);

    // Suppression des énumérations
    await queryRunner.query(
      `DROP TYPE IF EXISTS "${schema}"."student_level_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "${schema}"."user_role_enum"`);
  }
}
