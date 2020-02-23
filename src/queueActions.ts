import { Action } from "redux"
import { ActionHandler } from "./ActionHandler"
import logger from "./log"

export default function queueActions(
  actionHandlerFn: () => Promise<ActionHandler>,
): ActionHandler {
  const queue = [] as Action[]

  let actionHandler = (action: Action) => {
    logger.verbose(`Queuing action of type ${action.type}`)
    queue.push(action)
    return action
  }

  actionHandlerFn().then(handler => {
    actionHandler = handler
    logger.info("Endpoint loaded, handling queued actions...")
    processQueuedActions(queue, actionHandler)
  })

  return action => actionHandler(action)
}

function processQueuedActions(queue: Action[], handler: ActionHandler) {
  while (queue.length) {
    const action = queue.shift()
    if (action) {
      logger.verbose(`Handling queued action of type ${action.type}`)
      handler(action)
    }
  }
}
