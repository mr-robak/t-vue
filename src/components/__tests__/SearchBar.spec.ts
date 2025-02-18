import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import router from '@/router'
import SearchBar from '../SearchBar.vue'

interface SearchBarInstance extends ComponentPublicInstance {
  query: string
}

describe('SearchBar', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  it('renders properly', () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.home-button').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'Search TV Shows...',
    )
  })

  it('updates query on input', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test query')

    expect((wrapper.vm as SearchBarInstance).query).toBe('test query')
  })

  it('clears search when clicking clear button', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test query')

    const clearButton = wrapper.find('.icon:last-child')
    await clearButton.trigger('click')

    expect((wrapper.vm as SearchBarInstance).query).toBe('')
  })

  it('navigates to search page on enter', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test query')
    await input.trigger('keyup.enter')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('SearchShows')
    expect(router.currentRoute.value.query.q).toBe('test query')
  })

  it('navigates to home when clicking home button', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    await router.push('/search')
    await flushPromises()
    const homeButton = wrapper.find('.home-button')
    await homeButton.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('Home')
  })

  it('initializes query from route on search page', async () => {
    await router.push({ name: 'SearchShows', query: { q: 'initial query' } })

    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    expect((wrapper.vm as SearchBarInstance).query).toBe('initial query')
  })

  it('clears query when leaving search page', async () => {
    await router.push({ name: 'SearchShows', query: { q: 'test query' } })
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [router],
      },
    })

    await router.push({ name: 'Home' })

    expect((wrapper.vm as SearchBarInstance).query).toBe('')
  })
})
