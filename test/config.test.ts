import requireEnvVar from "../src/config"

describe("requireEnvVar", () => {
  it("returns the value if defined", () => {
    expect(() => requireEnvVar("exampleEnvVar")).toThrowError(
      `Required environment variable exampleEnvVar is undefined`,
    )
  })

  it("throws an error if defined", () => {
    process.env.exampleEnvVar = "exampleVal"
    expect(requireEnvVar("exampleEnvVar")).toEqual("exampleVal")
  })
})
