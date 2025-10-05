#!/usr/bin/env node

/**
 * Script para setup automático do ambiente de testes
 * Garante que o banco de dados e a aplicação estejam rodando
 */

const { execSync } = require('child_process');
const { waitFor } = require('@playwright/test');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} concluído!`, 'green');
  } catch (error) {
    log(`❌ Erro ao executar: ${description}`, 'red');
    log(`Comando: ${command}`, 'yellow');
    throw error;
  }
}

async function waitForService(url, serviceName, maxAttempts = 30) {
  log(`⏳ Aguardando ${serviceName} ficar disponível...`, 'yellow');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        log(`✅ ${serviceName} está disponível!`, 'green');
        return true;
      }
    } catch (error) {
      // Serviço ainda não está disponível
    }

    log(`Tentativa ${i + 1}/${maxAttempts}...`, 'yellow');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(
    `${serviceName} não ficou disponível após ${maxAttempts} tentativas`,
  );
}

async function setupEnvironment() {
  try {
    log('🚀 Iniciando setup do ambiente de testes...', 'blue');

    // 1. Parar containers existentes
    try {
      execCommand('docker-compose down', 'Parando containers existentes');
    } catch (error) {
      // Ignora erro se não há containers rodando
    }

    // 2. Subir o ambiente com Docker
    execCommand(
      'docker-compose up --build -d',
      'Subindo ambiente com Docker Compose',
    );

    // 3. Aguardar o banco de dados ficar disponível
    await waitForService('http://localhost:5432', 'PostgreSQL');

    // 4. Aguardar a aplicação ficar disponível
    await waitForService('http://localhost:3000/health', 'NestJS Application');

    // 5. Executar migrações do Prisma
    execCommand('npx prisma migrate deploy', 'Executando migrações do Prisma');

    // 6. Gerar cliente Prisma
    execCommand('npx prisma generate', 'Gerando cliente Prisma');

    log('🎉 Ambiente configurado com sucesso!', 'green');
    log(
      '💡 Você pode agora executar os testes com: npm run test:playwright',
      'blue',
    );
  } catch (error) {
    log('💥 Erro durante o setup do ambiente:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };
