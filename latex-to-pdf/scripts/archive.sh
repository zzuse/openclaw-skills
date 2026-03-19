#!/bin/bash

# Arguments: <base_name> (e.g. resume_apple_engineer)
BASE_NAME="$1"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_DIR="archive"

if [ -z "$BASE_NAME" ]; then
    echo "Error: No base name provided."
    exit 1
fi

mkdir -p "$ARCHIVE_DIR"

# Move and rename .tex if it exists
if [ -f "${BASE_NAME}.tex" ]; then
    NEW_TEX_PATH="$ARCHIVE_DIR/${BASE_NAME}_${TIMESTAMP}.tex"
    mv "${BASE_NAME}.tex" "$NEW_TEX_PATH"
    echo "Archived source: $NEW_TEX_PATH"
fi

# Move and rename .pdf if it exists
if [ -f "${BASE_NAME}.pdf" ]; then
    NEW_PDF_PATH="$ARCHIVE_DIR/${BASE_NAME}_${TIMESTAMP}.pdf"
    mv "${BASE_NAME}.pdf" "$NEW_PDF_PATH"
    echo "Archived output: $NEW_PDF_PATH"
    # Return the PDF path for the next script in the chain (upload)
    echo "$NEW_PDF_PATH"
fi
