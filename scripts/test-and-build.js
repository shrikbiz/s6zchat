#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting unit test and build process...\n');

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
    // Step 1: Run unit tests
    console.log('🧪 Step 1: Running unit tests...\n');
    await runCommand('npm', ['test', '--', '--coverage', '--watchAll=false']);
    console.log('✅ Unit tests completed successfully!\n');

    // Step 2: Build the app
    console.log('🏗️  Step 2: Building the application...\n');
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Build completed successfully!\n');

    console.log('🎉 All tasks completed successfully!');
    console.log('   - Unit tests: ✅ PASSED');
    console.log('   - Build: ✅ COMPLETED');
    
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    console.log('\n📋 Summary:');
    console.log('   - Unit tests: ❓ Check above output');
    console.log('   - Build: ❌ FAILED or NOT STARTED');
    process.exit(1);
  }
}

main();