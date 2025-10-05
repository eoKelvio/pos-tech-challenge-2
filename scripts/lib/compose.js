const { spawnSync } = require('child_process');

function resolveComposeCommand() {
  const isWin = process.platform === 'win32';
  const tryV1 = spawnSync('docker-compose', ['version'], { shell: isWin });
  if (tryV1.status === 0) return { cmd: 'docker-compose', args: [] };
  const tryV2 = spawnSync('docker', ['compose', 'version'], { shell: isWin });
  if (tryV2.status === 0) return { cmd: 'docker', args: ['compose'] };
  throw new Error('Docker Compose not found (v1 or v2).');
}

module.exports = { resolveComposeCommand };
