import { useState } from "react";

const ChatPanel = () => {
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Integrate with backend / RAG pipeline here.
    setInput("");
  };

  return (
    <section className="flex flex-col w-full h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
            🤖
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-50">
            AI Assistant
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          <span>Online</span>
        </div>
      </div>

      {/* Empty state / messages */}
      <div className="flex-1 min-h-0 px-4 sm:px-5 py-4 overflow-y-auto text-sm text-slate-300 bg-slate-950/40">
        <div className="h-full flex flex-col items-center justify-center text-center text-xs sm:text-sm text-slate-500 px-4 gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-slate-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 8h10" />
              <path d="M7 12h4" />
              <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 6.1 4.9 8.38 8.38 0 0 1 11.5 3h.5a8.5 8.5 0 0 1 8 8.5Z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-200 text-sm font-medium">
              Start a conversation with the AI assistant
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Ask about sections, summaries, timestamps, or key topics from your
              video.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom input bar */}
      <form
        onSubmit={handleSend}
        className="border-t border-slate-800 bg-slate-900 px-3 sm:px-4 py-3"
      >
        <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-slate-950/80 border border-slate-800 px-2.5 sm:px-3 py-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium shadow-md shadow-blue-500/30 transition-colors"
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
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChatPanel;

