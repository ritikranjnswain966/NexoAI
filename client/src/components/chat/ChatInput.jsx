import React, { useEffect, useRef, useState } from "react";

const ChevronDown = ({ open = false }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SendGlyph = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
);

const StopGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2.4" />
  </svg>
);

const ChatInput = ({
  prompt,
  setPrompt,
  onSubmit,
  onKeyDown,
  loading,
  onStop,
  mode,
  setMode,
  aiModel,
  setAiModel,
  modelOptions,
  isPublished,
  setIsPublished,
  textareaRef,
  theme,
}) => {
  const [showModelMenu, setShowModelMenu] = useState(false);
  const menuRef = useRef(null);
  const activeModel =
    modelOptions.find((option) => option.id === aiModel) ?? modelOptions[1];
  const isDark = theme === "dark";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => window.clearTimeout(timeoutId);
  }, [textareaRef]);

  useEffect(() => {
    if (!showModelMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setShowModelMenu(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showModelMenu]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6 sm:pb-5 lg:px-8">
      <div className="pointer-events-auto mx-auto max-w-[860px]">
        <div
          className={`rounded-[28px] border px-3 py-3 backdrop-blur-2xl ${
            isDark
              ? "border-white/10 bg-[#11131a]/92 shadow-[0_25px_60px_rgba(2,6,23,0.68)]"
              : "border-slate-200 bg-white/92 shadow-[0_20px_40px_rgba(148,163,184,0.22)]"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div
              className={`inline-flex rounded-full border p-1 text-xs ${
                isDark
                  ? "border-white/8 bg-white/[0.04] text-slate-300"
                  : "border-slate-200 bg-slate-100/80 text-slate-600"
              }`}
            >
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-all duration-300 ${
                  mode === "text"
                    ? isDark
                      ? "bg-white/12 text-white"
                      : "bg-white text-slate-900 shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setMode("image")}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-all duration-300 ${
                  mode === "image"
                    ? isDark
                      ? "bg-white/12 text-white"
                      : "bg-white text-slate-900 shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Image
              </button>
            </div>

            {mode === "text" ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowModelMenu((open) => !open)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/20 hover:bg-white/[0.07]"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: activeModel.color, color: activeModel.color }}
                  />
                  {activeModel.label}
                  <ChevronDown open={showModelMenu} />
                </button>

                {showModelMenu && (
                  <div
                    className={`absolute bottom-[calc(100%+10px)] right-0 w-56 overflow-hidden rounded-3xl border p-2 backdrop-blur-3xl ${
                      isDark
                        ? "border-white/10 bg-[#12141b]/96 shadow-[0_30px_70px_rgba(2,6,23,0.75)]"
                        : "border-slate-200 bg-white/96 shadow-[0_30px_70px_rgba(148,163,184,0.25)]"
                    }`}
                  >
                    {modelOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setAiModel(option.id);
                          setShowModelMenu(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300 ${
                          option.id === aiModel
                            ? isDark
                              ? "bg-white/[0.08] text-white"
                              : "bg-slate-100 text-slate-900"
                            : isDark
                              ? "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]"
                          style={{ backgroundColor: option.color, color: option.color }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{option.label}</p>
                          <p className="text-xs text-slate-400">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <label
                className={`inline-flex cursor-pointer items-center gap-3 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
                }`}
              >
                <span>Publish</span>
                <span className="relative inline-flex h-5 w-10 items-center rounded-full bg-slate-700/80 transition-colors duration-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-full bg-slate-300 peer-checked:bg-cyan-500/80 dark:bg-slate-700/80" />
                  <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-5" />
                </span>
              </label>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className={`flex items-end gap-3 rounded-[24px] border px-4 py-3 transition-all duration-300 ${
              isDark
                ? "border-white/10 bg-[#1a1d26] focus-within:border-white/18"
                : "border-slate-200 bg-white focus-within:border-slate-300"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              rows={1}
              required
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              placeholder={
                mode === "image"
                  ? "Describe the image you want to generate..."
                  : "Message Nexo"
              }
              className={`premium-scrollbar max-h-[220px] min-h-[28px] w-full resize-none bg-transparent py-2 text-[15px] leading-7 outline-none ${
                isDark
                  ? "text-slate-100 placeholder:text-slate-500"
                  : "text-slate-800 placeholder:text-slate-400"
              }`}
            />

            <button
              type={loading ? "button" : "submit"}
              onClick={loading ? onStop : undefined}
              className={`mb-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                loading
                  ? "bg-rose-500 text-white hover:scale-105"
                  : isDark
                    ? "bg-white text-slate-950 hover:scale-105"
                    : "bg-slate-900 text-white hover:scale-105"
              }`}
              aria-label={loading ? "Stop generation" : "Send message"}
            >
              {loading ? <StopGlyph /> : <SendGlyph />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
