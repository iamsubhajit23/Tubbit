import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import lightLogo from "../assets/Tubbit_logo_light.png";
import darkLogo from "../assets/Tubbit_logo_dark.png";
import { signUp, signIn } from "../services/user/auth.api.js";
import { login as storeLogin } from "../store/slices/AuthSlice.js";
import warningToast from "../utils/notification/warning.js";
import OTPVerification from "../components/OTPVerification.jsx";

const Auth = () => {
  const { theme } = useTheme();
  const logo = theme == "dark" ? darkLogo : lightLogo;

  const [showPassword, setShowPassword] = useState(false);
  const [isSigningin, setIsSigningin] = useState(false);
  const [isSignuping, setIsSignuping] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const navigate = useNavigate();
  const signinDispatch = useDispatch();

  const {
    register: signinRegister,
    handleSubmit: signinHandleSubmit,
    formState: { errors: signinErrors },
    watch: signinWatch,
  } = useForm();
  const {
    register: signupRegister,
    handleSubmit: signupHandleSubmit,
    formState: { errors: signupErrors },
    watch: signupWatch,
  } = useForm();

  const watchSigninEmail = signinWatch("email");

  const logInUser = async (data) => {
    setIsSigningin(true);
    const response = await signIn(data);

    if (response?.status !== 200 || response?.data?.success === false) {
      setIsSigningin(false);
      return;
    }
    const userData = response.data;
    signinDispatch(storeLogin(userData));
    setIsSigningin(false);
    navigate("/");
  };

  const createAccount = async (data) => {
    if (!emailVerified) {
      warningToast("Please verify your email with OTP before signing up.");
      return;
    }
    setIsSignuping(true);
    const response = await signUp(data);
    if (
      ![200, 201].includes(response?.status) ||
      response?.data?.success === false
    ) {
      setIsSignuping(false);
      return;
    }
    setIsSignuping(false);
    navigate("/auth");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center">
          <div
            onClick={() => navigate("/")}
            className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mx-auto cursor-pointer"
          >
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
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
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {signinErrors.password && (
                      <span className="text-sm text-red-200">
                        {signinErrors.password.message}
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full hover-scale"
                    disabled={!watchSigninEmail || isSigningin}
                  >
                    {isSigningin ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
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
                  <OTPVerification
                    email={signupWatch("email")}
                    onVerified={setEmailVerified}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
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
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {signupErrors.password && (
                      <span className="text-red-200 text-sm">
                        {signupErrors.password.message}
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full hover-scale"
                    disabled={!emailVerified || isSignuping}
                  >
                    {isSignuping ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
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
