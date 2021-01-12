import { createPgRestSelectors } from "../src/selectors"

describe("createPgRestSelectors", () => {
  testAll("get")
  testAll("post")
  testAll("patch")
  testAll("delete")

  function testAll(method: string) {
    testThrowsException(method)
    testNullForNoResource(method)
    testPresentResource(method)
  }

  function testThrowsException(method: string) {
    it(`${method} throws an exception if the reducer key is not present`, () => {
      expect(() =>
        createPgRestSelectors("exampleReducer")[method]("exampleResource")({}),
      ).toThrowError("Reducer state with key 'exampleReducer' not found")
    })
  }

  function testNullForNoResource(method: string) {
    it(`${method} returns null if the resource does not exist`, () => {
      expect(createPgRestSelectors()[method]("exampleResource")({})).toEqual(
        null,
      )

      expect(
        createPgRestSelectors("exampleReducer")[method]("exampleResource")({
          exampleReducer: {},
        }),
      ).toEqual(null)
    })
  }

  function testPresentResource(method: string) {
    it(`${method} returns the resource and method`, () => {
      const exampleState = {
        exampleResource: {
          [method.toUpperCase()]: {
            loading: true,
          },
        },
      }
      expect(
        createPgRestSelectors()[method]("exampleResource")(exampleState),
      ).toEqual({ loading: true })

      expect(
        createPgRestSelectors("exampleReducer")[method]("exampleResource")({
          exampleReducer: exampleState,
        }),
      ).toEqual({ loading: true })
    })
  }
})
