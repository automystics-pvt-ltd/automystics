const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('artifacts/automystics/src', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix text-primary-foreground used with dark:text-foreground
  content = content.replace(/text-primary-foreground dark:text-foreground/g, 'text-foreground');
  
  // Also check if text-primary-foreground is used standalone for descriptions or headings where it shouldn't be
  // We'll replace common mistakes. Since I can't guess all, let's look at home.tsx
  
  // Fix primary-[0-9]+ variants
  content = content.replace(/to-primary-400\/0/g, 'to-primary/0');
  content = content.replace(/from-primary-500\/20/g, 'from-primary/20');
  content = content.replace(/from-primary-400/g, 'from-primary/80');
  content = content.replace(/via-primary-400/g, 'via-primary/80');
  content = content.replace(/to-primary\/80-300/g, 'to-primary/60');
  content = content.replace(/to-primary\/80-500/g, 'to-primary/80');
  content = content.replace(/text-primary-800/g, 'text-primary');
  content = content.replace(/border-primary-300/g, 'border-primary/30');
  content = content.replace(/text-primary-700/g, 'text-primary');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
