const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

// Criar janela
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // O preload.js irá gerenciar a comunicação com a página
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    db.close();
  });
}

// Inicializando o banco de dados
function initDatabase() {
  db = new sqlite3.Database('./game_data.db', (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
      console.log('Banco de dados SQLite conectado');
    }
  });
}

// Quando a aplicação estiver pronta
app.whenReady().then(() => {
  createWindow();
  initDatabase();
});

// Terminar a aplicação quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Comunicação com o renderizador (index.html)
ipcMain.handle('getNPCs', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM npcs', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('getQuests', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM quests', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});
