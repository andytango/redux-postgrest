import { Action, createStore } from "redux"
import queueActions from "../src/queueActions"
import { identity } from "ramda"

describe("queueActions", () => {
  it("invokes the action handler promise", () => {
    const mockActionHandlerFn = jest.fn(() =>
      Promise.resolve((a: Action) => null),
    )
    const store = createStore(identity)

    queueActions(mockActionHandlerFn)
    expect(mockActionHandlerFn).toHaveBeenCalled()
  })

  it("passes actions to the handler once it has resolved", done => {
    const mockActionHandler = jest.fn((a: Action) => null)
    const mockActionHandlerFn = jest.fn(() =>
      Promise.resolve(mockActionHandler),
    )
    const exampleAction1 = { type: "EXAMPLE_ACTION_1" }
    const exampleAction2 = { type: "EXAMPLE_ACTION_2" }

    const queueHandler = queueActions(mockActionHandlerFn)
    queueHandler(exampleAction1)
    queueHandler(exampleAction2)

    setImmediate(() => {
      expect(mockActionHandler).toHaveBeenNthCalledWith(1, exampleAction1)
      expect(mockActionHandler).toHaveBeenNthCalledWith(2, exampleAction2)
      done()
    })
  })
})
