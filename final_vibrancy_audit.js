const fs = require('fs');
const path = require('path');

let issues = [];

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
  let lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for secondary text on non-secondary backgrounds
    if (line.includes('text-secondary-foreground') && !line.includes('bg-secondary') && !line.includes('Button')) {
      issues.push(`${filePath}:${idx+1} - text-secondary-foreground without bg-secondary`);
    }
    
    // Check for white text on light backgrounds
    if (line.includes('text-white') && !line.includes('bg-primary') && !line.includes('bg-secondary') && !line.includes('bg-gradient')) {
      issues.push(`${filePath}:${idx+1} - text-white on potential light background`);
    }
  });
});

if (issues.length > 0) {
  console.log('⚠️  Found potential legibility issues:\n');
  issues.slice(0, 20).forEach(i => console.log(i));
} else {
  console.log('✅ No legibility issues found in pages');
}

console.log('\n--- Color usage summary ---');
walk('artifacts/automystics/src/pages', function(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let hasPrimary = content.includes('primary');
  let hasSecondary = content.includes('secondary');
  let hasGradient = content.includes('bg-gradient');
  
  if (hasSecondary || hasGradient) {
    console.log(`${path.basename(filePath)}: primary=${hasPrimary}, secondary=${hasSecondary}, gradients=${hasGradient}`);
  }
});
