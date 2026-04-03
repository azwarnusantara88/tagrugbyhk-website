import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt, show instructions
      alert('To install:\n\niPhone: Tap Share → Add to Home Screen\nAndroid: Tap Menu → Add to Home Screen');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  // Don't show if already installed or banner dismissed
  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-auto">
      <div className="bg-[#0B3D2E] border border-[#CFFF2E]/30 rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-md mx-auto sm:mx-0">
        {/* Icon */}
        <div className="w-12 h-12 bg-[#CFFF2E] rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-[#0B3D2E]" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Install TAG ASIA CUP</p>
          <p className="text-white/60 text-xs">Add to home screen for quick access</p>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-bold text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Install
        </button>

        {/* Close Button */}
        <button
          onClick={() => setShowBanner(false)}
          className="flex-shrink-0 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
