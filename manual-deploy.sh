#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "Manual deployment via Vercel CLI"
echo "================================="
echo ""

# First, let's make sure we're linked to the right project
echo "Checking Vercel project link..."
if [ -f ".vercel/project.json" ]; then
    echo "Current Vercel project:"
    cat .vercel/project.json
    echo ""
fi

echo "Deploying directly to Vercel..."
vercel --prod --yes

echo ""
echo "================================="
echo "Deployment command sent!"
echo "Check: https://vercel.com/andrew-halls-projects-c98040e4/toption-app"
