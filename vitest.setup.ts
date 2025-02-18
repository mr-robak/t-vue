import '@vue/test-utils'
import { vi, beforeEach } from 'vitest' // Added beforeEach import

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Reset handlers after each test
beforeEach(() => {
  vi.restoreAllMocks()
})
