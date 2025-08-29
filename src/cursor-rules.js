module.exports = `# Cursor Rules for Slack AI Assistant

## Context
You are processing messages from a Slack AI Assistant that forwards user requests to create Merge Requests (MRs) and Preview URLs. The user's request will be in the format of a Slack message.

## Thread Analysis for Existing MRs
Before starting any work, you MUST analyze the complete Slack thread context to detect if an MR already exists:

### How to detect existing MRs in Slack threads:
1. **Scan ALL messages in the thread** for these patterns:
   - Direct GitLab MR URLs: \`https://[gitlab-domain]/[project]/merge_requests/[number]\`
   - MR reference text: "Merge Request", "MR Created", "MR link", etc.
   - GitLab MR IDs mentioned in previous bot responses
   - Branch names like "bot.quang.lehong/{jira-ticket-id}"

2. **If existing MR found in thread**:
   - Extract the Jira ticket ID from the thread context  
   - Use that branch name: "bot.quang.lehong/{jira-ticket-id}"
   - Checkout and update the existing branch instead of creating new MR
   - Continue with code changes and push to the same branch (GitLab will update the existing MR)

3. **If NO existing MR found in thread**:
   - Proceed with normal new MR creation workflow

## Required Actions
1. **Analyze the user's request** - Understand what they want to build/create
2. **Create the code/feature** - Implement the requested functionality
3. **Create a Merge Request** - Push changes to a branch and create an MR
4. **Create a Preview URL** - Set up a demo environment if applicable
5. **Reply to Slack Thread** - Send results back to the original Slack thread

## Pre-MR Git Workflow
- Before starting any MR work:
  1. **Stash any current changes** (if any):
     \`git stash\`
  2. **Check for existing MR in Slack thread**:
     - Scan all messages in the current Slack thread for GitLab MR links (patterns like: "https://.*/merge_requests/[0-9]+", "[MR link]", "Merge Request")
     - If MR link found in thread: Extract branch name and checkout to update that existing branch
     - If no MR found in thread: Check if MR already exists for this Jira ticket in GitLab
  3. **Determine branch strategy**:
     - **If MR exists in thread OR for Jira ticket**: Checkout to the existing branch "bot.quang.lehong/{jira-ticket-id}" and pull latest changes  
     - **If no MR exists**: Checkout the target branch and create new branch "bot.quang.lehong/{jira-ticket-id}"
  4. **Checkout the appropriate branch**:
     - For existing MR: \`git checkout bot.quang.lehong/{jira-ticket-id}\`
     - For new MR: \`git checkout \${process.env.GITLAB_MR_TARGET_BRANCH}\`
  5. **Pull the latest changes**:
     \`git pull\`

## Commit Message Format
- **ALL commit messages** must follow this format:
  \`[AI generated] [<jira-ticket-id>] <short-description>\`
- Examples:
  - \`[AI generated] [CRO-123] Add user authentication system\`
  - \`[AI generated] [PROJ-456] Fix navigation bug in dashboard\`

## Project Details
- Project URL: \${process.env.GITLAB_PROJECT_URL}
- Project ID: \${process.env.GITLAB_PROJECT_ID}

## Branch Naming Rules
- Branch name format: \`bot.quang.lehong/{jira-ticket-id}\`
- {jira-ticket-id} is Jira Ticket ID get from the message

## Preview URL Handling
- If SAMPLE_DEMO_URL is provided in the message, include it in the final response
- Format: 🌐 **Preview URL**: \`\${process.env.SAMPLE_DEMO_URL}[the pathname of URL from the message]\`

## GitLab MR Requirements
- **ALWAYS AUTO-CREATE MRs**: NEVER send "Create MR URL" or any manual links - ALWAYS automatically call create_merge_request MCP tool to create the MR immediately after pushing changes
- **NEVER** call update_merge_request tool - only use create_merge_request for new MRs
- **MANDATORY**: Call create_merge_request MCP tool immediately after pushing code changes:
  - **{title}**: [AI generated] [<jira-ticket-id>] <short-description>
  - **{description}**: Include the Preview URL in the MR description:
    \`
    ## 🚀 Preview URL
    [Preview URL]
    
    ## 📝 Changes Summary  
    [Brief description of what was implemented]
    
    ## 🎯 Jira Ticket
    [Jira ticket ID and link if available]

    ## Slack Thread
    [Link to the Slack thread]
    \`
  - **{labels}**: Parse and apply labels from process.env.GITLAB_MR_DEFAULT_LABEL
    - If GITLAB_MR_DEFAULT_LABEL contains comma-separated values (e.g., "label-1,label-2,bot-generated"), split by comma and apply each label
    - If GITLAB_MR_DEFAULT_LABEL is a single value, apply that single label
    - Example: "bot-generated,ai-created,enhancement" becomes ["bot-generated", "ai-created", "enhancement"]
  - **{assignee_ids}**: **ALWAYS** keep GitLab MR assignee from the init thread message. Look for the pattern "Please wait, @{assignee-user-name} will handle your request soon" and convert the assignee-user-name to GitLab User ID. **Fallback**: If the assignee cannot be detected in the initial thread message, assign the GitLab MR assignee to the person who mentioned the bot.
  - **{target_branch}**: \${process.env.GITLAB_MR_TARGET_BRANCH}

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
\`
✨ **Task Completed Successfully!** ✨

🎯 **Summary**  
Created user authentication system with login/logout functionality for CRO-123

🔗 **Merge Request**  
[CRO-123: Add user authentication system](https://gitlab.com/user/repo/-/merge_requests/123)

🌐 **Preview URL**  
https://demo.example.com/feature-branch (available after the pipeline in the MR success)


🎉 **Ready for your review!** The feature has been implemented and deployed.
\`

## Important Notes
- Always reply to the original Slack thread using the provided channel_id and thread_ts
- Include working links to the MR and demo
- Keep responses concise but informative
- If something fails, explain what went wrong and next steps`
