import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import ChatPanel from "../components/ChatPanel";
import Transcript from "../components/Transcript";
import UploadArea from "../components/UploadArea";
import { getTranscript, uploadVideo } from "../services/api";

const Dashboard = ({ videoId, setVideoId, videoSource, setVideoSource }) => {

  const [phase, setPhase] = useState("upload");
  const [transcriptItems, setTranscriptItems] = useState([]);

  const videoElementRef = useRef(null);

  const startProcessing = (nextSource) => {
    setVideoSource((prev) => {
      if (prev && prev.objectUrl && prev.objectUrl !== nextSource.objectUrl) {
        URL.revokeObjectURL(prev.objectUrl);
      }
      return nextSource;
    });
    setPhase("processing");

    // Simulate async processing; replace with real API call later.
    setTimeout(() => {
      setPhase("ready");
    }, 1500);
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0 || phase === "processing") return;
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setPhase("processing");
    setTranscriptItems([]);

    try {
      const uploadResponse = await uploadVideo(file);
      const newVideoId = uploadResponse.video_id;
      setVideoId(newVideoId || null);
      startProcessing({
        type: "file",
        src: uploadResponse.video_url || objectUrl,
        objectUrl,
        title: uploadResponse.title || file.name || "Uploaded Video"
      });

      if (newVideoId) {
        try {
          const transcript = await getTranscript(newVideoId);
          if (Array.isArray(transcript)) {
            setTranscriptItems(
              transcript.map((item, index) => ({
                id: item.id || index,
                timestamp: item.timestamp ?? item.start ?? 0,
                text: item.text || item.content || ""
              }))
            );
          }
        } catch {
          // ignore transcript errors for now
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setPhase("upload");
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUrl = (url) => {
    startProcessing({
      type: "url",
      src: url,
      objectUrl: null,
      title: "Video from URL"
    });
  };

  const handleJumpToTimestamp = (seconds) => {
    if (!videoElementRef.current || !Number.isFinite(seconds)) return;
    try {
      videoElementRef.current.currentTime = seconds;
      if (typeof videoElementRef.current.play === "function") {
        videoElementRef.current.play();
      }
    } catch {
      // ignore seek errors
    }
  };


  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/60">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-2 text-xs sm:text-sm text-slate-400">
          <div className="font-medium text-slate-200">AI Video Assistant</div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                phase === "processing"
                  ? "bg-amber-400"
                  : phase === "ready"
                  ? "bg-emerald-400"
                  : "bg-slate-500"
              }`}
            />
            <span className="capitalize">
              {phase === "upload" && "Waiting for video"}
              {phase === "processing" && "Analyzing video..."}
              {phase === "ready" && "Analysis ready"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          {videoId ? (
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
              {/* Video + Transcript column */}
              <div className="flex flex-col flex-[2] gap-4 min-h-0">
                <div className="flex-none">
                  <VideoPlayer
                    title={videoSource?.title || "AI Assistant Demo Video"}
                    src={videoSource?.src}
                    isProcessing={phase === "processing"}
                    videoRef={videoElementRef}
                  />
                </div>
                <div className="flex-1 min-h-0">
                <Transcript items={transcriptItems} />
              </div>
              </div>

              {/* Chat column */}
              <div className="flex-[1] min-w-[260px] lg:max-w-sm xl:max-w-md min-h-0 flex">
                <ChatPanel
                  videoId={videoId}
                  onJumpToTimestamp={handleJumpToTimestamp}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <UploadArea
                onFiles={handleFiles}
                onSubmitUrl={handleUrl}
                isProcessing={phase === "processing"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

