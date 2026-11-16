# WiFi Guardian Installation & Setup Guide

## System Requirements

- **Operating System:** Windows 10 (1809+) or Windows 11 (64-bit)
- **Architecture:** x64
- **Network Interface:** 802.11n / 802.11ac / 802.11ax compatible Wi-Fi adapter
- **RAM:** 256 MB available memory
- **Disk Space:** ~180 MB free disk space

---

## 1. Running the Windows Setup Installer (`WiFiGuardian-Setup.exe`)

1. Locate the built installer:
   ```
   d:\semproject\desktop\release\WiFiGuardian-Setup.exe
   ```
2. Double-click **`WiFiGuardian-Setup.exe`**.
3. The wizard will present:
   - Installation directory destination selection (default: `%LOCALAPPDATA%\Programs\WiFi Guardian`).
   - Desktop shortcut creation option.
   - Start Menu shortcut creation.
4. Click **Install**.
5. Once complete, check **Run WiFi Guardian** and click **Finish**.
6. The application launches immediately into the system tray and displays the Main Overview Dashboard.

---

## 2. Running the Portable / Unpacked Version

If you prefer to run WiFi Guardian without installation:
1. Navigate to:
   ```
   d:\semproject\desktop\release\win-unpacked\
   ```
2. Double-click **`WiFi Guardian.exe`**.
3. All features, background tray operation, and Wi-Fi diagnostics function identically.

---

## 3. Running from Source in Development Mode

### Prerequisites:
- Node.js (v18, v20, or v24)
- PowerShell

### Commands:
```powershell
# 1. Navigate to desktop directory
cd d:\semproject\desktop

# 2. Build TypeScript front-end and Electron processes
npm run build

# 3. Start Electron desktop application
npm start
```

---

## 4. Deploying the Web Dashboard to Vercel

The Vercel-ready web project is located in `d:\semproject\web`.

### Deploy via Vercel CLI:
```bash
cd d:\semproject\web
npx vercel
```

### Deploy via GitHub / Vercel Web Console:
1. Push repository to GitHub.
2. Log into [vercel.com](https://vercel.com).
3. Import project, and set **Root Directory** to `web`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.
