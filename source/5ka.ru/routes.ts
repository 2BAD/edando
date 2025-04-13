import { createBasicRouter } from 'crawlee'
import { Catalog } from './types/category.ts'
import { DetailedProduct, ProductCategory } from './types/product.ts'

export const router = createBasicRouter()

router.addDefaultHandler(async ({ request, log }) => {
  log.warning(`Processing not mapped route: ${request.loadedUrl}`)
})

router.addHandler('catalog', async ({ request, sendRequest, log, pushData, addRequests }) => {
  log.info(`Processing root catalog: ${request.url}`)
  const res = await sendRequest()

  const data = JSON.parse(res.body)
  const catalog = Catalog.parse(data)
  for (const category of catalog) {
    await pushData(category, 'categories')
    await addRequests([
      {
        url: `https://5d.5ka.ru/api/catalog/v2/stores/Y232/categories/${category.id}/products?mode=delivery&include_restrict=true&limit=12`,
        label: 'category',
        userData: {
          title: category.name
        }
      }
    ])
  }
})

router.addHandler('category', async ({ request, sendRequest, log, addRequests }) => {
  log.info(`Processing category "${request.userData['title']}"`)
  const res = await sendRequest()

  const data = JSON.parse(res.body)
  const category = ProductCategory.parse(data)
  if (category.products.length > 0) {
    for (const product of category.products) {
      await addRequests([
        {
          url: `https://5d.5ka.ru/api/catalog/v2/stores/Y232/products/${product.plu}?mode=delivery&include_restrict=true`,
          label: 'product',
          userData: {
            title: product.name
          }
        }
      ])
    }
  }
})

router.addHandler('product', async ({ request, sendRequest, log, pushData }) => {
  log.info(`Processing product "${request.userData['title']}"`)
  const res = await sendRequest()

  const data = JSON.parse(res.body)
  const product = DetailedProduct.parse(data)
  await pushData(product, 'products')
})
