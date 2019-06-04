import { BrowserWindow } from "electron";

export function openDevToolsInMainWindow(mainWindow: BrowserWindow): void {
  if (mainWindow) mainWindow.webContents.openDevTools();
}
