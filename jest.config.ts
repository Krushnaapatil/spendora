import type {
  Config,
} from "jest";

const config: Config = {
  preset: "ts-jest",

  testEnvironment:
    "node",

  roots: [
    "<rootDir>/__tests__",
  ],

  moduleNameMapper: {
    "^@/(.*)$":
      "<rootDir>/$1",
  },

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
  ],

  clearMocks: true,

  collectCoverage: false,
};

export default config;