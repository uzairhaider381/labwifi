import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import initSqlJs, { Database } from 'sql.js';

export interface LogEntry {
  id?: number;
  timestamp: string;
  event: string;
  description: string;
  category: 'protection' | 'network' | 'system' | 'security';
  status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  details?: string;
}

export class StorageService {
  private db: Database | null = null;
  private dbPath: string = '';
  private initialized = false;

  constructor() {
    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    this.dbPath = path.join(userDataPath, 'wifi_guardian.sqlite3');
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs();
      if (fs.existsSync(this.dbPath)) {
        const fileBuffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(fileBuffer);
      } else {
        this.db = new SQL.Database();
      }

      this.createTables();
      this.seedInitialDataIfEmpty();
      this.persist();
      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize SQLite via sql.js, falling back to local file store:', err);
      this.initFallbackStore();
      this.initialized = true;
    }
  }

  private createTables(): void {
    if (!this.db) return;
    this.db.run(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        event TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS audit_trail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT
      );
    `);
  }

  private seedInitialDataIfEmpty(): void {
    if (!this.db) return;
    const res = this.db.exec("SELECT COUNT(*) as count FROM activity_logs");
    const count = res[0]?.values[0]?.[0] as number || 0;
    if (count === 0) {
      this.addLog({
        timestamp: new Date().toISOString(),
        event: 'System Initialized',
        description: 'WiFi Guardian security engine initialized successfully.',
        category: 'system',
        status: 'INFO',
        details: 'SQLite storage mounted and baseline security rules loaded.'
      });
      this.addLog({
        timestamp: new Date().toISOString(),
        event: 'Background Agent Ready',
        description: 'Windows Wi-Fi monitor background service standby mode active.',
        category: 'network',
        status: 'SUCCESS',
        details: 'Adapter listening for beacon changes and gateway ARP integrity.'
      });
    }
  }

  private persist(): void {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (err) {
      console.error('Failed to persist SQLite database to disk:', err);
    }
  }

  public addLog(entry: LogEntry): void {
    if (!this.db) {
      this.fallbackAddLog(entry);
      return;
    }
    try {
      const stmt = this.db.prepare(`
        INSERT INTO activity_logs (timestamp, event, description, category, status, details)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run([
        entry.timestamp || new Date().toISOString(),
        entry.event,
        entry.description,
        entry.category,
        entry.status,
        entry.details || ''
      ]);
      stmt.free();
      this.persist();
    } catch (err) {
      console.error('Error inserting log into SQLite:', err);
      this.fallbackAddLog(entry);
    }
  }

  public getLogs(limit = 100, filterCategory?: string, searchTerm?: string): LogEntry[] {
    if (!this.db) return this.fallbackGetLogs(limit, filterCategory, searchTerm);

    try {
      let query = "SELECT id, timestamp, event, description, category, status, details FROM activity_logs";
      const conditions: string[] = [];
      const params: any[] = [];

      if (filterCategory && filterCategory !== 'all') {
        conditions.push("category = ?");
        params.push(filterCategory);
      }

      if (searchTerm && searchTerm.trim() !== '') {
        conditions.push("(event LIKE ? OR description LIKE ? OR details LIKE ?)");
        const term = `%${searchTerm.trim()}%`;
        params.push(term, term, term);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY id DESC LIMIT ?";
      params.push(limit);

      const stmt = this.db.prepare(query);
      stmt.bind(params);
      const results: LogEntry[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push({
          id: row.id as number,
          timestamp: row.timestamp as string,
          event: row.event as string,
          description: row.description as string,
          category: row.category as any,
          status: row.status as any,
          details: row.details as string,
        });
      }
      stmt.free();
      return results;
    } catch (err) {
      console.error('Error querying SQLite logs:', err);
      return this.fallbackGetLogs(limit, filterCategory, searchTerm);
    }
  }

  public clearLogs(): boolean {
    if (!this.db) return this.fallbackClearLogs();
    try {
      this.db.run("DELETE FROM activity_logs");
      this.addLog({
        timestamp: new Date().toISOString(),
        event: 'Logs Cleared',
        description: 'Audit and activity history purged by administrator.',
        category: 'system',
        status: 'INFO',
        details: 'User initiated log purge.'
      });
      this.persist();
      return true;
    } catch (err) {
      console.error('Error clearing logs:', err);
      return false;
    }
  }

  public exportLogsCsv(): string {
    const logs = this.getLogs(5000);
    const headers = ['ID', 'Timestamp', 'Event', 'Description', 'Category', 'Status', 'Details'];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${(l.event || '').replace(/"/g, '""')}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.status}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ].join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  public getSetting<T>(key: string, defaultValue: T): T {
    if (!this.db) return this.fallbackGetSetting(key, defaultValue);
    try {
      const stmt = this.db.prepare("SELECT value FROM settings WHERE key = ?");
      stmt.bind([key]);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return JSON.parse(row.value as string);
      }
      stmt.free();
      return defaultValue;
    } catch (err) {
      return defaultValue;
    }
  }

  public setSetting<T>(key: string, value: T): void {
    if (!this.db) {
      this.fallbackSetSetting(key, value);
      return;
    }
    try {
      const valStr = JSON.stringify(value);
      this.db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, valStr]);
      this.persist();
    } catch (err) {
      console.error(`Error saving setting ${key}:`, err);
      this.fallbackSetSetting(key, value);
    }
  }

  // Resilient JSON-backed fallback in case WASM binary loading has issues in packaging
  private fallbackStorePath = '';
  private fallbackStore: { logs: LogEntry[]; settings: Record<string, any>; audits: any[] } = { logs: [], settings: {}, audits: [] };

  private initFallbackStore(): void {
    const userDataPath = app.getPath('userData');
    this.fallbackStorePath = path.join(userDataPath, 'wifi_guardian_store.json');
    if (fs.existsSync(this.fallbackStorePath)) {
      try {
        const raw = fs.readFileSync(this.fallbackStorePath, 'utf8');
        this.fallbackStore = JSON.parse(raw);
      } catch (e) {
        this.fallbackStore = { logs: [], settings: {}, audits: [] };
      }
    }
  }

  private saveFallback(): void {
    try {
      fs.writeFileSync(this.fallbackStorePath, JSON.stringify(this.fallbackStore, null, 2));
    } catch (e) {
      console.error('Fallback save error:', e);
    }
  }

  private fallbackAddLog(entry: LogEntry): void {
    if (!this.fallbackStorePath) this.initFallbackStore();
    const id = (this.fallbackStore.logs[0]?.id || 0) + 1;
    this.fallbackStore.logs.unshift({ ...entry, id });
    this.saveFallback();
  }

  private fallbackGetLogs(limit = 100, filterCategory?: string, searchTerm?: string): LogEntry[] {
    if (!this.fallbackStorePath) this.initFallbackStore();
    let res = this.fallbackStore.logs;
    if (filterCategory && filterCategory !== 'all') {
      res = res.filter(l => l.category === filterCategory);
    }
    if (searchTerm && searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      res = res.filter(l =>
        l.event.toLowerCase().includes(s) ||
        l.description.toLowerCase().includes(s) ||
        (l.details || '').toLowerCase().includes(s)
      );
    }
    return res.slice(0, limit);
  }

  private fallbackClearLogs(): boolean {
    this.fallbackStore.logs = [];
    this.saveFallback();
    return true;
  }

  private fallbackGetSetting<T>(key: string, defaultValue: T): T {
    if (!this.fallbackStorePath) this.initFallbackStore();
    return this.fallbackStore.settings[key] !== undefined ? this.fallbackStore.settings[key] : defaultValue;
  }

  private fallbackSetSetting<T>(key: string, value: T): void {
    if (!this.fallbackStorePath) this.initFallbackStore();
    this.fallbackStore.settings[key] = value;
    this.saveFallback();
  }
}
