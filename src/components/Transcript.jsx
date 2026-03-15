const formatTimestamp = (seconds) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const Transcript = ({ items }) => {
  const lines =
    items && items.length
      ? items
      : [
          { timestamp: 12, text: "Welcome everyone to the tutorial" },
          { timestamp: 45, text: "Today we will discuss transformers" },
          { timestamp: 90, text: "Understanding attention mechanisms" },
          { timestamp: 130, text: "GPT model overview" }
        ];

  return (
    <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
        <h2 className="text-sm sm:text-base font-semibold text-slate-50">
          Transcript
        </h2>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2h-5" />
            <path d="M3 9V5a2 2 0 0 1 2-2h5" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-4" />
            <path d="M19 3h-2" />
            <path d="M15 3h-2" />
            <path d="M7 3H5" />
            <path d="M21 9v2" />
            <path d="M21 13v2" />
            <path d="M3 13v2" />
            <path d="M3 9v2" />
          </svg>
          Download
        </button>
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-5 py-3 overflow-y-auto text-xs sm:text-sm text-slate-200 space-y-2 pr-1">
        {lines.map((line, index) => (
          <button
            key={line.id || `${line.timestamp}-${index}`}
            className="w-full flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-800/80 transition-colors text-left"
          >
            <span className="text-[11px] sm:text-xs font-medium text-blue-400 min-w-[3.8rem] sm:min-w-[4.2rem] text-right">
              {formatTimestamp(line.timestamp)}
            </span>
            <span className="text-[11px] sm:text-sm text-slate-200">
              {line.text}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Transcript;

