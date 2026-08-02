import React, { useState } from 'react';
import { Settings, X, Shield, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [highRiskThreshold, setHighRiskThreshold] = useState(75);
  const [mediumRiskThreshold, setMediumRiskThreshold] = useState(50);
  const [enableOfflineOnly, setEnableOfflineOnly] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">GitSense AI Settings</h2>
              <p className="text-xs text-slate-400">Configure risk classification thresholds & local storage</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-medium mb-1">High Risk Threshold Score (%): {highRiskThreshold}%</label>
            <input
              type="range"
              min="60"
              max="90"
              value={highRiskThreshold}
              onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Medium Risk Threshold Score (%): {mediumRiskThreshold}%</label>
            <input
              type="range"
              min="30"
              max="60"
              value={mediumRiskThreshold}
              onChange={(e) => setMediumRiskThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span>Local ML Mode</span>
              <span className="text-emerald-400 font-mono text-[10px]">Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Predictions are generated entirely using locally trained models on historical commit features.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
