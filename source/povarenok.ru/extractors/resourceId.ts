export const resourceId = (url: string): number | null => {
  const urlObj = new URL(url)
  const path = urlObj.pathname.split('/').filter(Boolean)
  const id = path.pop()
  return id ? Number.parseInt(id) : null
}
