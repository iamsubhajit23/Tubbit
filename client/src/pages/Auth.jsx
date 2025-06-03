import React, { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Label } from '../components/ui/Label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs.jsx';

const Auth = () => {
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: ''
    });

    const [signUpForm, setSignUpForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Sign in:', signInForm);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('Sign up:', signUpForm);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
            <div className="w-full max-w-md animate-scale-in">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-tubbit-primary to-tubbit-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">Welcome to Tubbit</h1>
                    <p className="text-muted-foreground">Join the community of creators and learners</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* Sign In */}
                        <TabsContent value="signin">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Sign In</CardTitle>
                                <CardDescription>
                                    Welcome back! Please sign in to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={signInForm.email}
                                            onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signInForm.password}
                                            onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full hover-scale">
                                        Sign In
                                    </Button>
                                </form>

                                <div className="mt-4 text-center">
                                    <Button variant="link" className="text-sm">
                                        Forgot your password?
                                    </Button>
                                </div>
                            </CardContent>
                        </TabsContent>

                        {/* Sign Up */}
                        <TabsContent value="signup">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Create Account</CardTitle>
                                <CardDescription>
                                    Join Tubbit and start sharing your content today!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-username">Username</Label>
                                        <Input
                                            id="signup-username"
                                            type="text"
                                            placeholder="johndoe"
                                            value={signUpForm.username}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={signUpForm.email}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signUpForm.password}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-confirm">Confirm Password</Label>
                                        <Input
                                            id="signup-confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signUpForm.confirmPassword}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="transition-all focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full hover-scale">
                                        Create Account
                                    </Button>
                                </form>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        By signing up, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Continue with
                    </p>
                    <div className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1 hover-scale">
                            Google
                        </Button>
                        <Button variant="outline" className="flex-1 hover-scale">
                            GitHub
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
