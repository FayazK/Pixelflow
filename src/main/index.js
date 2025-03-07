import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { generateImage } from './imageGenerator'

// Get the path to the generation folder
function getGenerationFolderPath() {
  return join(app.getPath('userData'), 'generation')
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * Checks if the generation folder exists and creates it if it doesn't
 */
function ensureGenerationFolder() {
  const generationPath = getGenerationFolderPath()

  if (!existsSync(generationPath)) {
    try {
      mkdirSync(generationPath, { recursive: true })
      console.log(`Created generation folder at: ${generationPath}`)
    } catch (error) {
      console.error('Failed to create generation folder:', error)
    }
  } else {
    console.log(`Generation folder already exists at: ${generationPath}`)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize electron-store using dynamic import to handle ES Module
  let store
  ;(async () => {
    try {
      const { default: Store } = await import('electron-store')
      store = new Store({
        name: 'pixelflow-settings',
        defaults: {
          apiKeys: {
            replicate: '',
            gemini: ''
          }
        }
      })

      // API Keys handlers
      ipcMain.handle('settings:getApiKeys', () => {
        return store.get('apiKeys')
      })

      ipcMain.handle('settings:saveApiKeys', (_, keys) => {
        store.set('apiKeys', keys)
        return true
      })

      // Image generation handler
      ipcMain.handle('generation:generateImage', async (_, params) => {
        try {
          const apiKeys = store.get('apiKeys')
          if (!apiKeys.replicate) {
            throw new Error('Replicate API key is not set. Please add it in Settings.')
          }

          // Generate the image
          const result = await generateImage(params, apiKeys.replicate)

          // Ensure we only return serializable data
          return {
            timestamp: result.timestamp,
            directory: result.directory,
            imagePaths: result.imagePaths.map(String),
            response: result.response
          }
        } catch (error) {
          console.error('Generation failed:', error)
          // Ensure error is serializable for IPC
          throw new Error(error.message)
        }
      })

      // Handler to open the generation folder
      ipcMain.handle('generation:openGenerationFolder', () => {
        const generationPath = getGenerationFolderPath()

        if (existsSync(generationPath)) {
          shell.openPath(generationPath)
          return true
        } else {
          throw new Error('Generation folder does not exist')
        }
      })
    } catch (error) {
      console.error('Failed to initialize electron-store:', error)
    }
  })()

  // Ensure generation folder exists
  ensureGenerationFolder()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
