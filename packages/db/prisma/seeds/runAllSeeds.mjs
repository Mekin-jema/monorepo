import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =====================================================
// ✅ Function to Run Each Seeder
// =====================================================
async function run(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running seed: ${scriptPath}`);
    const child = spawn('pnpm', ['dlx', 'tsx', scriptPath], {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..', '..'), // package root
      shell: true,
      env: { ...process.env },
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
    const seedsToRun = [
      './prisma/seeds/authSeed.ts',
      './prisma/seeds/productSeed.ts',
      './prisma/seeds/orderSeed.ts',
    ];

    for (const s of seedsToRun) {
      await run(s);
    }

    console.log('✅ All seeds completed successfully');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
