import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.jsx";
import { useTheme } from "../components/ThemeProvider.jsx";
import lightLogo from "../assets/Tubbit_Logo_final_light.png";
import darkLogo from "../assets/Tubbit_Logo_final_dark2.png";
import { signUp, signIn } from "../services/user/auth.api.js";
import {login as storeLogin} from "../store/AuthSlice.js";


const Auth = () => {
  const { theme } = useTheme();
  const logo = theme == "dark" ? darkLogo : lightLogo;

  const navigate = useNavigate();
  const signInAuthStatus = useSelector((state) => state.auth.status);
  const signinDispatch = useDispatch();
  const signUpDispatch = useDispatch();

  const {
    register: signinRegister,
    handleSubmit: signinHandleSubmit,
    formState: { errors: signinErrors },
  } = useForm();
  const {
    register: signupRegister,
    handleSubmit: signupHandleSubmit,
    formState: { errors: signupErrors },
  } = useForm();

  const logInUser = async (data) => {
    await signIn(data);
    const response = await signIn(data);
    if (response.status === 200) {
      const userData = response.data;
      signinDispatch(storeLogin(userData));
      navigate("/");
    }
  };

  const createAccount = async (data) => {

    const response = await signUp(data);
    if (response.status === 201 || response.status === 200) {
      userData = response.data;
      signUpDispatch(storeLogin(userData));
      navigate("/");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mx-auto">
            <img
              src={logo}
              alt="Tubbit Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-300 mb-2">
            Welcome to Tubbit
          </h1>
          <p className="text-muted-foreground">
            Join the community of creators and learners
          </p>
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
                <form
                  onSubmit={signinHandleSubmit(logInUser)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <Input
                      type="username"
                      placeholder="johndoe"
                      className="transition-all focus:scale-[1.02]"
                      {...signinRegister("username", {
                        required: "Username is required",
                      })}
                    />
                    {signinErrors.username && (
                      <span className="text-sm text-red-200">
                        {signinErrors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="transition-all focus:scale-[1.02]"
                      {...signinRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {signinErrors.email && (
                      <span className="text-sm text-red-200">
                        {signinErrors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="transition-all focus:scale-[1.02]"
                      {...signinRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters ",
                        },
                      })}
                    />
                    {signinErrors.password && (
                      <span className="text-sm text-red-200">
                        {signinErrors.password.message}
                      </span>
                    )}
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
                <form
                  onSubmit={signupHandleSubmit(createAccount)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="transition-all focus:scale-[1.02]"
                      {...signupRegister("fullname", {
                        required: "Full Name is required",
                        pattern: {
                          value:
                            /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/,
                          message: "Invalid Name format",
                        },
                      })}
                    />
                    {signupErrors.fullname && (
                      <span className="text-red-200 text-sm">
                        {signupErrors.fullname.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      type="text"
                      placeholder="johndoe"
                      className="transition-all focus:scale-[1.02]"
                      {...signupRegister("username", {
                        required: "Username is required",
                      })}
                    />
                    {signupErrors.username && (
                      <span className="text-red-200 text-sm">
                        {signupErrors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="transition-all focus:scale-[1.02]"
                      {...signupRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {signupErrors.email && (
                      <span className="text-red-200 text-sm">
                        {signupErrors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="transition-all focus:scale-[1.02]"
                      {...signupRegister("password", {
                        required: "Password is required",
                        pattern: {
                          value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                          message:
                            "Must include upper, lower, number, and 8+ chars",
                        },
                      })}
                    />
                    {signupErrors.password && (
                      <span className="text-red-200 text-sm">
                        {signupErrors.password.message}
                      </span>
                    )}
                  </div>
                  <Button type="submit" className="w-full hover-scale">
                    Create Account
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy
                    Policy.
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mb-3 text-center">
          <p className="text-sm text-muted-foreground">Continue with</p>
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
