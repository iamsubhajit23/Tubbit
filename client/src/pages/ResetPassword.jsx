import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Shield, Lock, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Alert, AlertDescription } from "../components/ui/Alert.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import {
  resetPassword,
  sendResetPasswordEmailOtp,
  verifyEmailOtp,
} from "../services/user/auth.api.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [emailError, setEmailError] = useState();
  const [otpError, setOtpError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // unified change handler
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendResetPasswordEmailOtp(formData.email);
      if (!res || res.statuscode !== 200) {
        setEmailError(
          res?.message || "Something went wrong, please try again."
        );
        return;
      }
      setStep("otp");
    } catch (err) {
      setEmailError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError();
    try {
      const res = await verifyEmailOtp(formData.email, formData.otp);
      if (!res || res.statuscode !== 200) {
        setOtpError(res?.message || "Invalid OTP, please try again.");
        return;
      }
      setStep("password");
    } catch (err) {
      setOtpError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setOtpError();

    // password match check
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // password strength check
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(formData.password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include letters, numbers, and special characters."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(formData.email, formData.password);
      if (!res || res.statuscode !== 200) {
        setPasswordError(res?.message || "Password reset failed.");
        return;
      }
      setPasswordError();
      navigate("/auth");
    } catch (err) {
      setPasswordError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="transition-all focus:scale-[1.02]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full hover-scale"
              disabled={!formData.email || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {loading ? "Sending..." : "Send Reset OTP"}
            </Button>
          </form>
        );

      case "otp":
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                className="transition-all focus:scale-[1.02] text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full hover-scale"
              disabled={!formData.otp || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep("email")}
              disabled={loading}
              className="w-full"
            >
              Didn't receive OTP? Send again
            </Button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                className="transition-all focus:scale-[1.02]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="transition-all focus:scale-[1.02]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full hover-scale"
              disabled={!formData.confirmPassword || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        );
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case "email":
        return {
          title: "Reset Your Password",
          description:
            "Enter your email address and we'll send you a verification OTP to reset your password.",
          instruction: `${
            emailError
              ? emailError
              : "Please enter the email address associated with your account. We'll send you a 6-digit verification OTP."
          }`,
        };
      case "otp":
        return {
          title: "Enter Verification OTP",
          description: `We've sent a 6-digit OTP to ${formData.email}. Please check your inbox and enter the code below.`,
          instruction: `${
            otpError
              ? otpError
              : "The verification OTP will expire in 5 minutes. If you don't see the email, check your spam folder."
          }`,
        };
      case "password":
        return {
          title: "Create New Password",
          description:
            "Your identity has been verified. Please create a new strong password for your account.",
          instruction: `${
            passwordError
              ? passwordError
              : "Your password should be at least 8 characters long and include a mix of letters, numbers, and special characters."
          }`,
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="mb-4 hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-tubbit-primary to-tubbit-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Tubbit</h1>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{stepInfo.title}</CardTitle>
            <CardDescription>{stepInfo.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert
              className={`${
                emailError || otpError || passwordError ? "border-red-400" : "bg-background text-foreground"
              }`}
            >
              <AlertDescription className="text-sm">
                {stepInfo.instruction}
              </AlertDescription>
            </Alert>

            {renderStepContent()}

            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === "email" ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === "otp" ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === "password" ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
