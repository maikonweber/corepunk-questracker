const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
  
  // Registra o atalho global Ctrl+Shift+Q
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    // Toggle alwaysOnTop
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop)
    
    // Toggle visibilidade
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
