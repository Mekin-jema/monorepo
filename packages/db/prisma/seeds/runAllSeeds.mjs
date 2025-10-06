import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ===============================
// 🔐 GENERAL ENVIRONMENT SETTINGS
// ===============================
const NODE_ENV = 'development';
const DATABASE_DEBUG = false;
const LOG_LEVEL = 'info';
const PORT = 3000;

// ===============================
// 🌿 MONGODB DATABASE (for auth)
// ===============================
const DATABASE_URL_MONGO = "mongodb://mongo_user:mongo_pass@localhost:27017/mongotest?authSource=admin";

// ===============================
// 🐘 POSTGRES DATABASE
// ===============================
const DATABASE_URL_POSTGRES = "postgresql://postgres_user:postgres_pass@localhost:5432/authdb?schema=public";

// ===============================
// 🪶 SQLITE DATABASE
// ===============================
const DATABASE_URL_SQLITE = "file:./dev.db";

// =====================================================
// ✅ Function to Run Each Seeder
// =====================================================
async function run(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running seed: ${scriptPath}`);
    const child = spawn('pnpm', ['dlx', 'tsx', scriptPath], {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..', '..'),
      shell: true,
      env: {
        ...process.env,
        NODE_ENV,
        DATABASE_DEBUG,
        LOG_LEVEL,
        PORT,
        DATABASE_URL_MONGO,
        DATABASE_URL_POSTGRES,
        DATABASE_URL_SQLITE,
      },
    });

    child.on('exit', (code) => {
      if (code === 0) return resolve();
      return reject(new Error(`${scriptPath} exited with code ${code}`));
    });
    child.on('error', (err) =>
      reject(new Error(`${scriptPath} failed to start: ${err.message}`))
    );
  });
}

// =====================================================
// 🚀 Run Seeds
// =====================================================
(async () => {
  try {
    console.log('Database URLs:');
    console.log(' - SQLITE:', DATABASE_URL_SQLITE);
    console.log(' - MONGO:', DATABASE_URL_MONGO);
    console.log(' - POSTGRES:', DATABASE_URL_POSTGRES);

    const seedsToRun = [];
    seedsToRun.push({ script: './prisma/seeds/sqliteSeed.ts', name: 'sqlite' });

    if (DATABASE_URL_MONGO) {
      seedsToRun.push({ script: './prisma/seeds/mongoSeed.ts', name: 'mongo' });
    } else {
      console.warn('Skipping mongo seed (no DATABASE_URL_MONGO)');
    }

    if (DATABASE_URL_POSTGRES) {
      seedsToRun.push({ script: './prisma/seeds/postgresSeed.ts', name: 'postgres' });
    } else {
      console.warn('Skipping postgres seed (no DATABASE_URL_POSTGRES)');
    }

    for (const s of seedsToRun) {
      await run(s.script);
    }

    console.log('✅ All requested seeds completed successfully');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
