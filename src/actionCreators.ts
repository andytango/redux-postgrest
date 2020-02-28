import { PgRestAction } from "./PgRestAction"

export function createPgRestActionGet(type: string) {
  return (query?: object, meta = {}) =>
    ({
      type,
      meta: { query, ...meta },
    } as PgRestAction)
}

export function createPgRestActionPost(type: string) {
  return (body: object, meta = {}) =>
    ({
      type,
      meta: { body, method: "POST", ...meta },
    } as PgRestAction)
}

export function createPgRestActionPatch(type: string) {
  return (query: object, body: object, meta = {}) =>
    ({
      type,
      meta: { query, method: "PATCH", body, ...meta },
    } as PgRestAction)
}

export function createPgRestActionDelete(type: string) {
  return (query: object, meta = {}) =>
    ({
      type,
      meta: { query, method: "DELETE", ...meta },
    } as PgRestAction)
}
