const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('artifacts/automystics/src/pages', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace `text-primary-foreground dark:text-muted-foreground` with `text-muted-foreground`
  content = content.replace(/text-primary-foreground dark:text-muted-foreground/g, 'text-muted-foreground');
  
  // Look for any remaining generic text-primary-foreground
  // But be careful not to replace it if it's on a button, bg-primary, etc.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
