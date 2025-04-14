import { load } from 'cheerio'

export type NutrientSection = {
  calories: number | null
  protein: number | null
  fat: number | null
  carbs: number | null
}

export type NutritionData = {
  dish: NutrientSection
  portion: NutrientSection
  per100g: NutrientSection
}

const SECTION_MAPPING: Record<string, keyof NutritionData> = {
  'Готового блюда': 'dish',
  Порции: 'portion',
  '100 г блюда': 'per100g'
}

/**
 * Extract nutritional information from HTML
 */
export const extractNutritionData = (html: string): NutritionData => {
  const result: NutritionData = {
    dish: { calories: null, protein: null, fat: null, carbs: null },
    portion: { calories: null, protein: null, fat: null, carbs: null },
    per100g: { calories: null, protein: null, fat: null, carbs: null }
  }

  const extractNumericValue = (text: string): number | null => {
    const match = text.match(/[\d.]+/)
    return match ? Number.parseFloat(match[0]) : null
  }

  const $ = load(html)
  const rows = $('table tr')
  let currentSection: keyof NutritionData | '' = ''

  rows.each((_, row) => {
    const cells = $(row).find('td')

    // Check if this is a section header row
    if (cells.length === 1 && $(cells).hasClass('nae-title')) {
      const titleText = $(cells).text().trim()

      for (const [key, value] of Object.entries(SECTION_MAPPING)) {
        if (titleText.includes(key)) {
          currentSection = value
          break
        }
      }
    } else if (cells.length === 4 && currentSection) {
      const sectionData = result[currentSection]

      sectionData.calories = extractNumericValue($(cells[0]).find('strong').text().trim())
      sectionData.protein = extractNumericValue($(cells[1]).find('strong').text().trim())
      sectionData.fat = extractNumericValue($(cells[2]).find('strong').text().trim())
      sectionData.carbs = extractNumericValue($(cells[3]).find('strong').text().trim())
    }
  })

  return result
}
