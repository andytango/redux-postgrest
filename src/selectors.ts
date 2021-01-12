import { has, identity, ifElse, pathOr, pipe } from "ramda"
import { HttpMethod } from "./http"

type PgRestResourceSelector = (
  resource: string,
) => (state: any) => typeof state | NullResource

type NullResource = null

export interface PgRestResourceSelectors {
  get: PgRestResourceSelector
  post: PgRestResourceSelector
  patch: PgRestResourceSelector
  delete: PgRestResourceSelector
}

export function createPgRestSelectors(
  reducerKey?: string,
): PgRestResourceSelectors {
  const createSelectorFactoryForMethod = createSelectorFactoryForReducer(
    reducerKey,
  )
  return {
    get: createSelectorFactoryForMethod(HttpMethod.GET),
    post: createSelectorFactoryForMethod(HttpMethod.POST),
    patch: createSelectorFactoryForMethod(HttpMethod.PATCH),
    delete: createSelectorFactoryForMethod(HttpMethod.DELETE),
  }
}

type ReducerKeyValidator = (state: any) => typeof state

function createReducerPathChecker(
  reducerKey: string | undefined,
): ReducerKeyValidator {
  if (reducerKey) {
    return ifElse(has(reducerKey), identity, () => {
      throw new Error(`Reducer state with key '${reducerKey}' not found'`)
    })
  }

  return identity
}

function createSelectorFactoryForReducer(
  reducerKey: string | undefined,
): PgRestResourceSelector {
  if (reducerKey) {
    return (method: HttpMethod) => (resource: string) =>
      pipe(
        createReducerPathChecker(reducerKey),
        pathOr(null as NullResource, [reducerKey, resource, method]),
      )
  }

  return (method: HttpMethod) => (resource: string) =>
    pipe(
      createReducerPathChecker(reducerKey),
      pathOr(null as NullResource, [resource, method]),
    )
}
