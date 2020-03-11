import { pipe } from "ramda"
import { useDispatch } from "react-redux"
import { ActionCreator, compose } from "redux"
import {
  createPgRestActionDelete,
  createPgRestActionGet,
  createPgRestActionPatch,
  createPgRestActionPost,
} from "./actionCreators"
import { PgRestAction } from "./PgRestAction"

export function makePgRestHooks(type: string) {
  return {
    get: makePgRestHookGet(type),
    post: makePgRestHookPost(type),
    patch: makePgRestHookPatch(type),
    delete: makePgRestHookDelete(type),
  }
}

export function makePgRestHookGet(type: string) {
  return createDispatchHookFn(
    createPgRestActionGet(type),
    formatPgRestHookName("Get", type),
  )
}

export function makePgRestHookPost(type: string) {
  return createDispatchHookFn(
    createPgRestActionPost(type),
    formatPgRestHookName("Post", type),
  )
}

export function makePgRestHookPatch(type: string) {
  return createDispatchHookFn(
    createPgRestActionPatch(type),
    formatPgRestHookName("Patch", type),
  )
}

export function makePgRestHookDelete(type: string) {
  return createDispatchHookFn(
    createPgRestActionDelete(type),
    formatPgRestHookName("Delete", type),
  )
}

function createDispatchHookFn(
  actionCreator: ActionCreator<PgRestAction>,
  fnName: string,
) {
  const hookFn = () => {
    const dispatch = useDispatch()
    return compose(dispatch, actionCreator) as (...args: any[]) => void
  }

  Object.defineProperty(hookFn, "name", { value: fnName })

  return hookFn
}

function formatPgRestHookName(verb: string, type: string) {
  return `usePgRest${verb}(${type})`
}
