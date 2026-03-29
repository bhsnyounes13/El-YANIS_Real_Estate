import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isOnline: boolean;
  showInstallButton: boolean;
  dismissReason: 'dismissed' | 'accepted' | 'installed' | null;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    deferredPrompt: null,
    isInstallable: false,
    isInstalled: false,
    isIOS: false,
    isOnline: navigator.onLine,
    showInstallButton: false,
    dismissReason: null,
  });

  // Check if running as an installed PWA
  const checkInstalled = useCallback(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    return isStandalone;
  }, []);

  // Check if device is iOS
  const checkIsIOS = useCallback(() => {
    const userAgent = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    return iOS;
  }, []);

  // Initialize PWA detection
  useEffect(() => {
    // Check current platform
    const isStandalone = checkInstalled();
    const isIOSDevice = checkIsIOS();

    setState(prev => ({
      ...prev,
      isInstalled: isStandalone,
      isIOS: isIOSDevice,
      isOnline: navigator.onLine,
    }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      
      // Don't show if already installed
      if (isStandalone) return;

      setState(prev => ({
        ...prev,
        deferredPrompt: e as BeforeInstallPromptEvent,
        isInstallable: true,
        showInstallButton: true,
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        showInstallButton: false,
        deferredPrompt: null,
        dismissReason: 'installed',
      }));
    };

    // Listen for online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkInstalled, checkIsIOS]);

  // Install handler
  const install = useCallback(async () => {
    const { deferredPrompt } = state;
    
    if (!deferredPrompt) {
      // If iOS, show instructions - handled by component
      if (state.isIOS) {
        return { success: false, ios: true };
      }
      return { success: false };
    }

    try {
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          showInstallButton: false,
          deferredPrompt: null,
        }));
        return { success: true, accepted: true };
      } else {
        setState(prev => ({
          ...prev,
          dismissReason: 'dismissed',
        }));
        return { success: false, dismissed: true };
      }
    } catch (error) {
      console.error('Install prompt error:', error);
      return { success: false, error };
    }
  }, [state.deferredPrompt, state.isIOS]);

  // Dismiss install button
  const dismissInstall = useCallback(() => {
    setState(prev => ({
      ...prev,
      showInstallButton: false,
      dismissReason: 'dismissed',
    }));
  }, []);

  // Show install button again (for testing)
  const showInstallButton = useCallback(() => {
    if (!state.isInstalled && state.deferredPrompt) {
      setState(prev => ({
        ...prev,
        showInstallButton: true,
        dismissReason: null,
      }));
    }
  }, [state.isInstalled, state.deferredPrompt]);

  return {
    ...state,
    install,
    dismissInstall,
    showInstallButton,
  };
}

export default usePWA;
