import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification, dialog } from 'electron';
import path from 'path';
import { StorageService } from './services/storage';
import { WifiMonitorService } from './services/wifi-monitor';
import { ProtectionManager } from './services/protection-manager';
import { SettingsProtectionService } from './services/settings-protection';
import { AppSettings, WifiAdapterInfo, ProtectionStatus } from './types';

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Initialize Core Services
const storage = new StorageService();
const wifiMonitor = new WifiMonitorService(storage);
const protectionManager = new ProtectionManager(storage, wifiMonitor);
const settingsProtection = new SettingsProtectionService(storage);

// Application Settings Defaults
const defaultSettings: AppSettings = {
  launchOnStartup: false,
  minimizeToTray: true,
  launchMinimized: false,
  desktopNotifications: true,
  rogueApDetection: true,
  dnsProtection: true,
  arpInspection: true,
  highFrequencyPolling: true,
  settingsProtectionEnabled: false,
  theme: 'cyber',
  accentColor: 'cyan',
};

function getAppSettings(): AppSettings {
  return storage.getSetting<AppSettings>('app_settings', defaultSettings);
}

function saveAppSettings(newSettings: Partial<AppSettings>): AppSettings {
  const current = getAppSettings();
  const updated = { ...current, ...newSettings };
  storage.setSetting('app_settings', updated);

  // Apply Windows startup setting
  if (typeof newSettings.launchOnStartup === 'boolean') {
    app.setLoginItemSettings({
      openAtLogin: newSettings.launchOnStartup,
      openAsHidden: updated.launchMinimized,
    });
  }

  return updated;
}

// Generate sleek programmatic tray icons (Active Cyan vs Inactive Neutral)
function createTrayIcon(isActive: boolean): Electron.NativeImage {
  // 16x16 RGBA buffer
  const size = 16;
  const buffer = Buffer.alloc(size * size * 4);

  // Colors: Cyan [0, 240, 255] for active, Neutral slate [148, 163, 184] for inactive
  const r = isActive ? 0 : 148;
  const g = isActive ? 240 : 163;
  const b = isActive ? 255 : 184;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Draw shield shape outline and fill
      const dx = Math.abs(x - 7.5);
      const isInsideShield = y >= 2 && y <= 13 && dx <= (y <= 7 ? 6 : 6 - (y - 7) * 1.1);
      const isBorder = isInsideShield && (y === 2 || dx >= (y <= 7 ? 5 : 5 - (y - 7) * 1.1) || y >= 12);

      if (isInsideShield) {
        if (isBorder || (x === 7 && y >= 4 && y <= 10)) {
          buffer[idx] = r;
          buffer[idx + 1] = g;
          buffer[idx + 2] = b;
          buffer[idx + 3] = 255;
        } else {
          // Semi-transparent interior
          buffer[idx] = Math.floor(r * 0.3);
          buffer[idx + 1] = Math.floor(g * 0.3);
          buffer[idx + 2] = Math.floor(b * 0.3);
          buffer[idx + 3] = isActive ? 180 : 80;
        }
      } else {
        buffer[idx + 3] = 0; // transparent
      }
    }
  }

  return nativeImage.createFromBuffer(buffer, { width: size, height: size });
}

function updateTrayMenu(): void {
  if (!tray) return;

  const protStatus = protectionManager.getStatus();
  const isActive = protStatus.state === 'ACTIVE';
  const isStarting = protStatus.state === 'STARTING';
  const isStopping = protStatus.state === 'STOPPING';

  tray.setImage(createTrayIcon(isActive));
  tray.setToolTip(`WiFi Guardian — Protection: ${protStatus.state}`);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open WiFi Guardian',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: `Shield: ${protStatus.state}`,
      enabled: false,
    },
    {
      label: 'Activate Protection',
      enabled: !isActive && !isStarting,
      click: async () => {
        await protectionManager.activateProtection();
      },
    },
    {
      label: 'Deactivate Protection',
      enabled: (isActive || isStarting) && !isStopping,
      click: async () => {
        await protectionManager.deactivateProtection();
      },
    },
    { type: 'separator' },
    {
      label: 'Current Network Status...',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Exit WiFi Guardian',
      click: async () => {
        if (isActive && mainWindow) {
          mainWindow.show();
          const { response } = await dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['Exit & Deactivate Protection', 'Cancel'],
            defaultId: 1,
            cancelId: 1,
            title: 'Protection is Active',
            message: 'Wi-Fi Guardian is currently protecting your network. Are you sure you want to stop protection and exit?',
          });
          if (response === 1) return;
        }
        isQuitting = true;
        await protectionManager.deactivateProtection();
        wifiMonitor.stopMonitoring();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function setupTray(): void {
  tray = new Tray(createTrayIcon(false));
  updateTrayMenu();

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        if (!mainWindow.isFocused()) {
          mainWindow.focus();
        } else {
          mainWindow.hide();
        }
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

function createMainWindow(): void {
  const settings = getAppSettings();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Custom sleek Fluent titlebar
    backgroundColor: '#070b14',
    show: !settings.launchMinimized,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Intercept close button: Hide to tray instead of quitting!
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      if (mainWindow) {
        mainWindow.hide();
      }
      const s = getAppSettings();
      if (s.desktopNotifications) {
        if (Notification.isSupported()) {
          new Notification({
            title: 'WiFi Guardian',
            body: 'WiFi Guardian is running in the background. Wi-Fi protection remains active in your system tray.',
            silent: true,
          }).show();
        } else if (tray) {
          tray.displayBalloon({
            title: 'WiFi Guardian Running in Background',
            content: 'Wi-Fi protection and connection monitoring remain active in your Windows system tray.',
            iconType: 'info',
          });
        }
      }
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register IPC handlers
function registerIpcHandlers(): void {
  // Wi-Fi Telemetry
  ipcMain.handle('wifi:getInfo', async () => {
    return wifiMonitor.getCurrentInfo();
  });

  ipcMain.handle('wifi:scanNearby', async () => {
    return wifiMonitor.scanNearbyNetworks();
  });

  // Protection
  ipcMain.handle('protection:getStatus', () => {
    return protectionManager.getStatus();
  });

  ipcMain.handle('protection:getStats', () => {
    return protectionManager.getStats();
  });

  ipcMain.handle('protection:activate', async () => {
    return protectionManager.activateProtection();
  });

  ipcMain.handle('protection:deactivate', async () => {
    return protectionManager.deactivateProtection();
  });

  // Logs
  ipcMain.handle('logs:get', (_e, filter, search) => {
    return storage.getLogs(200, filter, search);
  });

  ipcMain.handle('logs:clear', () => {
    return storage.clearLogs();
  });

  ipcMain.handle('logs:exportCsv', () => {
    return storage.exportLogsCsv();
  });

  // Settings
  ipcMain.handle('settings:get', () => {
    return getAppSettings();
  });

  ipcMain.handle('settings:save', (_e, updated) => {
    saveAppSettings(updated);
    return true;
  });

  // Settings Protection
  ipcMain.handle('settings-lock:getStatus', () => {
    return settingsProtection.getStatus();
  });

  ipcMain.handle('settings-lock:auth', (_e, password) => {
    return settingsProtection.authenticate(password);
  });

  ipcMain.handle('settings-lock:setPassword', (_e, password) => {
    return settingsProtection.setPassword(password);
  });

  ipcMain.handle('settings-lock:lock', () => {
    settingsProtection.lockSettings();
    updateTrayMenu();
  });

  ipcMain.handle('settings-lock:unlock', () => {
    settingsProtection.unlockSettingsPermanently();
    updateTrayMenu();
  });

  // Window controls
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close(); // Triggers the close-to-tray intercept
  });

  ipcMain.handle('app:quit', async () => {
    isQuitting = true;
    await protectionManager.deactivateProtection();
    wifiMonitor.stopMonitoring();
    app.quit();
  });
}

// App Lifecycle
app.whenReady().then(async () => {
  await storage.init();

  // Register IPC
  registerIpcHandlers();

  // Setup System Tray
  setupTray();

  // Create Window
  createMainWindow();

  // Start background monitoring
  await wifiMonitor.startMonitoring(2500);

  // Wire event broadcasts to renderer window
  wifiMonitor.onNetworkChange((current) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('wifi:updated', current);
    }
  });

  // Regular telemetry push every 2 seconds
  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('wifi:updated', wifiMonitor.getCurrentInfo());
    }
  }, 2000);

  protectionManager.onStateChange((status) => {
    updateTrayMenu();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('protection:updated', status);
    }
  });

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
  });
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});
