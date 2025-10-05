const fs = require('fs');
const path = require('path');

function generateDbName() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);
  return `e2e_${timestamp}_${random}`;
}

function writeEnvFile(env) {
  const envFilePath = path.resolve(process.cwd(), '.env.e2e');
  const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`);
  fs.writeFileSync(envFilePath, lines.join('\n'), { encoding: 'utf8' });
  return envFilePath;
}

module.exports = { generateDbName, writeEnvFile };
