const fs = require('fs');
const path = require('path');

const PROJECTS = [
  { name: 'store_backend', dir: path.join(__dirname, '..', 'store_backend', 'src') },
  { name: 'store-management-system', dir: path.join(__dirname, '..', 'store-management-system', 'src') },
  { name: 'store-web', dir: path.join(__dirname, '..', 'store-web', 'src') },
];

const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist', '.git', 'coverage', '.vscode']);

function scanDirectory(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        results = results.concat(scanDirectory(path.join(dir, entry.name)));
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      const fullPath = path.join(dir, entry.name);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split(/\r?\n/).length;
        results.push({
          file: fullPath,
          name: entry.name,
          lines,
        });
      } catch (err) {
        // Skip unreadable files
      }
    }
  }
  return results;
}

function analyzeFiles(files, rootDir) {
  const buckets = {
    compact: 0,   // < 100
    medium: 0,    // 100 - 249
    large: 0,     // 250 - 499
    monolith: 0,  // >= 500
  };

  let totalLines = 0;
  for (const f of files) {
    totalLines += f.lines;
    if (f.lines < 100) buckets.compact++;
    else if (f.lines < 250) buckets.medium++;
    else if (f.lines < 500) buckets.large++;
    else buckets.monolith++;
  }

  const sorted = [...files].sort((a, b) => b.lines - a.lines);
  const avg = files.length > 0 ? Math.round(totalLines / files.length) : 0;

  return {
    count: files.length,
    totalLines,
    avgLines: avg,
    buckets,
    topLargest: sorted.slice(0, 10).map((f) => ({
      relPath: path.relative(rootDir, f.file).replace(/\\/g, '/'),
      lines: f.lines,
    })),
  };
}

function runAudit() {
  const rootDir = path.resolve(__dirname, '..');
  console.log('='.repeat(78));
  console.log('       RICKY MOBILE STORE — MONOREPO FILE LENGTH & CODE HEALTH AUDIT       ');
  console.log('='.repeat(78));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('');

  let allFiles = [];

  for (const project of PROJECTS) {
    const files = scanDirectory(project.dir);
    allFiles = allFiles.concat(files);
    const analysis = analyzeFiles(files, rootDir);

    console.log(`[SUBSYSTEM: ${project.name}]`);
    console.log(`  Source Files:       ${analysis.count}`);
    console.log(`  Total Lines:        ${analysis.totalLines.toLocaleString()}`);
    console.log(`  Average Lines/File: ${analysis.avgLines}`);
    console.log(`  Distribution:`);
    console.log(`    🟢 Compact   (< 100 lines):    ${analysis.buckets.compact} files (${analysis.count > 0 ? Math.round((analysis.buckets.compact / analysis.count) * 100) : 0}%)`);
    console.log(`    🟡 Medium    (100–249 lines):  ${analysis.buckets.medium} files`);
    console.log(`    🟠 Large     (250–499 lines):  ${analysis.buckets.large} files`);
    console.log(`    🔴 Monoliths (>= 500 lines):   ${analysis.buckets.monolith} files`);

    if (analysis.topLargest.length > 0) {
      console.log(`  Top Largest Files:`);
      analysis.topLargest.slice(0, 5).forEach((f, i) => {
        console.log(`    ${i + 1}. [${f.lines.toString().padStart(4, ' ')} lines] ${f.relPath}`);
      });
    }
    console.log('-'.repeat(78));
  }

  const grandAnalysis = analyzeFiles(allFiles, rootDir);
  console.log('MONOREPO TOTALS:');
  console.log(`  Total Source Files:  ${grandAnalysis.count}`);
  console.log(`  Total Lines of Code: ${grandAnalysis.totalLines.toLocaleString()}`);
  console.log(`  Average Lines/File:  ${grandAnalysis.avgLines}`);
  console.log(`  Compact Ratio:       ${Math.round((grandAnalysis.buckets.compact / grandAnalysis.count) * 100)}% (< 100 lines)`);
  console.log(`  Monolith Count:      ${grandAnalysis.buckets.monolith} files (>= 500 lines)`);
  console.log('');
  console.log('TOP 10 LARGEST MONOLITHS ACROSS MONOREPO:');
  grandAnalysis.topLargest.slice(0, 10).forEach((f, i) => {
    const status = f.lines >= 500 ? '🔴' : f.lines >= 250 ? '🟠' : '🟡';
    console.log(`  ${(i + 1).toString().padStart(2, ' ')}. ${status} ${f.lines.toString().padStart(4, ' ')} lines  ${f.relPath}`);
  });
  console.log('='.repeat(78));
}

runAudit();
