import { useRef, useState } from "react";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const VideoPlayer = ({ title, src, isProcessing }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progress =
    duration && Number.isFinite(duration) ? (currentTime / duration) * 100 : 0;
  const clampedProgress = Math.max(0, Math.min(progress || 0, 100));

  return (
    <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 p-4 sm:p-5 md:p-6">
      <div className="relative w-full aspect-video max-h-[320px] rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-800/40" />

        {src ? (
          <video
            ref={videoRef}
            src={src}
            className="relative z-0 h-full w-full object-contain bg-black"
            controls={!isProcessing}
            onLoadedMetadata={(e) => {
              setDuration(e.target.duration || 0);
            }}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime || 0);
            }}
          />
        ) : (
          <button
            className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/40 hover:bg-blue-500 transition-colors"
            type="button"
          >
            <svg
              className="h-7 w-7 translate-x-[1px]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {src && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-xs font-medium text-slate-100">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-slate-100 z-10">
            <div className="h-7 w-7 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-xs sm:text-sm font-medium">
              Analyzing video and generating transcript...
            </p>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-900/70">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-50">
          {title}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Uploaded video for AI-assisted analysis.
        </p>
      </div>
    </section>
  );
};

export default VideoPlayer;

