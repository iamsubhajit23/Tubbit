import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";
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
import successToast from "../../utils/notification/success.js"; 
import errorToast from "../../utils/notification/error.js";

const AvatarUpload = ({ currentAvatar, userName }) => {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar || "");
  const [isUploading, setIsUploading] = useState(false);

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
    if (!avatar) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      // Replace with real API endpoint
      const response = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Avatar Updated",
          description: "Your avatar has been updated successfully.",
        });
        setAvatar(null);
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
              {userName?.slice(0, 2).toUpperCase()}
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
                    Choose Image
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
