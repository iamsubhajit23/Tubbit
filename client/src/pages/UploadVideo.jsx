import React from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Textarea } from "../components/ui/TextArea.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { uploadVideo } from "../services/video/video.api.js";
import errorToast from "../utils/notification/error.js";
import successToast from "../utils/notification/success.js";

const UploadVideo = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitVideo = async (data) => {
    const formData = new FormData();
    formData.append("videofile", data.videofile[0]);
    if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);
    formData.append("title", data.title);
    formData.append("description", data.description || "");

    const response = await uploadVideo(formData);
    if (response.statuscode !== 200) {
      errorToast("Failed to upload video. Please try again!");
      reset();
      return;
    }

    successToast("Video uploaded successfully!");
    reset();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitVideo)} className="space-y-6">
            {/* Video File */}
            <div className="space-y-2">
              <Label htmlFor="videofile">Video File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <Label
                  htmlFor="videofile"
                  className="cursor-pointer block mt-2 text-sm font-medium text-tubbit-primary"
                >
                  Choose video file
                </Label>
                <p className="mt-2 text-xs text-muted-foreground">
                  MP4, AVI, MOV up to 2GB
                </p>
              </div>
              <Input
                type="file"
                id="videofile"
                accept="video/*"
                {...register("videofile", {
                  required: "Video file is required",
                })}
                className="hidden"
              />
              {errors.videofile && (
                <p className="text-red-500 text-sm">
                  {errors.videofile.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                {...register("title", { required: "Video title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell viewers about your video"
                className="min-h-[100px]"
                {...register("description")}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <Label
                  htmlFor="thumbnail"
                  className="cursor-pointer block text-sm font-medium text-tubbit-primary"
                >
                  Choose thumbnail image
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <Input
                type="file"
                id="thumbnail"
                accept="image/*"
                {...register("thumbnail")}
                className="hidden"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button type="submit">Upload Video</Button>
              <Button type="button" variant="outline" onClick={() => reset()}>
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadVideo;
