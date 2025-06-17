import SkeletonLoader from "./ui/SkeletonLoader.jsx";

const RelatedVideoSkeleton = () => {
  return (
    <div className="flex space-x-3">
      {/* Thumbnail */}
      <SkeletonLoader className="w-36 h-20" />

      {/* Text content */}
      <div className="flex-1 space-y-2 py-1">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-1/2" />
        <SkeletonLoader className="h-3 w-1/3" />
      </div>
    </div>
  );
};

export default RelatedVideoSkeleton;
