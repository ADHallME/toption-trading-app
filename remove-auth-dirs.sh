#!/bin/bash

# Remove the problematic auth directory that's causing redirect loops
echo "Removing /auth directory that's causing redirect loops..."
rm -rf src/app/auth
rm -rf src/app/auth-debug
rm -rf src/app/auth-deleted
rm -rf src/app/auth-old-backup

echo "Auth directories removed. Auth is now handled by /sign-in and /sign-up"
