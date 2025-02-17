export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: do proper sanitizing and use v-html ???
export function clearHTMLTags(html: string | null | undefined): string | null {
  if (html === null || html === undefined) return null
  if (html === '') return ''
  return html.replace(/(<([^>]+)>)/gi, '').trim()
}
