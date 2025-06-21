import { useState,useEffect} from "react";
import { Camera, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Label } from "../ui/Label.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { updateAvatar } from "../../services/user/profile.api.js";
import successToast from "../../utils/notification/success.js";
import errorToast from "../../utils/notification/error.js";
import { login as storeLogin } from "../../store/AuthSlice.js";

const AvatarUpload = () => {
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setAvatarPreview(user.data?.avatar || "");
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const res = await updateAvatar(avatar);

    if (res.statuscode !== 200) {
      setIsUploading(false);
      errorToast("Failed to update your avatar. Please try again");
      return;
    }

    dispatch(storeLogin({ userData: res }));
    setAvatarPreview(res?.data?.avatar);
    setAvatar(null);
    setIsUploading(false);
    successToast("Avatar updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload a new profile picture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarPreview} alt="Profile" />
            <AvatarFallback>
              {user?.data?.fullname?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Camera className="w-4 h-4 mr-2" />
                    Update Avatar
                  </span>
                </Button>
              </Label>
              {avatar && (
                <Button onClick={handleUpload} disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;
