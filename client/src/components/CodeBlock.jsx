import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { assets } from "../assets/assets";

const CodeBlock = ({ className, children }) => {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g. "language-javascript" → "javascript")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  // Display-friendly language name
  const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);

  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = codeString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="codeblock-wrapper">
      {/* Header bar */}
      <div className="codeblock-header">
        <span className="codeblock-lang">{languageLabel}</span>
        <button
          onClick={handleCopy}
          className="codeblock-copy-btn"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <img src={assets.copy_filled} alt="Copied" className="codeblock-copy-icon" />
              Copied!
            </>
          ) : (
            <>
              <img src={assets.copy_clipboard} alt="Copy" className="codeblock-copy-icon" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Syntax-highlighted code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={false}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          padding: "14px 16px",
          borderRadius: "0 0 10px 10px",
          fontSize: "13px",
          lineHeight: "1.6",
          background: "#1a1a2e",
          overflowX: "auto",
          maxWidth: "100%",
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace",
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

