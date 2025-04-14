import { describe, expect, it } from 'vitest'
import { extractIngredients } from './ingredients.ts'

describe('extractIngredients', () => {
  // Example HTML input that would typically come from a web scraper
  const html = `
    <div class="ingredients-bl">
      <ul>
        <li itemprop="recipeIngredient">
          <a href="https://www.povarenok.ru/recipes/ingredient/1177/">
            <span>Мясо</span>
          </a>
          (суповой набор)
          —
          <span>950 г</span>
        </li>
        <li itemprop="recipeIngredient">
          <a href="https://www.povarenok.ru/recipes/ingredient/1608/">
            <span>Свекла</span>
          </a>
          (300 грамм)
          —
          <span>2 шт</span>
        </li>
        <li itemprop="recipeIngredient">
          <a href="https://www.povarenok.ru/recipes/ingredient/1067/">
            <span>Масло растительное</span>
          </a>
          (для пассировки, плюс 2 ст.л. для тушения свеклы.)
        </li>
      </ul>
    </div>
  `

  // HTML with no ingredients data
  const htmlWithNoData = '<div><h2>A recipe with no ingredients</h2></div>'

  it('should extract ingredients correctly', () => {
    const result = extractIngredients(html)

    expect(result).toHaveLength(3)

    expect(result[0]).toEqual({
      name: 'Мясо',
      amount: '950 г',
      notes: 'суповой набор',
      url: 'https://www.povarenok.ru/recipes/ingredient/1177/',
      id: 1177,
      section: null
    })

    expect(result[1]).toEqual({
      name: 'Свекла',
      amount: '2 шт',
      notes: '300 грамм',
      url: 'https://www.povarenok.ru/recipes/ingredient/1608/',
      id: 1608,
      section: null
    })

    expect(result[2]).toEqual({
      name: 'Масло растительное',
      amount: null,
      notes: 'для пассировки, плюс 2 ст.л. для тушения свеклы.',
      url: 'https://www.povarenok.ru/recipes/ingredient/1067/',
      id: 1067,
      section: null
    })
  })

  it('should return empty array when no ingredients are present', () => {
    const result = extractIngredients(htmlWithNoData)
    expect(result).toEqual([])
  })

  it('should correctly handle ingredients with missing properties', () => {
    const htmlWithMissingProps = `
      <div class="ingredients-bl">
        <ul>
          <li itemprop="recipeIngredient">
            <a href="https://www.povarenok.ru/recipes/ingredient/1681/">
              <span>Соль</span>
            </a>
            —
            <span> по вкусу</span>
          </li>
        </ul>
      </div>
    `

    const result = extractIngredients(htmlWithMissingProps)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      name: 'Соль',
      amount: 'по вкусу',
      notes: null,
      url: 'https://www.povarenok.ru/recipes/ingredient/1681/',
      id: 1681,
      section: null
    })
  })

  it('should handle sectioned ingredient lists', () => {
    const htmlWithSections = `
      <div class="ingredients-bl">
        <p><strong>First Section:</strong></p>
        <ul>
          <li itemprop="recipeIngredient">
            <a href="https://www.povarenok.ru/recipes/ingredient/1177/">
              <span>Мясо</span>
            </a>
            —
            <span>100 г</span>
          </li>
        </ul>
        <p><strong>Second Section</strong></p>
        <ul>
          <li itemprop="recipeIngredient">
            <a href="https://www.povarenok.ru/recipes/ingredient/1608/">
              <span>Свекла</span>
            </a>
            —
            <span>200 г</span>
          </li>
        </ul>
      </div>
    `

    const result = extractIngredients(htmlWithSections)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'Мясо',
      amount: '100 г',
      notes: null,
      url: 'https://www.povarenok.ru/recipes/ingredient/1177/',
      id: 1177,
      section: 'First Section'
    })

    expect(result[1]).toEqual({
      name: 'Свекла',
      amount: '200 г',
      notes: null,
      url: 'https://www.povarenok.ru/recipes/ingredient/1608/',
      id: 1608,
      section: 'Second Section'
    })
  })
})
