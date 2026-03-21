#!/bin/bash

# twitter-post.sh <message>
MESSAGE="$1"
PROFILE="openclaw"

if [ -z "$MESSAGE" ]; then
    echo "Error: No message provided."
    exit 1
fi

echo "🚀 Starting Twitter post process..."

# 1. Start browser if not running
openclaw browser start --browser-profile "$PROFILE"

# 2. Navigate to compose page directly
echo "🌐 Navigating to compose page..."
openclaw browser navigate "https://x.com/compose/post" --browser-profile "$PROFILE"

# 3. Wait for the tweet area to be ready
echo "⏳ Waiting for input area..."
openclaw browser wait "css=[data-testid='tweetTextarea_0']" --browser-profile "$PROFILE"

# 4. Use evaluate to bypass the CLI's aria-ref prefixing and post directly
echo "✉️ Posting message..."

# Safely escape the message for JS
# Using Python to generate the JS function call to avoid escaping hell in bash
JS_CODE=$(python3 -c "import json, sys; msg = sys.argv[1]; print(f'''
(() => {{
  const textarea = document.querySelector(\"[data-testid='tweetTextarea_0']\");
  const button = document.querySelector(\"[data-testid='tweetButton']\");
  if (!textarea || !button) return \"error: elements not found\";
  
  textarea.focus();
  document.execCommand('insertText', false, {json.dumps(msg)});
  
  // Click the post button after a tiny delay
  setTimeout(() => {{
    button.click();
  }}, 500);
  
  return \"success\";
}})()
''')" "$MESSAGE")

openclaw browser evaluate --fn "$JS_CODE" --browser-profile "$PROFILE"

echo "✅ Done!"
