/* eslint-disable @stylistic/indent */
import type { RouteHandler } from '~/types.ts'
import { parseRussianDate } from '~/utils/date.ts'
import { cleanupHtmlWhitespace } from '~/utils/html.ts'
import { parseRussianCookingTime } from '~/utils/time.ts'
import { extractIngredients } from '../extractors/ingredients.ts'
import { extractNutritionData } from '../extractors/nutrients.ts'
import { resourceId } from '../extractors/resourceId.ts'

export const recipeHandler: RouteHandler = async ({ request, log, $, pushData }) => {
  log.info(`Processing recipe: ${request.url}`)

  // Find the article container
  const $article = $('.item-about')
  const $header = $('.article-header')

  const id = Number.parseInt(new URL(request.url).pathname.split('/').filter(Boolean).pop() ?? '')

  const authorName = $header.find('span[itemprop="author"]').text().trim()
  const authorUrl = $header.find('.user-info-main a').attr('href') || ''
  const publishDate = parseRussianDate($header.find('.article-header .i-time').text().trim())
  const views = Number.parseInt($header.find('.i-views').text().trim())

  const title = $article.find('h1[itemprop="name"]').text().trim()
  const mainImage = $article.find('div.m-img img').first().attr('src') || ''
  const parsedTime = parseRussianCookingTime($article.find('time[itemprop="totalTime"]').text().trim())
  const cookingTime = parsedTime.minutes !== 0 ? parsedTime : null
  const servings = Number.parseInt($article.find('span[itemprop="recipeYield"]').text().trim())
  const $nutrition = $article.find('div[itemprop="nutrition"]').first()
  const nutrients = extractNutritionData($nutrition.html() ?? '')
  const $ingredients = $article.find('div.ingredients-bl').first()
  const ingredients = extractIngredients($ingredients.toString() ?? '')

  const description = $('div[itemprop="description"]').text().trim()

  const steps = $article
    .find('.cooking-bl')
    .map((index, element) => {
      const el = $(element)

      return {
        step: index + 1,
        text: el.find('p').text().trim(),
        image: el.find('img').attr('src') || ''
      }
    })
    .get()

  const categories = $('span[itemprop="recipeCategory"] a')
    .map((_, el) => ({
      name: $(el).text().trim(),
      url: $(el).attr('href') || '', // https://www.povarenok.ru/recipes/category/{id}/
      id: resourceId($(el).attr('href') || '')
    }))
    .get()
  const $tagsList = $('div.tab-content p:nth-child(2)')
  const tags =
    $tagsList.find('b').text().trim() === 'Теги:'
      ? $tagsList
          .find('a')
          .map((_, el) => ({
            name: $(el).text().trim(),
            url: $(el).attr('href') || '', // https://www.povarenok.ru/recipes/tag/{id}/
            id: resourceId($(el).attr('href') || '')
          }))
          .get()
      : []

  const $flavorsList = $('div.tab-content p:nth-child(3)')
  const flavors =
    $flavorsList.find('b').text().trim() === 'Вкусы:'
      ? $flavorsList
          .find('a')
          .map((_, el) => ({
            name: $(el).text().trim(),
            url: $(el).attr('href') || '', // https://www.povarenok.ru/recipes/tag/{id}/
            id: resourceId($(el).attr('href') || '')
          }))
          .get()
      : []

  // Create the recipe object
  const recipe = {
    id,
    source: request.url,
    title,
    mainImage,
    author: {
      name: authorName,
      url: authorUrl
    },
    publishDate,
    views,
    cookingTime,
    // cookingMethod,
    servings,
    nutrients,
    description,
    ingredients,
    steps,
    categories,
    tags,
    flavors
    // difficulty,
    // rating: {
    //   value: ratingValue,
    //   count: ratingCount
    // }
  }

  const dump = {
    id,
    html: cleanupHtmlWhitespace($article.html() ?? '')
  }

  await pushData(recipe, 'recipes')
  await pushData(dump, 'dumps')
}
