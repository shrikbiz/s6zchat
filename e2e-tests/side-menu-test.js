const { chromium } = require('playwright');

async function testSideMenu() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Opening side menu...');
    
    // Click the hamburger menu button to open sidebar
    const menuButton = await page.locator('[data-testid="menu"], .mini-nav-button, button[aria-label*="menu"]').first();
    await menuButton.click();
    
    // Wait for sidebar to open
    await page.waitForTimeout(1000);
    
    console.log('Checking for required menu items...');
    
    // Check for "New chat" option
    const newChatItem = await page.locator('text="New chat"');
    await expect(newChatItem).toBeVisible();
    console.log('✓ New chat item found');
    
    // Check for "Search" option
    const searchItem = await page.locator('text="Search"');
    await expect(searchItem).toBeVisible();
    console.log('✓ Search item found');
    
    // Check for "Chats" section (chat history)
    const chatsSection = await page.locator('text="Chats", [data-testid="chats-section"]').first();
    if (await chatsSection.isVisible()) {
      console.log('✓ Chats section found');
    } else {
      console.log('ℹ Chats section not visible (may be empty)');
    }
    
    // Check for settings button (usually at the bottom)
    const settingsButton = await page.locator('[data-testid="settings"], button[aria-label*="settings"], text="Settings"').first();
    if (await settingsButton.isVisible()) {
      console.log('✓ Settings button found');
    } else {
      console.log('ℹ Settings button not found or not visible');
    }
    
    // Take screenshot of open sidebar
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/side-menu-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved as ${screenshotPath}`);
    console.log('✅ Side menu test completed successfully');
    
  } catch (error) {
    console.error('❌ Side menu test failed:', error);
    
    // Take screenshot of failure state
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/side-menu-error-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Error screenshot saved as ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

testSideMenu();