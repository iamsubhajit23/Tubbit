import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import TweetCard from "../components/TweetCard.jsx";
import SkeletonLoader from "../components/ui/SkeletonLoader.jsx";
import { getAllTweets } from "../services/tweet/tweet.api.js";

const Tweets = () => {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  
  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      const res = await getAllTweets({
        query: "",
        sortBy: "createdAt",
        sortType: "desc",
        userId: "",
      });

      if (res.statuscode !== 200) {
        errorToast("Failed to fetch tweets. Please try again");
        return;
      }
      setTweets(res.data.docs);
      setLoading(false);
    };
    fetchTweets();
  }, [setLoading]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border pb-4 mb-4">
            <div className="flex gap-3">
              <SkeletonLoader
                variant="circular"
                className="w-10 h-10 flex-shrink-0"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <SkeletonLoader className="h-4 w-24" />
                  <SkeletonLoader className="h-3 w-16" />
                </div>
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-3/4" />
                <SkeletonLoader className="h-32 w-full rounded-lg" />
                <div className="flex gap-8">
                  <SkeletonLoader className="h-4 w-12" />
                  <SkeletonLoader className="h-4 w-12" />
                  <SkeletonLoader className="h-4 w-12" />
                  <SkeletonLoader className="h-4 w-8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <div className="space-y-0">
        {tweets.map((tweet, index) => (
          <div
            key={tweet?._id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TweetCard
              tweetId={tweet?._id}
              content={tweet?.content}
              username={tweet?.owner?.username}
              fullname={tweet?.owner?.fullname}
              userAvatar={tweet?.owner?.avatar}
              timestamp={formatDistanceToNow(new Date(tweet?.updatedAt), {
                addSuffix: true,
              })}
              images={tweet?.image}
              {...tweet}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tweets;
