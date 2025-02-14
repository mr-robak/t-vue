import { sleep } from '../helpers'

describe('helpers', () => {
  it('should wait for the specified time', async () => {
    vi.useFakeTimers()

    const promise = sleep(1000)
    vi.advanceTimersByTime(1000)
    await promise

    expect(vi.getTimerCount()).toBe(0)
  })
})
