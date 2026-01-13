import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { Heart, Stethoscope, Loader2, Mail } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Role State (Default 'mother')
    const [role, setRole] = useState<'mother' | 'health_worker'>('mother');

    // Email Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login/Sign Up for Email

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    data: {
                        role: role,
                    },
                    redirectTo: window.location.origin + '/auth/callback',
                } as any,
            });
            if (error) throw error;
        } catch (error: any) {
            toast({
                title: "Google Login Failed",
                description: error.message,
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // SIGN UP
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: role,
                            full_name: email.split('@')[0], // Simple default name
                        },
                    },
                });
                if (error) throw error;
                toast({
                    title: "Account Created!",
                    description: "Please check your email to verify your account.",
                });
            } else {
                // LOG IN
                const { data: { session }, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                if (session) {
                    // Check role and redirect
                    const { data: profile } = await supabase
                        .from('profiles' as any)
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    const userRole = (profile as any)?.role || 'mother';
                    handleRedirect(userRole);
                }
            }
        } catch (error: any) {
            toast({
                title: isSignUp ? "Sign Up Failed" : "Login Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = (userRole: string) => {
        if (userRole === 'health_worker') {
            navigate('/worker/dashboard');
        } else {
            navigate('/mother/home');
        }
    };

    return (
        <PageLayout maxWidth="full" className="relative flex items-center justify-center min-h-[85vh] overflow-hidden bg-background">
            {/* Background Effects for Glassmorphism */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[100px] animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-white/20 shadow-2xl animate-fade-in transition-all duration-300 z-10">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500 mb-2 drop-shadow-sm">
                        MaaSathi AI
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-muted-foreground/80">
                        Your companion for a safer journey
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    {/* ROLE SELECTOR - CRITICAL */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('mother')}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group ${role === 'mother'
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 transform scale-[1.02]'
                                : 'border-border/50 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 hover:border-primary/50'
                                }`}
                        >
                            {role === 'mother' && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-ping" />
                            )}
                            <Heart className={`w-8 h-8 mb-2 transition-colors ${role === 'mother' ? 'text-primary fill-primary/20' : 'text-muted-foreground group-hover:text-primary/70'}`} />
                            <span className={`font-bold text-sm transition-colors ${role === 'mother' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'}`}>
                                I am a Mother
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('health_worker')}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group ${role === 'health_worker'
                                ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/10 transform scale-[1.02]'
                                : 'border-border/50 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 hover:border-teal-500/50'
                                }`}
                        >
                            {role === 'health_worker' && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                            )}
                            <Stethoscope className={`w-8 h-8 mb-2 transition-colors ${role === 'health_worker' ? 'text-teal-500' : 'text-muted-foreground group-hover:text-teal-500/70'}`} />
                            <span className={`font-bold text-sm transition-colors ${role === 'health_worker' ? 'text-teal-500' : 'text-muted-foreground group-hover:text-teal-500/70'}`}>
                                Health Worker
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* GOOGLE BUTTON - PRIMARY ACTION */}
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-medium shadow-sm hover:shadow-md transition-all border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/60 backdrop-blur-sm"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                            )}
                            Continue with Google
                        </Button>

                        {/* OR SEPARATOR */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted-foreground/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-muted-foreground font-semibold">
                                    Or use email
                                </span>
                            </div>
                        </div>

                        {/* EMAIL ACCORDION - SECONDARY ACTION */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="email-options" className="border-none">
                                <AccordionTrigger className="py-2 text-sm justify-center text-muted-foreground hover:text-foreground/80 transition-colors">
                                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Sign in with Email</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-1">
                                    <form onSubmit={handleEmailAuth} className="space-y-3 pt-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="example@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-white/50 dark:bg-black/20 border-white/20 focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="bg-white/50 dark:bg-black/20 border-white/20 focus:border-primary/50"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isSignUp ? "Sign Up" : "Log In"}
                                        </Button>
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setIsSignUp(!isSignUp)}
                                                className="text-xs text-muted-foreground hover:text-primary hover:underline font-medium transition-colors"
                                            >
                                                {isSignUp
                                                    ? "Already have an account? Log in"
                                                    : "Don't have an account? Sign up"}
                                            </button>
                                        </div>
                                    </form>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <div className="text-[10px] text-muted-foreground/80 bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-sm">
                        Debug Info: Selected Role is <span className="font-mono font-bold text-primary">{role}</span>
                    </div>
                </CardFooter>
            </Card>
        </PageLayout>
    );
};

export default Login;
