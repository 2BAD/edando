import type { RouteHandler } from '~/types.ts'

const RECIPES_PER_PAGE = 15

export const categoryHandler: RouteHandler = async ({ request, $, log, enqueueLinks }) => {
  log.info(`Processing category: ${request.url}`)

  // pagination
  if (!request.url.includes('~')) {
    const total = Number.parseInt($('div.bl-right strong').text())
    const urls = Array.from({ length: Math.ceil(total / RECIPES_PER_PAGE) }).map((_, i) => `${request.url}~${i + 1}/`)

    await enqueueLinks({
      urls,
      label: 'category'
    })
  }

  // recipe page
  await enqueueLinks({
    regexps: [/^https:\/\/www\.povarenok\.ru\/recipes\/show\/\d+\/$/],
    label: 'recipe'
  })
}
