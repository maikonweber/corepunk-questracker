const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let mainWindow

// Criar a janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'), // Definir o script preload
    }
  })

  mainWindow.loadFile('index.html')
  
  // Registra o atalho global Ctrl+Shift+Q
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    // Alterna a visibilidade e o alwaysOnTop
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop)
    
    // Alterna a visibilidade
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

// Quando o app estiver pronto, criar a janela
app.whenReady().then(createWindow)

// Quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Quando o app for ativado (caso não haja janelas)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./game_data.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message)
  } else {
    console.log('Conectado ao banco de dados SQLite.')
  }
})

// Manipulador para consultas ao banco de dados
ipcMain.handle('get-quest-data', async (event, questId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM quests WHERE id = ?', [questId], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
})

ipcMain.handle('get-goals', async (event, questId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM goals WHERE quest_id = ?', [questId], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
})

ipcMain.handle('get-comments', async (event, questId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM comments WHERE quest_id = ?', [questId], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
})
