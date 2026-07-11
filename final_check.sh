#!/bin/bash

echo "=== Checking for malformed Tailwind classes ==="
grep -rE "(to|from|via)-(primary|secondary|accent|muted)-(100|200|300|400|500|600|700|800|900)" artifacts/automystics/src/ 2>/dev/null | grep -v "node_modules" | head -20

echo ""
echo "=== Checking for compound opacity issues ==="
grep -rE "(to|from|via)-[a-z]+-[0-9]+/[0-9]+/[0-9]+" artifacts/automystics/src/ 2>/dev/null | grep -v "node_modules" | head -20

echo ""
echo "=== Checking for text-primary-foreground outside appropriate contexts ==="
grep -rn "text-primary-foreground" artifacts/automystics/src/pages/ 2>/dev/null | grep -v "bg-primary" | grep -v "Button.*bg-gradient" | head -20

echo ""
echo "=== Final verification complete ==="
