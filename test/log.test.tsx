import logger from "../src/log"
import { keys } from "ramda"

describe("logger", () => {
  it("has functions for different levels", () => {
    expect(logger).toMatchObject({
      debug: expect.any(Function),
      verbose: expect.any(Function),
      info: expect.any(Function),
      warn: expect.any(Function),
      error: expect.any(Function),
    })
  })

  it("runs without throwing exceptions", () => {
    keys(logger).forEach((k: string) => {
      expect(() => logger[k]).not.toThrowError()
    })
  })
})
