/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Test environment
  testEnvironment: "jsdom",
  
  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  
  // Coverage
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  
  // Module file extensions
  moduleFileExtensions: [
    "js",
    "jsx", 
    "ts",
    "tsx",
    "json",
    "node"
  ],
  
  // Module name mapping for path aliases and CSS
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  
  // Transform files
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
      },
    }],
  },
  
  // Test match patterns
  testMatch: [
    "**/__tests__/**/*.(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)"
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  
  // Module directories
  moduleDirectories: [
    "node_modules",
    "<rootDir>/src"
  ],
};

module.exports = config;
