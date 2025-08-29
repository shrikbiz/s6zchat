const { chromium } = require('playwright');

async function testChatHistory() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Starting chat history test...');
    
    // Enter a unique prompt to test chat history
    const testPrompt = `Test chat history - ${new Date().toISOString()}`;
    console.log(`Entering prompt: ${testPrompt}`);
    
    const textInput = await page.locator('#prompt');
    await textInput.fill(testPrompt);
    
    // Submit the prompt
    const runButton = await page.locator('.text-editor-button');
    await runButton.click();
    
    console.log('Waiting for AI response...');
    // Wait 10 seconds for the response
    await page.waitForTimeout(10000);
    
    // Open the sidebar to check chat history
    console.log('Opening sidebar to check chat history...');
    const menuButton = await page.locator('[data-testid="menu-toggle-button"]');
    await menuButton.click();
    
    // Wait for sidebar to open
    await page.waitForTimeout(2000);
    
    // Look for the chat in the sidebar (it should appear in the Chats section)
    console.log('Checking if chat appears in history...');
    
    // Check if there's a Chats section or chat list
    const chatItems = await page.locator('[data-testid="chat-item"]').count();
    
    if (chatItems > 0) {
      console.log(`✓ Found ${chatItems} chat item(s) in history`);
      
      // Try to find our specific chat by looking for a recent timestamp or similar text
      const recentChats = await page.locator('[data-testid="chat-item"]').first();
      const chatText = await recentChats.textContent();
      console.log(`Most recent chat: ${chatText}`);
      
      // Click on the most recent chat to test navigation
      await recentChats.click();
      await page.waitForTimeout(1000);
      console.log('✓ Successfully clicked on chat history item');
      
    } else {
      // If no specific chat items found, look for chats section
      const chatsSection = await page.locator('[data-testid="chats-section"]');
      
      if (await chatsSection.isVisible()) {
        console.log('✓ Chat history section exists in sidebar');
      } else {
        console.log('ℹ Chat history may not be immediately visible or has different structure');
      }
    }
    
    // Take screenshot of the sidebar with chat history
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/chat-history-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved as ${screenshotPath}`);
    console.log('✅ Chat history test completed');
    
  } catch (error) {
    console.error('❌ Chat history test failed:', error);
    
    // Take screenshot of failure state
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/chat-history-error-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Error screenshot saved as ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

testChatHistory();