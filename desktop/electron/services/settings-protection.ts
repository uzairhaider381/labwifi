import crypto from 'crypto';
import { StorageService } from './storage';

export interface SettingsProtectionStatus {
  isLocked: boolean;
  hasPasswordSet: boolean;
  sessionUnlocked: boolean;
  unlockedUntil: string | null;
  failedAttempts: number;
}

export class SettingsProtectionService {
  private sessionUnlocked = false;
  private unlockExpiry: number | null = null;
  private failedAttempts = 0;

  constructor(private storage: StorageService) {}

  public getStatus(): SettingsProtectionStatus {
    const isLocked = this.storage.getSetting<boolean>('settingsLocked', false);
    const hasPasswordSet = !!this.storage.getSetting<string>('adminPasswordHash', '');
    const isSessionValid = this.isUnlocked();

    return {
      isLocked,
      hasPasswordSet,
      sessionUnlocked: isSessionValid,
      unlockedUntil: this.unlockExpiry ? new Date(this.unlockExpiry).toISOString() : null,
      failedAttempts: this.failedAttempts,
    };
  }

  public isUnlocked(): boolean {
    const isLocked = this.storage.getSetting<boolean>('settingsLocked', false);
    if (!isLocked) return true; // not locked at all
    if (this.sessionUnlocked && this.unlockExpiry && Date.now() < this.unlockExpiry) {
      return true;
    }
    this.sessionUnlocked = false;
    this.unlockExpiry = null;
    return false;
  }

  public setPassword(newPassword: string): { success: boolean; message: string } {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(newPassword, salt, 10000, 64, 'sha512').toString('hex');

    this.storage.setSetting('adminPasswordSalt', salt);
    this.storage.setSetting('adminPasswordHash', hash);

    this.storage.addLog({
      timestamp: new Date().toISOString(),
      event: 'Admin Credential Configured',
      description: 'Administrator settings protection passcode updated.',
      category: 'security',
      status: 'SUCCESS',
      details: 'Cryptographic PBKDF2-SHA512 hash persisted in secure vault.'
    });

    return { success: true, message: 'Administrator password updated successfully.' };
  }

  public authenticate(password: string): { success: boolean; message: string } {
    const salt = this.storage.getSetting<string>('adminPasswordSalt', '');
    const expectedHash = this.storage.getSetting<string>('adminPasswordHash', '');

    // Default password if none set is 'admin123'
    if (!salt || !expectedHash) {
      if (password === 'admin123' || password === 'admin') {
        this.grantSession();
        return { success: true, message: 'Authenticated with default admin key.' };
      }
    } else {
      const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))) {
        this.grantSession();
        return { success: true, message: 'Administrator credentials verified.' };
      }
    }

    this.failedAttempts++;
    this.storage.addLog({
      timestamp: new Date().toISOString(),
      event: 'Admin Unlock Failed',
      description: 'Failed administrator password verification attempt.',
      category: 'security',
      status: 'WARNING',
      details: `Attempt #${this.failedAttempts}. Unauthorized settings access prevented.`
    });

    return { success: false, message: 'Invalid administrator password.' };
  }

  private grantSession(): void {
    this.sessionUnlocked = true;
    this.unlockExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes session
    this.failedAttempts = 0;

    this.storage.addLog({
      timestamp: new Date().toISOString(),
      event: 'Settings Unlocked',
      description: 'Administrative configuration controls unlocked for 15 minutes.',
      category: 'system',
      status: 'SUCCESS',
      details: 'Admin session token granted.'
    });
  }

  public lockSettings(): void {
    this.sessionUnlocked = false;
    this.unlockExpiry = null;
    this.storage.setSetting('settingsLocked', true);

    this.storage.addLog({
      timestamp: new Date().toISOString(),
      event: 'Settings Locked',
      description: 'Wi-Fi security configuration controls locked under administrator protection.',
      category: 'security',
      status: 'INFO',
      details: 'Modification of protected network policies now requires elevation.'
    });
  }

  public unlockSettingsPermanently(): void {
    this.sessionUnlocked = false;
    this.unlockExpiry = null;
    this.storage.setSetting('settingsLocked', false);

    this.storage.addLog({
      timestamp: new Date().toISOString(),
      event: 'Settings Lock Disabled',
      description: 'Administrator lock removed. All settings accessible.',
      category: 'system',
      status: 'INFO',
      details: 'Lock policy toggled OFF.'
    });
  }
}
