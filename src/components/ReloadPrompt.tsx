import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "./ui/button";

const ReloadPrompt = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            (`Service Worker at: ${swUrl}`);
        },
        onRegisterError(error) {
            ("SW registration error", error);
        },
    });

    useEffect(() => {
        if (needRefresh) {
            toast("New content available, click on reload button to update.", {
                action: (
                    <Button onClick={() => updateServiceWorker(true)} size="sm">
                        Reload
                    </Button>
                ),
                duration: Infinity,
            });
        }
    }, [needRefresh, updateServiceWorker]);

    return null;
};

export default ReloadPrompt;
