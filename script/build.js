const {resolve} = require('path')
const fs = require('fs')
const plugin = require('../public/plugin.json')
const config = require('../dist/config')

const features = []
Object.values(config).forEach((template) => {
  features.push(
    ...template?.map((item) => {
      const explain = `${item.description || ''}`
      const cmds = []
      const {code} = item

      if (code.startsWith('search-')) {
        const getMatchApp = () => {
          if (code === 'search-safari-tab') return 'Safari.app'
          if (code === 'search-edge-tab') return 'Microsoft Edge.app'
          if (code === 'search-chrome-tab') return 'Google Chrome.app'
        }
        cmds.push(`${item.title || ''}`, `${item.description || ''}`, {
          type: 'window',
          label: explain,
          match: {
            app: [getMatchApp()]
          }
        })
      } else if (code.startsWith('open-')) {
        const getOtherApps = () => {
          const apps = ['Safari.app', 'Microsoft Edge.app', 'Google Chrome.app']
          if (code === 'open-safari')
            return apps.filter((app) => app !== 'Safari.app')
          if (code === 'open-edge')
            return apps.filter((app) => app !== 'Microsoft Edge.app')
          if (code === 'open-chrome')
            return apps.filter((app) => app !== 'Google Chrome.app')
        }
        cmds.push({
          type: 'window',
          label: explain,
          match: {
            app: getOtherApps()
          }
        })
      }

      return {
        code: item?.code,
        icon: item?.icon,
        explain,
        cmds
      }
    })
  )
})

function build(config) {
  console.log('Start building ...')
  const {distDir, replaces, copyDirs} = config

  for (const dir of copyDirs) {
    fs.cpSync(dir, distDir, {recursive: true})
  }

  for (const replace of replaces) {
    const newContent = replace.action(
      fs.readFileSync(replace.source).toString()
    )
    fs.writeFileSync(replace.destination, newContent)
  }
  console.log('Finish building!')
}

const distDir = resolve(__dirname, '../dist')
const publicDir = resolve(__dirname, '../public')

build({
  distDir,
  replaces: [
    {
      source: resolve(publicDir, 'plugin.json'),
      destination: resolve(distDir, 'plugin.json'),
      action: () => {
        plugin.features = features
        return JSON.stringify(plugin, null, 2)
      }
    }
  ],
  copyDirs: [publicDir]
})
