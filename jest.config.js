/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: '@shelf/jest-mongodb',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
