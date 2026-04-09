import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const modelOptions = [
  { id: "basic", label: "Basic", desc: "Fast and light", color: "#10b981" },
  { id: "medium", label: "Medium", desc: "Balanced reasoning", color: "#38bdf8" },
  { id: "pro", label: "Pro", desc: "Deeper answers", color: "#8b5cf6" },
  { id: "high", label: "High", desc: "Most capable", color: "#f97316" },
];

const modelCosts = { basic: 1, medium: 2, pro: 4, high: 8 };


const createLocalId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeMessages = (messages = []) => {
  if (
    messages.length >= 2 &&
    messages[0]?.role === "user" &&
    messages[1]?.role === "user" &&
    !messages[0]?.isImage &&
    !messages[1]?.isImage &&
    messages[0]?.content?.trim() === messages[1]?.content?.trim()
  ) {
    return [messages[0], ...messages.slice(2)];
  }

  return messages;
};

const hydrateMessages = (messages = []) =>
  normalizeMessages(messages).map((message, index) => ({
    ...message,
    localId: message.localId ?? `${message.timestamp}-${message.role}-${index}`,
  }));

const ThinkingBubble = ({ isDark }) => (
  <div className="flex w-full justify-start gap-3">
    <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100 sm:flex">
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
    </div>

    <div className="flex max-w-full flex-col items-start sm:max-w-[88%]">
      <div className={`mb-2 flex items-center gap-2 px-1 text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        <span className="font-medium text-slate-300/90">Nexo</span>
        <span>thinking...</span>
      </div>
      <div className={`inline-flex rounded-full px-4 py-3 ${isDark ? "bg-white/[0.03] text-slate-300" : "bg-white text-slate-700 shadow-sm"}`}>
        <div className="flex items-center gap-2.5">
          <span className="thinking-dot" />
          <span className="thinking-dot" style={{ animationDelay: "120ms" }} />
          <span className="thinking-dot" style={{ animationDelay: "240ms" }} />
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = ({ isDark }) => (
  <div className="flex min-h-[calc(100dvh-220px)] flex-1 flex-col items-center justify-center px-4 text-center">
    <div className="max-w-[720px]">
      <h1 className={`text-4xl font-semibold tracking-tight sm:text-6xl ${isDark ? "text-white" : "text-slate-900"}`}>
        How can I help you today?
      </h1>
      <p className={`mx-auto mt-5 max-w-[620px] text-sm leading-7 [text-wrap:balance] sm:text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        Ask anything. I can help with code, writing, debugging, research, and images.
      </p>
      <p className={`mt-3 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        Start typing below to begin a conversation.
      </p>
    </div>
  </div>
);

const ChatPage = () => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);

  const {
    selectedChat,
    setSelectedChat,
    theme,
    user,
    axios,
    token,
    setUser,
    isNewChat,
    setIsNewChat,
    fetchUsersChats,
    navigate,
  } = useAppContext();

  const { chatId: urlChatId } = useParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [aiModel, setAiModel] = useState("medium");
  const [isPublished, setIsPublished] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [reactions, setReactions] = useState({});

  const isDark = theme === "dark";
  const pageHasMessages = messages.length > 0;

  const focusComposer = useCallback(() => {
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const resizeComposer = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  const syncScrollState = useCallback(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    const isNearBottom = distanceFromBottom < 140;

    shouldStickToBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom && pageHasMessages);
  }, [pageHasMessages]);

  const copyToClipboard = useCallback(async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied");
    }
  }, []);

  const streamTextResponse = useCallback(
    async (chatId, promptText, modelId, skipUserMessagePersist = false) => {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${axios.defaults.baseURL}/api/message/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          chatId,
          prompt: promptText,
          aiModel: modelId,
          skipUserMessagePersist,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessageId = null;
      let fullText = "";
      let firstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const payload = line.slice(6);

          if (payload === "[DONE]") {
            break;
          }

          try {
            const { content, error } = JSON.parse(payload);

            if (error) {
              toast.error(error);
              break;
            }

            if (content) {
              if (firstChunk) {
                firstChunk = false;
                setStreaming(true);
                assistantMessageId = createLocalId();
                setMessages((previous) => [
                  ...previous,
                  {
                    role: "assistant",
                    content: "",
                    timestamp: Date.now(),
                    isImage: false,
                    localId: assistantMessageId,
                  },
                ]);
              }

              fullText += content;
              const snapshot = fullText;

              setMessages((previous) =>
                previous.map((message) =>
                  message.localId === assistantMessageId
                    ? { ...message, content: snapshot }
                    : message,
                ),
              );
            }
          } catch {
            continue;
          }
        }
      }

      setUser((previous) => ({
        ...previous,
        credits: previous.credits - (modelCosts[modelId] || 1),
      }));
    },
    [axios.defaults.baseURL, setUser, token],
  );

  const sendPrompt = useCallback(
    async ({
      promptText,
      modeOverride = mode,
      publishOverride = isPublished,
      clearComposer = true,
    }) => {
      const nextPrompt = promptText.trim();

      if (!nextPrompt) {
        return;
      }

      if (!user) {
        toast("Login to send message");
        return;
      }

      if (loading) {
        return;
      }

      try {
        setLoading(true);
        setStreaming(false);

        if (clearComposer) {
          setPrompt("");
          resizeComposer();
        }

        focusComposer();

        let chatId = selectedChat?._id ?? null;
        const isCreatingNewChat = isNewChat || !selectedChat;
        const userMessage = {
          role: "user",
          content: nextPrompt,
          timestamp: Date.now(),
          isImage: false,
          localId: createLocalId(),
        };

        if (isCreatingNewChat) {
          setMessages([userMessage]);

          const { data: chatData } = await axios.post(
            "/api/chat/create-with-message",
            { prompt: nextPrompt },
            { headers: { Authorization: token } },
          );

          if (!chatData.success) {
            toast.error(chatData.message || "Error creating chat");
            if (clearComposer) {
              setPrompt(nextPrompt);
            }
            setLoading(false);
            return;
          }

          const newChat = chatData.chat;
          setSelectedChat(newChat);
          setIsNewChat(false);
          fetchUsersChats();
          chatId = newChat._id;
          sessionStorage.setItem("activeChatId", chatId);
          navigate(`/chat/${chatId}`, { replace: true });
        } else {
          setMessages((previous) => [...previous, userMessage]);
        }

        if (modeOverride === "image") {
          const { data } = await axios.post(
            "/api/message/image",
            {
              chatId,
              prompt: nextPrompt,
              isPublished: publishOverride,
              skipUserMessagePersist: isCreatingNewChat,
            },
            { headers: { Authorization: token } },
          );

          if (data.success) {
            setMessages((previous) => [
              ...previous,
              { ...data.reply, localId: createLocalId() },
            ]);
            setUser((previous) => ({
              ...previous,
              credits: previous.credits - 2,
            }));
          } else {
            toast.error(data.message);
            if (clearComposer) {
              setPrompt(nextPrompt);
            }
          }

          return;
        }

        await streamTextResponse(
          chatId,
          nextPrompt,
          aiModel,
          isCreatingNewChat,
        );
      } catch (error) {
        if (error.name === "AbortError") {
          setUser((previous) => ({
            ...previous,
            credits: previous.credits - (modelCosts[aiModel] || 1),
          }));
        } else {
          toast.error(error.message);
          if (clearComposer) {
            setPrompt(nextPrompt);
          }
        }
      } finally {
        setLoading(false);
        setStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [
      aiModel,
      axios,
      fetchUsersChats,
      focusComposer,
      isNewChat,
      isPublished,
      loading,
      mode,
      navigate,
      resizeComposer,
      selectedChat,
      setIsNewChat,
      setSelectedChat,
      setUser,
      streamTextResponse,
      token,
      user,
    ],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await sendPrompt({ promptText: prompt });
    },
    [prompt, sendPrompt],
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile && event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (prompt.trim()) {
          handleSubmit(event);
        }
      }
    },
    [handleSubmit, prompt],
  );

  const handleReaction = useCallback((messageId, value) => {
    setReactions((previous) => ({
      ...previous,
      [messageId]: previous[messageId] === value ? null : value,
    }));
  }, []);

  const handleRegenerate = useCallback(
    async (assistantIndex) => {
      if (loading) {
        return;
      }

      const previousUserMessage = [...messages]
        .slice(0, assistantIndex)
        .reverse()
        .find((message) => message.role === "user");

      if (!previousUserMessage) {
        toast.error("No prompt found to regenerate");
        return;
      }

      const targetMessage = messages[assistantIndex];
      const nextMode = targetMessage?.isImage ? "image" : "text";

      setMode(nextMode);

      await sendPrompt({
        promptText: previousUserMessage.content,
        modeOverride: nextMode,
        publishOverride: Boolean(targetMessage?.isPublished),
        clearComposer: false,
      });
    },
    [loading, messages, sendPrompt],
  );

  useEffect(() => {
    resizeComposer();
  }, [prompt, resizeComposer]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(hydrateMessages(selectedChat.messages));
      setReactions({});
      setIsNewChat(false);
    }
  }, [selectedChat, setIsNewChat]);

  useEffect(() => {
    if (urlChatId && token) {
      const fetchChat = async () => {
        try {
          const { data } = await axios.get(`/api/chat/${urlChatId}`, {
            headers: { Authorization: token },
          });

          if (data.success) {
            setSelectedChat(data.chat);
            setIsNewChat(false);
            sessionStorage.setItem("activeChatId", urlChatId);
          } else {
            toast.error(data.message || "Chat not found");
            navigate("/", { replace: true });
          }
        } catch {
          toast.error("Error loading chat");
          navigate("/", { replace: true });
        }
      };

      fetchChat();
      return;
    }

    if (!urlChatId) {
      setSelectedChat(null);
      setMessages([]);
      setReactions({});
      setIsNewChat(true);
    }
  }, [axios, navigate, setIsNewChat, setSelectedChat, token, urlChatId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (shouldStickToBottomRef.current) {
        scrollToBottom(streaming ? "auto" : "smooth");
      }
    }, 40);

    return () => window.clearTimeout(timeoutId);
  }, [messages, scrollToBottom, streaming]);

  useEffect(() => {
    focusComposer();
  }, [focusComposer, urlChatId]);

  return (
    <div className={`relative flex flex-1 min-w-0 overflow-hidden ${isDark ? "bg-[radial-gradient(circle_at_top,#111827,#030712_42%,#020617_100%)]" : "bg-[linear-gradient(180deg,#f8fbff,#eef4ff)]"}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute inset-x-0 top-0 h-64 ${isDark ? "bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_58%)]" : "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_58%)]"}`} />
        <div className={`absolute bottom-0 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full blur-3xl ${isDark ? "bg-cyan-500/6" : "bg-sky-400/8"}`} />
      </div>

      <div
        ref={containerRef}
        onScroll={syncScrollState}
        className="custom-scrollbar relative z-10 flex-1 overflow-y-auto overflow-x-hidden pt-14 md:pt-0"
      >
        <div className="mx-auto flex min-h-full w-full max-w-[860px] flex-col px-4 pb-52 pt-8 sm:px-6 sm:pb-56 sm:pt-10 md:pb-60 md:pt-12">
          {isNewChat || (!selectedChat && messages.length === 0) ? (
            <EmptyState isDark={isDark} />
          ) : messages.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-220px)] flex-1 items-center justify-center text-sm text-slate-400">
              Start a new conversation
            </div>
          ) : (
            <div className="space-y-7">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.localId}
                  message={message}
                  isLatest={index === messages.length - 1}
                  isStreaming={streaming}
                  reaction={reactions[message.localId]}
                  canRegenerate={!loading}
                  onCopy={() => copyToClipboard(message.content)}
                  onRegenerate={() => handleRegenerate(index)}
                  onReact={(value) => handleReaction(message.localId, value)}
                  theme={theme}
                />
              ))}

              {loading && !streaming && <ThinkingBubble isDark={isDark} />}
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll to latest message"
        onClick={() => {
          shouldStickToBottomRef.current = true;
          scrollToBottom("smooth");
        }}
        className={`absolute bottom-36 left-1/2 z-20 inline-flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border backdrop-blur-2xl transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#11131a]/90 text-slate-200"
            : "border-slate-200 bg-white/90 text-slate-700"
        } ${
          showScrollButton
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        loading={loading}
        onStop={handleStop}
        mode={mode}
        setMode={setMode}
        aiModel={aiModel}
        setAiModel={setAiModel}
        modelOptions={modelOptions}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
        textareaRef={textareaRef}
        theme={theme}
      />
    </div>
  );
};

export default ChatPage;





