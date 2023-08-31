import { exec, execSync } from 'child_process'
import * as sf from './safari'
import * as ch from './chromium'

function execCommand(command) {
  exec(command, (err) => {
    if (!err) return
    console.error(err)
  })
}

function appleScriptCommand(script: string) {
  return `osascript -e '${script}'`
}

export interface Tab {
  window: number
  tab: number
  title: string
  description: string
}

function openUrl(app: string, url: string) {
  execCommand(`open -a "${app}" "${url}"`)
}

function execAppleScript(script: string) {
  execCommand(appleScriptCommand(script))
}

function execGetTabs(script: string, seperator: string) {
  return new Promise<Tab[]>((resolve) => {
    const output = execSync(appleScriptCommand(script)).toString().trim()
    if (!output) {
      resolve([])
      return
    }
    const tabs: Tab[] = output.split('\n').map((item) => {
      const [window, tab, title, description] = item.split(seperator)
      return {
        window: parseInt(window),
        tab: parseInt(tab),
        title,
        description: decodeURI(description)
      }
    })
    resolve(tabs)
  })
}

abstract class BrowserCommand {
  protected SEPERATOR = '[,~,]'

  abstract activateTab(window: number, tab: number): void
  abstract getAllTabs(): Promise<Tab[]>
  abstract openUrl(url: string)
}

class SafariCommand extends BrowserCommand {
  activateTab(window: number, tab: number): void {
    execAppleScript(sf.activateTabScript(window, tab))
  }

  getAllTabs(): Promise<Tab[]> {
    return execGetTabs(sf.allTabsScript(this.SEPERATOR), this.SEPERATOR)
  }

  openUrl(url: string) {
    openUrl('Safari', url)
  }
}

class EdgeCommand extends BrowserCommand {
  activateTab(window: number, tab: number): void {
    execAppleScript(ch.activateTabScript('Microsoft Edge', window, tab))
  }

  getAllTabs(): Promise<Tab[]> {
    return execGetTabs(
      ch.allTabsScript('Microsoft Edge', this.SEPERATOR),
      this.SEPERATOR
    )
  }

  openUrl(url: string) {
    openUrl('Microsoft Edge', url)
  }
}

class ChromeCommand extends BrowserCommand {
  activateTab(window: number, tab: number): void {
    execAppleScript(ch.activateTabScript('Google Chrome', window, tab))
  }

  getAllTabs(): Promise<Tab[]> {
    return execGetTabs(
      ch.allTabsScript('Google Chrome', this.SEPERATOR),
      this.SEPERATOR
    )
  }

  openUrl(url: string) {
    openUrl('Google Chrome', url)
  }
}

export const safari = new SafariCommand()
export const edge = new EdgeCommand()
export const chrome = new ChromeCommand()
