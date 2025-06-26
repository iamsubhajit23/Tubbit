import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Label } from "../ui/Label.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { changePassword } from "../../services/user/profile.api.js";
import { logout as storeLogout } from "../../store/slices/AuthSlice.js";
import successToast from "../../utils/notification/success.js";
import errorToast from "../../utils/notification/error.js";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormChanged =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
      errorToast("New password must be different from current one");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("New password and confirm password do not match.");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (newPassword.length < 6) {
      errorToast("Password must be at least 6 characters long.");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    setIsUpdating(true);
    const res = await changePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
    });

    if (res.statuscode !== 200) {
      setIsUpdating(false);
      errorToast("Failed to update password. Please try again!");
      return;
    }

    successToast("Your password has been updated successfully");
    setIsUpdating(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    dispatch(storeLogout());
    navigate("/auth");
  };

  const EyeButton = ({ visible, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <EyeButton
                visible={showCurrent}
                onClick={() => setShowCurrent((prev) => !prev)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <EyeButton
                  visible={showNew}
                  onClick={() => setShowNew((prev) => !prev)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={isUpdating || !isFormChanged}>
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
