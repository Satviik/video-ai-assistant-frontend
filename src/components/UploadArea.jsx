import { useRef, useState } from "react";

const UploadArea = ({ onFiles, onSubmitUrl, isProcessing }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowseClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFiles?.(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isProcessing) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFiles?.(files);
    }
  };

  const handlePasteUrlClick = () => {
    if (isProcessing) return;
    const url = window.prompt("Paste video URL to analyze");
    if (url && url.trim()) {
      onSubmitUrl?.(url.trim());
    }
  };

  return (
    <section className="w-full max-w-xl bg-slate-900 border border-dashed border-slate-700 rounded-2xl px-6 sm:px-8 py-10 sm:py-12 flex flex-col items-center text-center shadow-xl shadow-black/40">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 mb-4">
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
          <path d="M10 9l5 3-5 3V9z" />
        </svg>
      </div>

      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-50 mb-2">
        {isProcessing ? "Processing Video..." : "Upload Video"}
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md">
        Drag and drop a video file here, or paste a video URL to start AI
        analysis with transcript-based retrieval.
      </p>

      <div
        className={`w-full border rounded-xl px-4 py-6 text-sm text-slate-200 flex flex-col items-center justify-center gap-2 mb-4 transition-colors ${
          isProcessing
            ? "border-slate-700 bg-slate-900/40 cursor-not-allowed opacity-70"
            : isDragging
            ? "border-blue-500 bg-slate-800/80"
            : "border-slate-700 bg-slate-900/60 hover:bg-slate-800/80"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isProcessing ? handleBrowseClick : undefined}
      >
        <span className="font-medium">
          {isProcessing
            ? "Analyzing your video..."
            : "Click to browse files or drop your video here"}
        </span>
        <span className="text-xs text-slate-400">
          MP4, WebM and other common video formats are supported
        </span>
      </div>

      <button
        type="button"
        onClick={handlePasteUrlClick}
        disabled={isProcessing}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium shadow-md shadow-blue-500/40 transition-colors ${
          isProcessing
            ? "bg-slate-700 text-slate-300 cursor-not-allowed shadow-none"
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
          <path d="M7 11v2a2 2 0 0 0 2 2h2" />
          <path d="M17 13v-2a2 2 0 0 0-2-2h-2" />
        </svg>
        Paste Video URL
      </button>
    </section>
  );
};

export default UploadArea;

