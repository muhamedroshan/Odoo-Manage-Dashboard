#!/bin/bash

# --- CONFIGURATION ---
# Replace this with the actual path to your local repository
TARGET_DIR="/home/yourusername/path/to/your/repo"
# ---------------------

# 1. Check if the directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

# 2. Navigate to the directory
cd "$TARGET_DIR" || exit

# 3. Check if this is a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: '$TARGET_DIR' is not a git repository."
    exit 1
fi

# 4. Pull the changes
echo "⬇️  Pulling changes for $TARGET_DIR..."
output=$(git pull 2>&1)

# 5. Check if the pull was successful
if [ $? -eq 0 ]; then
    echo "✅ Success: Repository updated."
    echo "$output"
else
    echo "❌ Error: Git pull failed."
    echo "$output"
fi
