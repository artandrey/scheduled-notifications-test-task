import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
  schema: './src/shared/modules/persistence/infrastructure/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
  out: process.env.DD_MIGRATIONS_DIR || './database/migrations',
  introspect: { casing: 'camel' },
  schemaFilter: ['public'],
});

export default config;
