import React, { useState } from 'react';
import { Lock, Unlock, Key, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isSettingPassword?: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isSettingPassword = false,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSettingPassword) {
        if (password.length < 4) {
          setError('Password must be at least 4 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const res = await (window as any).api.setAdminPassword(password);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.message);
        }
      } else {
        const res = await (window as any).api.authenticateAdmin(password);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.message || 'Incorrect administrator password.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#0c1322] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            {isSettingPassword ? <Key className="w-6 h-6" /> : <Lock className="w-6 h-6 text-amber-400" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isSettingPassword ? 'Set Administrator Password' : 'Administrator Authorization'}
            </h3>
            <p className="text-xs text-slate-400">
              {isSettingPassword
                ? 'Create a master password to protect Wi-Fi security policies.'
                : 'Enter administrator credentials to unlock protected controls.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {isSettingPassword ? 'New Admin Password' : 'Admin Passcode / Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSettingPassword ? 'Enter new password...' : 'Default: admin123'}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all"
            />
          </div>

          {isSettingPassword && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all"
              />
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Verifying...' : isSettingPassword ? 'Save Password' : 'Unlock Controls'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
