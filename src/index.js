require('dotenv').config();
const { App } = require('@slack/bolt');
const CursorIntegration = require('./cursor-integration');
const { logger } = require('./utils/logger');
const cursorRulesContent = require('./cursor-rules');

// Initialize the Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true, // Enable socket mode for easier local development
});

// Initialize Cursor integration
const cursorIntegration = new CursorIntegration();

// Helper function to get thread context
async function getThreadContext(client, channel, threadTs) {
  try {
    if (!threadTs) return null;
    
    const result = await client.conversations.replies({
      channel: channel,
      ts: threadTs,
      inclusive: true
    });
    
    return result.messages;
  } catch (error) {
    logger.error('Error fetching thread context:', error);
    return null;
  }
}

// Helper function to format thread messages
async function formatThreadMessages(client, messages) {
  if (!messages || messages.length <= 1) return '';
  
  let threadContent = '\n\n**Thread Context:**\n';
  
  for (const msg of messages) {
    try {
      // Get user info for display name
      const userInfo = await client.users.info({ user: msg.user });
      const displayName = userInfo.user.real_name || userInfo.user.name || msg.user;
      
      const timestamp = new Date(parseFloat(msg.ts) * 1000).toLocaleString();
      threadContent += `\n- **${displayName}** (${timestamp}): ${msg.text}`;
    } catch (error) {
      // Fallback if user info fails
      const timestamp = new Date(parseFloat(msg.ts) * 1000).toLocaleString();
      threadContent += `\n- **User ${msg.user}** (${timestamp}): ${msg.text}`;
    }
  }
  
  return threadContent;
}

// Listen for messages in any channel the bot is in
app.message(async ({ message, client, say }) => {
  try {
    // Skip messages from bots (including this bot)
    if (message.bot_id || message.subtype === 'bot_message') {
      return;
    }

    logger.info(`Received message: ${message.text} from user: ${message.user}`);

    // Get channel info
    const channelInfo = await client.conversations.info({ channel: message.channel });
    const channelName = channelInfo.channel.name || 'Direct Message';

    // Check if this is a thread message
    const isThreadMessage = message.thread_ts && message.thread_ts !== message.ts;
    const threadTs = message.thread_ts || message.ts;

    // Reply to thread first with status message
    await client.chat.postMessage({
      channel: message.channel,
      thread_ts: threadTs,
      text: ":brain: I'm creating the MR and Preview URL based on your request..."
    });

    // Get thread context if this is part of a thread
    const threadMessages = await getThreadContext(client, message.channel, threadTs);
    const threadContext = await formatThreadMessages(client, threadMessages);

    // Format the message for Cursor with rules content first
    let formattedMessage = cursorRulesContent + '\n\n---\n\n';
    
    // Add thread context if available
    if (threadContext) {
      formattedMessage += threadContext + '\n\n---\n\n';
    }
    
    formattedMessage += `**Slack Message from <@${message.user}> in #${channelName}:**\n\n${message.text}`;

    // Append thread information to the message for Cursor
    formattedMessage += `\n\nSend the final result as a NEW REPLY MESSAGE to the thread using tool slack_reply_to_thread with channel_id=${message.channel}, thread_ts=${threadTs}. Do not edit existing messages - create a new reply in the thread.`;

    // Forward to Cursor
      await cursorIntegration.sendToCursor(formattedMessage);
      
      // Optional: React to the message to show it was processed
      await client.reactions.add({
        channel: message.channel,
        timestamp: message.ts,
        name: 'robot_face'
      });

  } catch (error) {
    logger.error('Error processing message:', error);
  }
});

// Listen for direct mentions
app.event('app_mention', async ({ event, client, say }) => {
  try {
    logger.info(`Bot mentioned: ${event.text}`);
    
    // Check if this is a thread mention
    const threadTs = event.thread_ts || event.ts;

    // Reply to thread first with status message
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: threadTs,
      text: ":brain: I'm creating the MR and Preview URL based on your request..."
    });
    
    // Get thread context if this is part of a thread
    const threadMessages = await getThreadContext(client, event.channel, threadTs);
    const threadContext = await formatThreadMessages(client, threadMessages);
    
    // Format the mention for Cursor with rules content first
    let formattedMessage = cursorRulesContent + '\n\n---\n\n';
    
    // Add thread context if available
    if (threadContext) {
      formattedMessage += threadContext + '\n\n---\n\n';
    }
    
    formattedMessage += `**Slack Mention from <@${event.user}> in #${event.channel}:**\n\n${event.text}`;

    // Append thread information to the message for Cursor
    formattedMessage += `\n\nSend the final result as a new reply message to the thread using tool slack_reply_to_thread with channel_id=${event.channel}, thread_ts=${threadTs}. Do not edit existing messages - create a new reply in the thread.`;

    // Forward to Cursor
      await cursorIntegration.sendToCursor(formattedMessage);

  } catch (error) {
    logger.error('Error processing mention:', error);
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.thread_ts || event.ts,
      text: 'Sorry, there was an error processing your message.'
    });
  }
});

// Handle app errors
app.error((error) => {
  logger.error('Slack app error:', error);
});

// Start the app
(async () => {
  try {
    await app.start();
    logger.info('⚡️ Slack bot is running with Socket Mode!');
    logger.info('Bot is ready to forward messages to Cursor 🚀');
    
  } catch (error) {
    logger.error('Failed to start the app:', error);
    process.exit(1);
  }
})(); 