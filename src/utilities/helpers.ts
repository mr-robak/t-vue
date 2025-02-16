export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clearHTMLTags(html: string | null | undefined): string | null {
  if (!html) return null
  return html.replace(/(<([^>]+)>)/gi, '').trim()
}
