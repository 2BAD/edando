import { HttpCrawler } from 'crawlee'
import { router } from './povarenok.ru/routes.ts'

const crawler = new HttpCrawler({
  maxConcurrency: 1,
  // maxRequestsPerCrawl: 40,
  sessionPoolOptions: {
    maxPoolSize: 1
  },
  requestHandler: router
})

await crawler.run([
  {
    url: 'https://5d.5ka.ru/api/catalog/v2/stores/Y232/categories?mode=delivery&include_subcategories=1&include_restrict=true',
    label: 'catalog'
  }
])

// await Dataset.exportToCSV('categories')
// await Dataset.exportToCSV('products')

// https://5d.5ka.ru/api/catalog/v2/stores/Y232/categories/251C12886/extended?mode=delivery&include_restrict=true
// https://5d.5ka.ru/api/catalog/v2/stores/Y232/categories/251C12886/products?mode=delivery&include_restrict=true&limit=12
// https://5d.5ka.ru/api/catalog/v1/stores/Y232/categories/73C13797/products_line?mode=delivery&include_restrict=true&order_by=popularity
// https://5d.5ka.ru/api/catalog/v2/stores/Y232/promotions?mode=delivery&include_subcategories=1&include_restrict=true
