#!/bin/bash
FILES=$(find artifacts/automystics/src -type f -name "*.tsx" -o -name "*.ts")

for file in $FILES; do
  # Replace hardcoded backgrounds
  sed -i 's/bg-\[#0A0612\]/bg-background/g' "$file"
  sed -i 's/bg-\[#0B1426\]/bg-secondary/g' "$file"
  sed -i 's/bg-\[#0B1021\]/bg-secondary/g' "$file"
  sed -i 's/bg-\[#D4DBE8\]/bg-muted\/30/g' "$file"
  sed -i 's/bg-\[#E1E6EF\]/bg-muted\/20/g' "$file"
  sed -i 's/bg-\[#334155\]/bg-card/g' "$file"
  sed -i 's/bg-\[#F1F5F9\]/bg-muted\/50/g' "$file"
  
  # Replace hardcoded borders
  sed -i 's/border-white\/10/border-border/g' "$file"
  sed -i 's/border-white\/20/border-border\/80/g' "$file"
  sed -i 's/border-white\/5/border-border\/50/g' "$file"
  
  # Replace cyans and blues
  sed -i 's/from-cyan-500/from-primary/g' "$file"
  sed -i 's/via-cyan-400/via-primary/g' "$file"
  sed -i 's/to-cyan-300/to-primary\/80/g' "$file"
  sed -i 's/from-cyan-400/from-primary/g' "$file"
  sed -i 's/to-cyan-500/to-primary/g' "$file"
  sed -i 's/from-blue-600/from-primary\/90/g' "$file"
  sed -i 's/to-blue-400/to-primary\/80/g' "$file"
  sed -i 's/bg-cyan-500/bg-primary/g' "$file"
  sed -i 's/bg-cyan-400/bg-primary/g' "$file"
  sed -i 's/bg-cyan-900/bg-primary\/20/g' "$file"
  sed -i 's/bg-blue-600/bg-primary/g' "$file"
  sed -i 's/bg-blue-500/bg-primary/g' "$file"
  sed -i 's/bg-blue-50/bg-primary\/10/g' "$file"
  sed -i 's/text-cyan-400/text-primary/g' "$file"
  sed -i 's/text-cyan-500/text-primary/g' "$file"
  sed -i 's/text-cyan-300/text-primary/g' "$file"
  sed -i 's/text-blue-600/text-primary/g' "$file"
  sed -i 's/text-blue-500/text-primary/g' "$file"
  sed -i 's/border-cyan-500/border-primary/g' "$file"
  sed -i 's/border-cyan-400/border-primary/g' "$file"
  sed -i 's/border-blue-200/border-primary\/30/g' "$file"
  sed -i 's/border-blue-500/border-primary/g' "$file"
  sed -i 's/shadow-cyan-500/shadow-primary/g' "$file"
  sed -i 's/shadow-blue-500/shadow-primary/g' "$file"
  sed -i 's/ring-cyan-500/ring-primary/g' "$file"
  
  # Replace rgba/hsla
  sed -i 's/rgba(8,145,178/hsla(var(--primary)/g' "$file"
  sed -i 's/rgba(34,211,238/hsla(var(--primary)/g' "$file"
  
  # Hardcoded text and bg combos
  sed -i 's/text-white/text-foreground/g' "$file"
  sed -i 's/text-foreground\/80/text-muted-foreground/g' "$file"
  sed -i 's/text-foreground\/70/text-muted-foreground/g' "$file"
  sed -i 's/text-foreground\/60/text-muted-foreground/g' "$file"
done

