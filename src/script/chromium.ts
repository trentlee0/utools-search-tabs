export function activateTabScript(
  chromiumApp: string,
  window: number,
  tab: number
) {
  return `
    tell application "${chromiumApp}"
        activate
        tell window ${window}
            set active tab index to ${tab}
            set visible to true
        end tell
    end tell`
}

export function allTabsScript(chromiumApp: string, seperator: string) {
  return `
    set tabList to ""
    tell application "${chromiumApp}"
        set winIndex to 1
        repeat with w in windows
            set tabIndex to 1
            repeat with t in tabs of w
                set tabItem to winIndex & "${seperator}" & tabIndex & "${seperator}" & (title of t) & "${seperator}" & (URL of t) & "\n"
                set tabList to tabList & tabItem
                set tabIndex to tabIndex + 1
            end repeat
            set winIndex to winIndex + 1
        end repeat
    end tell
    tabList`
}
