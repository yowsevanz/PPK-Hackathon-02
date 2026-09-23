import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed-dummy-user.mjs",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
