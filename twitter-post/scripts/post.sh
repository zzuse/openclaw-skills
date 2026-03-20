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

# 2. Navigate to compose page directly (more reliable than finding the 'Post' button)
echo "🌐 Navigating to compose page..."
openclaw browser navigate "https://x.com/compose/post" --browser-profile "$PROFILE"

# 3. Wait for the page to load and find the text box
# Note: In our successful run, ref e21 was the textbox in the compose view.
# However, refs can change, so we'll try using a role-based selector if possible,
# or wait and take a snapshot to find the current ref.
sleep 5

echo "📸 Finding UI elements..."
# We'll use the 'textbox' selector which is standard for the compose area
openclaw browser type "textbox" "$MESSAGE" --browser-profile "$PROFILE"

# 4. Click the 'Post' button. 
# In compose view, it's usually the only primary button named 'Post' or 'Reply'
echo "✉️ Sending post..."
openclaw browser click "button >> text=/^(Post|Reply)$/" --browser-profile "$PROFILE"

echo "✅ Done!"
