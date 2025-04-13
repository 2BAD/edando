import type { RouteHandler } from '~/types.ts'

export const categoryHandler: RouteHandler = async ({ request, log, enqueueLinks }) => {
  log.info(`Processing category: ${request.url}`)

  // pagination
  await enqueueLinks({
    regexps: [/^https:\/\/www\.povarenok\.ru\/recipes\/category\/\d+\/~\d+\/$/],
    label: 'category'
  })

  // recipe page
  await enqueueLinks({
    regexps: [/^https:\/\/www\.povarenok\.ru\/recipes\/show\/\d+\/$/],
    label: 'recipe'
  })
}
