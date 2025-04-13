export const parseRussianDate = (dateStr: string): Date => {
  const russianMonths: Record<string, number> = {
    января: 0,
    февраля: 1,
    марта: 2,
    апреля: 3,
    мая: 4,
    июня: 5,
    июля: 6,
    августа: 7,
    сентября: 8,
    октября: 9,
    ноября: 10,
    декабря: 11
  }

  const parts = dateStr.split(/[,\s]+/).filter(Boolean)

  if (!parts[0] || !parts[2]) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  const day = Number.parseInt(parts[0], 10)
  const monthName = parts[1]?.toLowerCase()
  const year = Number.parseInt(parts[2], 10)

  if (Number.isNaN(day) || !monthName || russianMonths[monthName] === undefined || Number.isNaN(year)) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  let hours = 0
  let minutes = 0
  if (parts.length > 3) {
    const timeParts = parts[3]?.split(':')
    if (timeParts?.[0] && timeParts?.[1] && timeParts.length >= 2) {
      hours = Number.parseInt(timeParts[0], 10) || 0
      minutes = Number.parseInt(timeParts[1], 10) || 0
    }
  }

  return new Date(year, russianMonths[monthName], day, hours, minutes)
}
