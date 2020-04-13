import { has, identity, ifElse, pathOr, pipe } from "ramda"
import { HttpMethod } from "./http"

export interface PgRestSelectors {
  get: (resource: string) => (state: object) => object | null
  post: (resource: string) => (state: object) => object | null
  patch: (resource: string) => (state: object) => object | null
  delete: (resource: string) => (state: object) => object | null
}

export function createPgRestSelectors(reducerKey?: string): PgRestSelectors {
  const createSelector = createSelectorFn(reducerKey)
  return {
    get: createSelector(HttpMethod.GET),
    post: createSelector(HttpMethod.POST),
    patch: createSelector(HttpMethod.PATCH),
    delete: createSelector(HttpMethod.DELETE),
  }
}

type ReducerKeyValidator = (state: object) => object

function createReducerPathCheck(
  reducerKey: string | undefined,
): ReducerKeyValidator {
  if (reducerKey) {
    return ifElse(has(reducerKey), identity, () => {
      throw new Error(`Reducer state with key '${reducerKey}' not found'`)
    })
  }

  return identity
}

function createSelectorFn(reducerKey: string | undefined) {
  const checkReducerPath = createReducerPathCheck(reducerKey)

  if (reducerKey) {
    return (method: HttpMethod) => (resource: string) =>
      pipe(checkReducerPath, pathOr(null, [reducerKey, resource, method]))
  }

  return (method: HttpMethod) => (resource: string) =>
    pipe(checkReducerPath, pathOr(null, [resource, method]))
}
