import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, FileText } from "lucide-react";
import { Button } from "./ui/Button.jsx";
import Modal from "./ui/Modal.jsx";

const UploadModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleUploadVideo = () => {
    onClose();
    navigate("/upload-video");
  };

  const handleCreatePost = () => {
    onClose();
    navigate("/create-post");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Content">
      <div className="space-y-4">
        <Button
          onClick={handleUploadVideo}
          className="w-full flex items-center gap-3 h-16 text-left justify-start"
          variant="outline"
        >
          <Video className="w-6 h-6 text-tubbit-primary" />
          <div>
            <h3 className="font-semibold">Upload Video</h3>
            <p className="text-sm text-muted-foreground">
              Share a video with your audience
            </p>
          </div>
        </Button>

        <Button
          onClick={handleCreatePost}
          className="w-full flex items-center gap-3 h-16 text-left justify-start"
          variant="outline"
        >
          <FileText className="w-6 h-6 text-tubbit-primary" />
          <div>
            <h3 className="font-semibold">Create Post</h3>
            <p className="text-sm text-muted-foreground">
              Share your thoughts with the community
            </p>
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default UploadModal;
