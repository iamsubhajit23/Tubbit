import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";
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
import { updateCoverImage } from "../../services/user/profile.api.js";
import successToast from "../../utils/notification/success.js";
import errorToast from "../../utils/notification/error.js";
import { login as storeLogin } from "../../store/AuthSlice.js";

const CoverImageUpload = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);

    const res = await updateCoverImage(coverImage);

    if (res.statuscode !== 200) {
      setIsUploading(false)
      errorToast("Failed to update your cover image. Please try again");
      return;
    }
    dispatch(storeLogin({ userData: res }));
    setIsUploading(false);
    successToast("Your details updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
        <CardDescription>Upload a cover image for your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coverPreview && (
            <div className="w-full h-32 rounded-lg overflow-hidden bg-muted">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              id="cover-upload"
            />
            <Label htmlFor="cover-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Update Cover Image
                </span>
              </Button>
            </Label>
            {coverImage && (
              <Button onClick={handleUpload} disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            JPG, PNG or GIF. Max size 10MB. Recommended size: 1200x300px.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverImageUpload;
