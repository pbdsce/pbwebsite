import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  clearMocks: true,

  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/api/**/*.{ts,tsx}",
    "!app/**/api/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testEnvironment: "node",

  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/"
  ],
};

export default createJestConfig(customJestConfig);