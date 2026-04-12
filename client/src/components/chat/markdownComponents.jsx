import React from "react";
import CodeBlock from "./CodeBlock";

export const markdownComponents = {
  table({ children }) {
    return (
      <div className="chat-table-wrap premium-scrollbar">
        <table className="chat-table">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="chat-table-head">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="chat-table-body">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="chat-table-row">{children}</tr>;
  },
  th({ children }) {
    return <th className="chat-table-cell chat-table-cell--head">{children}</th>;
  },
  td({ children }) {
    return <td className="chat-table-cell">{children}</td>;
  },
  code({ className, children, ...props }) {
    const isInline = !className && !String(children).includes("\n");

    if (isInline) {
      return (
        <code className="codeblock-inline" {...props}>
          {children}
        </code>
      );
    }

    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
};
