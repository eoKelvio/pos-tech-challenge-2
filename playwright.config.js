// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Diretório onde estão os testes
  testDir: './tests',

  // Timeout global para cada teste
  timeout: 60 * 1000,

  // Timeout para expectativas
  expect: {
    timeout: 10 * 1000,
  },

  // Executar testes em paralelo
  fullyParallel: true,

  // Não executar testes se houver falha no CI
  forbidOnly: !!process.env.CI,

  // Tentativas em caso de falha
  retries: process.env.CI ? 2 : 0,

  // Workers para execução paralela
  workers: process.env.CI ? 1 : undefined,

  // Relatório de testes
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Configurações globais
  use: {
    // URL base da aplicação
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Rastreamento de erros
    trace: 'on-first-retry',

    // Screenshots em caso de falha
    screenshot: 'only-on-failure',

    // Vídeo em caso de falha
    video: 'retain-on-failure',
  },

  // Configuração dos projetos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // // Testes em dispositivos móveis (opcional)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Configuração do servidor para garantir ambiente saudável antes dos testes
  webServer: {
    // Sobe dependências e app via script que cria DB efêmero
    command: 'node scripts/start-test-env.js',

    // URL de healthcheck (Playwright aguarda até ficar disponível)
    url: 'http://localhost:3000/health',

    // Tempo para aguardar o servidor subir
    timeout: 180 * 1000,

    // Reutiliza servidor local fora do CI para acelerar o ciclo local
    reuseExistingServer: !process.env.CI,
  },
  // Teardown global para encerrar dependências (ex.: containers) ao fim dos testes
  globalTeardown: require.resolve('./tests/global-teardown.js'),
});
