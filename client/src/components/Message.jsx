import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])

  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-500/10 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-white'>{message.content}</p>
            <span className='text-xs text-gray-400 dark:text-gray-500'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full'/>
        </div>
      )
      :
      (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10 rounded-md my-4'>
          {message.isImage ? (
            <img src={message.content} alt="" className='w-full max-w-md mt-2 rounded-md'/>
          )
          :
          (
            <div className='text-sm dark:text-white reset-tw'><Markdown>{message.content}</Markdown></div>
          )}
          <span className='text-xs text-gray-400 dark:text-gray-500'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )
    }
    </div>
  )
}

export default Message
