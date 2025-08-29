#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 }
    };
    this.startTime = Date.now();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logHeader(title) {
    const border = '='.repeat(60);
    this.log('\n' + border, 'cyan');
    this.log(`  ${title}`, 'bright');
    this.log(border, 'cyan');
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: options.silent ? 'pipe' : 'inherit',
        shell: true,
        ...options
      });

      let stdout = '';
      let stderr = '';

      if (options.silent) {
        child.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ code, stdout, stderr });
        } else {
          reject({ code, stdout, stderr });
        }
      });

      child.on('error', (error) => {
        reject({ code: -1, error, stdout, stderr });
      });
    });
  }

  async runUnitTests() {
    this.logHeader('🧪 Running Unit Tests');
    
    try {
      this.log('📋 Discovering test files...', 'blue');
      
      // Check if there are test files
      const testCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const result = await this.runCommand(testCommand, ['test', '--', '--watchAll=false', '--coverage', '--verbose'], {
        silent: false
      });

      this.log('✅ Unit tests completed successfully', 'green');
      this.results.unit.passed = 1;
      this.results.unit.total = 1;
      
      return true;
    } catch (error) {
      this.log('❌ Unit tests failed', 'red');
      if (error.stdout) {
        this.log('Output:', 'yellow');
        console.log(error.stdout);
      }
      if (error.stderr) {
        this.log('Errors:', 'red');
        console.log(error.stderr);
      }
      
      this.results.unit.failed = 1;
      this.results.unit.total = 1;
      
      return false;
    }
  }

  async runE2ETests() {
    this.logHeader('🚀 Running E2E Tests');
    
    // Check if e2e-tests directory exists
    const e2eDir = path.join(process.cwd(), 'e2e-tests');
    if (!fs.existsSync(e2eDir)) {
      this.log('⚠️  E2E tests directory not found, skipping...', 'yellow');
      return true;
    }

    // Check if development server is running
    this.log('🔍 Checking if development server is running on localhost:3000...', 'blue');
    
    try {
      const { default: fetch } = await import('node-fetch');
      const response = await fetch('http://localhost:3000', { 
        method: 'HEAD',
        timeout: 5000 
      });
      
      if (!response.ok) {
        throw new Error('Server not responding');
      }
      
      this.log('✅ Development server is running', 'green');
    } catch (error) {
      this.log('❌ Development server is not running on localhost:3000', 'red');
      this.log('   Please start the server with: npm start', 'yellow');
      return false;
    }

    // Get list of E2E test files
    const testFiles = fs.readdirSync(e2eDir)
      .filter(file => file.endsWith('.js') && file !== 'run-all-tests.js')
      .sort();

    if (testFiles.length === 0) {
      this.log('⚠️  No E2E test files found', 'yellow');
      return true;
    }

    this.log(`📋 Found ${testFiles.length} E2E test files`, 'blue');
    this.results.e2e.total = testFiles.length;

    let allPassed = true;

    for (const testFile of testFiles) {
      this.log(`\n🔄 Running ${testFile}...`, 'cyan');
      
      try {
        await this.runCommand('node', [path.join(e2eDir, testFile)], {
          silent: false
        });
        
        this.log(`✅ ${testFile} passed`, 'green');
        this.results.e2e.passed++;
      } catch (error) {
        this.log(`❌ ${testFile} failed`, 'red');
        this.results.e2e.failed++;
        allPassed = false;
        
        if (error.stdout) {
          console.log(error.stdout);
        }
        if (error.stderr) {
          console.log(error.stderr);
        }
      }
    }

    return allPassed;
  }

  async checkPrerequisites() {
    this.logHeader('🔧 Checking Prerequisites');
    
    const checks = [
      { name: 'Node.js', command: 'node', args: ['--version'] },
      { name: 'npm', command: 'npm', args: ['--version'] },
    ];

    for (const check of checks) {
      try {
        const result = await this.runCommand(check.command, check.args, { silent: true });
        this.log(`✅ ${check.name}: ${result.stdout.trim()}`, 'green');
      } catch (error) {
        this.log(`❌ ${check.name}: Not found`, 'red');
        return false;
      }
    }

    // Check if Playwright is installed for E2E tests
    try {
      const result = await this.runCommand('npx', ['playwright', '--version'], { silent: true });
      this.log(`✅ Playwright: ${result.stdout.trim()}`, 'green');
    } catch (error) {
      this.log(`⚠️  Playwright: Not found (E2E tests may fail)`, 'yellow');
    }

    return true;
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    this.logHeader('📊 Test Results Summary');
    
    // Unit Tests Summary
    this.log('🧪 Unit Tests:', 'bright');
    if (this.results.unit.total > 0) {
      this.log(`   ✅ Passed: ${this.results.unit.passed}`, 'green');
      this.log(`   ❌ Failed: ${this.results.unit.failed}`, this.results.unit.failed > 0 ? 'red' : 'reset');
      this.log(`   📊 Total:  ${this.results.unit.total}`, 'blue');
    } else {
      this.log('   ⚠️  No unit tests run', 'yellow');
    }

    // E2E Tests Summary
    this.log('\n🚀 E2E Tests:', 'bright');
    if (this.results.e2e.total > 0) {
      this.log(`   ✅ Passed: ${this.results.e2e.passed}`, 'green');
      this.log(`   ❌ Failed: ${this.results.e2e.failed}`, this.results.e2e.failed > 0 ? 'red' : 'reset');
      this.log(`   📊 Total:  ${this.results.e2e.total}`, 'blue');
    } else {
      this.log('   ⚠️  No E2E tests run', 'yellow');
    }

    // Overall Summary
    const totalPassed = this.results.unit.passed + this.results.e2e.passed;
    const totalFailed = this.results.unit.failed + this.results.e2e.failed;
    const totalTests = this.results.unit.total + this.results.e2e.total;

    this.log('\n🎯 Overall Results:', 'bright');
    this.log(`   ✅ Total Passed: ${totalPassed}`, 'green');
    this.log(`   ❌ Total Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'reset');
    this.log(`   📊 Total Tests:  ${totalTests}`, 'blue');
    this.log(`   ⏱️  Duration:    ${duration}s`, 'cyan');

    if (totalFailed === 0 && totalTests > 0) {
      this.log('\n🎉 All tests passed!', 'green');
    } else if (totalFailed > 0) {
      this.log('\n⚠️  Some tests failed. Check the output above for details.', 'yellow');
    } else {
      this.log('\n⚠️  No tests were run.', 'yellow');
    }

    return totalFailed === 0 && totalTests > 0;
  }

  async run() {
    this.log('🚀 S6ZChat Test Suite Runner', 'cyan');
    this.log('='.repeat(40), 'cyan');

    try {
      // Check prerequisites
      const prerequisitesOk = await this.checkPrerequisites();
      if (!prerequisitesOk) {
        this.log('\n❌ Prerequisites check failed', 'red');
        process.exit(1);
      }

      // Run unit tests
      const unitTestsOk = await this.runUnitTests();
      
      // Run E2E tests
      const e2eTestsOk = await this.runE2ETests();

      // Print summary
      const allTestsPassed = this.printSummary();

      // Exit with appropriate code
      process.exit(allTestsPassed ? 0 : 1);

    } catch (error) {
      this.log('\n💥 Unexpected error occurred:', 'red');
      console.error(error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Test run interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Test run terminated');
  process.exit(1);
});

// Run the test suite
if (require.main === module) {
  const runner = new TestRunner();
  runner.run();
}

module.exports = TestRunner;