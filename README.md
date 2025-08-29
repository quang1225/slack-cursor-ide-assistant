# slack-cursor-ide-assistant

A sophisticated Slack bot that creates an AI-assisted development workflow by forwarding Slack messages to Cursor editor's Agent mode, enabling automatic code generation, GitLab MR creation, and preview URL generation. This bot runs locally for fast codebase indexing and seamless integration with your development workflow.

## Features

- 🤖 **AI-Powered Development Workflow** - Forward Slack messages to Cursor's Agent mode for automatic code generation
- 🧵 **Smart Thread Context** - Captures complete conversation history for better AI understanding
- 🔀 **GitLab Integration** - Automatic Merge Request creation with proper branching and commit conventions
- 🌐 **Preview URL Generation** - Creates demo environments and preview links
- 🎯 **Intelligent Response System** - Bot replies back to Slack threads with MR links and results
- 📱 **Fallback Notifications** - Desktop notifications as backup when direct integration fails
- 🔧 **Socket Mode Integration** - Real-time messaging without webhooks
- 🍎 **Native macOS Integration** - AppleScript automation for seamless Cursor control
- 📝 **Rich Message Formatting** - Includes sender, channel, and thread context information
- 🔄 **Project-Specific Setup** - Opens specific project folders in Cursor automatically

## Slide

[https://docs.google.com/presentation/d/1mq8SpC92NjMPRGHun8lNRQPwV7wN__QdzrxndYIRAhM](https://docs.google.com/presentation/d/1mq8SpC92NjMPRGHun8lNRQPwV7wN__QdzrxndYIRAhM)

## RFC

[https://docs.google.com/document/d/1PqM_IaivSpb4itCDbPHWXmEBy2cmSdBJxUopteU1XSw](https://docs.google.com/document/d/1PqM_IaivSpb4itCDbPHWXmEBy2cmSdBJxUopteU1XSw)

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
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# Optional: Debug and Project Settings
DEBUG_MODE=false
PROJECT_LOCAL_PATH=/path/to/your/project

# GitLab Integration (Optional - for MR creation)
GITLAB_PROJECT_URL=https://gitlab.com/your-org/your-project
GITLAB_PROJECT_ID=12345
GITLAB_MR_TARGET_BRANCH=main
GITLAB_MR_LABEL=bot-generated
SAMPLE_DEMO_URL=https://your-demo-site.com
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

Create a `.env` file in the root directory with all required variables:

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

Before starting the full bot, test the Cursor integration:

```bash
# Test Cursor integration (recommended first step)
npm run test-cursor
```

This will:

- ✅ Verify Cursor is available and running
- ✅ Test project folder opening (if configured)
- ✅ Send a comprehensive test message to Agent mode
- ✅ Test notification fallback system

If the test passes, then start the full bot:

1. **Start the bot**: `npm start`
2. **Open Cursor editor** and ensure it's running
3. **Send a message** in a Slack channel where the bot is present
4. **Check Cursor** - you should see a new Agent conversation with your message and thread context
5. **Wait for AI response** - Cursor AI will process and reply back to the Slack thread

### Bot Commands

- **Any message in channels**: Bot captures thread context, forwards to Cursor Agent mode, and replies with MR results
- **@mention the bot**: Bot responds immediately with status message, processes request via Cursor AI
- **Thread conversations**: Bot maintains complete conversation history for better AI context
- **Direct messages**: Bot forwards DMs to Cursor with full workflow automation

### Expected Workflow

1. **User posts request** in Slack channel or mentions the bot
2. **Bot replies** with "🧠 I'm creating the MR and Preview URL based on your request..."
3. **Cursor AI processes** the request with full thread context and workflow rules
4. **AI creates** code, branches, and Merge Request following conventions
5. **Bot replies** in thread with MR link, preview URL, and implementation summary

## How It Works

1. **Slack Integration**: Uses Slack Bolt SDK with Socket Mode for real-time messaging
2. **Thread Context Capture**: Automatically gathers complete conversation history from Slack threads
3. **Cursor Rules Injection**: Adds comprehensive development workflow instructions to each message
4. **Project Opening**: Opens specific project folder in Cursor using CLI or AppleScript (if configured)
5. **Agent Mode Activation**: Uses AppleScript to:
   - Activate Cursor application
   - Start new Agent session (Cmd+Shift+I)
   - Inject formatted message with thread context via clipboard
   - Send message to AI agent
6. **AI Development Workflow**: Cursor AI agent processes the request and:
   - Analyzes requirements from the Slack conversation
   - Creates/modifies code based on the request
   - Creates GitLab branches following naming conventions
   - Generates Merge Requests with proper formatting
   - Sets up preview environments
   - Replies back to the original Slack thread with results
7. **Fallback System**: Shows macOS notifications if direct integration fails

## Cursor Keyboard Shortcuts

The bot uses these Cursor shortcuts:

- `Cmd+Shift+I`: Start new Agent session (primary method)
- `Cmd+V`: Paste formatted message via clipboard
- `Enter`: Send message to AI agent

Make sure these shortcuts are enabled in Cursor's settings. Each Slack message will start a fresh Agent conversation in Cursor with complete thread context and development workflow instructions.

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
PROJECT_LOCAL_PATH=/path/to/your/project
# Example: PROJECT_LOCAL_PATH=/Users/username/Documents/PROJECTS/my-project
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
├── index.js              # Main bot entry point with Slack integration
├── cursor-integration.js # Cursor Agent mode automation logic
├── cursor-rules.js       # AI development workflow rules and instructions
├── test-cursor.js        # Integration testing script
├── api/                  # Future API endpoints (empty)
└── utils/
    └── logger.js         # Logging utility
```

### Adding Features

1. **Message Handlers**: Edit Slack event handlers in `src/index.js`
2. **Cursor Integration**: Modify AppleScript automation in `src/cursor-integration.js`
3. **AI Workflow Rules**: Update development workflow instructions in `src/cursor-rules.js`
4. **Testing**: Use `npm run test-cursor` to verify Cursor integration
5. **Development Mode**: Run with `npm start` for testing

### AI Development Workflow

This bot implements a sophisticated AI-assisted development workflow:

1. **Thread Context**: Captures complete Slack conversation history
2. **Cursor Rules**: Injects comprehensive development instructions including:
   - Git workflow with proper branching (`bot.quang.lehong/{jira-ticket-id}`)
   - Commit message format: `[AI generated] [TICKET-ID] Description`
   - GitLab MR creation with labels and assignees
   - Preview URL generation and formatting
3. **Response System**: AI agent replies back to Slack thread with:
   - MR links and status
   - Preview URLs for testing
   - Implementation summary

### GitLab Integration Requirements

For full workflow automation, ensure you have:

- GitLab MCP tools configured in Cursor
- Proper GitLab project access tokens
- Branch protection rules configured
- CI/CD pipelines for preview deployments

## Security Notes

- Keep your Slack tokens secure
- Don't commit `.env` file to version control
- The bot runs locally - no data leaves your machine
- AppleScript has system access - review scripts before running

## Version

**Current Version**: 1.0.0 (Released 2024-07-04)

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Requirements

- **Node.js**: >= 18.0.0
- **macOS**: Required for AppleScript integration
- **Cursor**: Latest version with Agent mode support
- **Slack Workspace**: Admin permissions for app installation

## License

MIT License - Feel free to modify and distribute

**Author**: quang1225 (quang1225@gmail.com)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run test-cursor` first
5. Test the full integration with a Slack workspace
6. Submit a pull request

---

**Need help?** Check the troubleshooting section or create an issue in the repository.

**Pro Tip**: Start with `npm run test-cursor` to ensure your Cursor integration is working before setting up Slack.
