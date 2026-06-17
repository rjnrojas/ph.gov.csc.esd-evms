const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // Add uploadCOE and uploadID functions to the API
  uploadCOE: (data) => ipcRenderer.invoke('upload-coe', data),
  uploadID: (data) => ipcRenderer.invoke('upload-id', data)
});