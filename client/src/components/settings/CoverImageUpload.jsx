import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Label } from '../ui/Label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import successToast from "../../utils/notification/success.js"; 
import errorToast from "../../utils/notification/error.js";

const CoverImageUpload = () => {
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
    if (!coverImage) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('coverImage', coverImage);

      // API integration point - replace with actual API call
      const response = await fetch('/api/user/cover', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Cover Image Updated",
          description: "Your cover image has been updated successfully.",
        });
        setCoverImage(null);
      } else {
        throw new Error('Failed to update cover image');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cover image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
        <CardDescription>
          Upload a cover image for your profile
        </CardDescription>
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
                  Choose Cover Image
                </span>
              </Button>
            </Label>
            {coverImage && (
              <Button onClick={handleUpload} disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload'}
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
