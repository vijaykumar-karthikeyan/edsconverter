const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('index.html');
});

ipcMain.on('save-file', (event, content) => {
    dialog.showSaveDialog({
        title: 'Save Processed CSV',
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    }).then(result => {
        if (!result.canceled && result.filePath) {
            fs.writeFileSync(result.filePath, content);
        }
    });
});

app.on('window-all-closed', () => {
    fetch('http://localhost:5000/cleanup')
        .finally(() => app.quit());
});