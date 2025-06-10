import { ArrowLeft } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Separator } from "../components/ui/Separator.jsx";
import ProfileInfoForm from "../components/settings/ProfileInfoUpdateForm.jsx";
import AvatarUpload from "../components/settings/AvatarUpload.jsx";
import CoverImageUpload from "../components/settings/CoverImageUpload.jsx";
import PasswordChangeForm from "../components/settings/PasswordChangeForm.jsx";

const Settings = () => {
  // const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Profile Info */}
          <ProfileInfoForm
            initialName={user?.name || ""}
            initialEmail={user?.email || ""}
          />

          {/* Avatar Upload */}
          <AvatarUpload currentAvatar={user?.avatar} userName={user?.name} />

          {/* Cover Image Upload */}
          <CoverImageUpload />

          {/* Divider */}
          <Separator />

          {/* Password Change */}
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
};

export default Settings;
