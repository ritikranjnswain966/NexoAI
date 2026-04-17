import React, { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./markdownComponents";

const TypingText = ({ text, isStreaming }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount((previous) => {
      if (!text) {
        return 0;
      }

      return Math.min(previous, text.length);
    });
  }, [text]);

  useEffect(() => {
    if (visibleCount >= text.length) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setVisibleCount((previous) => {
        if (previous >= text.length) {
          return previous;
        }

        const remaining = text.length - previous;
        const step = remaining > 120 ? 5 : remaining > 48 ? 3 : 1;

        return Math.min(text.length, previous + step);
      });
    }, 16);

    return () => window.clearInterval(interval);
  }, [text, visibleCount]);

  const visibleText = useMemo(
    () => text.slice(0, visibleCount),
    [text, visibleCount],
  );

  const showCursor = isStreaming || visibleCount < text.length;

  return (
    <div className="min-w-0">
      <div className="reset-tw chat-markdown assistant-response-markdown assistant-response-markdown--streaming">
        <Markdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {visibleText}
        </Markdown>
        {showCursor && <span className="typing-cursor">|</span>}
      </div>
    </div>
  );
};

export default TypingText;
