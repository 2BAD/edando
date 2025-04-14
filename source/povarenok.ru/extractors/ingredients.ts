import { load } from 'cheerio'

export type Ingredient = {
  name: string
  amount: string | null
  notes: string | null
  url: string | null
  id: number | null
  section: string | null
}

/**
 * Extract ingredients information from HTML
 */
export const extractIngredients = (html: string): Ingredient[] => {
  const result: Ingredient[] = []

  const $ = load(html)
  const ingredientsBlock = $('.ingredients-bl')

  let currentSection: string | null = null

  // Process each child element to handle section headers
  ingredientsBlock.children().each((_, element) => {
    const el = $(element)

    // Check if this is a section header (strong text in p tag)
    if (el.is('p') && el.find('strong').length > 0) {
      currentSection = el.find('strong').text().trim()
      // Remove trailing colon if present
      if (currentSection.endsWith(':')) {
        currentSection = currentSection.slice(0, -1)
      }
    }

    // Process ingredient list if present
    if (el.is('ul')) {
      el.find('li[itemprop="recipeIngredient"]').each((_, item) => {
        const ingredientElement = $(item)

        // Find the first span within an <a> tag for the ingredient name
        const nameElement = ingredientElement.find('a span').first()
        const name = nameElement.text().trim()

        let amount: string | null = null
        // Check if there's a dash in the text which indicates an amount is present
        if (ingredientElement.text().includes('—')) {
          const amountElement = ingredientElement.find('span').last()
          amount = amountElement.text().trim() || null
        }

        // Get notes (text in parentheses)
        let notes: string | null = null
        const itemText = ingredientElement.text()
        const notesMatch = itemText.match(/\(([^)]+)\)/)
        if (notesMatch) {
          notes = notesMatch[1]?.trim() ?? null
        }

        const linkElement = ingredientElement.find('a').first()
        const url = linkElement.attr('href') ?? null
        const id = url ? Number.parseInt(new URL(url).pathname.split('/').filter(Boolean).pop() ?? '') : null

        result.push({
          name,
          amount,
          notes,
          url,
          id,
          section: currentSection
        })
      })
    }
  })

  return result
}
