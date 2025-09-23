#!/bin/bash

# Roll back to the last known good state before this chat session
echo "🔄 Rolling back to last known good state..."

cd /Users/andyhall/virtera/toption-trading-app

# Reset to the commit before we started making changes
git reset --hard 48fe6770852d8f33af6d2cb1c8d0f953cb24c161

# Force push to override the remote
git push --force origin main

echo "✅ Successfully rolled back to the previous working state"
echo ""
echo "📊 Vercel will now redeploy with the previous code"
echo ""
echo "This has restored the code to the state before the current chat session started."
