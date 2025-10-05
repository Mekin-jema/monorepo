import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running seed: ${scriptPath}`);
    const child = spawn('pnpm', ['dlx', 'tsx', scriptPath], {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..', '..'),
      shell: true,
      env: process.env,
    });

    child.on('exit', (code) => {
      if (code === 0) return resolve();
      return reject(new Error(`${scriptPath} exited with code ${code}`));
    });
    child.on('error', (err) => reject(new Error(`${scriptPath} failed to start: ${err.message}`)));
  });
}

(async () => {
  try {
    const packageRoot = path.resolve(__dirname, '..', '..');

    // Ensure DATABASE_URL_SQLITE has a sensible default if not provided
    if (!process.env.DATABASE_URL_SQLITE) {
      const defaultSqlite = `file:${path.join(packageRoot, 'prisma', 'sqlite', 'dev.db')}`;
      console.warn(`DATABASE_URL_SQLITE not set — defaulting to ${defaultSqlite}`);
      process.env.DATABASE_URL_SQLITE = defaultSqlite;
    }

    // Decide which seeds to run depending on environment variables
    const seedsToRun = [];
    seedsToRun.push({ script: './prisma/seeds/sqliteSeed.ts', name: 'sqlite' });
    if (process.env.DATABASE_URL_MONGO) {
      seedsToRun.push({ script: './prisma/seeds/mongoSeed.ts', name: 'mongo' });
    } else {
      console.warn('Skipping mongo seed because DATABASE_URL_MONGO is not set');
    }
    if (process.env.DATABASE_URL_POSTGRES) {
      seedsToRun.push({ script: './prisma/seeds/postgresSeed.ts', name: 'postgres' });
    } else {
      console.warn('Skipping postgres seed because DATABASE_URL_POSTGRES is not set');
    }

    for (const s of seedsToRun) {
      await run(s.script);
    }

    console.log('All requested seeds completed');
  } catch (err) {
    console.error('Seed failed', err);
    if (typeof process !== 'undefined' && typeof process.exit === 'function') {
      process.exit(1);
    }
  }
})();
