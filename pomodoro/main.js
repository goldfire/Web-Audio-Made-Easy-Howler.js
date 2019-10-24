const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

let tray;
let appWindow;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzU3QTdGNzkyQUJCMTFFOTg1MTJBNTlCMjBGNDYzQzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzU3QTdGN0EyQUJCMTFFOTg1MTJBNTlCMjBGNDYzQzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NTdBN0Y3NzJBQkIxMUU5ODUxMkE1OUIyMEY0NjNDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NTdBN0Y3ODJBQkIxMUU5ODUxMkE1OUIyMEY0NjNDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoXr6CMAAAEVSURBVHjapNOxasJAHMdxEUEQi4KTPoKbFKdCpbj7Co6C0MVa+iBu4iPUSTqUUpBKBwcX30AopVCatoNbbPu98AskMb1I/MMnhLv//XN3uctkkmMh1sjGtJVRRyWmr6K+sq1oC3Ps8CtrvMo60L5Tbita5AJuIPFQrsZ6kdcSxykKjTU2n+MxwSN6+EQVT1hhhDN98BmXOMU53nCDLtom4QM/GAaWeoIaitqLud5r6vPjWmNNjdBUZ5qJWfs7GihIQ22ucmaRsdY9cNAUJyE3MeFLrB80O75MOLQlsYVXo5Pit0d1/IrTI4rcBqdm/sp9iiIPGrt3gQf4PqCAybn659KHDmMfd3jRBd1io7Z+5FB68SfAAEj7p5yH5o4lAAAAAElFTkSuQmCC`);
  tray = new Tray(icon);

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (appWindow.isVisible() && process.defaultApp && event.metaKey) {
      appWindow.openDevTools({mode: 'detach'});
    }
  });

  // Make the popup window for the menubar
  appWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Tell the popup window to load our index.html file
  appWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  // Only close the window on blur if dev tools isn't opened
  appWindow.on('blur', () => {
    if (!appWindow.webContents.isDevToolsOpened()) {
      appWindow.hide();
    }
  });
});

/**
 * Toggle the visibility of the window.
 */
const toggleWindow = () => {
  if (appWindow.isVisible()) {
    appWindow.hide();
  } else {
    showWindow();
  }
};

/**
 * Show the window and position it.
 */
const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = appWindow.getBounds();
  let x = 0;
  let y = 0;
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  appWindow.setPosition(x, y, false);
  appWindow.show();
  appWindow.focus();
};

// Handle quitting the app.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
