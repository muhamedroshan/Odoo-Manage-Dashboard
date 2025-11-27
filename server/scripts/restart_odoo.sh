#!/bin/bash

# --- CONFIGURATION ---
# Replace 'your-service-name' with your actual service (e.g., nginx, odoo, postgresql)
SERVICE_NAME="your-service-name"
# ---------------------

echo "🔄 Attempting to restart $SERVICE_NAME..."

# 1. Restart the service (requires sudo)
if sudo systemctl restart "$SERVICE_NAME"; then
    echo "✅ Success: Restart command sent."
else
    echo "❌ Error: Failed to restart $SERVICE_NAME."
    exit 1
fi

# 2. Wait a brief moment for the service to initialize
sleep 2

# 3. Check if the service is actually active/running
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "✅ Verified: $SERVICE_NAME is up and running."
    # Optional: Show the latest status line
    systemctl status "$SERVICE_NAME" --no-pager | head -n 3
else
    echo "⚠️ Warning: Service restarted, but it does not appear to be active."
    exit 1
fi
