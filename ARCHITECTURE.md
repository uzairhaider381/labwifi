# WiFi Guardian Architecture Documentation

## 1. System Overview

WiFi Guardian employs a decoupled two-tier architecture:
1. **Windows Local Agent (Desktop):** Electron + React + Node.js + Win32 native networking interfaces. Runs natively on the host machine to perform real hardware queries, background system tray maintenance, and cryptographic setting protection.
2. **Cloud Presentation Platform (Web):** Vercel-hosted React application providing product introduction, software download distribution, operational manuals, and an interactive web simulator.

```
+-----------------------------------------------------------------------------------+
|                            WiFi Guardian Architecture                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Vercel Edge Cloud ]                                                            |
|    - Project landing page & documentation                                         |
|    - Software download repository (WiFiGuardian-Setup.exe)                        |
|    - Interactive Web Simulator (Heuristic demo without hardware access)           |
|                                                                                   |
|  [ Windows Desktop Application ]                                                  |
|    +-------------------------+     IPC (Context Isolation)     +---------------+  |
|    |      React Renderer     | <=============================> |   Preload.ts  |  |
|    |  - Hero Protection Card |                                 +-------+-------+  |
|    |  - Real Telemetry Grid  |                                         |          |
|    |  - Heuristic Policies   |                                         |          |
|    |  - SQLite Logs Viewer   |                                         v          |
|    +-------------------------+                                 +---------------+  |
|                                                                | Electron Main |  |
|                                                                +-------+-------+  |
|                                                                        |          |
|          +--------------------+-------------------+--------------------+          |
|          |                    |                   |                    |          |
|          v                    v                   v                    v          |
|  +---------------+  +-------------------+  +---------------+  +----------------+  |
|  | WifiMonitor   |  | ProtectionManager |  | SettingsLock  |  | StorageService |  |
|  | - netsh wlan  |  | - State Machine   |  | - PBKDF2 Hash |  | - SQLite DB    |  |
|  | - ipconfig    |  | - Rogue AP Guard  |  | - Admin Auth  |  | - Audit Trail  |  |
|  | - ARP Cache   |  | - DNS Guard       |  | - Lock Status |  | - CSV Export   |  |
|  | - WAN Latency |  | - ARP MitM Guard  |  |               |  |                |  |
|  +---------------+  +-------------------+  +---------------+  +----------------+  |
|          |                    |                                        |          |
|          v                    v                                        v          |
|  [ Win32 OS APIs ]    [ Win System Tray ]                     [ Local Storage ]   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Protection State Machine

The core protection engine implements a strict state machine:
- **`INACTIVE`**: Standby mode. Baseline background monitoring only.
- **`STARTING`**: Transitions when user clicks `ACTIVATE`. Queries initial Wi-Fi snapshot (BSSID, DNS, Gateway ARP), records trusted parameters, starts 2s high-frequency audit loop.
- **`ACTIVE`**: Full real-time heuristics engaged. Packets audited, rogue AP spoofing detected, DNS integrity checked.
- **`STOPPING`**: Transitions when user clicks `DEACTIVATE`. Flushes logs, releases high-frequency timers.
- **`ERROR`**: Captured if hardware interface fails or permissions are denied.

---

## 3. Background System Tray Operation

- **Window Close Interception:** The main window's `close` event is intercepted via `e.preventDefault()`. `mainWindow.hide()` is called, keeping Node.js event loops and background polling active.
- **System Tray:** A native `Tray` instance is initialized. Context menu allows:
  - Opening the main window.
  - Viewing live status.
  - One-click Activate / Deactivate directly from tray.
  - Clean application termination.
- **Dynamic Icons:** Generated dynamically based on shield state (Electric Cyan when ACTIVE, Slate Grey when INACTIVE).

---

## 4. Hardware Interrogation Subsystem

All network data displayed in the desktop application is obtained directly from Windows:
- **`netsh wlan show interfaces`**: Obtains SSID, BSSID, Radio Type (802.11ax/ac/n), Authentication (WPA3/WPA2), Cipher, Channel, Signal percentage, and Link Rates (Mbps).
- **`netsh wlan show networks mode=bssid`**: Scans neighboring wireless spectrum and identifies nearby Access Points, signal qualities, and encryption schemes.
- **`ipconfig /all`**: Resolves IPv4 Address, Subnet Mask, Default Gateway, and primary/secondary DNS servers.
- **`arp -a <GatewayIP>`**: Interrogates local ARP cache to bind the default gateway's physical MAC address.
- **Cloud Probe (`http://1.1.1.1`, `http://8.8.8.8`)**: Measures actual WAN latency and detects captive portal / internet loss.

---

## 5. Security & Cryptography

1. **Context Isolation:** `contextIsolation: true` and `nodeIntegration: false`. No Node.js globals are exposed to the DOM.
2. **Settings Lock:** Password verification utilizes Node.js native `crypto.pbkdf2Sync` with SHA-512, 10,000 iterations, and a cryptographically generated 16-byte random salt.
3. **Audit Trail:** All authentication events, settings changes, and defensive interceptions are logged into SQLite.
