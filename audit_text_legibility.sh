#!/bin/bash

echo "=== Auditing text legibility across all pages ==="
echo ""

echo "Checking for text-secondary-foreground on non-secondary backgrounds:"
grep -rn "text-secondary-foreground" artifacts/automystics/src/pages/ | grep -v "bg-secondary" | head -10

echo ""
echo "Checking for text-accent-foreground on non-accent backgrounds:"
grep -rn "text-accent-foreground" artifacts/automystics/src/pages/ | grep -v "bg-accent" | head -10

echo ""
echo "Checking for potentially invisible text patterns:"
grep -rn "text-primary-foreground" artifacts/automystics/src/pages/ | grep -v "bg-primary" | grep -v "bg-gradient.*primary" | head -10

echo ""
echo "=== Audit complete ==="
