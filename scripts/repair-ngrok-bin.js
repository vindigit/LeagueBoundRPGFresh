const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const projectRoot = process.cwd();
const pkgDir = join(projectRoot, 'node_modules', '@expo', 'ngrok-bin-win32-x64');
const binPath = join(pkgDir, 'ngrok.exe');

if (process.platform !== 'win32' || process.arch !== 'x64') {
  console.log('[repair-ngrok] Skipped: only needed on win32-x64');
  process.exit(0);
}

if (existsSync(binPath)) {
  console.log('[repair-ngrok] ngrok.exe already present');
  process.exit(0);
}

console.log('[repair-ngrok] ngrok.exe missing, restoring from npm tarball...');
if (!existsSync(pkgDir)) {
  mkdirSync(pkgDir, { recursive: true });
}

const tgz = execSync('npm pack @expo/ngrok-bin-win32-x64@2.3.41', { encoding: 'utf8' }).trim().split(/\r?\n/).pop();
execSync(`tar -xf ${tgz} -C "${pkgDir}" --strip-components=1`, { stdio: 'inherit' });
execSync(`cmd /c del /f /q ${tgz}`, { stdio: 'ignore' });

if (!existsSync(binPath)) {
  throw new Error('[repair-ngrok] Restore failed: ngrok.exe still missing');
}

console.log('[repair-ngrok] Restored ngrok.exe');
