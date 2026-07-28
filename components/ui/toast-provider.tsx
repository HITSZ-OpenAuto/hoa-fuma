'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function ToastProvider() {
  const isFirstMount = useRef(true);

  useEffect(() => {
    const handleOnline = () => {
      // Don't toast on initial load if already online
      if (isFirstMount.current) return;
      toast.success('网络连接已恢复', {
        description: '您已重新连接到互联网，所有在线功能已恢复使用',
        duration: 3500,
      });
    };

    const handleOffline = () => {
      toast.warning('网络连接已断开', {
        description: '您当前正处于离线浏览模式，部分资源或在线功能可能受到限制',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial offline check
    if (!navigator.onLine && isFirstMount.current) {
      toast.warning('处于离线模式', {
        description: '当前未连接到网络',
        duration: 4000,
      });
    }

    isFirstMount.current = false;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
