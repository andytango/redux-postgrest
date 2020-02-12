import Axios from "axios"
import connectPostgrest from "../src/main"
describe("connectPostgrest", () => {
  it("returns a middleware", () => {
    expect(
      connectPostgrest({ http: Axios, url: "http://localhost:3000" }),
    ).toBeInstanceOf(Function)
  })
})
