import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingApi } from '../api';

interface SettingsContextType {
  settings: Record<string, string>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsPayload: (payload: Record<string, string>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingApi.getAll();
      if (res.data && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch site settings", e);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingsPayload = async (payload: Record<string, string>) => {
    await settingApi.saveAll(payload);
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettingsPayload }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
