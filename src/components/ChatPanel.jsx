import { useEffect, useRef, useState } from "react";
import { askQuestion } from "../services/api";

const ChatPanel = ({ videoId, onJumpToTimestamp }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !videoId || isSending) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await askQuestion(videoId, trimmed);
      const assistantMessage = {
        role: "assistant",
        content: response.answer ?? "",
        recommendedTimestamp: response.recommended_timestamp
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content:
          error.message || "Sorry, something went wrong while answering."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  const formatTimestamp = (seconds) => {
    if (!Number.isFinite(seconds)) return null;
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
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
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={handleClear}
            className="hidden sm:inline text-[11px] px-2 py-0.5 rounded-full border border-slate-700 hover:bg-slate-800/80 transition-colors"
          >
            Clear chat
          </button>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 px-4 sm:px-5 py-4 overflow-y-auto text-sm text-slate-300 bg-slate-950/40">
        {messages.length === 0 ? (
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
                Ask about sections, summaries, timestamps, or key topics from
                your video.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const tsLabel = formatTimestamp(msg.recommendedTimestamp);
              return (
                <div
                  key={index}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-50 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {!isUser &&
                      msg.recommendedTimestamp != null &&
                      tsLabel &&
                      onJumpToTimestamp && (
                        <button
                          type="button"
                          onClick={() =>
                            onJumpToTimestamp(msg.recommendedTimestamp)
                          }
                          className="mt-2 text-[11px] font-medium text-blue-300 hover:text-blue-200 underline-offset-2 hover:underline"
                        >
                          Jump to {tsLabel}
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 bg-slate-800 text-slate-300 text-xs flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
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
            placeholder={
              videoId ? "Ask anything..." : "Upload a video to start chatting"
            }
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!videoId || isSending || !input.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed text-white px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium shadow-md shadow-blue-500/30 transition-colors"
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

