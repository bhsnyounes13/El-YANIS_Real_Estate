import { useState } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Download, X, Share2, Smartphone, Check } from 'lucide-react';
import './InstallPrompt.css';

type Language = 'en' | 'ar' | 'fr';

export default function InstallPrompt({ language = 'en' as Language }) {
  const { 
    showInstallButton, 
    isInstalled, 
    isIOS, 
    isInstallable,
    install, 
    dismissInstall,
    isOnline,
    deferredPrompt
  } = usePWA();

  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Translations
  const translations: Record<Language, Record<string, string>> = {
    en: {
      download: 'Download App',
      installing: 'Installing...',
      installed: 'App Installed!',
      dismiss: 'Cancel',
      iOSTitle: 'Add to Home Screen',
      iOSDescription: 'To install EL-YANIS Real Estate on your iPhone or iPad:',
      iOSStep1: 'Tap the Share button',
      iOSStep2: 'Scroll down and tap "Add to Home Screen"',
      iOSStep3: 'Tap "Add" in the top right corner',
      iOSGotIt: 'Got it!',
      offline: 'You are offline. Reconnect to use the app.',
      offlineTitle: 'Offline',
    },
    ar: {
      download: 'تحميل التطبيق',
      installing: 'جاري التثبيت...',
      installed: 'تم تثبيت التطبيق!',
      dismiss: 'إلغاء',
      iOSTitle: 'إضافة إلى الشاشة الرئيسية',
      iOSDescription: 'لتثبيت عقارات ال يانيس على iPhone أو iPad:',
      iOSStep1: 'انقر على زر المشاركة',
      iOSStep2: 'مرر لأسفل وانقر على "إضافة إلى الشاشة الرئيسية"',
      iOSStep3: 'انقر على "إضافة" في الزاوية العلوية اليمنى',
      iOSGotIt: 'حسناً!',
      offline: 'أنت غير متصل. أعد الاتصال لاستخدام التطبيق.',
      offlineTitle: 'غير متصل',
    },
    fr: {
      download: "Télécharger l'app",
      installing: 'Installation...',
      installed: 'Application installée!',
      dismiss: 'Annuler',
      iOSTitle: 'Ajouter à l\'écran d\'accueil',
      iOSDescription: 'Pour installer EL-YANIS Immobilier sur votre iPhone ou iPad:',
      iOSStep1: 'Appuyez sur le bouton Partager',
      iOSStep2: 'Faites défiler vers le bas et appuyez sur "Ajouter à l\'écran d\'accueil"',
      iOSStep3: 'Appuyez sur "Ajouter" en haut à droite',
      iOSGotIt: 'Compris!',
      offline: 'Vous êtes hors ligne. Reconnectez-vous pour utiliser l\'application.',
      offlineTitle: 'Hors ligne',
    },
  };

  const trans = translations[language] || translations.en;

  // Handle install click
  const handleInstallClick = async () => {
    if (isIOS && !isInstalled) {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    const result = await install();
    setIsInstalling(false);

    if (result.success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Show offline indicator when offline and installed
  if (!isOnline && isInstalled) {
    return (
      <div className="pwa-offline-indicator">
        <span>{trans.offlineTitle}</span>
      </div>
    );
  }

  // Don't show if installed or no install available and not iOS
  if (isInstalled || (!showInstallButton && !isIOS)) {
    return null;
  }

  // Don't show if dismissed and still not installable
  if (!showInstallButton && !isInstallable && !isIOS) {
    return null;
  }

  // Render install button
  const canInstall = Boolean(showInstallButton && !isInstalled && deferredPrompt);
  
  return (
    <>
      {/* Install Button - Floating */}
      {canInstall && (
        <div className="install-prompt-container">
          <div className="install-prompt animate-slide-up">
            <div className="install-prompt-icon">
              <Download size={20} />
            </div>
            <div className="install-prompt-content">
              <span className="install-prompt-text">{trans.download}</span>
              <span className="install-prompt-subtext">EL-YANIS</span>
            </div>
            <div className="install-prompt-actions">
              <button
                onClick={handleInstallClick}
                className="install-btn-primary"
                disabled={isInstalling}
              >
                {isInstalling ? (
                  <span className="install-btn-loading">
                    <span className="spinner"></span>
                    {trans.installing}
                  </span>
                ) : (
                  <>
                    <Download size={16} />
                    {language === 'ar' ? 'تثبيت' : language === 'fr' ? 'Installer' : 'Install'}
                  </>
                )}
              </button>
              <button
                onClick={dismissInstall}
                className="install-btn-secondary"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="ios-modal-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="ios-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal-header">
              <Smartphone size={32} />
              <h2>{trans.iOSTitle}</h2>
            </div>
            <p className="ios-modal-description">{trans.iOSDescription}</p>
            <div className="ios-modal-steps">
              <div className="ios-step">
                <div className="ios-step-number">1</div>
                <div className="ios-step-content">
                  <Share2 size={24} className="ios-step-icon" />
                  <span>{trans.iOSStep1}</span>
                </div>
              </div>
              <div className="ios-step">
                <div className="ios-step-number">2</div>
                <div className="ios-step-content">
                  <Share2 size={24} className="ios-step-icon" />
                  <span>{trans.iOSStep2}</span>
                </div>
              </div>
              <div className="ios-step">
                <div className="ios-step-number">3</div>
                <div className="ios-step-content">
                  <Check size={24} className="ios-step-icon" />
                  <span>{trans.iOSStep3}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="ios-modal-btn"
            >
              {trans.iOSGotIt}
            </button>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && (
        <div className="install-toast animate-slide-up">
          <div className="install-toast-icon">
            <Check size={20} />
          </div>
          <span>{trans.installed}</span>
        </div>
      )}
    </>
  );
}
