import React, { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { getUserPlaylists } from "../services/playlist/playlist.api.js";
import errorToast from "../utils/notification/error.js";

const Playlists = () => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUserPlaylists = async () => {
      const res = await getUserPlaylists();

      if (res.statuscode !== 200) {
        setLoading(false);
        errorToast("Failed to fetch your palylists. Please try again");
        return;
      }

      setUserPlaylists(res.data?.playlists);
      setLoading(false);
    };
    setLoading(false);
    fetchUserPlaylists();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {userPlaylists?.length === 0
            ? "You have not any playlist yet."
            : "Your Playlists"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {userPlaylists.map((playlist) => (
            <Card
              key={playlist._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={playlist?.videos?.[0]?.thumbnail}
                  alt={playlist?.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{playlist?.name}</CardTitle>
                <CardDescription>
                  {playlist?.videos?.length} videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {playlist?.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlists;
