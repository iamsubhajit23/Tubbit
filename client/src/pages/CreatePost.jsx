import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Textarea } from "../components/ui/TextArea.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    content: "",
    imageFile: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, imageFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating post:", formData);
    alert("Post creation functionality - API integration needed");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind? *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Share your thoughts with the community..."
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Add Image (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {formData.imageFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{formData.imageFile.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <img
                      src={URL.createObjectURL(formData.imageFile)}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-cover"
                    />
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
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" disabled={!formData.content.trim()}>
                Create Post
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

export default CreatePost;
