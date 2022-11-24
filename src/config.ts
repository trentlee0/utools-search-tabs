import {NoneTemplate, DynamicListTemplate} from './util/templates'
import {safari, edge, chrome, Tab} from './script'

export const list: Array<DynamicListTemplate> = [
  {
    code: 'search-safari-tab',
    title: 'Search Safari Tabs',
    description: '搜索 Safari 标签页',
    icon: 'icon/safari.png',
    isSearchDesc: true,
    onlyEnterOnce: false,
    onEnter: (render) => {
      safari
        .getAllTabs()
        .then((tabs) =>
          render(tabs.map((tab) => ({...tab, icon: 'icon/safari.png'})))
        )
    },
    onSelect: (item) => {
      const tabItem = item as Tab
      safari.activateTab(tabItem.window, tabItem.tab)
      utools.hideMainWindow()
      utools.outPlugin()
    }
  },
  {
    code: 'search-edge-tab',
    title: 'Search Edge Tabs',
    description: '搜索 Edge 标签页',
    icon: 'icon/edge.png',
    isSearchDesc: true,
    onlyEnterOnce: false,
    onEnter: (render) => {
      edge
        .getAllTabs()
        .then((tabs) =>
          render(tabs.map((tab) => ({...tab, icon: 'icon/edge.png'})))
        )
    },
    onSelect: (item) => {
      const tabItem = item as Tab
      edge.activateTab(tabItem.window, tabItem.tab)
      utools.hideMainWindow()
      utools.outPlugin()
    }
  },
  {
    code: 'search-chrome-tab',
    title: 'Search Chrome Tabs',
    description: '搜索 Chrome 标签页',
    icon: 'icon/chrome.png',
    isSearchDesc: true,
    onlyEnterOnce: false,
    onEnter: (render) => {
      chrome
        .getAllTabs()
        .then((tabs) =>
          render(tabs.map((tab) => ({...tab, icon: 'icon/chrome.png'})))
        )
    },
    onSelect: (item) => {
      const tabItem = item as Tab
      chrome.activateTab(tabItem.window, tabItem.tab)
      utools.hideMainWindow()
      utools.outPlugin()
    }
  }
]

export const none: Array<NoneTemplate> = [
  {
    code: 'open-safari',
    title: '在 Safari 中打开当前页面',
    description: '在 Safari 中打开当前页面',
    icon: 'icon/safari.png',
    action: () =>
      utools.readCurrentBrowserUrl().then((url) => {
        safari.openUrl(url)
        utools.hideMainWindow()
        utools.outPlugin()
      })
  },
  {
    code: 'open-edge',
    title: '在 Edge 中打开当前页面',
    description: '在 Edge 中打开当前页面',
    icon: 'icon/edge.png',
    action: () =>
      utools.readCurrentBrowserUrl().then((url) => {
        edge.openUrl(url)
        utools.hideMainWindow()
        utools.outPlugin()
      })
  },
  {
    code: 'open-chrome',
    title: '在 Chrome 中打开当前页面',
    description: '在 Chrome 中打开当前页面',
    icon: 'icon/chrome.png',
    action: () =>
      utools.readCurrentBrowserUrl().then((url) => {
        chrome.openUrl(url)
        utools.hideMainWindow()
        utools.outPlugin()
      })
  }
]
