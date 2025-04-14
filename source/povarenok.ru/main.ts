import { CheerioCrawler } from 'crawlee'
import { router } from './routes.ts'

const crawler = new CheerioCrawler({
  maxConcurrency: 5,
  sessionPoolOptions: {
    maxPoolSize: 5
  },
  requestHandler: router
})

await crawler.run([
  {
    url: 'https://www.povarenok.ru/recipes/search/',
    label: 'catalog'
  }
])

const dataset = await crawler.getDataset('recipes')

await dataset.exportToJSON('recipes.json')
