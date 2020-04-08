module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  testMatch: ["**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  cacheDirectory: "./tmp/.jest_cache",
}
