module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  setupFiles: ["dotenv/config", "sepia/index"],
  testEnvironment: "node",
  testMatch: ["**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
}
