const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Auto-reload in development
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('dist/index.html');
}

// Handle COE image upload
ipcMain.handle('upload-coe', async (event, data) => {
  const { selectedRow } = data;
  const storageAddress = data.storageAddress || data.imageAddress || data.storagePath;
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }]
  });
  if (!result.canceled) {
    const filePath = result.filePaths[0];
    const ext = path.extname(filePath);
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const filename = `${yyyy}-${mm}-${dd}_${selectedRow.lastname}-COE${ext}`;
    const destPath = path.join(storageAddress, filename);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(filePath, destPath);
    
    return destPath;
  }
  return null;
});

// Handle ID image upload
ipcMain.handle('upload-id', async (event, data) => {
  const { selectedRow } = data;
  const storageAddress = data.storageAddress || data.imageAddress || data.storagePath;
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }]
  });
  if (!result.canceled) {
    const filePath = result.filePaths[0];
    const ext = path.extname(filePath);
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const filename = `${yyyy}-${mm}-${dd}_${selectedRow.lastname}-ID${ext}`;
    const destPath = path.join(storageAddress, filename);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(filePath, destPath);
    
    return destPath;
  }
  return null;
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});