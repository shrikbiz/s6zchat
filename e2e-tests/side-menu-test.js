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
    const menuButton = await page.locator('[data-testid="menu-toggle-button"]');
    await menuButton.click();
    
    // Wait for sidebar to open
    await page.waitForTimeout(1000);
    
    console.log('Checking for required menu items...');
    
    // Check for "New chat" option
    const newChatItem = await page.locator('[data-testid="sidebar-new-chat"]');
    if (await newChatItem.isVisible()) {
      console.log('✓ New chat item found');
    } else {
      console.log('⚠ New chat item not found');
    }
    
    // Check for "Search" option
    const searchItem = await page.locator('[data-testid="sidebar-search"]');
    if (await searchItem.isVisible()) {
      console.log('✓ Search item found');
    } else {
      console.log('⚠ Search item not found');
    }
    
    // Check for "Chats" section (chat history)
    const chatsSection = await page.locator('[data-testid="chats-section"]');
    if (await chatsSection.isVisible()) {
      console.log('✓ Chats section found');
    } else {
      console.log('ℹ Chats section not visible (may be empty)');
    }
    
    // Check for settings button (usually at the bottom)
    const settingsButton = await page.locator('[data-testid="settings"]');
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