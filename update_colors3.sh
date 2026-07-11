#!/bin/bash
FILES=$(find artifacts/automystics/src -type f -name "*.tsx" -o -name "*.ts")

for file in $FILES; do
  sed -i 's/cyan/primary/g' "$file"
  sed -i 's/blue-/primary-/g' "$file"
  sed -i 's/blue/primary/g' "$file"
done

