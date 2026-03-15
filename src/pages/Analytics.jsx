import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { getAnalytics } from "../services/api";

const Analytics = ({ videoId, videoSource }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const handleJumpToTimestamp = (seconds) => {
    if (!videoRef.current || !Number.isFinite(seconds)) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play?.();
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!videoId) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await getAnalytics(videoId);
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [videoId]);

  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex-1 flex flex-col px-6 py-4">
        {!videoId ? (
          <div className="text-slate-400">
            Upload a video to view analytics.
          </div>
        ) : (
          <>
            <VideoPlayer
              title={videoSource?.title || "Video"}
              src={videoSource?.src}
              videoRef={videoRef}
            />

            <div className="mt-4">
              <AnalyticsPanel
                videoId={videoId}
                analytics={analytics}
                isLoading={isLoading}
                error={error}
                onJumpToTimestamp={handleJumpToTimestamp}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;