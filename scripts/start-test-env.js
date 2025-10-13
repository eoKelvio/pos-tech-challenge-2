#!/usr/bin/env node

const { spawn } = require('child_process');
const { resolveComposeCommand } = require('./lib/compose');
const { generateDbName, writeEnvFile } = require('./lib/e2e-env');

// Generate unique database name per run
const dbName = generateDbName();

// Defaults with overrides from process.env when present
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';
// Inside Docker network, the hostname must be the service name 'postgres'
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'postgres';
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
const NODE_ENV = 'test';

// Compose uses POSTGRES_DB for cluster init and app uses DATABASE_URL
const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${dbName}?schema=public`;

const envFilePath = writeEnvFile({
  NODE_ENV,
  JWT_SECRET,
  POSTGRES_DB: dbName,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  DATABASE_URL,
});
console.log(`[e2e] Using database: ${dbName}`);
console.log(`[e2e] Env file written at ${envFilePath}`);

const composeCmd = resolveComposeCommand();

// Start docker compose in foreground with the generated env file
const compose = spawn(
  composeCmd.cmd,
  [...composeCmd.args, '--env-file', envFilePath, 'up'],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

const shutdown = () => {
  // Let Playwright's global teardown handle stopping containers and volume cleanup
  compose.kill();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

compose.on('exit', (code) => {
  process.exit(code ?? 0);
});
