import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
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
import { createTweet } from "../services/tweet/tweet.api.js";
import errorToast from "../utils/notification/error.js";
import successToast from "../utils/notification/success.js";

const CreateTweet = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const naviagte = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const watchImage = watch("image");
  const watchContent = watch("content");

  const buttonDisableControl = isUploading || !watchContent || !watchImage?.[0];

  const submitTweet = async (data) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("image", data.image[0]);

    try {
      const response = await createTweet(formData);

      if (![200, 201].includes(response.statuscode)) {
        errorToast("Failed to upload tweet. Please try again!");
        reset();
        return;
      }

      successToast("Tweet uploaded Successfully");
      reset();
      naviagte("/");
    } catch (error) {
      errorToast("Something went wrong...");
    } finally {
      isUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Tweet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitTweet)} className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                What's on your mind?{" "}
                <span className="text-tubbit-primary">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts with the community..."
                className="min-h-[120px]"
                {...register("content", { required: "Content is required" })}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">
                Add Image <span className="text-tubbit-primary">*</span>
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {watchImage?.[0] ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{watchImage[0].name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("image", null); // clear form field
                          setImagePreview(null); // clear preview
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-2">
                      <Label htmlFor="image" className="cursor-pointer">
                        <span className="text-sm font-medium text-tubbit-primary">
                          Choose image
                        </span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image", {
                    required: "Select a photo",
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Submit & clear form Button */}
            <div className="flex gap-3">
              <Button type="submit" disabled={buttonDisableControl}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Post Tweet"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setImagePreview(null);
                }}
                disabled={isUploading}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTweet;
