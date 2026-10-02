import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  console.log("Configuration des politiques RLS du bucket Supabase 'news-images'...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Trouvée" : "Manquante");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. S'assurer que le bucket 'news-images' existe et est public
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('news-images', 'news-images', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log("Bucket 'news-images' vérifié et configuré en public.");

    // 2. Supprimer les anciennes politiques si elles existent
    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Allow public uploads to news-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public select from news-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public update to news-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public delete from news-images" ON storage.objects;
    `);

    // 3. Créer les politiques RLS autorisant le téléversement (INSERT) et la lecture (SELECT)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public uploads to news-images"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'news-images');
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public select from news-images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'news-images');
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public update to news-images"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'news-images');
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public delete from news-images"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'news-images');
    `);

    console.log("✅ Politiques RLS créées avec succès sur Supabase Storage pour le bucket 'news-images' !");
  } catch (error) {
    console.error("Erreur lors de la configuration des politiques RLS :", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
