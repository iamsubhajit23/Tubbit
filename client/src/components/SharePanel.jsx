import { useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { Button } from "./ui/Button.jsx";
import Modal from "./ui/Modal.jsx";
import { CircleCheck } from "lucide-react";

const SharePanel = ({
  isOpen,
  onClose,
  type,
  id,
  title,
  description,
  thumbnail,
}) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const shareUrl = `${window.location.origin}/${type}/${id}`;
  const shareTitle = title || "Check this out on Tubbit!";
  const shareDesc = description || "Watch this amazing content on Tubbit!";
  const shareImg = thumbnail;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsLinkCopied(true);

        setTimeout(() => {
          setIsLinkCopied(false);
        }, 5000);
      })
      .catch(() => setIsLinkCopied(false));
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      copyToClipboard();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share">
      {/* Preview Card */}
      <div className="mb-6 border rounded-xl overflow-hidden shadow-sm">
        <img
          src={shareImg}
          alt={shareTitle}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{shareTitle}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{shareDesc}</p>
          <p className="text-xs text-gray-400 mt-2">{shareUrl}</p>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <FacebookShareButton url={shareUrl} quote={shareTitle}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={shareTitle}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <LinkedinShareButton
          url={shareUrl}
          title={shareTitle}
          summary={shareDesc}
        >
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3 justify-center">
        {isLinkCopied ? (
          <Button
            variant="success"
            disabled
            className="flex items-center gap-2 bg-green-100 text-green-700 border border-green-300 cursor-default"
          >
            <CircleCheck className="h-4 w-4" />
            Copied!
          </Button>
        ) : (
          <Button variant="outline" onClick={copyToClipboard}>
            Copy Link
          </Button>
        )}

        <Button
          variant="default"
          onClick={nativeShare}
          className="flex items-center gap-2 bg-[#1e938b] text-white rounded-lg hover:bg-[#2cc6bb]"
        >
          Share
        </Button>
      </div>
    </Modal>
  );
};

export default SharePanel;
