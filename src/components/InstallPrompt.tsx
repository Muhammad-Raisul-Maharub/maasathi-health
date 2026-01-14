import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // Handle Android/Desktop install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Wait a bit before showing to not be intrusive immediately
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, show prompt after a delay if not standalone
        if (iOS) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            console.log("No deferred prompt found");
            return;
        }

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
                >
                    <div className="mx-auto max-w-md bg-card border border-border shadow-2xl rounded-2xl p-5">
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>

                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="font-semibold text-lg text-primary">
                                    Install MaaSathi AI
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Add to home screen for offline access and better performance.
                                </p>
                            </div>

                            {isIOS ? (
                                <div className="text-sm space-y-2 bg-muted p-3 rounded-lg text-foreground">
                                    <p className="flex items-center gap-2">
                                        1. Tap the Share button <Share className="w-4 h-4" />
                                    </p>
                                    <p className="flex items-center gap-2">
                                        2. Select "Add to Home Screen" <PlusSquare className="w-4 h-4" />
                                    </p>
                                </div>
                            ) : (
                                // Only show button if we captured the event
                                deferredPrompt && (
                                    <Button onClick={handleInstallClick} className="w-full shadow-lg">
                                        Install App
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
