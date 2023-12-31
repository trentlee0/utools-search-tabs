import { safari, edge, chrome, Tab } from './script'
import {
  templateBuilder,
  NoneTemplate,
  MutableListTemplate,
  Action,
  ListRenderFunction,
  hideAndOutPlugin,
  ListItem,
  searchList,
  pinyinMatch
} from 'utools-utils'
import * as pinyin from 'tiny-pinyin'
import * as NProgress from 'nprogress'
import cssInline from 'nprogress/nprogress.css?inline'

NProgress.configure({ showSpinner: false })

function getPinyin(s: string) {
  return pinyin.parse(s).map((item) => item.target)
}

function pinyinSearch(arr: Array<ListItem>, searchWord: string) {
  return searchList(arr, searchWord.split(/ +/), (item, word) => {
    word = word.toLowerCase()
    return (
      item.title.toLowerCase().includes(word) ||
      item.description.toLowerCase().includes(word) ||
      !!pinyinMatch(getPinyin(item.title), word, { case: 'upper' }) ||
      !!pinyinMatch(getPinyin(item.description), word, { case: 'upper' })
    )
  })
}

abstract class AbstractListTemplate implements MutableListTemplate {
  abstract code: string
  $list: ListItem[]
  isInjectedCss: boolean

  constructor() {
    this.isInjectedCss = false
  }

  enter(action: Action, render: ListRenderFunction): void {
    if (!this.isInjectedCss) {
      const id = 'my-custom-style'
      if (!document.querySelector(id)) {
        const s = document.createElement('style')
        s.id = id
        const css =
          cssInline + `#nprogress .bar { background: #70b5b8 !important; }`
        s.appendChild(document.createTextNode(css))
        document.head.insertBefore(s, document.head.firstChild)
        this.isInjectedCss = true
      }
    }
  }

  protected startLoading() {
    NProgress.start()
  }

  protected doneLoading() {
    NProgress.done()
  }

  select(action: Action, item: ListItem) {}
}

class SafariTab extends AbstractListTemplate {
  code = 'search-safari-tab'

  async enter(action: Action, render: ListRenderFunction) {
    super.enter(action, render)
    this.startLoading()
    const tabs = await safari.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/safari.png' })))
    this.doneLoading()
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    safari.activateTab(item.window, item.tab)
    utools.hideMainWindow()
  }
}

class EdgeTab extends AbstractListTemplate {
  code = 'search-edge-tab'

  async enter(action: Action, render: ListRenderFunction) {
    super.enter(action, render)
    this.startLoading()
    const tabs = await edge.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/edge.png' })))
    this.doneLoading()
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    edge.activateTab(item.window, item.tab)
    utools.hideMainWindow()
  }
}

class ChromeTab extends AbstractListTemplate {
  code = 'search-chrome-tab'

  async enter(action: Action, render: ListRenderFunction) {
    super.enter(action, render)
    this.startLoading()
    const tabs = await chrome.getAllTabs()
    render(tabs.map((tab) => ({ ...tab, icon: 'icon/chrome.png' })))
    this.doneLoading()
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(pinyinSearch(this.$list, searchWord))
  }

  select(action: Action, item: Tab): void {
    edge.activateTab(item.window, item.tab)
    utools.hideMainWindow()
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

class NewSafari implements NoneTemplate {
  code = 'new-safari'

  async enter(action: Action) {
    safari.newTab()
    hideAndOutPlugin()
  }
}

class NewEdge implements NoneTemplate {
  code = 'new-edge'

  async enter(action: Action) {
    edge.newTab()
    hideAndOutPlugin()
  }
}

class NewChrome implements NoneTemplate {
  code = 'new-chrome'

  async enter(action: Action) {
    chrome.newTab()
    hideAndOutPlugin()
  }
}

function getSelectedItem(): ListItem {
  const el = document.querySelector('.list-item-selected')
  const title = el?.querySelector('.list-item-title')?.textContent ?? ''
  const description =
    el?.querySelector('.list-item-description')?.textContent ?? ''
  return { title, description }
}

window.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'c') {
    utools.copyText(getSelectedItem().description)
    utools.hideMainWindow()
  }
})

window.exports = templateBuilder()
  .mutableList(new SafariTab())
  .mutableList(new EdgeTab())
  .mutableList(new ChromeTab())
  .none(new OpenSafari())
  .none(new OpenEdge())
  .none(new OpenChrome())
  .none(new NewSafari())
  .none(new NewEdge())
  .none(new NewChrome())
  .build()
