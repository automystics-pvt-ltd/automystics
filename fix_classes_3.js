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

  // Fix malformed tailwind classes
  content = content.replace(/to-primary\/80\/90/g, 'to-primary/90');
  content = content.replace(/to-primary\/80-300/g, 'to-primary/60');
  content = content.replace(/to-primary\/80-500/g, 'to-primary/80');
  content = content.replace(/from-primary-400/g, 'from-primary/80');
  content = content.replace(/via-primary-400/g, 'via-primary/80');
  content = content.replace(/to-primary-400/g, 'to-primary/80');
  content = content.replace(/from-primary-500/g, 'from-primary');
  content = content.replace(/to-primary-500/g, 'to-primary');
  content = content.replace(/via-primary-500/g, 'via-primary');
  content = content.replace(/text-primary-800/g, 'text-primary');
  content = content.replace(/border-primary-300/g, 'border-primary/30');
  content = content.replace(/text-primary-700/g, 'text-primary');
  
  // Fix button text on primary backgrounds
  content = content.replace(/(bg-primary[a-zA-Z0-9\/\-]*.*?)(?:text-foreground)/g, '$1text-primary-foreground');
  content = content.replace(/(from-primary[a-zA-Z0-9\/\-]*.*?)(?:text-foreground)/g, '$1text-primary-foreground');

  // Fix bg-white/5 for light mode
  content = content.replace(/bg-white\/5/g, 'bg-foreground/5 dark:bg-white/5');
  content = content.replace(/bg-white\/10/g, 'bg-foreground/10 dark:bg-white/10');
  
  // Undo double dark replacements just in case
  content = content.replace(/dark:bg-white\/5 dark:bg-white\/5/g, 'dark:bg-white/5');
  content = content.replace(/dark:bg-white\/10 dark:bg-white\/10/g, 'dark:bg-white/10');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
