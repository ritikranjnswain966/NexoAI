import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Loading = () => {
  const navigate = useNavigate()
  const { fetchUser } = useAppContext()
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing system...')

  useEffect(() => {
    const statuses = [
      'Initializing system...',
      'Connecting to server...',
      'Loading AI modules...',
      'Preparing interface...',
      'Almost ready...',
    ]

    let current = 0
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 12 + 3
        return next >= 100 ? 100 : next
      })
      if (current < statuses.length - 1) {
        current++
        setStatusText(statuses[current])
      }
    }, 600)

    const timeout = setTimeout(() => {
      setProgress(100)
      setStatusText('System ready!')
      clearInterval(progressInterval)
      setTimeout(() => {
        fetchUser()
        navigate('/')
      }, 500)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="loading-screen">
      {/* Animated background grid */}
      <div className="loading-grid" />

      {/* Floating particles */}
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="loading-orb loading-orb-1" />
      <div className="loading-orb loading-orb-2" />
      <div className="loading-orb loading-orb-3" />

      {/* Main content */}
      <div className="loading-content">
        {/* Logo with pulse */}
        <div className="loading-logo-container">
          <div className="loading-logo-ring" />
          <div className="loading-logo-ring loading-logo-ring-2" />
          <img
            src={assets.logo_full}
            alt="Nexo"
            className="loading-logo"
          />
        </div>

        {/* Hexagon spinner */}
        <div className="hex-spinner">
          <div className="hex-dot" />
          <div className="hex-dot" />
          <div className="hex-dot" />
          <div className="hex-dot" />
          <div className="hex-dot" />
          <div className="hex-dot" />
        </div>

        {/* Progress bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-track">
            <div
              className="loading-progress-bar"
              style={{ width: `${progress}%` }}
            />
            <div
              className="loading-progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="loading-progress-info">
            <span className="loading-status">{statusText}</span>
            <span className="loading-percent">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Terminal-style text */}
        <div className="loading-terminal">
          <span className="terminal-prompt">&gt;</span>
          <span className="terminal-text">nexo --init</span>
          <span className="terminal-cursor">▌</span>
        </div>
      </div>

      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #000000 0%, #000a04 30%, #001a09 60%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 9999;
        }

        /* Animated grid background */
        .loading-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 8s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        /* Floating particles */
        .loading-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #00FF41;
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat linear infinite;
          box-shadow: 0 0 6px #00FF41, 0 0 12px #00FF4180;
        }

        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 0.8; transform: translateY(-20px) scale(1); }
          80% { opacity: 0.4; transform: translateY(-100px) scale(0.6); }
          100% { opacity: 0; transform: translateY(-150px) scale(0); }
        }

        /* Glowing orbs */
        .loading-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: orbPulse 4s ease-in-out infinite;
        }

        .loading-orb-1 {
          width: 400px;
          height: 400px;
          background: #00FF41;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .loading-orb-2 {
          width: 300px;
          height: 300px;
          background: #39FF14;
          bottom: -80px;
          left: -80px;
          animation-delay: 1.5s;
        }

        .loading-orb-3 {
          width: 200px;
          height: 200px;
          background: #0D9B3E;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 3s;
        }

        @keyframes orbPulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.2); }
        }

        .loading-orb-3 {
          animation-name: orbPulseCenter;
        }

        @keyframes orbPulseCenter {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.3); }
        }

        /* Main content */
        .loading-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 36px;
          animation: contentFadeIn 0.8s ease-out;
        }

        @keyframes contentFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Logo container */
        .loading-logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160px;
          height: 160px;
        }

        .loading-logo {
          width: 120px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 20px rgba(0, 255, 65, 0.4));
          animation: logoPulse 3s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 255, 65, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 40px rgba(0, 255, 65, 0.7)); transform: scale(1.05); }
        }

        .loading-logo-ring {
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          border-top-color: #00FF41;
          border-right-color: #00FF4140;
          border-radius: 50%;
          animation: ringRotate 2s linear infinite;
        }

        .loading-logo-ring-2 {
          inset: -10px;
          border-top-color: #39FF14;
          border-right-color: transparent;
          border-bottom-color: #39FF1440;
          animation-direction: reverse;
          animation-duration: 3s;
        }

        @keyframes ringRotate {
          to { transform: rotate(360deg); }
        }

        /* Hex spinner */
        .hex-spinner {
          width: 50px;
          height: 50px;
          position: relative;
          animation: hexRotate 6s linear infinite;
        }

        .hex-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #00FF41;
          border-radius: 50%;
          box-shadow: 0 0 10px #00FF41, 0 0 20px #00FF4160;
          animation: hexPulse 1.5s ease-in-out infinite;
        }

        .hex-dot:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
        .hex-dot:nth-child(2) { top: 13px; right: 0; animation-delay: 0.25s; }
        .hex-dot:nth-child(3) { bottom: 13px; right: 0; animation-delay: 0.5s; }
        .hex-dot:nth-child(4) { bottom: 0; left: 50%; transform: translateX(-50%); animation-delay: 0.75s; }
        .hex-dot:nth-child(5) { bottom: 13px; left: 0; animation-delay: 1s; }
        .hex-dot:nth-child(6) { top: 13px; left: 0; animation-delay: 1.25s; }

        @keyframes hexRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes hexPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .hex-dot:nth-child(1), .hex-dot:nth-child(4) {
          animation-name: hexPulseCenter;
        }

        @keyframes hexPulseCenter {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(0.6); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }

        /* Progress bar */
        .loading-progress-container {
          width: 280px;
        }

        .loading-progress-track {
          position: relative;
          width: 100%;
          height: 3px;
          background: rgba(0, 255, 65, 0.1);
          border-radius: 4px;
          overflow: visible;
        }

        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #0D9B3E, #00FF41, #39FF14);
          border-radius: 4px;
          transition: width 0.4s ease-out;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }

        .loading-progress-glow {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #00FF41;
          border-radius: 50%;
          filter: blur(4px);
          transition: left 0.4s ease-out;
          opacity: 0.8;
        }

        .loading-progress-info {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 12px;
          font-family: 'Outfit', monospace;
        }

        .loading-status {
          color: rgba(0, 255, 65, 0.6);
          letter-spacing: 0.5px;
        }

        .loading-percent {
          color: #00FF41;
          font-weight: 600;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.5);
        }

        /* Terminal text */
        .loading-terminal {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          padding: 10px 20px;
          background: rgba(0, 255, 65, 0.03);
          border: 1px solid rgba(0, 255, 65, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .terminal-prompt {
          color: #00FF41;
          font-weight: bold;
        }

        .terminal-text {
          color: rgba(0, 255, 65, 0.7);
        }

        .terminal-cursor {
          color: #00FF41;
          animation: cursorBlink 1s step-end infinite;
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .loading-logo-container {
            width: 120px;
            height: 120px;
          }
          .loading-logo {
            width: 80px;
          }
          .loading-progress-container {
            width: 220px;
          }
          .loading-content {
            gap: 28px;
          }
          .hex-spinner {
            width: 40px;
            height: 40px;
          }
          .hex-dot {
            width: 6px;
            height: 6px;
          }
          .hex-dot:nth-child(2),
          .hex-dot:nth-child(3) { right: -2px; }
          .hex-dot:nth-child(5),
          .hex-dot:nth-child(6) { left: -2px; }
          .hex-dot:nth-child(3),
          .hex-dot:nth-child(5) { bottom: 10px; }
          .hex-dot:nth-child(2),
          .hex-dot:nth-child(6) { top: 10px; }
        }
      `}</style>
    </div>
  )
}

export default Loading
