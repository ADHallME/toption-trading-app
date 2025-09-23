#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "==================================="
echo "Checking Git and Deployment Status"
echo "==================================="
echo ""

echo "1. Current directory:"
pwd
echo ""

echo "2. Git remote URL:"
git remote -v
echo ""

echo "3. Current branch:"
git branch --show-current
echo ""

echo "4. Git status:"
git status
echo ""

echo "5. Last commit:"
git log -1 --oneline
echo ""

echo "6. Checking if we have uncommitted changes:"
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes!"
    echo ""
    echo "Files that need to be committed:"
    git status -s
    echo ""
    echo "Let's commit and push them now..."
    echo ""
    git add -A
    git commit -m "Fix: Options screener updates - debugging and default tickers"
    git push origin main
    echo ""
    echo "✅ Changes pushed! Check Vercel for deployment."
else
    echo "✅ No uncommitted changes."
    echo ""
    echo "7. Checking if local is ahead of remote:"
    git status -sb
    echo ""
    
    # Check if we need to push
    if git status | grep -q "Your branch is ahead"; then
        echo "⚠️  Local branch is ahead of remote. Pushing now..."
        git push origin main
        echo "✅ Pushed to GitHub!"
    else
        echo "✅ Everything is up to date with remote."
        echo ""
        echo "8. Let's force a new commit to trigger deployment:"
        echo "# Deployment trigger $(date)" >> deployment.log
        git add deployment.log
        git commit -m "Trigger deployment - $(date)"
        git push origin main
        echo ""
        echo "✅ Forced a new commit to trigger Vercel deployment!"
    fi
fi

echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo "1. Check Vercel dashboard: https://vercel.com/andrew-halls-projects-c98040e4/toption-app"
echo "2. Look for a new deployment in progress"
echo "3. If no deployment appears, check Settings > Git in Vercel"
echo "   - Make sure GitHub integration is connected"
echo "   - Make sure 'main' branch is set to auto-deploy"
