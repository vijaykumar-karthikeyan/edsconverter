const { app, BrowserWindow, dialog, net } = require('electron');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');
});

app.on('window-all-closed', () => {
    // Ensure Flask cleanup is triggered before quitting
    fetch('http://localhost:5000/cleanup')
        .catch(err => console.error("Cleanup failed:", err))
        .finally(() => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
});