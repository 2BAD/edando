import type { CheerioCrawlingContext, Dictionary } from 'crawlee'

export type RouteHandler<UserData extends Dictionary = Dictionary, JSONData extends Dictionary = Dictionary> = (
  context: CheerioCrawlingContext<UserData, JSONData>
) => Promise<void>

export type RouteHandlersMap<
  UserData extends Dictionary = Dictionary,
  JSONData extends Dictionary = Dictionary
> = Record<string, RouteHandler<UserData, JSONData>>
