import type { RouteHandler } from '~/types.ts'

export const defaultHandler: RouteHandler = async ({ request, log }) => {
  log.warning(`Not mapped route: ${request.loadedUrl}`)
}
