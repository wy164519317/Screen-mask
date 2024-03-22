const { app, BrowserWindow, screen, globalShortcut, ipcMain } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 需要设置为 false 才能在渲染进程中使用 ipcRenderer 模块
      devTools: true,
    },
    fullscreen: false, // 全屏
    transparent: true, // 透明
    frame: false, // 无边框
    alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
  })

  win.loadFile('index.html')
  // win.webContents.openDevTools()
  ipcMain.on('mouseenter', () => {
    win.setIgnoreMouseEvents(true, { forward: true })
  })

  ipcMain.on('mouseleave', () => {
    win.setIgnoreMouseEvents(false)
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 监听 F10 键，退出程序
app.on('browser-window-focus', () => {
  globalShortcut.register('F10', () => {
    app.quit()
  })
})

app.on('browser-window-blur', () => {
  globalShortcut.unregister('F10')
})
