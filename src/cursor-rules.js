module.exports = `# Cursor Rules for Slack AI Assistant

## Context
You are processing messages from a Slack AI Assistant that forwards user requests to create Merge Requests (MRs) and Preview URLs. The user's request will be in the format of a Slack message.

## Required Actions
1. **Analyze the user's request** - Understand what they want to build/create
2. **Create the code/feature** - Implement the requested functionality
3. **Create a Merge Request** - Push changes to a branch and create an MR
4. **Create a Preview URL** - Set up a demo environment if applicable
5. **Reply to Slack Thread** - Send results back to the original Slack thread

## Pre-MR Git Workflow
- Before starting any MR work:
  1. **Stash any current changes** (if any):
     'git stash'
  2. **Checkout the target branch** (IMPORTANT - checkout the exact branch name):
     'git checkout ${process.env.GITLAB_MR_TARGET_BRANCH}'
  3. **Pull the latest changes**:
     'git pull'

## Project Details
- Project URL: ${process.env.GITLAB_PROJECT_URL}
- Project ID: ${process.env.GITLAB_PROJECT_ID}

## Branch Naming Rules
- Branch name format:'bot.quang.lehong/{jira-ticket-id}'
- {jira-ticket-id} is Jira Ticket ID get from the message

## Preview URL Handling
- If SAMPLE_DEMO_URL is provided in the message, include it in the final response
- Format: 🌐 **Preview URL**: '${process.env.SAMPLE_DEMO_URL}[the pathname of URL from the message]'

## GitLab MR Requirements
- **NEVER** call update_merge_request tool - only use create_merge_request for new MRs
- Call create_merge_request MCP tool:
  - **{title}**: [AI generated] [<jira-ticket-id>] <short-description>
  - **{description}**: Include the Preview URL in the MR description:
    '
    ## 🚀 Preview URL
    [Preview URL]
    
    ## 📝 Changes Summary  
    [Brief description of what was implemented]
    
    ## 🎯 Jira Ticket
    [Jira ticket ID and link if available]

    ## Slack Thread
    [Link to the Slack thread]
    '
  - **{labels}**:
    - Add ['ai-assisted::cursor-ai'${process.env.GITLAB_MR_LABEL ? `, ${process.env.GITLAB_MR_LABEL}` : ''}] label to the MR
  - **{assignee_ids}**: Detect the last mentioned user in the message (Slack User ID), convert the it to GitLab User ID and add to the MR
  - **{target_branch}**: <GITLAB_MR_TARGET_BRANCH>

## Response Format
When you complete the task, you MUST use the slack_reply_to_thread tool that will be provided in the message. The message will contain:
- channel_id=<channel_id>
- thread_ts=<thread_ts>

Use these exact values to reply to the thread.

## Final Response Template
Your final response should be beautifully formatted with emojis and clear sections:

✨ MR Created Successfully ✨

🎯 **Summary**  
Brief description of what was implemented

🔗 **Merge Request**  
[Direct link to MR with descriptive text]

🌐 **Preview URL**  
[Preview URL] (available when the pipeline in the MR run successfully)

## Example Response
'
✨ **Task Completed Successfully!** ✨

🎯 **Summary**  
Created user authentication system with login/logout functionality for CRO-123

🔗 **Merge Request**  
[CRO-123: Add user authentication system](https://gitlab.com/user/repo/-/merge_requests/123)

🌐 **Preview URL**  
https://demo.example.com/feature-branch (available after the pipeline in the MR success)


🎉 **Ready for your review!** The feature has been implemented and deployed.
'

## Important Notes
- Always reply to the original Slack thread using the provided channel_id and thread_ts
- Include working links to the MR and demo
- Keep responses concise but informative
- If something fails, explain what went wrong and next steps`; 