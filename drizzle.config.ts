import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './newPipeline/db/migrations',
  schema: './newPipeline/db/schema.ts',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'justinlong',
    password: '54321',
    database: 'VC_Backed_Jobs',
    ssl: false,
  },
});
