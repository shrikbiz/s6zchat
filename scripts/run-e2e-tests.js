#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🧪 Starting E2E test suite...\n');

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log('🏃 Running all E2E tests...\n');
    await runCommand('node', ['e2e-tests/run-all-tests.js']);
    
    console.log('\n🎉 All E2E tests completed successfully!');
    console.log('   - E2E tests: ✅ PASSED');
    console.log('   - Screenshots saved in .e2e-screenshots/');
    
  } catch (error) {
    console.error('❌ E2E tests failed:', error.message);
    console.log('\n📋 Summary:');
    console.log('   - E2E tests: ❌ FAILED');
    console.log('   - Make sure the dev server is running on localhost:3000');
    process.exit(1);
  }
}

main();