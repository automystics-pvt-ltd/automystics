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
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Add secondary color to gradients for more vibrancy
  content = content.replace(/bg-gradient-to-r from-primary to-primary\/80/g, 'bg-gradient-to-r from-primary via-primary to-secondary');
  content = content.replace(/bg-gradient-to-r from-primary to-primary/g, 'bg-gradient-to-r from-primary to-secondary');
  content = content.replace(/bg-gradient-to-br from-primary\/20 to-primary\/10/g, 'bg-gradient-to-br from-primary/20 via-secondary/15 to-secondary/10');
  
  // Enhance icon backgrounds with secondary color
  content = content.replace(/bg-primary\/10 /g, 'bg-gradient-to-br from-primary/10 to-secondary/10 ');
  
  // Add more vibrant borders
  content = content.replace(/border-primary\/30/g, 'border-primary/40');
  content = content.replace(/border-primary\/20/g, 'border-primary/30');
  
  // Enhance hover states with secondary
  content = content.replace(/hover:border-primary\/50/g, 'hover:border-primary/60 hover:shadow-secondary/20');
  content = content.replace(/group-hover:text-primary transition/g, 'group-hover:text-primary group-hover:scale-105 transition');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Enhanced vibrancy:', filePath);
  }
});

// Update components for vibrant interactions
walk('artifacts/automystics/src/components', function(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Enhance navbar with secondary accent
  if (filePath.includes('navbar.tsx')) {
    content = content.replace(/hover:bg-primary group-hover:text-primary-foreground/g, 'hover:bg-gradient-to-br hover:from-primary hover:to-secondary group-hover:text-primary-foreground');
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Enhanced component:', filePath);
  }
});

console.log('\n✅ Vibrancy enhancement complete');
