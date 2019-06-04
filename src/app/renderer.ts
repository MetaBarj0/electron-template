import { remote } from "electron";

const button = document.querySelector(".devtools");

if (button)
  button.addEventListener(
    "click",
    (): void => {
      remote
        .require("./lib")
        .openDevToolsInMainWindow(remote.getCurrentWindow());
    }
  );
