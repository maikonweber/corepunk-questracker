const { contextBridge, ipcRenderer } = require('electron');

// Expondo funções do main para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getNPCs: (callback) => ipcRenderer.invoke('getNPCs').then(callback),
  getQuests: (callback) => ipcRenderer.invoke('getQuests').then(callback),
});
