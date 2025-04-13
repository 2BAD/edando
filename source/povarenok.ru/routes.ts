import { createCheerioRouter } from 'crawlee'
import { catalogHandler, categoryHandler, defaultHandler, recipeHandler } from './routes/index.ts'

export const router = createCheerioRouter()

router.addDefaultHandler(defaultHandler)
router.addHandler('catalog', catalogHandler)
router.addHandler('category', categoryHandler)
router.addHandler('recipe', recipeHandler)
