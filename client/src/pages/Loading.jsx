import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const loaderDelays = [
  "-1.4285714286s",
  "-2.8571428571s",
  "-4.2857142857s",
  "-5.7142857143s",
  "-7.1428571429s",
  "-8.5714285714s",
  "-10s",
];

const Loading = ({ redirectHome = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!redirectHome) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, 3800);

    return () => window.clearTimeout(timeout);
  }, [navigate, redirectHome]);

  return (
    <div className="chat-shell-grid relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/12 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute bottom-[-10%] right-[-8%] h-60 w-60 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="nexo-loader relative z-10">
        {loaderDelays.map((delay, index) => (
          <div
            key={index}
            className="nexo-loader-square"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>

      <style>{`
        @keyframes square-animation {
          0%,
          10.5% {
            left: 0;
            top: 0;
          }
          12.5%,
          23% {
            left: 32px;
            top: 0;
          }
          25%,
          35.5% {
            left: 64px;
            top: 0;
          }
          37.5%,
          48% {
            left: 64px;
            top: 32px;
          }
          50%,
          60.5% {
            left: 32px;
            top: 32px;
          }
          62.5%,
          73% {
            left: 32px;
            top: 64px;
          }
          75%,
          85.5% {
            left: 0;
            top: 64px;
          }
          87.5%,
          98% {
            left: 0;
            top: 32px;
          }
          100% {
            left: 0;
            top: 0;
          }
        }

        .nexo-loader {
          position: relative;
          width: 96px;
          height: 96px;
          transform: rotate(45deg);
        }

        .nexo-loader-square {
          position: absolute;
          top: 0;
          left: 0;
          width: 28px;
          height: 28px;
          margin: 2px;
          border-radius: 0;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.98), rgba(99, 102, 241, 0.96) 58%, rgba(139, 92, 246, 0.96));
          box-shadow: 0 12px 28px rgba(56, 189, 248, 0.22);
          animation: square-animation 10s ease-in-out infinite both;
        }

        html:not(.dark) .nexo-loader-square {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(79, 70, 229, 0.92) 58%, rgba(124, 58, 237, 0.92));
          box-shadow: 0 10px 24px rgba(99, 102, 241, 0.18);
        }

        @media (max-width: 640px) {
          .nexo-loader {
            width: 84px;
            height: 84px;
          }

          .nexo-loader-square {
            width: 24px;
            height: 24px;
            margin: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
