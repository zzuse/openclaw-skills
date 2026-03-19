#!/bin/bash

FILE_PATH="$1"
FILENAME=$(basename "$FILE_PATH")
BIN_ID=$(python3 -c "import uuid; print(uuid.uuid4().hex)")

# Upload the file
RESPONSE=$(curl -s -T "$FILE_PATH" "https://filebin.net/$BIN_ID/$FILENAME")

# Output the link
echo "https://filebin.net/$BIN_ID/$FILENAME"
