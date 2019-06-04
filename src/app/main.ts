import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  mainWindow.webContents.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on(
    "closed",
    (): void => {
      mainWindow = null;
    }
  );
}

app
  .on("ready", createWindow)
  .on(
    "window-all-closed",
    (): void => {
      if (process.platform !== "darwin") app.quit();
    }
  )
  .on(
    "activate",
    (): void => {
      if (mainWindow === null) createWindow();
    }
  );
