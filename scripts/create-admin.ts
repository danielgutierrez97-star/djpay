import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);

async function createAdmin() {
  const username = "Franklin";
  const password = "09051997";

  const passwordHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO admins (
      username,
      password_hash
    )
    VALUES (
      ${username},
      ${passwordHash}
    )
  `;

  console.log("✅ Administrador creado correctamente");
}

createAdmin().catch(console.error);