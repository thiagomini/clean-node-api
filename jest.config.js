/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: '@shelf/jest-mongodb',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/.interface.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    // RegExp used to map any module like @/domain to the actual file under src/domain.
    '@/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['jest-extended/all'],
}
