/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  collectCoverageFrom: [
    'src/features/auth/components/RouteGuards.tsx',
    'src/lib/recommendationEngine.ts',
    'src/lib/internationalResources.ts',
  ],
};

export default config;