const { chromium } = require('playwright');

async function testChatApplication() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find the text input field and type the prompt
    const textInput = await page.locator('#prompt');
    await textInput.fill('Write poem on indian dancers');
    
    // Find and click the run/send button
    const runButton = await page.locator('.text-editor-button');
    await runButton.click();
    
    // Wait 10 seconds for the response
    await page.waitForTimeout(10000);
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `.e2e-screenshots/chat-response-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved as ${screenshotPath}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testChatApplication();