---
name: twitter-post
description: Automate posting messages to Twitter (X) using the Chrome browser MCP. Use when the user wants to "tweet", "post to twitter", or "share on X". Requires the user to be logged into Twitter in the 'openclaw' Chrome profile.
---

# Twitter Post Skill

This skill automates the process of posting messages to Twitter (X) using the built-in browser automation tools.

## Quick Start

1.  **Draft your message**.
2.  **Run the post script** to handle navigation and UI interaction.

```bash
./skills/twitter-post/scripts/post.sh "Your message here"
```

## Workflow

### 1. Automation Script
The bundled `post.sh` script handles the entire flow:
- Ensures the browser is started (profile: `openclaw`).
- Navigates directly to `https://x.com/compose/post`.
- Locates the "textbox" element and types the message.
- Locates the "Post" button and clicks it.

### 2. Manual Recovery
If the automation fails (e.g., due to a login wall or UI change):
1.  Use `openclaw browser screenshot` to see what's happening.
2.  Use `openclaw browser snapshot` to find the current element references.
3.  Manually click or type using the specific `ref` found.

## Prerequisites
- **Chrome Profile**: The user must be logged into Twitter in the `openclaw` Chrome profile.
- **MCP Config**: The `browser` tool must be enabled in `openclaw.json`.
