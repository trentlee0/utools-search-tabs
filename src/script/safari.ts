export function activateTabScript(window: number, tab: number) {
  return `
    tell application "Safari"
        activate
        tell window ${window}
            set current tab to tab ${tab}
            set visible to true
        end tell
    end tell`
}

export function allTabsScript(seperator: string) {
  return `
    set tabList to ""
    tell application "Safari"
        set winIndex to 1
        repeat with w in windows
            set tabIndex to 1
            repeat with t in tabs of w
                set tabItem to winIndex & "${seperator}" & tabIndex & "${seperator}" & (name of t) & "${seperator}" & (URL of t) & "\n"
                set tabList to tabList & tabItem
                set tabIndex to tabIndex + 1
            end repeat
            set winIndex to winIndex + 1
        end repeat
    end tell
    tabList`
}
