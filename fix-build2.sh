#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "FIXING BUILD ERROR #2"
git add -A
git commit -m "Fix: Remove sampleOptionsData reference in EnhancedOverview"
git push origin main

echo "Build should work now!"
