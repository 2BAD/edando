import { beforeEach, describe, expect, it } from 'vitest'
import { extractNutritionData, type NutritionData } from './nutrients.ts'

describe('extractNutritionData', () => {
  // Example HTML input that would typically come from a web scraper
  const htmlWithFullData = `
    <div itemprop="nutrition" itemscope="" itemtype="http://schema.org/NutritionInformation">
      <h2>Пищевая и энергетическая ценность:</h2>
      <table>
        <tbody>
          <tr>
            <td colspan="4" class="nae-title">
              <strong>Готового блюда</strong>
            </td>
          </tr>
          <tr>
            <td>
              ккал
              <br>
              <strong itemprop="calories">
                1447.5 ккал
              </strong>
            </td>
            <td>
              белки
              <br>
              <strong itemprop="proteinContent">
                72.3 г
              </strong>
            </td>
            <td>
              жиры
              <br>
              <strong itemprop="fatContent">
                67.6 г
              </strong>
            </td>
            <td>
              углеводы
              <br>
              <strong itemprop="carbohydrateContent">
                144.2 г
              </strong>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="nae-title">
              <strong>Порции</strong>
            </td>
          </tr>
          <tr>
            <td>ккал<br><strong>180.9 ккал</strong></td>
            <td>белки<br><strong>9 г</strong></td>
            <td>жиры<br><strong>8.5 г</strong></td>
            <td>углеводы<br><strong>18 г</strong></td>
          </tr>
          <tr>
            <td colspan="4" class="nae-title">
              <strong>100 г блюда</strong>
            </td>
          </tr>
          <tr>
            <td>ккал<br><strong>110.5 ккал</strong></td>
            <td>белки<br><strong>5.5 г</strong></td>
            <td>жиры<br><strong>5.2 г</strong></td>
            <td>углеводы<br><strong>11 г</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `

  // HTML with partial data (missing some sections)
  const htmlWithPartialData = `
    <div>
      <table>
        <tbody>
          <tr>
            <td colspan="4" class="nae-title">
              <strong>Готового блюда</strong>
            </td>
          </tr>
          <tr>
            <td>ккал<br><strong>1447.5 ккал</strong></td>
            <td>белки<br><strong>72.3 г</strong></td>
            <td>жиры<br><strong>67.6 г</strong></td>
            <td>углеводы<br><strong>144.2 г</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `

  // HTML with no nutrition data
  const htmlWithNoData = '<div><h2>A recipe with no nutrition data</h2></div>'

  let fullDataResult: NutritionData
  let partialDataResult: NutritionData
  let noDataResult: NutritionData

  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    fullDataResult = extractNutritionData(htmlWithFullData)
    partialDataResult = extractNutritionData(htmlWithPartialData)
    noDataResult = extractNutritionData(htmlWithNoData)
  })

  it('should extract dish nutritional data correctly', () => {
    expect(fullDataResult.dish).toEqual({
      calories: 1447.5,
      protein: 72.3,
      fat: 67.6,
      carbs: 144.2
    })
  })

  it('should extract portion nutritional data correctly', () => {
    expect(fullDataResult.portion).toEqual({
      calories: 180.9,
      protein: 9,
      fat: 8.5,
      carbs: 18
    })
  })

  it('should extract per100g nutritional data correctly', () => {
    expect(fullDataResult.per100g).toEqual({
      calories: 110.5,
      protein: 5.5,
      fat: 5.2,
      carbs: 11
    })
  })

  it('should extract partial data correctly', () => {
    // Check that dish section is populated
    expect(partialDataResult.dish).toEqual({
      calories: 1447.5,
      protein: 72.3,
      fat: 67.6,
      carbs: 144.2
    })

    // Check that portion and per100g sections are null
    expect(partialDataResult.portion).toEqual({
      calories: null,
      protein: null,
      fat: null,
      carbs: null
    })

    expect(partialDataResult.per100g).toEqual({
      calories: null,
      protein: null,
      fat: null,
      carbs: null
    })
  })

  it('should return null values for all fields when no data is present', () => {
    // All fields should be null
    expect(noDataResult).toEqual({
      dish: { calories: null, protein: null, fat: null, carbs: null },
      portion: { calories: null, protein: null, fat: null, carbs: null },
      per100g: { calories: null, protein: null, fat: null, carbs: null }
    })
  })

  it('should handle numeric values correctly', () => {
    // Check types
    expect(typeof fullDataResult.dish.calories).toBe('number')
    expect(typeof fullDataResult.dish.protein).toBe('number')
    expect(typeof fullDataResult.dish.fat).toBe('number')
    expect(typeof fullDataResult.dish.carbs).toBe('number')
  })
})
