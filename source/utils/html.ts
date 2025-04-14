export const cleanupHtmlWhitespace = (html: string): string => {
  if (!html) {
    return html
  }

  return html.replace(/\s+/g, ' ').replace(/\s+</g, '<').replace(/>\s+/g, '>').trim()
}
