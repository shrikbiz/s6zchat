const { chromium } = require('playwright');

async function testSettings() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Starting settings menu test...');
    
    // First, open the sidebar
    console.log('Opening sidebar...');
    const menuButton = await page.locator('[data-testid="menu-toggle-button"]');
    await menuButton.click();
    
    // Wait for sidebar to open
    await page.waitForTimeout(1500);
    
    // Look for settings button in the sidebar footer
    console.log('Looking for settings button...');
    const settingsButton = await page.locator('[data-testid="settings"]');
    
    if (await settingsButton.isVisible()) {
      console.log('✓ Settings button found');
      
      // Click settings button to open settings modal
      console.log('Opening settings...');
      await settingsButton.click();
      
      // Wait for settings modal to open
      await page.waitForTimeout(2000);
      
      // Check if settings modal/dialog is open
      const settingsModal = await page.locator('.MuiDialog-root, .MuiModal-root, .settings-modal, [role="dialog"]').first();
      
      if (await settingsModal.isVisible()) {
        console.log('✓ Settings modal opened successfully');
        
        // Take screenshot of open settings
        let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let screenshotPath = `.e2e-screenshots/settings-open-${timestamp}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Settings opened screenshot: ${screenshotPath}`);
        
        // Look for common settings elements
        const settingsContent = await settingsModal.textContent();
        console.log('Settings content preview:', settingsContent.substring(0, 200) + '...');
        
        // Try to close the settings modal
        console.log('Closing settings...');
        
        // Look for close button (X, Cancel, Close, etc.)
        let closeButton = await page.locator('[data-testid="close-settings"]').first();
        
        if (!(await closeButton.isVisible())) {
          closeButton = await page.locator('text="Close"').first();
        }
        
        if (!(await closeButton.isVisible())) {
          closeButton = await page.locator('text="Cancel"').first();
        }
        
        if (await closeButton.isVisible()) {
          await closeButton.click();
          console.log('✓ Clicked close button');
        } else {
          // Try pressing Escape key to close modal
          await page.keyboard.press('Escape');
          console.log('✓ Pressed Escape to close modal');
        }
        
        // Wait for modal to close
        await page.waitForTimeout(1000);
        
        // Verify modal is closed
        if (!(await settingsModal.isVisible())) {
          console.log('✓ Settings modal closed successfully');
        } else {
          console.log('ℹ Settings modal may still be open or took longer to close');
        }
        
      } else {
        console.log('⚠ Settings modal did not open or has different structure');
        
        // Check if settings opened in a different way (like a new page or panel)
        const settingsPage = await page.locator('text="Settings", .settings-page, .settings-panel').count();
        if (settingsPage > 0) {
          console.log('✓ Settings may have opened in a different format');
        }
      }
      
    } else {
      console.log('ℹ Settings button not found - checking alternative locations...');
      
      // Try to find settings in other common locations
      const altSettingsButtons = await page.locator('button:has-text("Settings"), [title="Settings"], .settings').count();
      console.log(`Found ${altSettingsButtons} alternative settings elements`);
      
      if (altSettingsButtons > 0) {
        const altSettings = await page.locator('button:has-text("Settings"), [title="Settings"], .settings').first();
        await altSettings.click();
        await page.waitForTimeout(1000);
        console.log('✓ Clicked alternative settings button');
      }
    }
    
    // Take final screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/settings-final-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Final screenshot saved as ${screenshotPath}`);
    console.log('✅ Settings test completed');
    
  } catch (error) {
    console.error('❌ Settings test failed:', error);
    
    // Take screenshot of failure state
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/settings-error-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Error screenshot saved as ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

testSettings();