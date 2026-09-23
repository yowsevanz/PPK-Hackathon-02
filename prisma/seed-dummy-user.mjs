import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the dummy user.");
}

const email = "dummy@example.com";
const password = process.env.DUMMY_USER_PASSWORD ?? "dummy-password";
const passwordHash = await bcrypt.hash(password, 10);
const pool = new Pool({ connectionString });

try {
  const result = await pool.query(
    `INSERT INTO "User" ("name", "email", "password")
     VALUES ($1, $2, $3)
     ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name"
     RETURNING "id"`,
    ["Dummy User", email, passwordHash],
  );

  const userId = result.rows[0]?.id;

  if (userId !== 1) {
    throw new Error(`Dummy user must have id 1, but received id ${userId}.`);
  }

  console.log(`Dummy user ready: ${email} (id=${userId})`);
} finally {
  await pool.end();
}
