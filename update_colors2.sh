#!/bin/bash
FILES=$(find artifacts/automystics/src -type f -name "*.tsx" -o -name "*.ts")

for file in $FILES; do
  sed -i 's/via-\[#E1E6EF\]/via-muted\/20/g' "$file"
  sed -i 's/to-\[#D4DBE8\]/to-muted\/40/g' "$file"
  sed -i 's/bg-blue-400\/5/bg-primary\/5/g' "$file"
  sed -i 's/bg-cyan-500\/10/bg-primary\/10/g' "$file"
  sed -i 's/from-cyan-400\/10/from-primary\/10/g' "$file"
  sed -i 's/bg-cyan-400\/25/bg-primary\/25/g' "$file"
  sed -i 's/hover:shadow-cyan-500\/20/hover:shadow-primary\/20/g' "$file"
  sed -i 's/hover:shadow-cyan-500\/30/hover:shadow-primary\/30/g' "$file"
  sed -i 's/shadow-cyan-500\/20/shadow-primary\/20/g' "$file"
  sed -i 's/shadow-cyan-500\/30/shadow-primary\/30/g' "$file"
  sed -i 's/shadow-cyan-500\/40/shadow-primary\/40/g' "$file"
  sed -i 's/text-cyan-50/text-primary-foreground/g' "$file"
  sed -i 's/text-blue-900/text-primary-foreground/g' "$file"
  sed -i 's/text-cyan-100/text-primary-foreground/g' "$file"
  sed -i 's/bg-blue-100/bg-primary\/10/g' "$file"
  sed -i 's/border-cyan-500\/20/border-primary\/20/g' "$file"
  sed -i 's/border-cyan-500\/30/border-primary\/30/g' "$file"
  sed -i 's/border-cyan-500\/50/border-primary\/50/g' "$file"
  sed -i 's/to-cyan-500\/10/to-primary\/10/g' "$file"
  sed -i 's/to-cyan-500\/90/to-primary\/90/g' "$file"
  sed -i 's/to-cyan-500\/5/to-primary\/5/g' "$file"
  sed -i 's/from-cyan-500\/10/from-primary\/10/g' "$file"
  sed -i 's/from-cyan-500\/5/from-primary\/5/g' "$file"
done

