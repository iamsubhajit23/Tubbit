import { useState } from "react";
import { Pencil, Trash2, Flag, Save, X } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import {
  updateVideoComment,
  deleteVideoComment,
  updateTweetComment,
  deleteTweetComment,
} from "../../services/comment/comment.api.js";
import successToast from "../../utils/notification/success.js";
import errorToast from "../../utils/notification/error.js";

const CommentControl = ({
  comment,
  authUserId,
  setComments,
  controllerFor = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.text || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const isOwner = comment?.owner?._id === authUserId;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    setIsProcessing(true);
    const res =
      controllerFor === "video"
        ? await deleteVideoComment(comment?._id)
        : await deleteTweetComment(comment?._id);

    if (res?.statuscode === 200) {
      successToast(`${res?.message}`);
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } else {
      errorToast("Failed to delete comment");
    }
    setIsProcessing(false);
  };

  const handleUpdate = async () => {
    if (!editedComment.trim()) return;
    setIsProcessing(true);

    const res =
      controllerFor === "video"
        ? await updateVideoComment(comment?._id, editedComment.trim())
        : await updateTweetComment(comment?._id, editedComment.trim());

    if (res?.statuscode === 200) {
      successToast(`${res?.message}`);

      const newUpdatedComment = res?.data?.updatedComment;
      if (newUpdatedComment) {
        const updatedText =
          newUpdatedComment.content ||
          newUpdatedComment.text ||
          editedComment.trim();

        setComments((prev) =>
          prev.map((c) =>
            c._id === comment._id
              ? {
                  ...c,
                  content: updatedText,
                }
              : c
          )
        );
        setEditedComment(updatedText);
      }
      setIsEditing(false);
    } else {
      errorToast("Failed to update comment");
    }
    setIsProcessing(false);
  };

  const handleReport = async () => {
    const confirmed = window.confirm("Do you want to report this comment?");
    if (!confirmed) return;

    setIsProcessing(true);
    const res = await reportComment(comment._id);

    if (res?.statuscode === 200) {
      successToast("Comment reported");
    } else {
      errorToast("Failed to report comment");
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
      {isEditing ? (
        <>
          <input
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent focus:outline-none text-sm"
            disabled={isProcessing}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleUpdate}
            disabled={isProcessing || !editedComment.trim()}
            title="Save"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setEditedComment(comment.text);
            }}
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          {isOwner ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDelete}
                disabled={isProcessing}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleReport}
              disabled={isProcessing}
              title="Report"
            >
              <Flag className="w-4 h-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentControl;
