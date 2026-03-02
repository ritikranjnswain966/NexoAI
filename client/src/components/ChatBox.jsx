import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef = useRef(null)

  const {selectedChat, theme, user, axios, token, setUser} = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      if(!user) return toast('Login to send message')
        setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

      const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt, isPublished}, {headers: {Authorization: token}})

      if(data.success){
        setMessages(prev => [...prev, data.reply])
        //decrease credits
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

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>

      {/*Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-[#0D9B3E] via-[#00FF41] to-[#39FF14]'>Ask me...</p>
          </div>
        )}

        {messages.map((message, index)=><Message key={index} message={message}/>)}

        {/* Three Dots Loading */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

      {/*Mode Toggle + Publish */}
      <div className='flex flex-col items-center gap-3 w-full max-w-2xl mx-auto'>
        
        {/*Modern Segmented Toggle*/}
        <div className='flex items-center gap-3'>
          <div className='relative flex bg-gray-100 dark:bg-[#0a1a0d] rounded-full p-1 border border-gray-200 dark:border-[#00FF41]/15'>
            <div className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-gradient-to-r from-[#0D9B3E] to-[#00FF41] rounded-full transition-all duration-300 shadow-lg dark:shadow-[0_0_12px_rgba(0,255,65,0.3)] ${mode === 'image' ? 'left-[calc(50%+2px)]' : 'left-1'}`}></div>
            <button type='button' onClick={() => setMode('text')} className={`relative z-10 px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${mode === 'text' ? 'text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              📝 Text
            </button>
            <button type='button' onClick={() => setMode('image')} className={`relative z-10 px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${mode === 'image' ? 'text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              🖼️ Image
            </button>
          </div>

          {mode === 'image' && (
            <label className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none'>
              <div className='relative'>
                <input type="checkbox" className='sr-only peer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                <div className='w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-[#00FF41] transition-all'></div>
                <span className='absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
              </div>
              Publish
            </label>
          )}
        </div>

        {/*Prompt Input Box */}
        <form onSubmit={onSubmit} className='chatbox-input-form'>
          <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder="Type your prompt here..." className='chatbox-input' required />
          <button disabled={loading} type="submit" className={`chatbox-send-btn ${loading ? 'chatbox-send-btn-loading' : ''}`}>
            <span className="chatbox-send-btn-glow" />
            <img src={loading ? assets.stop_icon : assets.send_icon} className='chatbox-send-icon' alt={loading ? "Stop" : "Send"} />
          </button>
        </form>

        <style>{`
          .chatbox-input-form {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 6px 6px 6px 20px;
            background: #0a1a0d;
            border: 1.5px solid rgba(0, 255, 65, 0.3);
            border-radius: 999px;
            backdrop-filter: blur(12px);
            transition: all 0.3s ease;
          }

          .dark .chatbox-input-form {
            background: #0a1a0d;
            border-color: rgba(0, 255, 65, 0.3);
          }

          .chatbox-input-form:focus-within {
            border-color: rgba(0, 255, 65, 0.5);
            box-shadow: 0 0 0 3px rgba(0, 255, 65, 0.08), 0 0 25px rgba(0, 255, 65, 0.12);
          }

          .chatbox-input {
            flex: 1;
            width: 100%;
            font-size: 14px;
            outline: none;
            background: transparent;
            color: #e0e0e0;
            font-family: 'Outfit', sans-serif;
          }

          .chatbox-input::placeholder {
            color: rgba(255, 255, 255, 0.45);
          }

          /* Send / Stop Button */
          .chatbox-send-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #0D9B3E 0%, #00FF41 60%, #39FF14 100%);
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.3s ease;
            box-shadow: 0 2px 12px rgba(0, 255, 65, 0.25);
            overflow: hidden;
          }

          .chatbox-send-btn:hover:not(:disabled) {
            transform: scale(1.08);
            box-shadow: 0 4px 24px rgba(0, 255, 65, 0.45);
          }

          .chatbox-send-btn:active:not(:disabled) {
            transform: scale(0.95);
          }

          .chatbox-send-btn:disabled {
            cursor: default;
          }

          /* Shimmer glow */
          .chatbox-send-btn-glow {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
            transform: translateX(-100%);
            transition: transform 0.5s ease;
            border-radius: 50%;
          }

          .chatbox-send-btn:hover:not(:disabled) .chatbox-send-btn-glow {
            transform: translateX(100%);
          }

          /* Loading state - pulsing red */
          .chatbox-send-btn-loading {
            background: linear-gradient(135deg, #c0392b 0%, #e74c3c 60%, #ff6b6b 100%);
            box-shadow: 0 2px 12px rgba(231, 76, 60, 0.3);
            animation: sendBtnPulse 1.5s ease-in-out infinite;
          }

          .chatbox-send-btn-loading:hover {
            box-shadow: 0 4px 24px rgba(231, 76, 60, 0.5);
          }

          @keyframes sendBtnPulse {
            0%, 100% { box-shadow: 0 2px 12px rgba(231, 76, 60, 0.3); }
            50% { box-shadow: 0 2px 24px rgba(231, 76, 60, 0.6); }
          }

          /* Icon */
          .chatbox-send-icon {
            width: 20px;
            height: 20px;
            position: relative;
            z-index: 1;
            filter: brightness(0);
            transition: all 0.2s ease;
          }

          .chatbox-send-btn-loading .chatbox-send-icon {
            filter: brightness(0);
          }

          /* Mobile */
          @media (max-width: 640px) {
            .chatbox-send-btn {
              width: 40px;
              height: 40px;
            }
            .chatbox-send-icon {
              width: 18px;
              height: 18px;
            }
            .chatbox-input-form {
              padding: 5px 5px 5px 16px;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default ChatBox
