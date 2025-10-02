#!/bin/bash

# Quick commit of build fix
cd /Users/andyhall/virtera/toption-trading-app

git add -A
git commit -m "Fix: AnalyticsTab import error causing build failure"
git push origin main

echo "Build fix pushed to Vercel"
