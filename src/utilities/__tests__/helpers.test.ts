import { sleep, clearHTMLTags } from '../helpers'

describe('helpers', () => {
  describe('sleep', () => {
    it('should wait for the specified time', async () => {
      vi.useFakeTimers()
      const promise = sleep(1000)
      vi.advanceTimersByTime(1000)
      await promise
      expect(vi.getTimerCount()).toBe(0)
    })
  })

  describe('clearHTMLTags', () => {
    it('should return null for null input', () => {
      expect(clearHTMLTags(null)).toBeNull()
    })

    it('should return empty string for empty input', () => {
      expect(clearHTMLTags('')).toBe('')
    })

    it('should remove simple HTML tags', () => {
      expect(clearHTMLTags('<p>Hello</p>')).toBe('Hello')
    })

    it('should remove nested HTML tags', () => {
      expect(clearHTMLTags('<div><p>Hello <b>World</b></p></div>')).toBe(
        'Hello World',
      )
    })

    it('should handle HTML attributes', () => {
      expect(clearHTMLTags('<p class="text-bold" id="123">Content</p>')).toBe(
        'Content',
      )
    })

    it('should trim whitespace', () => {
      expect(clearHTMLTags('  <p>  Hello  </p>  ')).toBe('Hello')
    })

    it('should handle self-closing tags', () => {
      expect(clearHTMLTags('Before<br/>After<img src="test.jpg"/>')).toBe(
        'BeforeAfter',
      )
    })

    it('should preserve line breaks in text', () => {
      expect(clearHTMLTags('<p>Line 1\nLine 2</p>')).toBe('Line 1\nLine 2')
    })
  })
})
