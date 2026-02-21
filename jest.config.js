/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle CSS imports
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock transformers to avoid ESM/import.meta issues
    '^@huggingface/transformers$': '<rootDir>/__mocks__/@huggingface/transformers.js',
    // Mock PWA registration
    '^virtual:pwa-register/react$': '<rootDir>/__mocks__/pwaRegisterMock.js',
    // Mock Worker Factory to avoid import.meta issues in Jest
    'workerFactory$': '<rootDir>/__mocks__/workerFactoryMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      useESM: true
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@huggingface|@radix-ui|lucide-react)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
