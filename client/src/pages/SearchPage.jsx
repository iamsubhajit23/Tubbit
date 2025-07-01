import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Play, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { getAllVideos } from "../services/video/video.api";
import formatDuration from "../utils/functions/videoDurationFormat.js";
import errorToast from "../utils/notification/error";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRelated, setIsRelated] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchVideos = async () => {
      setLoading(true);
      const res = await getAllVideos({ query: query, sortBy: "views" });

      if (res.statuscode !== 200) {
        setLoading(false);
        console.log("Failed to get videos.");
        return;
      }

      setResults(res.data?.docs);
      if (res.data?.related) {
        setIsRelated(true);
      }
      setLoading(false);
    };
    fetchVideos();
  }, [query]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!loading && results.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No videos found for: <span className="font-medium">{query}</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">
        {isRelated
          ? `No exact matches found. Showing related results for: ${query}`
          : `Search results for: ${query}`}
      </h2>

      {/* Videos Section */}
      {results.length > 0 && (
        <div className="space-y-4">
         <h3>{results.length} results found</h3>
          {results.map((video, index) => (
            <Card
              key={video._id}
              className="p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex gap-4">
                

                <div
                  onClick={() => navigate(`/watch/${video._id}`)}
                  className="relative flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary cursor-pointer transition-colors"
                    onClick={() => navigate(`/watch/${video._id}`)}
                  >
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <p
                      onClick={() =>
                        navigate(`/profile/${video.owner?.username}`)
                      }
                      className="cursor-pointer hover:text-white"
                    >
                      {video.owner?.fullname}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {video.views} views •{" "}
                    {video.createdAt
                      ? formatDistanceToNow(new Date(video.createdAt), {
                          addSuffix: true,
                        })
                      : "some time ago"}
                  </p>
                </div>

                <div className="flex items-start">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Users Section (Optional) */}
      {results?.users?.length > 0 && (
        <div className="pt-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Matching Channels
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.users.map((user) => (
              <Card
                key={user._id}
                className="p-4 hover:bg-accent cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <p className="text-foreground font-medium">
                    {user.fullname || user.username}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
