const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'frontend/preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'frontend/index.html'));
}

app.whenReady().then(() => {
    console.log('Running server from', path.join(__dirname, 'server/index.js'));
    console.log('ENV PATH:', process.env.PATH);
    console.log('DB_USER:', process.env.DB_USER);
    serverProcess = spawn('node', [path.join(__dirname, 'app.js')]);

    // ⬇️ Перехоплення логів і передача у вікно
    serverProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('log-line', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
        mainWindow.webContents.send('log-line', '[stderr] ' + data.toString());
    });

    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});

app.on('before-quit', () => {
    serverProcess.kill();
});

