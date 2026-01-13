import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Fetch Profile to determine redirect
                const { data: profile } = await supabase
                    .from('profiles' as any)
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                const role = (profile as any)?.role || 'mother';

                if (role === 'health_worker') {
                    navigate('/worker/dashboard', { replace: true });
                } else {
                    navigate('/mother/home', { replace: true });
                }
            } else if (event === 'SIGNED_OUT') {
                navigate('/login', { replace: true });
            }
        });
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Verifying Access...</p>
        </div>
    );
};

export default AuthCallback;
