const { spawn } = require('child_process');
const path = require('path');

const tests = [
  'playwright-test.js',
  'side-menu-test.js', 
  'chat-history-test.js',
  'model-switching-test.js',
  'settings-test.js'
];

async function runTest(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Running ${testFile}...`);
    console.log('='.repeat(50));
    
    const testProcess = spawn('node', [path.join(__dirname, testFile)], {
      stdio: 'inherit'
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${testFile} completed successfully\n`);
        resolve();
      } else {
        console.log(`❌ ${testFile} failed with code ${code}\n`);
        reject(new Error(`Test ${testFile} failed`));
      }
    });

    testProcess.on('error', (error) => {
      console.error(`❌ Error running ${testFile}:`, error);
      reject(error);
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting E2E Test Suite');
  console.log('='.repeat(50));
  console.log(`📋 Tests to run: ${tests.length}`);
  console.log('📁 Screenshots will be saved to: .e2e-screenshots/');
  console.log('⏰ Started at:', new Date().toLocaleString());
  
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const test of tests) {
    try {
      await runTest(test);
      passed++;
      results.push({ test, status: '✅ PASSED' });
    } catch (error) {
      failed++;
      results.push({ test, status: '❌ FAILED', error: error.message });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total:  ${tests.length}`);
  console.log('⏰ Completed at:', new Date().toLocaleString());
  
  console.log('\n📋 Detailed Results:');
  results.forEach(({ test, status, error }) => {
    console.log(`  ${status} ${test}`);
    if (error) {
      console.log(`    └─ ${error}`);
    }
  });

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check screenshots in .e2e-screenshots/ for debugging.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed successfully!');
    process.exit(0);
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Test run interrupted');
  process.exit(1);
});

runAllTests().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});