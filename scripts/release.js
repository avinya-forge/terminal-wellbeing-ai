import fs from 'fs';
import path from 'path';

// Define paths
const packageJsonPath = path.join(process.cwd(), 'package.json');
const readmePath = path.join(process.cwd(), 'README.md');
const releaseNotesPath = path.join(process.cwd(), 'docs/release-notes.md');

// Read package.json to get the version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Update README.md
let readmeContent = fs.readFileSync(readmePath, 'utf8');
readmeContent = readmeContent.replace(/!\[version\]\(https:\/\/img\.shields\.io\/badge\/version-v[^_]+-green\)/, `![version](https://img.shields.io/badge/version-v${version}-green)`);
readmeContent = readmeContent.replace(/\| demo 2 \| v[^ ]+ \|/, `| demo 2 | v${version} |`);
fs.writeFileSync(readmePath, readmeContent);

// Append a template to release-notes.md
let releaseNotesContent = fs.readFileSync(releaseNotesPath, 'utf8');
if (!releaseNotesContent.includes(`## v${version}`)) {
  const template = `\n## v${version}\n\n- **Feature:** \n- **Fix:** \n`;
  releaseNotesContent += template;
  fs.writeFileSync(releaseNotesPath, releaseNotesContent);
}

console.log(`Version bumped to ${version} across README.md and release-notes.md`);
