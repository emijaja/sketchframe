import path from "node:path"
import { defineConfig } from "prisma/config"
import "dotenv/config"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL")
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: databaseUrl,
  },
})
