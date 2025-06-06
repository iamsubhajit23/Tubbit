import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Textarea } from "../components/ui/TextArea.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnailFile: null,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type === "video" ? "videoFile" : "thumbnailFile"]: file,
      }));
    }
  };

  const removeFile = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type === "video" ? "videoFile" : "thumbnailFile"]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Uploading video:", formData);
    alert("Video upload functionality - API integration needed");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {formData.videoFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{formData.videoFile.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile("video")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Label htmlFor="video" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-tubbit-primary">
                          Choose video file
                        </span>
                      </Label>
                      <p className="mt-2 text-xs text-muted-foreground">
                        MP4, AVI, MOV up to 2GB
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter video title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Tell viewers about your video"
                className="min-h-[100px]"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {formData.thumbnailFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {formData.thumbnailFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile("thumbnail")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Label htmlFor="thumbnail" className="cursor-pointer">
                      <span className="text-sm font-medium text-tubbit-primary">
                        Choose thumbnail image
                      </span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!formData.videoFile || !formData.title}
              >
                Upload Video
              </Button>
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadVideo;
