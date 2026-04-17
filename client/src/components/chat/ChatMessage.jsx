import React from "react";
import moment from "moment";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingText from "./TypingText";
import { markdownComponents } from "./markdownComponents";

const ActionButton = ({
  label,
  onClick,
  children,
  active = false,
  disabled = false,
  isDark,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`inline-flex h-8 items-center justify-center rounded-full border px-2.5 text-[11px] font-medium transition-all duration-300 ${
      active
        ? "border-cyan-400/35 bg-cyan-400/12 text-cyan-100"
        : isDark
          ? "border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/16 hover:bg-white/[0.06] hover:text-slate-200"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
  >
    {children}
  </button>
);

const AssistantGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15z" />
  </svg>
);

const CopyGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const RetryGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 15.4-6.4L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.4 6.4L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const ThumbUpGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v11" />
    <path d="M14 5.9 12.5 10H20a2 2 0 0 1 2 2v1.5a2 2 0 0 1-.2.9l-3 6A2 2 0 0 1 17 21H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h3l1.5-4.5A2.2 2.2 0 0 1 13.6 2a1.4 1.4 0 0 1 1.4 1.4c0 .8-.1 1.7-1 2.5Z" />
  </svg>
);

const ThumbDownGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 14V3" />
    <path d="M10 18.1 11.5 14H4a2 2 0 0 1-2-2v-1.5a2 2 0 0 1 .2-.9l3-6A2 2 0 0 1 7 3h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3l-1.5 4.5a2.2 2.2 0 0 1-2.1 1.5A1.4 1.4 0 0 1 9 20.6c0-.8.1-1.7 1-2.5Z" />
  </svg>
);

const ChatMessage = ({
  message,
  isLatest,
  isStreaming,
  onCopy,
  onRegenerate,
  onReact,
  reaction,
  canRegenerate,
  theme,
}) => {
  const isUser = message.role === "user";
  const isDark = theme === "dark";
  const isAssistantText = !isUser && !message.isImage;
  const showTyping = !isUser && !message.isImage && isLatest && isStreaming;

  const stackClassName = isUser
    ? "max-w-[78%] items-end"
    : isAssistantText
      ? "assistant-response-stack"
      : "max-w-full items-start sm:max-w-[88%]";

  const bodyClassName = isUser
    ? isDark
      ? "relative min-w-0 overflow-hidden rounded-[22px] border border-white/8 bg-[#2b2d31] px-4 py-3.5 text-slate-100"
      : "relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 px-4 py-3.5 text-slate-800"
    : message.isImage
      ? isDark
        ? "relative min-w-0 overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-2"
        : "relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2"
      : "assistant-response-content";

  return (
    <div
      className={`group/message flex w-full animate-message-in gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100 sm:flex">
          <AssistantGlyph />
        </div>
      )}

      <div
        className={`flex min-w-0 flex-col ${stackClassName}`}
      >
        <div className={bodyClassName}>
          <div className="relative min-w-0">
            {message.isImage ? (
              <img
                src={message.content}
                alt="AI generated"
                className="max-h-[420px] w-full rounded-[16px] object-cover"
              />
            ) : isUser ? (
              <p className="whitespace-pre-wrap text-[15px] leading-7 text-inherit">
                {message.content}
              </p>
            ) : showTyping ? (
              <TypingText text={message.content} isStreaming={isStreaming} />
            ) : (
              <div className="reset-tw chat-markdown assistant-response-markdown">
                <Markdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </Markdown>
              </div>
            )}
          </div>
        </div>

        <div
          className={
            isAssistantText
              ? "assistant-response-meta"
              : `mt-2 flex items-center gap-2 px-1 text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`
          }
        >
          {!isUser && <span className="font-medium text-slate-300/90">Nexo</span>}
          <span>{moment(message.timestamp).fromNow()}</span>
        </div>

        <div
          className={`grid transition-all duration-300 ${
            isUser ? "justify-end" : "justify-start"
          } ${isAssistantText ? "assistant-response-actions" : ""} pointer-events-none grid-rows-[0fr] opacity-0 group-hover/message:grid-rows-[1fr] group-hover/message:opacity-100 group-hover/message:pointer-events-auto group-focus-within/message:grid-rows-[1fr] group-focus-within/message:opacity-100 group-focus-within/message:pointer-events-auto`}
        >
          <div className="overflow-hidden">
            <div className="mt-2 flex flex-wrap gap-2">
              <ActionButton label="Copy" onClick={onCopy} isDark={isDark}>
                <span className="mr-1.5">
                  <CopyGlyph />
                </span>
                Copy
              </ActionButton>

              {!isUser && (
                <>
                  <ActionButton
                    label="Regenerate"
                    onClick={onRegenerate}
                    disabled={!canRegenerate}
                    isDark={isDark}
                  >
                    <span className="mr-1.5">
                      <RetryGlyph />
                    </span>
                    Retry
                  </ActionButton>
                  <ActionButton
                    label="Like"
                    onClick={() => onReact("up")}
                    active={reaction === "up"}
                    isDark={isDark}
                  >
                    <ThumbUpGlyph />
                  </ActionButton>
                  <ActionButton
                    label="Dislike"
                    onClick={() => onReact("down")}
                    active={reaction === "down"}
                    isDark={isDark}
                  >
                    <ThumbDownGlyph />
                  </ActionButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

