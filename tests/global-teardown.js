const { execSync } = require('node:child_process');
const path = require('path');
const { resolveComposeCommand } = require('../scripts/lib/compose');

module.exports = async () => {
  try {
    // Remove containers and named volumes; respect env file if present
    const envFile = path.resolve(process.cwd(), '.env.e2e');
    const composeCmd = resolveComposeCommand();
    try {
      execSync(
        `${composeCmd.cmd} ${composeCmd.args.join(' ')} --env-file "${envFile}" down -v`,
        {
          stdio: 'inherit',
        },
      );
    } catch (_) {
      // fallback without env-file
      execSync(`${composeCmd.cmd} ${composeCmd.args.join(' ')} down -v`, {
        stdio: 'inherit',
      });
    }
  } catch (_) {
    // ignore teardown failures
  }
};
