import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const HomeRedirect = () => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);
            try {
                const { data: profile } = await supabase
                    .from('profiles' as any)
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                setRole((profile as any)?.role || 'mother');
            } catch (error) {
                console.error("Error fetching role:", error);
                setRole('mother');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role === 'health_worker') {
        return <Navigate to="/worker/dashboard" replace />;
    }

    return <Navigate to="/mother/home" replace />;
};

export default HomeRedirect;
