const applescript = require('applescript');
const { logger } = require('./utils/logger');

class CursorIntegration {
  constructor() {
    // Integration is always enabled
  }

  /**
   * Send a message to Cursor's chat interface using AppleScript
   * @param {string} message - The message to send to Cursor
   */
  async sendToCursor(message) {

    try {
      // First, open Cursor with the project folder if specified
      const projectPath = process.env.PROJECT_LOCAL_PATH;
      if (projectPath) {
        await this.openCursorWithProject(projectPath);
      }

      // AppleScript to interact with Cursor - using clipboard method
      const script = `
        -- Copy message to clipboard
        set the clipboard to "${message.replace(/"/g, '\\"')}"
        
        tell application "Cursor"
          activate
          delay 0.5
          
          -- Ensure Cursor is focused and start Agent session
          tell application "System Events"
            -- Start a new Agent session with Cmd+Shift+I
            key code 34 using {command down, shift down}
            delay 0.5
            
            -- Ensure still focused before pasting
            tell application "Cursor" to activate
            delay 0.3
            
            -- Paste the forwarded message
            key code 9 using command down
            delay 0.5
            
            -- Ensure still focused before sending
            tell application "Cursor" to activate
            delay 0.2
            
            -- Press Enter to send
            key code 36
            delay 0.5
            
            -- Keep focus until message is sent
            tell application "Cursor" to activate
          end tell
        end tell
      `;

      await this.executeAppleScript(script);
      logger.info('Message successfully sent to Cursor');
      
    } catch (error) {
      logger.error('Failed to send message to Cursor:', error);
      
      // Fallback: try to open Cursor and show a notification
      await this.fallbackNotification(message);
    }
  }

  /**
   * Test the connection to Cursor (without sending messages)
   */
  async testConnection() {

    try {
      const script = `
        tell application "Cursor"
          return name
        end tell
      `;

      const result = await this.executeAppleScript(script);
      logger.info(`Cursor integration test successful: ${result}`);
      
    } catch (error) {
      logger.error('Cursor integration test failed:', error);
      logger.warn('Make sure Cursor is installed and running');
    }
  }

  /**
   * Fallback method to show notification if direct chat integration fails
   * @param {string} message - The message to show in notification
   */
  async fallbackNotification(message) {
    try {
      const script = `
        tell application "Cursor"
          activate
        end tell
        
        display notification "${message.replace(/"/g, '\\"').substring(0, 100)}..." with title "New Slack Message" sound name "Glass"
      `;

      await this.executeAppleScript(script);
      logger.info('Fallback notification sent');
      
    } catch (error) {
      logger.error('Fallback notification failed:', error);
    }
  }

  /**
   * Execute AppleScript
   * @param {string} script - The AppleScript to execute
   */
  executeAppleScript(script) {
    return new Promise((resolve, reject) => {
      applescript.execString(script, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Alternative method using clipboard and keyboard shortcuts
   * @param {string} message - The message to send
   */
  async sendToCursorViaClipboard(message) {
    try {
      const script = `
        -- Copy message to clipboard
        set the clipboard to "${message.replace(/"/g, '\\"')}"
        
        tell application "Cursor"
          activate
          delay 0.5
          
          tell application "System Events"
            -- Start new Agent session with Cmd+Shift+I
            key code 34 using {command down, shift down}
          
            
            -- Ensure still focused before pasting
            tell application "Cursor" to activate
            delay 0.3
            
            -- Paste the message
            key code 9 using command down
            delay 0.5
            
            -- Ensure still focused before sending
            tell application "Cursor" to activate
            delay 0.2
            
            -- Send with Enter
            key code 36
            delay 0.5
            
            -- Keep focus until message is sent
            tell application "Cursor" to activate
          end tell
        end tell
      `;

      await this.executeAppleScript(script);
      logger.info('Message sent to Cursor via clipboard (new chat)');
      
    } catch (error) {
      logger.error('Clipboard method failed:', error);
      throw error;
    }
  }

  /**
   * Open Cursor with a specific project folder
   * @param {string} projectPath - The path to the project folder
   */
  async openCursorWithProject(projectPath) {
    try {
      // Try CLI method first (more reliable)
      await this.openCursorWithProjectCLI(projectPath);
      
    } catch (error) {
      logger.warn('CLI method failed, trying AppleScript method:', error);
      // Fallback to AppleScript method
      await this.openCursorWithProjectAppleScript(projectPath);
    }
  }

  /**
   * AppleScript method to open Cursor with project (fallback)
   * @param {string} projectPath - The path to the project folder
   */
  async openCursorWithProjectAppleScript(projectPath) {
    try {
      // Use a simpler approach - just activate Cursor and let CLI handle the folder
      const script = `
        tell application "Cursor"
          activate
          delay 0.5
        end tell
      `;

      await this.executeAppleScript(script);
      logger.info(`Cursor activated (project opening handled by CLI)`);
      
    } catch (error) {
      logger.error('Failed to activate Cursor via AppleScript:', error);
      throw error;
    }
  }

  /**
   * CLI method to open Cursor with project (primary method)
   * @param {string} projectPath - The path to the project folder
   */
  async openCursorWithProjectCLI(projectPath) {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    try {
      // Use the built-in Cursor CLI binary
      const cursorPath = '/Applications/Cursor.app/Contents/Resources/app/bin/cursor';
      
      // Open project with Cursor CLI
      await execAsync(`"${cursorPath}" "${projectPath}"`);
      logger.info(`Cursor opened with project via CLI: ${projectPath}`);
      
      // Give Cursor time to open
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      logger.warn('Cursor CLI failed:', error.message);
      throw error;
    }
  }

  /**
   * Open Cursor and create a new chat session
   */
  async openNewChatSession() {
    try {
      const script = `
        tell application "Cursor"
          activate
          delay 0.5
          
          tell application "System Events"
            -- Try Cmd+Shift+I for new Agent session (if available)
            key code 34 using {command down, shift down}
            delay 0.5
            
            -- Keep focus on Cursor
            tell application "Cursor" to activate
          end tell
        end tell
      `;

      await this.executeAppleScript(script);
      logger.info('New Cursor chat session opened');
      
    } catch (error) {
      logger.error('Failed to open new chat session:', error);
    }
  }
}

module.exports = CursorIntegration; 