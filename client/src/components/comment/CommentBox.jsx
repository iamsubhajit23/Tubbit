import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { addCommentOnVideo } from "../../services/comment/comment.api.js";
import errorToast from "../../utils/notification/error.js";
import successToast from "../../utils/notification/success.js";

const CommentBox = ({ videoId, setComments }) => {
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsPosting(true);
    const response = await addCommentOnVideo(videoId, comment.trim());

    if (![200, 201].includes(response.statuscode)) {
      errorToast("Failed to post comment");
      return;
    } else {
      successToast("Comment posted");
      setComment("");
      setComments((prev) => [response.data, ...prev]);
    }
    setIsPosting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        className="w-full border-b border-gray-300 bg-transparent focus:outline-none py-2"
      />

      {comment && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setComment("")}
            disabled={isPosting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!comment.trim() || isPosting}
          >
            {isPosting ? "Posting..." : "Comment"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
