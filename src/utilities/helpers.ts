export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clearHTMLTags(html: string | null | undefined): string | null {
  if (html === null || html === undefined) return null
  if (html === '') return ''
  return html.replace(/(<([^>]+)>)/gi, '').trim()
}
