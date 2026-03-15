import React from "react";

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

const AnalyticsPanel = ({
  videoId,
  analytics,
  isLoading,
  error,
  onJumpToTimestamp
}) => {
  if (!videoId) {
    return (
      <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 h-full min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
          <h2 className="text-sm sm:text-base font-semibold text-slate-50">
            Analytics
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 text-xs sm:text-sm text-slate-400 text-center">
          Upload a video to view analytics.
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 h-full min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
          <h2 className="text-sm sm:text-base font-semibold text-slate-50">
            Analytics
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 text-xs sm:text-sm text-slate-300 gap-3">
          <div className="h-7 w-7 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          <p>Generating video analytics...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 h-full min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
          <h2 className="text-sm sm:text-base font-semibold text-slate-50">
            Analytics
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 text-xs sm:text-sm text-red-300 text-center">
          {error}
        </div>
      </section>
    );
  }

  if (!analytics) {
    return null;
  }

  const { transcript_stats, topics, chapters, key_moments, speech_rate, rag_metrics } =
    analytics;

  return (
    <section className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
        <h2 className="text-sm sm:text-base font-semibold text-slate-50">
          Video Analytics
        </h2>
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-5 py-4 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-200">
        {/* Overview */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
            Video Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] sm:text-xs">
            <div>
              <div className="text-slate-400">Duration</div>
              <div className="text-slate-50 text-sm">
                {formatTimestamp(transcript_stats?.video_duration || 0)}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Total Words</div>
              <div className="text-slate-50 text-sm">
                {transcript_stats?.total_words ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Sentences</div>
              <div className="text-slate-50 text-sm">
                {transcript_stats?.total_sentences ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Chunks Created</div>
              <div className="text-slate-50 text-sm">
                {transcript_stats?.chunks_created ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Speech Rate</div>
              <div className="text-slate-50 text-sm">
                {(speech_rate?.speech_rate_wpm ?? 0).toFixed(1)} wpm
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
            Topics
          </h3>
          {topics && topics.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topics.map((t, idx) => (
                <div key={`${t.topic}-${idx}`} className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.max(5, (t.weight || 0) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 min-w-[7rem] justify-end">
                    <span className="text-[11px] sm:text-xs text-slate-200 truncate max-w-[7rem]">
                      {t.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {Math.round((t.weight || 0) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No major topics detected yet.
            </p>
          )}
        </div>

        {/* Chapters */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
            AI Chapters
          </h3>
          {chapters && chapters.length > 0 ? (
            <div className="space-y-2">
              {chapters.map((ch, idx) => (
                <button
                  key={`${ch.title}-${idx}`}
                  type="button"
                  onClick={() =>
                    onJumpToTimestamp && onJumpToTimestamp(ch.timestamp)
                  }
                  className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 bg-slate-900 hover:bg-slate-800/80 transition-colors text-left text-[11px] sm:text-xs"
                >
                  <span className="text-slate-100 truncate max-w-[12rem] sm:max-w-[16rem]">
                    {ch.title}
                  </span>
                  <span className="text-slate-400">
                    {formatTimestamp(ch.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Chapters will appear here once generated.
            </p>
          )}
        </div>

        {/* Key moments */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
            Key Moments
          </h3>
          {key_moments && key_moments.length > 0 ? (
            <div className="space-y-2">
              {key_moments.map((m, idx) => (
                <button
                  key={`${m.insight}-${idx}`}
                  type="button"
                  onClick={() =>
                    onJumpToTimestamp && onJumpToTimestamp(m.timestamp)
                  }
                  className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 bg-slate-900 hover:bg-slate-800/80 transition-colors text-left text-[11px] sm:text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-sm">🔥</span>
                    <span className="text-slate-100 truncate max-w-[11rem] sm:max-w-[15rem]">
                      {m.insight}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {formatTimestamp(m.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Important moments will appear here once detected.
            </p>
          )}
        </div>

        {/* RAG metrics */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
            RAG System Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] sm:text-xs">
            <div>
              <div className="text-slate-400">Embedding Model</div>
              <div className="text-slate-50">
                {rag_metrics?.embedding_model || "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Vector Database</div>
              <div className="text-slate-50">
                {rag_metrics?.vector_database || "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Chunks Indexed</div>
              <div className="text-slate-50">
                {rag_metrics?.chunks_indexed ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPanel;

