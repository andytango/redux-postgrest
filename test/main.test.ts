import * as pgRest from "../src/main"

describe("pgRest module", () => {
  it("exports functions", () => {
    expect(pgRest).toEqual({
      connectPgRest: expect.any(Function),
      createPgRestActions: expect.any(Function),
      createPgRestActionGet: expect.any(Function),
      createPgRestActionPost: expect.any(Function),
      createPgRestActionPatch: expect.any(Function),
      createPgRestActionDelete: expect.any(Function),
      createPgRestSelectors: expect.any(Function),
      makePgRestHooks: expect.any(Function),
      makePgRestHookGet: expect.any(Function),
      makePgRestHookPost: expect.any(Function),
      makePgRestHookPatch: expect.any(Function),
      makePgRestHookDelete: expect.any(Function),
    })
  })
})
