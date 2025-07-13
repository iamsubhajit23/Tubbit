import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Loader2 } from "lucide-react";
import { sendEmailOtp, verifyEmailOtp } from "../services/user/auth.api";

const OTPVerification = ({ email, onVerified }) => {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | verifying | success | error
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm();

  // Countdown effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    setStatus("sending");
    const res = await sendEmailOtp(email);
    if (res.success == false) {
      setStatus("error");
      setError("otp", { message: res.message});
      return;
    }
    setStatus("sent");
    setResendTimer(60);
    reset({ otp: "" }); // clear input
  };

  const handleVerifyOtp = async (data) => {
    setStatus("verifying");
    const res = await verifyEmailOtp(email, data.otp);
    if (res.success === false) {
      setStatus("error");
      setError("otp", { message: "Invalid or expired OTP." });
      return;
    }
    setStatus("success");
    setIsVerified(true);
    onVerified(true);
  };

  return (
    <div className="space-y-2">
      {!isVerified && email && (
        <>
          <Label htmlFor="otp">OTP</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "OTP must be 6 digits",
                },
              })}
              className="transition-all focus:scale-[1.02]"
            />
            <Button
              type="button"
              onClick={handleSendOtp}
              variant="secondary"
              disabled={resendTimer > 0 || status === "sending"}
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : status === "sending"
                  ? "Sending..."
                  : status === "sent"
                    ? "Resend"
                    : "Send OTP"}
            </Button>
          </div>

          {errors.otp && (
            <p className="text-red-400 text-sm">{errors.otp.message}</p>
          )}
            <Button
              type="button"
              onClick={handleSubmit(handleVerifyOtp)}
              className="hover-scale flex items-center gap-2 mt-2"
              disabled={status === "verifying"}
            >
              {status === "verifying" ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
        </>
      )}

      {isVerified && (
        <p className="text-green-400 text-sm">✅ Email verified</p>
      )}
    </div>
  );
};

export default OTPVerification;
