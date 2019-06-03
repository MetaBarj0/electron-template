import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow | null = null;

app
  .on(
    "ready",
    (): void => {
      mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true }
      });
      mainWindow.webContents.loadURL(`file://${__dirname}/index.html`);
    }
  )
  .on(
    "quit",
    (): void => {
      mainWindow = null;
    }
  );
