require('dotenv').config();
const CursorIntegration = require('./cursor-integration');

async function testCursorIntegration() {
  console.log('🧪 Testing Cursor Integration...');
  
  // Create integration instance
  const cursorIntegration = new CursorIntegration();
  
  try {
    // Test 1: Check if Cursor is available (without sending message)
    console.log('\n1. Testing Cursor availability...');
    const script = 'tell application "Cursor" to return name';
    await cursorIntegration.executeAppleScript(script);
    console.log('✅ Cursor is available');
    
    // Test 2: Send ONE comprehensive test message
    console.log('\n2. Sending comprehensive test message...');
    const testMessage = `🧪 **Slack-Cursor Bot Integration Test**

This is a comprehensive test to verify the integration is working correctly.

**Test Components:**
✅ Cursor availability check
✅ Project folder opening
✅ New chat session creation
✅ Message forwarding

**Status:** All systems operational! 🚀

The bot is ready to forward Slack messages to Cursor's AI chat.`;
    
    await cursorIntegration.sendToCursor(testMessage);
    
    // Test 3: Test notification fallback only (no new chat)
    console.log('\n3. Testing notification fallback...');
    await cursorIntegration.fallbackNotification('🔔 Notification system working');
    
    console.log('\n✅ Integration test completed!');
    console.log('\nYou should see ONE new chat session in Cursor with the test message.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('- Make sure Cursor is running');
    console.log('- Check accessibility permissions for Terminal');
    console.log('- Try running: osascript -e "tell application \\"Cursor\\" to activate"');
  }
}

// Run the test
testCursorIntegration(); 