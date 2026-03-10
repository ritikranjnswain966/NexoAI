import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef = useRef(null)
  const bottomRef = useRef(null)

  const {selectedChat, setSelectedChat, theme, user, axios, token, setUser, isNewChat, setIsNewChat, fetchUsersChats, navigate} = useAppContext()
  const { chatId: urlChatId } = useParams()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior })
    }
  }, [])

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      if(!user) return toast('Login to send message')
      setLoading(true)
      const promptCopy = prompt
      setPrompt('')

      // --- New chat flow: create chat with first message ---
      if (isNewChat || !selectedChat) {
        setMessages([{role: 'user', content: promptCopy, timestamp: Date.now(), isImage: false }])

        // 1. Create the chat on the server with the first message
        const {data: chatData} = await axios.post('/api/chat/create-with-message', {prompt: promptCopy}, {headers: {Authorization: token}})
        if (!chatData.success) {
          toast.error(chatData.message || 'Error creating chat')
          setPrompt(promptCopy)
          setLoading(false)
          return
        }

        const newChat = chatData.chat
        setSelectedChat(newChat)
        setIsNewChat(false)
        fetchUsersChats()
        sessionStorage.setItem('activeChatId', newChat._id)
        navigate(`/chat/${newChat._id}`, { replace: true })

        // 2. Now send the AI message using the new chatId
        const {data} = await axios.post(`/api/message/${mode}`, {chatId: newChat._id, prompt: promptCopy, isPublished}, {headers: {Authorization: token}})
        if(data.success){
          setMessages(prev => [...prev, data.reply])
          if (mode === 'image') {
            setUser(prev => ({...prev, credits: prev.credits - 2}))
          } else {
            setUser(prev => ({...prev, credits: prev.credits - 1}))
          }
        } else {
          toast.error(data.message)
        }
        setLoading(false)
        return
      }

      // --- Existing chat flow ---
      setMessages(prev => [...prev, {role: 'user', content: promptCopy, timestamp: Date.now(), isImage: false }])

      const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt: promptCopy, isPublished}, {headers: {Authorization: token}})

      if(data.success){
        setMessages(prev => [...prev, data.reply])
        if (mode === 'image') {
          setUser(prev => ({...prev, credits: prev.credits - 2}))
        }else{
          setUser(prev => ({...prev, credits: prev.credits - 1}))
        }
      }else{
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }

  // Track scroll position for show/hide scroll-to-bottom button
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    setShowScrollBtn(distanceFromBottom > 150)
  }, [])

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
      setIsNewChat(false)
    }
  },[selectedChat])

  // Fetch chat from URL on mount/refresh
  useEffect(() => {
    if (urlChatId && token) {
      const fetchChat = async () => {
        try {
          const { data } = await axios.get(`/api/chat/${urlChatId}`, { headers: { Authorization: token } })
          if (data.success) {
            setSelectedChat(data.chat)
            setIsNewChat(false)
            sessionStorage.setItem('activeChatId', urlChatId)
          } else {
            toast.error(data.message || 'Chat not found')
            navigate('/', { replace: true })
          }
        } catch (error) {
          toast.error('Error loading chat')
          navigate('/', { replace: true })
        }
      }
      fetchChat()
    } else if (!urlChatId) {
      // On root "/", show welcome screen
      setSelectedChat(null)
      setMessages([])
      setIsNewChat(true)
    }
  }, [urlChatId, token])

  useEffect(()=>{
    // small delay so DOM updates before scroll
    const t = setTimeout(() => scrollToBottom('smooth'), 80)
    return () => clearTimeout(t)
  },[messages, scrollToBottom])

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true })
      return () => el.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className='chatbox-root'>

      {/*Chat Messages Area */}
      <div ref={containerRef} className='chatbox-messages custom-scrollbar'>
        {(isNewChat || (!selectedChat && messages.length === 0)) ? (
          <div className='chatbox-welcome'>
            <div className='chatbox-welcome__logo'>
              <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="Nexo" className='w-full max-w-56 sm:max-w-68 logo-recolor' />
            </div>
            <p className='chatbox-welcome__tagline'>How can I help you today?</p>
            <div className='chatbox-welcome__chips'>
              <button type='button' onClick={() => { setPrompt('Explain a concept simply'); }} className='chatbox-welcome__chip'>💡 Explain a concept</button>
              <button type='button' onClick={() => { setPrompt('Write code for me'); }} className='chatbox-welcome__chip'>💻 Write code</button>
              <button type='button' onClick={() => { setPrompt('Generate an image of'); }} className='chatbox-welcome__chip'>🎨 Generate an image</button>
              <button type='button' onClick={() => { setPrompt('Help me brainstorm ideas'); }} className='chatbox-welcome__chip'>🧠 Brainstorm ideas</button>
            </div>
          </div>
        ) : messages.length === 0 && (
          <div className='chatbox-empty'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68 logo-recolor' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 dark:from-blue-400 dark:via-violet-400 dark:to-pink-400'>Ask me...</p>
          </div>
        )}

        <div className='chatbox-messages-inner'>
          {messages.map((message, index) => (
            <Message key={index} message={message} isLatest={index === messages.length - 1} />
          ))}

          {/* AI Thinking Indicator */}
          {loading && (
            <div className='chat-msg chat-msg--ai chat-msg--latest'>
              <div className='chat-msg__avatar-wrap'>
                <div className='chat-msg__avatar chat-msg__avatar--ai'>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <div className='chat-msg__bubble-wrap'>
                <div className='chat-msg__bubble chat-msg__bubble--ai chat-thinking'>
                  <div className='chat-thinking__dots'>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className='chat-thinking__label'>Thinking</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} className='h-1' />
        </div>
      </div>

      {/* Scroll to bottom FAB */}
      <button
        className={`chatbox-scroll-btn ${showScrollBtn ? 'chatbox-scroll-btn--show' : ''}`}
        onClick={() => scrollToBottom('smooth')}
        aria-label="Scroll to bottom"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Modern Floating Chat Input Area */}
      <div className='chatbox-footer'>
        <div className='chatbox-footer-inner'>
          
          {/* Glass Dock Container */}
          <div className='w-full flex flex-col gap-3 backdrop-blur-2xl bg-white/60 dark:bg-[#0f172a]/70 p-2 sm:p-3 rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/50 dark:border-blue-500/20 shadow-[0_-8px_32px_rgba(0,0,0,0.04)] sm:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-500'>
            
            {/* Top Bar: Toggle & Publish */}
            <div className='flex items-center justify-between px-1 sm:px-2'>
              {/* Modern Segmented Toggle */}
              <div className='relative flex bg-slate-200/50 dark:bg-slate-800/80 rounded-full p-1 border border-transparent shadow-inner'>
                <div className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white dark:bg-slate-600 rounded-full transition-all duration-300 shadow-sm ${mode === 'image' ? 'left-[calc(50%+2px)]' : 'left-1'}`}></div>
                <button type='button' onClick={() => setMode('text')} className={`relative z-10 px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${mode === 'text' ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                  <span>📝</span> Text
                </button>
                <button type='button' onClick={() => setMode('image')} className={`relative z-10 px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${mode === 'image' ? 'text-purple-600 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                  <span>🖼️</span> Image
                </button>
              </div>

              {/* Publish Toggle */}
              {mode === 'image' && (
                <label className='flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-300 cursor-pointer select-none bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50'>
                  <div className='relative'>
                    <input type="checkbox" className='sr-only peer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <div className='w-8 h-4 bg-slate-300 dark:bg-slate-600 rounded-full peer-checked:bg-blue-500 transition-all'></div>
                    <span className='absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm'></span>
                  </div>
                  Publish
                </label>
              )}
            </div>

            {/* Input Form with modern styling */}
            <form onSubmit={onSubmit} className='relative flex items-center w-full bg-white dark:bg-[#1e293b]/80 text-slate-800 dark:text-white rounded-full transition-all duration-300 border border-slate-200 dark:border-slate-700/60 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 dark:focus-within:border-blue-500/50 dark:focus-within:ring-blue-500/20 shadow-inner dark:shadow-none'>
              <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder={mode === 'image' ? "Describe the image you want to generate..." : "Type your prompt here..."} className='w-full bg-transparent outline-none px-6 py-3.5 sm:py-4 text-[15px] font-outfit placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0' required />
              
              <div className='pr-2 sm:pr-2.5 flex items-center shrink-0'>
                <button disabled={loading} type="submit" className={`relative flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-full border-none cursor-pointer transition-all duration-300 overflow-hidden group ${loading ? 'animate-pulse bg-red-500 shadow-[0_2px_10px_rgba(239,68,68,0.3)]' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-[0_2px_10px_rgba(59,130,246,0.3)]'}`}>
                  <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
                  <img src={loading ? assets.stop_icon : assets.send_icon} className='w-4 sm:w-5 h-4 sm:h-5 relative z-10 filter brightness-0 invert transition-transform group-hover:scale-110' alt={loading ? "Stop" : "Send"} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        /* ─── Chat Root ─── */
        .chatbox-root {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: linear-gradient(to bottom right, #ffffff, rgba(239,246,255,0.4), rgba(238,242,255,0.3));
          border-radius: 0;
          height: 100%;
          min-height: 0;
          min-width: 0;
        }
        .dark .chatbox-root {
          background: transparent;
        }
        @media (min-width: 768px) {
          .chatbox-root {
            margin: 0;
            border-radius: 0;
            height: 100%;
          }
        }
        @media (min-width: 1280px) {
          .chatbox-root {
            margin: 0;
            height: 100%;
          }
        }
        @media (min-width: 1536px) {
          .chatbox-root {
            padding-right: 0;
          }
        }

        /* ─── Messages scroll container ─── */
        .chatbox-messages {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 16px 12px 20px 12px;
          scroll-behavior: smooth;
          min-height: 0;
        }
        @media (min-width: 640px) {
          .chatbox-messages { padding: 24px 24px 24px 24px; }
        }
        @media (min-width: 768px) {
          .chatbox-messages { padding: 24px 32px 32px 32px; }
        }

        .chatbox-messages-inner {
          max-width: 768px;
          margin: 0 auto;
          width: 100%;
        }

        .chatbox-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-bottom: 60px;
        }

        /* ─── Welcome Landing Screen ─── */
        .chatbox-welcome {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding-bottom: 40px;
          animation: welcomeFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chatbox-welcome__logo {
          animation: welcomeFloat 4s ease-in-out infinite;
        }
        @keyframes welcomeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .chatbox-welcome__tagline {
          margin-top: 12px;
          font-size: 1.75rem;
          font-weight: 600;
          text-align: center;
          background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (min-width: 640px) {
          .chatbox-welcome__tagline { font-size: 2.5rem; }
        }
        .dark .chatbox-welcome__tagline {
          background: linear-gradient(135deg, #67e8f9, #818cf8, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
        }
        .chatbox-welcome__chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          max-width: 540px;
          padding: 0 16px;
        }
        .chatbox-welcome__chip {
          padding: 10px 18px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(226,232,240,0.8);
          background: rgba(255,255,255,0.7);
          color: #475569;
          backdrop-filter: blur(8px);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .chatbox-welcome__chip:hover {
          background: rgba(255,255,255,0.95);
          border-color: #93c5fd;
          color: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59,130,246,0.12);
        }
        .dark .chatbox-welcome__chip {
          background: rgba(30,41,59,0.6);
          border-color: rgba(99,102,241,0.2);
          color: #94a3b8;
        }
        .dark .chatbox-welcome__chip:hover {
          background: rgba(30,41,59,0.9);
          border-color: rgba(99,102,241,0.5);
          color: #e2e8f0;
          box-shadow: 0 4px 16px rgba(99,102,241,0.15);
        }

        /* ─── Message Rows ─── */
        .chat-msg {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 6px;
          animation: msgFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          max-width: 100%;
        }
        .chat-msg--user {
          flex-direction: row-reverse;
          margin-left: auto;
        }
        .chat-msg--ai {
          flex-direction: row;
          margin-right: auto;
        }

        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Avatar */
        .chat-msg__avatar-wrap {
          flex-shrink: 0;
          margin-top: 4px;
        }
        .chat-msg__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .chat-msg__avatar--ai {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 2px 8px rgba(99,102,241,0.25);
        }
        @media (min-width: 640px) {
          .chat-msg__avatar { width: 36px; height: 36px; }
        }

        /* Bubble wrap */
        .chat-msg__bubble-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 85%;
          min-width: 0;
          overflow: hidden;
        }
        .chat-msg--user .chat-msg__bubble-wrap {
          align-items: flex-end;
        }
        .chat-msg--ai .chat-msg__bubble-wrap {
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .chat-msg__bubble-wrap { max-width: 80%; }
        }
        @media (min-width: 1024px) {
          .chat-msg__bubble-wrap { max-width: 75%; }
        }

        /* Bubble */
        .chat-msg__bubble {
          padding: 12px 16px;
          border-radius: 20px;
          line-height: 1.55;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
          overflow: hidden;
          max-width: 100%;
        }
        .chat-msg__bubble--user {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          border-bottom-right-radius: 6px;
          box-shadow: 0 2px 12px rgba(59,130,246,0.18);
        }
        .dark .chat-msg__bubble--user {
          background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%);
          box-shadow: 0 2px 16px rgba(59,130,246,0.2);
        }
        .chat-msg__bubble--ai {
          background: rgba(241,245,249,0.8);
          color: #1e293b;
          border-bottom-left-radius: 6px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          border: 1px solid rgba(226,232,240,0.6);
        }
        .dark .chat-msg__bubble--ai {
          background: rgba(30,41,59,0.6);
          color: #e2e8f0;
          border-color: rgba(99,102,241,0.12);
          box-shadow: 0 1px 8px rgba(0,0,0,0.15);
        }

        /* Text */
        .chat-msg__text {
          font-size: 14px;
          line-height: 1.6;
        }
        @media (min-width: 640px) {
          .chat-msg__text { font-size: 14.5px; }
        }
        .chat-msg__bubble--user .chat-msg__text {
          color: #fff;
        }

        /* AI Image */
        .chat-msg__image {
          max-width: 100%;
          border-radius: 12px;
          margin-top: 4px;
        }
        @media (min-width: 640px) {
          .chat-msg__image { max-width: 420px; }
        }

        /* Timestamp */
        .chat-msg__time {
          font-size: 10px;
          color: #94a3b8;
          padding: 0 4px;
          line-height: 1;
        }
        .dark .chat-msg__time {
          color: #64748b;
        }

        /* Markdown inside AI bubble */
        .chat-msg__markdown {
          overflow-x: auto;
          width: 100%;
          min-width: 0;
        }
        /* Ensure code blocks inside bubbles are responsive */
        .chat-msg__bubble .codeblock-wrapper {
          max-width: 100%;
          overflow: hidden;
        }
        .chat-msg__bubble .codeblock-wrapper pre {
          max-width: 100%;
          overflow-x: auto;
        }

        /* ─── Thinking Indicator ─── */
        .chat-thinking {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px !important;
        }
        .chat-thinking__dots {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .chat-thinking__dots span {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          animation: thinkBounce 1.4s ease-in-out infinite;
        }
        .dark .chat-thinking__dots span {
          background: linear-gradient(135deg, #818cf8, #a78bfa);
        }
        .chat-thinking__dots span:nth-child(2) { animation-delay: 0.15s; }
        .chat-thinking__dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes thinkBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        .chat-thinking__label {
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
          animation: thinkPulse 2s ease-in-out infinite;
        }
        .dark .chat-thinking__label { color: #64748b; }
        @keyframes thinkPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* ─── Scroll to Bottom Button ─── */
        .chatbox-scroll-btn {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(226,232,240,0.7);
          background: rgba(255,255,255,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 20;
        }
        .dark .chatbox-scroll-btn {
          background: #1e293b;
          border-color: rgba(99,102,241,0.15);
          color: #94a3b8;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        }
        .chatbox-scroll-btn--show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) scale(1);
        }
        .chatbox-scroll-btn:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          color: #3b82f6;
        }
        .chatbox-scroll-btn:active { transform: translateX(-50%) scale(0.92); }

        /* ─── Floating Footer ─── */
        .chatbox-footer {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 0 12px 12px 12px;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          background: transparent;
          z-index: 10;
          flex-shrink: 0;
        }
        .dark .chatbox-footer {
          background: transparent;
        }
        @media (min-width: 640px) {
          .chatbox-footer { padding: 16px 24px; padding-bottom: max(16px, env(safe-area-inset-bottom)); }
        }
        @media (min-width: 768px) {
          .chatbox-footer { padding: 16px 32px; padding-bottom: max(16px, env(safe-area-inset-bottom)); }
        }
        @media (min-width: 1024px) {
          .chatbox-footer { padding: 20px 48px; padding-bottom: max(20px, env(safe-area-inset-bottom)); }
        }

        .chatbox-footer-inner {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
        }



        /* ─── Mobile-first top spacing for hamburger menu ─── */
        @media (max-width: 767px) {
          .chatbox-root {
            margin-top: 48px;
            height: calc(100% - 48px);
          }
        }
      `}</style>
    </div>
  )
}

export default ChatBox
