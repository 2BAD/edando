/**
 * Parses cooking time from a Russian text string
 * @param {string} text - Text containing cooking time information
 * @returns {Object} Object containing minutes and formatted time
 */
export const parseRussianCookingTime = (text: string) => {
  // Regular expression to find numbers followed by time units
  const timeRegex = /(\d+)\s*(минут|минуты|мин|часов|часа|час|ч)/gi
  let totalMinutes = 0
  const matches = []
  let match

  // Find all time-related matches in the text
  while ((match = timeRegex.exec(text)) !== null) {
    const value = Number.parseInt(match[1], 10)
    const unit = match[2].toLowerCase()

    matches.push({ value, unit })

    // Convert to minutes based on the unit
    if (unit.includes('час')) {
      totalMinutes += value * 60
    } else if (unit.includes('мин')) {
      totalMinutes += value
    }
  }

  // If no matches were found but there's a number in the text, assume it's minutes
  if (matches.length === 0) {
    const numberMatch = text.match(/(\d+)/)
    if (numberMatch) {
      totalMinutes = Number.parseInt(numberMatch[1], 10)
      matches.push({ value: totalMinutes, unit: 'минут' })
    }
  }

  // Format the time in hours and minutes
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  let formattedTime = ''

  if (hours > 0) {
    formattedTime += `${hours} hour${hours > 1 ? 's' : ''}`
  }

  if (minutes > 0) {
    if (formattedTime) {
      formattedTime += ' '
    }
    formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  if (!formattedTime) {
    formattedTime = '0 minutes'
  }

  return {
    minutes: totalMinutes,
    formatted: formattedTime
  }
}
