module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/apps'],
  testMatch: ['**/__tests__/**/*.integration.test.ts', '**/?(*.)+(integration.spec|integration.test).ts'],
  collectCoverageFrom: [
    'packages/**/src/**/*.ts',
    'apps/**/src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  moduleNameMapper: {
    '^@trutalk/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@trutalk/backend/(.*)$': '<rootDir>/packages/backend/src/$1',
    '^@trutalk/ai/(.*)$': '<rootDir>/packages/ai/src/$1',
  },
  // Integration tests may need longer timeouts
  testTimeout: 30000,
};
