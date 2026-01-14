import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchUserRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchUserRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = async (userId: string) => {
        try {
            const { data: profile } = await supabase
                .from('profiles' as any)
                .select('role')
                .eq('id', userId)
                .single();

            setUserRole((profile as any)?.role || 'mother');
        } catch (error) {
            console.error('Error fetching role:', error);
            setUserRole('mother'); // Default fallback
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        // Redirect to login, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // User is logged in but doesn't have the right role
        // Redirect them to their appropriate home
        if (userRole === 'health_worker') {
            return <Navigate to="/worker/dashboard" replace />;
        } else {
            return <Navigate to="/mother/home" replace />;
        }
    }

    // Authorized
    return <Outlet />;
};

export default ProtectedRoute;
