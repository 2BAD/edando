import { load } from 'cheerio'

export type Ingredient = {
  name: string
  amount: string | null
  notes: string | null
  url: string | null
  id: number | null
}

/**
 * Extract ingredients information from HTML
 */
export const extractIngredients = (html: string): Ingredient[] => {
  const result: Ingredient[] = []

  const $ = load(html)
  const items = $('.ingredients-bl ul li[itemprop="recipeIngredient"]')

  items.each((_, item) => {
    const ingredientElement = $(item)

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
      id
    })
  })

  return result
}
