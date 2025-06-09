#!/usr/bin/env node

/**
 * Terminal Wellbeing AI Project Management Script
 * 
 * This script handles all project management tasks including:
 * - Cleaning up project files
 * - Running development server
 * - Building for production
 * - Running tests
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

/**
 * Helper functions
 */
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function removeFiles(pattern) {
  const files = findFiles(pattern);
  files.forEach(file => {
    try {
      fs.unlinkSync(file);
      console.log(`Removed: ${file}`);
    } catch (error) {
      console.error(`Error removing ${file}: ${error.message}`);
    }
  });
}

function findFiles(pattern, dir = process.cwd()) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      // Recursively search directories
      results = results.concat(findFiles(pattern, filePath));
    } else if (file.match(pattern)) {
      results.push(filePath);
    }
  });
  
  return results;
}

function renameFiles(fromPattern, transform) {
  const files = findFiles(fromPattern);
  files.forEach(file => {
    const newName = transform(file);
    try {
      fs.renameSync(file, newName);
      console.log(`Renamed: ${file} → ${newName}`);
    } catch (error) {
      console.error(`Error renaming ${file}: ${error.message}`);
    }
  });
}

/**
 * Command implementations
 */
function cleanup() {
  console.log('Cleaning up project files...');
  
  // Remove all .bak files
  removeFiles(/\.bak$/);
  
  // Remove all script files except this one
  findFiles(/\.(ps1|sh)$/).forEach(file => {
    fs.unlinkSync(file);
    console.log(`Removed script: ${file}`);
  });
  
  // Rename all .new files to remove the extension
  renameFiles(/\.new$/, file => file.replace(/\.new$/, ''));
  
  // Remove unnecessary configuration files
  const unnecessaryConfigs = [
    'postcss.config.js',
    'tailwind.config.js',
    '.eslintrc.cjs',
    'tsconfig.node.json'
  ];
  
  unnecessaryConfigs.forEach(configFile => {
    const filePath = path.join(process.cwd(), configFile);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed unnecessary config: ${configFile}`);
    }
  });
  
  // Remove the old cleanup script
  const oldCleanupScript = path.join(__dirname, 'cleanup.js');
  if (fs.existsSync(oldCleanupScript)) {
    fs.unlinkSync(oldCleanupScript);
    console.log('Removed old cleanup.js script');
  }
  
  console.log('Cleanup completed!');
}

function dev() {
  console.log('Starting development server...');
  executeCommand('npm run dev');
}

function build() {
  console.log('Building for production...');
  executeCommand('npm run build');
}

function test() {
  console.log('Running tests...');
  executeCommand('npm test');
}

function coverage() {
  console.log('Running tests with coverage...');
  executeCommand('npm run test:coverage');
}

function help() {
  console.log(`
Terminal Wellbeing AI Project Management Script

Usage: node scripts/manage.js [command]

Commands:
  cleanup    - Clean up project files (remove .bak files, rename .new files)
  dev        - Start development server
  build      - Build for production
  test       - Run tests
  coverage   - Run tests with coverage
  help       - Show this help message
`);
}

/**
 * Command router
 */
switch (command) {
  case 'cleanup':
    cleanup();
    break;
  case 'dev':
    dev();
    break;
  case 'build':
    build();
    break;
  case 'test':
    test();
    break;
  case 'coverage':
    coverage();
    break;
  case 'help':
  default:
    help();
    break;
}

// For ES modules, we need to export the functions
export { cleanup, dev, build, test, coverage, help };
