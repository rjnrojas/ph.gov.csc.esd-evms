const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // Expose printToPDF function to the renderer process
  printToPDF: () => ipcRenderer.invoke('print-to-pdf'),

  // Add uploadCOE and uploadID functions to the API
  uploadCOE: (data) => ipcRenderer.invoke('upload-coe', data),
  uploadID: (data) => ipcRenderer.invoke('upload-id', data)
});