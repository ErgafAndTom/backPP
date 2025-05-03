const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('logAPI', {
    onLog: (callback) => ipcRenderer.on('log-line', (event, line) => callback(line)),
});
