import { safari, edge, chrome, Tab } from './script'
import {
  templateBuilder,
  NoneTemplate,
  MutableListTemplate,
  Action,
  ListRenderFunction,
  hideAndOutPlugin,
  ListItem
} from 'utools-utils'
import { match } from 'pinyin-pro'

function pinyinSearch(arr: Array<ListItem>, searchWord: string) {
  const words = searchWord.split(/ +/)
  for (const word of words) {
    if (!word) continue
    const lowerCase = word.toLowerCase()
    arr = arr.filter((item) => {
      if (match(item.title, word) !== null) return true
      return (
        item.title.toLowerCase().includes(lowerCase) ||
        item.description?.toLowerCase().includes(lowerCase)
      )
    })
  }
  return arr
}

class SafariTab implements MutableListTemplate {
  code = 'search-safari-tab'
  $list: ListItem[]

  async enter(action: Action, render: ListRenderFunction) {
    const tabs = await safari.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/safari.png' })))
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    safari.activateTab(item.window, item.tab)
    hideAndOutPlugin()
  }
}

class EdgeTab implements MutableListTemplate {
  code = 'search-edge-tab'
  $list: ListItem[]

  async enter(action: Action, render: ListRenderFunction) {
    const tabs = await edge.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/edge.png' })))
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    edge.activateTab(item.window, item.tab)
    hideAndOutPlugin()
  }
}

class ChromeTab implements MutableListTemplate {
  code = 'search-chrome-tab'
  $list: ListItem[]

  async enter(action: Action, render: ListRenderFunction) {
    const tabs = await chrome.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/chrome.png' })))
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    edge.activateTab(item.window, item.tab)
    hideAndOutPlugin()
  }
}

class OpenSafari implements NoneTemplate {
  code = 'open-safari'

  async enter(action: Action) {
    const url = await utools.readCurrentBrowserUrl()
    safari.openUrl(url)
    hideAndOutPlugin()
  }
}

class OpenEdge implements NoneTemplate {
  code = 'open-edge'

  async enter(action: Action) {
    const url = await utools.readCurrentBrowserUrl()
    edge.openUrl(url)
    hideAndOutPlugin()
  }
}

class OpenChrome implements NoneTemplate {
  code = 'open-chrome'

  async enter(action: Action) {
    const url = await utools.readCurrentBrowserUrl()
    chrome.openUrl(url)
    hideAndOutPlugin()
  }
}

window.exports = templateBuilder()
  .mutableList(new SafariTab())
  .mutableList(new EdgeTab())
  .mutableList(new ChromeTab())
  .none(new OpenSafari())
  .none(new OpenEdge())
  .none(new OpenChrome())
  .build()
