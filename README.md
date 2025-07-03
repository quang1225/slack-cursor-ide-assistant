# slack-cursor-ide-assistant

A Slack bot that summarize requirements in a Slack thread and forwards messages to Cursor editor's chat (Agent mode) interface on macOS. This bot runs locally (for fast codebase indexing). Output is a Merge Request with analytics.

## Features

- 🤖 Forward Slack messages to Cursor's AI chat (Agent mode)
- 🎯 Responds to direct mentions in Slack channels
- 📱 Desktop notifications as fallback
- 🔧 Easy local setup with Socket Mode
- 🍎 Native macOS integration using AppleScript
- 📝 Formatted messages with sender and channel info

## Quick Start 🚀

Get your Slack-Cursor bot running in 5 minutes!

### Prerequisites for Quick Start

- macOS computer
- Cursor editor installed
- Node.js (v18+)
- Slack workspace admin access

### 1. Create Slack App (Fastest Method)

#### Option A: Use Slack App Manifest

1. Go to [Slack Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From an app manifest"
3. Select your workspace
4. Copy and paste this manifest:

```yaml
display_information:
  name: Cursor Bot
  description: Forwards Slack messages to Cursor AI chat
  background_color: '#2c2d30'
features:
  bot_user:
    display_name: Cursor Bot
    always_online: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - channels:read
      - chat:write
      - reactions:write
settings:
  socket_mode_enabled: true
  token_rotation_enabled: false
```

5. Create the app and note down your tokens

#### Option B: Manual Setup

Follow the detailed setup instructions below in the "Setup Instructions" section.

### 2. Quick Environment Setup

Create a `.env` file with your tokens:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
DEBUG_MODE=false

# Optional: Open specific project folder in Cursor
PROJECT_LOCAL_PATH=/path/to/your/project
```

### 3. Quick Test

```bash
# Install dependencies
npm install

# Test Cursor integration first
npm run test-cursor

# If that works, start the bot
npm start
```

### 4. Test in Slack

1. Add the bot to a channel: `/invite @Cursor Bot`
2. Send a message in the channel
3. Check Cursor - you should see the message appear!

### Quick Troubleshooting

- **Bot not receiving messages?** Check if bot is in the channel and verify tokens in `.env`
- **Cursor integration not working?** Grant accessibility permissions to Terminal and make sure Cursor is running
- **Test manually:** `osascript -e 'tell application "Cursor" to activate'`

---

## Prerequisites

- macOS (required for AppleScript integration)
- Node.js (v18 or higher)
- Cursor editor installed
- Slack workspace with admin permissions

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Or use yarn
yarn install
```

### 2. Create Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Cursor Bot") and select your workspace
4. Navigate to "OAuth & Permissions" in the sidebar

### 3. Configure OAuth Scopes

Add these Bot Token Scopes:

- `app_mentions:read` - Read mentions
- `channels:history` - Read channel messages
- `chat:write` - Send messages
- `reactions:write` - Add reactions
- `channels:read` - Read channel information

### 4. Enable Socket Mode

1. Go to "Socket Mode" in the sidebar
2. Toggle "Enable Socket Mode"
3. Create an App-Level Token with `connections:write` scope
4. Save the App Token (starts with `xapp-`)

### 5. Install App to Workspace

1. Go to "OAuth & Permissions"
2. Click "Install to Workspace"
3. Authorize the app
4. Copy the Bot User OAuth Token (starts with `xoxb-`)

### 6. Get Signing Secret

1. Go to "Basic Information"
2. Copy the Signing Secret from "App Credentials"

### 7. Configure Environment Variables

Create a `.env` file in the root directory refer to the `.env.example`:

### 8. Enable Accessibility Permissions

For AppleScript to control Cursor, you need to grant accessibility permissions:

1. Open System Preferences → Security & Privacy → Privacy
2. Select "Accessibility" from the left panel
3. Click the lock to make changes
4. Add Terminal (or your preferred terminal app)
5. Add Node.js if it appears in the list

## Usage

### Start the Bot

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Test the Integration

1. Start the bot
2. Open Cursor editor
3. Send a message in a Slack channel where the bot is present
4. The message should appear in Cursor's chat interface

### Bot Commands

- **Any message in channels**: Bot forwards messages to Cursor
- **@mention the bot**: Bot responds and forwards to Cursor
- **Direct messages**: Bot forwards DMs to Cursor

## How It Works

1. **Slack Integration**: Uses Slack Bolt SDK with Socket Mode for real-time messaging
2. **Message Processing**: Captures messages, extracts user/channel info
3. **Project Opening**: Opens specific project folder in Cursor (if configured)
4. **AppleScript Automation**: Uses AppleScript to:
   - Activate Cursor
   - Start new chat session (Cmd+Shift+L)
   - Type the forwarded message
   - Send the message (Enter)
5. **Fallback**: Shows macOS notifications if direct integration fails

## Cursor Keyboard Shortcuts

The bot uses these Cursor shortcuts:

- `Cmd+Shift+L`: Start new chat session (primary method)
- `Cmd+L`: Open/focus existing chat panel (fallback)

Make sure these shortcuts are enabled in Cursor's settings. Each Slack message will start a fresh chat conversation in Cursor.

## Troubleshooting

### Bot Not Receiving Messages

- Check if bot is added to the channel
- Verify OAuth scopes are correct
- Ensure Socket Mode is enabled

### Cursor Integration Not Working

- Verify Cursor is running
- Check accessibility permissions
- Try running in debug mode: `DEBUG_MODE=true`
- Test with `osascript` manually:
  ```bash
  osascript -e 'tell application "Cursor" to activate'
  ```

### Common Issues

1. **"Cursor not found"**: Make sure Cursor is installed and in Applications
2. **Permissions denied**: Grant accessibility permissions to Terminal/Node
3. **Messages not formatting**: Check AppleScript escaping for special characters

## Advanced Configuration

### Project-Specific Setup

If you want Cursor to open a specific project folder when receiving Slack messages, set the `PROJECT_LOCAL_PATH` environment variable:

```bash
# In your .env file
PROJECT_LOCAL_PATH=/Users/quang.lehong/Documents/PROJECTS/web-kit/web-app/packages/coban-ui
```

This will:

- Open Cursor with your project folder before sending messages
- Keep your context focused on the right codebase
- Use either AppleScript (Cmd+O) or CLI (`cursor` command) to open the project

### Custom Message Formatting

Edit `src/cursor-integration.js` to customize message formatting:

```javascript
const formattedMessage = `Custom format: ${userName} says: ${message.text}`
```

### Alternative Integration Methods

The bot includes multiple integration methods:

- Direct typing with AppleScript
- Clipboard-based message sending
- Notification fallbacks
- Project-specific folder opening

## Development

### Project Structure

```
src/
├── index.js              # Main bot entry point
├── cursor-integration.js # Cursor automation logic
└── utils/
    └── logger.js         # Logging utility
```

### Adding Features

1. Edit message handlers in `src/index.js`
2. Modify Cursor integration in `src/cursor-integration.js`
3. Test with `npm run dev`

## Security Notes

- Keep your Slack tokens secure
- Don't commit `.env` file to version control
- The bot runs locally - no data leaves your machine
- AppleScript has system access - review scripts before running

## License

MIT License - Feel free to modify and distribute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
