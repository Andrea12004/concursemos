import { useState, useCallback } from 'react';

export const useNotifyToggle = () => {
  const [notifyStates, setNotifyStates] = useState<Record<string, boolean>>({});

  const toggleNotify = useCallback((itemId: string) => {
    setNotifyStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  const getNotifyIcon = useCallback((itemId: string): string => {
    return notifyStates[itemId] 
      ? 'notifyselected.svg' 
      : 'notify.svg';
  }, [notifyStates]);

  return {
    notifyStates,
    toggleNotify,
    getNotifyIcon
  };
};