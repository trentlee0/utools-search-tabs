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
            set index to 1
        end tell
    end tell`
}

export function allTabsScript(chromiumApp: string, separator: string) {
  return `
    set tabList to ""
    tell application "${chromiumApp}"
        set winIndex to 1
        repeat with w in windows
            set tabIndex to 1
            repeat with t in tabs of w
                set tabItem to winIndex & "${separator}" & tabIndex & "${separator}" & (title of t) & "${separator}" & (URL of t) & "\n"
                set tabList to tabList & tabItem
                set tabIndex to tabIndex + 1
            end repeat
            set winIndex to winIndex + 1
        end repeat
    end tell
    tabList`
}

export function newTab(chromiumApp: string) {
  return `
    tell application "${chromiumApp}"
      activate
      if the count of windows is equal to 0 then
        make new window
      else
        tell window 1
          make new tab
          set index to 1
        end tell
      end
    end tell`
}
