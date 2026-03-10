import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import ChatPanel from "../components/ChatPanel";
import Transcript from "../components/Transcript";
import UploadArea from "../components/UploadArea";

const Dashboard = () => {
  const [videoSource, setVideoSource] = useState(null);
  const [phase, setPhase] = useState("upload"); // upload | processing | ready

  const hasVideo = phase === "ready" && !!videoSource;

  useEffect(
    () => () => {
      // cleanup object URL on unmount
      setVideoSource((prev) => {
        if (prev && prev.objectUrl) {
          URL.revokeObjectURL(prev.objectUrl);
        }
        return null;
      });
    },
    []
  );

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

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    startProcessing({
      type: "file",
      src: objectUrl,
      objectUrl,
      title: file.name || "Uploaded Video"
    });
  };

  const handleUrl = (url) => {
    startProcessing({
      type: "url",
      src: url,
      objectUrl: null,
      title: "Video from URL"
    });
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
          {phase !== "upload" ? (
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
              {/* Video + Transcript column */}
              <div className="flex flex-col flex-[2] gap-4 min-h-0">
                <div className="flex-none">
                  <VideoPlayer
                    title={videoSource?.title || "AI Assistant Demo Video"}
                    src={videoSource?.src}
                    isProcessing={phase === "processing"}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <Transcript />
                </div>
              </div>

              {/* Chat column */}
              <div className="flex-[1] min-w-[260px] lg:max-w-sm xl:max-w-md min-h-0 flex">
                <ChatPanel />
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

