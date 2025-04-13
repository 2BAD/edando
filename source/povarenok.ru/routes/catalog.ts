import type { RouteHandler } from '~/types.ts'

export const catalogHandler: RouteHandler = async ({ request, log, enqueueLinks }) => {
  log.info(`Processing catalog root: ${request.url}`)

  await enqueueLinks({
    regexps: [/^https:\/\/www\.povarenok\.ru\/recipes\/category\/\d+\/$/],
    label: 'category'
  })
}
