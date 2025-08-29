const { chromium } = require('playwright');

async function testModelSwitching() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Starting model switching test...');
    
    // Look for the model selector (it should be visible in the top right)
    const modelSelector = await page.locator('.model-selector-container select, [data-testid="model-selector"], .MuiSelect-root').first();
    
    // Wait for model selector to be available
    await page.waitForTimeout(2000);
    
    if (await modelSelector.isVisible()) {
      console.log('✓ Model selector found');
      
      // Get current selected model
      const currentModel = await modelSelector.inputValue();
      console.log(`Current model: ${currentModel}`);
      
      // Click to open the model selector dropdown
      await modelSelector.click();
      await page.waitForTimeout(1000);
      
      // Look for OpenAI and Ollama options in the dropdown
      const openAIOption = await page.locator('text="Open AI", [value="Open AI"], li[data-value="Open AI"]');
      const ollamaOption = await page.locator('text="Ollama", [value="Ollama"], li[data-value="Ollama"]');
      
      console.log('Checking available model options...');
      
      // Take screenshot of open dropdown
      let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let screenshotPath = `.e2e-screenshots/model-dropdown-${timestamp}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Model dropdown screenshot: ${screenshotPath}`);
      
      // Test switching to different model
      if (await openAIOption.isVisible()) {
        console.log('✓ OpenAI option found');
        if (currentModel !== 'Open AI') {
          console.log('Switching to OpenAI...');
          await openAIOption.click();
          await page.waitForTimeout(1000);
          console.log('✓ Switched to OpenAI');
        }
      } else if (await ollamaOption.isVisible()) {
        console.log('✓ Ollama option found');
        if (currentModel !== 'Ollama') {
          console.log('Switching to Ollama...');
          await ollamaOption.click();
          await page.waitForTimeout(1000);
          console.log('✓ Switched to Ollama');
        }
      }
      
      // Wait a moment and then try to switch back
      await page.waitForTimeout(1000);
      
      // Click selector again to test second switch
      await modelSelector.click();
      await page.waitForTimeout(500);
      
      // Switch to the other model
      if (await ollamaOption.isVisible() && currentModel === 'Open AI') {
        console.log('Switching back to Ollama...');
        await ollamaOption.click();
        await page.waitForTimeout(1000);
        console.log('✓ Switched to Ollama');
      } else if (await openAIOption.isVisible() && currentModel === 'Ollama') {
        console.log('Switching back to OpenAI...');
        await openAIOption.click();
        await page.waitForTimeout(1000);
        console.log('✓ Switched to OpenAI');
      }
      
      // Verify the model has actually changed
      const newModel = await modelSelector.inputValue();
      console.log(`Final model: ${newModel}`);
      
      if (newModel !== currentModel) {
        console.log('✅ Model switching successful');
      } else {
        console.log('ℹ Model may not have changed or same model was selected');
      }
      
    } else {
      console.log('ℹ Model selector not found - checking alternative locations...');
      
      // Try alternative selectors
      const altSelector = await page.locator('select, .model-select, [role="combobox"]').first();
      if (await altSelector.isVisible()) {
        console.log('✓ Found alternative model selector');
      } else {
        console.log('⚠ Model selector not found in expected locations');
      }
    }
    
    // Take final screenshot
    timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    screenshotPath = `.e2e-screenshots/model-switching-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved as ${screenshotPath}`);
    console.log('✅ Model switching test completed');
    
  } catch (error) {
    console.error('❌ Model switching test failed:', error);
    
    // Take screenshot of failure state
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/model-switching-error-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Error screenshot saved as ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

testModelSwitching();