export function activateTabScript(window: number, tab: number) {
  return `
    tell application "Safari"
        activate
        tell window ${window}
            set current tab to tab ${tab}
            set index to 1
        end tell
    end tell`
}

export function allTabsScript(separator: string) {
  return `
    set tabList to ""
    tell application "Safari"
        set winIndex to 1
        repeat with w in windows
            set tabIndex to 1
            repeat with t in tabs of w
                set tabItem to winIndex & "${separator}" & tabIndex & "${separator}" & (name of t) & "${separator}" & (URL of t) & "\n"
                set tabList to tabList & tabItem
                set tabIndex to tabIndex + 1
            end repeat
            set winIndex to winIndex + 1
        end repeat
    end tell
    tabList`
}

export function newTab() {
  return `
    tell application "Safari"
        tell window 1
            activate
            if the (count of tabs) is equal to 0 then
                do shell script "open -a Safari.app"
            else
                set aTab to make new tab
                set current tab to aTab
                set index to 1
            end if
        end tell
    end tell`
}
