import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { Heart, Stethoscope, Loader2, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
                style={{
                    backgroundImage: `url('/login_background.png')`,
                    filter: 'blur(3px)'
                }}
            />

            {/* Gradient Overlay for better readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90" />

            <Card className="w-full max-w-md bg-white/80 dark:bg-black/60 backdrop-blur-xl border-white/20 shadow-2xl animate-fade-in transition-all duration-300 z-10">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-20 h-20 bg-white/50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-white/30 backdrop-blur-md">
                        <img src="/pwa-192x192.png" alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
                    </div>
                    <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500 mb-2 drop-shadow-sm">
                        MaaSathi AI
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-muted-foreground/90">
                        Your companion for a safer journey
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    {/* ROLE SELECTOR */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('mother')}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group ${role === 'mother'
                                ? 'border-primary bg-primary/20 shadow-lg shadow-primary/10 transform scale-[1.02]'
                                : 'border-border/50 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 hover:border-primary/50'
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
                                ? 'border-teal-500 bg-teal-500/20 shadow-lg shadow-teal-500/10 transform scale-[1.02]'
                                : 'border-border/50 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 hover:border-teal-500/50'
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
                        {/* GOOGLE BUTTON */}
                        <Button
                            variant="outline"
                            className="w-full h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 hover:bg-white/90 dark:hover:bg-black/70 backdrop-blur-sm flex items-center justify-center gap-3"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                            )}
                            Continue with Google
                        </Button>

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

                        {/* EMAIL ACCORDION */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="email-options" className="border-none">
                                <AccordionTrigger className="py-2 text-sm justify-center text-muted-foreground hover:text-foreground/80 transition-colors">
                                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Sign in with Email</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-1">
                                    <form onSubmit={handleEmailAuth} className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold ml-1">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="example@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-white/50 dark:bg-black/20 border-white/20 focus:border-primary/50 h-12 text-base px-4 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <Label htmlFor="password" className="text-sm font-semibold ml-1">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="bg-white/50 dark:bg-black/20 border-white/20 focus:border-primary/50 h-12 text-base px-4 pr-10 rounded-xl"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full h-12 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 text-lg rounded-xl mt-2" disabled={loading}>
                                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                            {isSignUp ? "Sign Up" : "Log In"}
                                        </Button>
                                        <div className="text-center pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsSignUp(!isSignUp)}
                                                className="text-sm text-muted-foreground hover:text-primary hover:underline font-medium transition-colors"
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
        </div>
    );
};

export default Login;
