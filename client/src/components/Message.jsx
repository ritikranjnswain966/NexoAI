import React from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import CodeBlock from './CodeBlock'

const Message = ({message}) => {

  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-3 sm:my-4 gap-2'>
          <div className='flex flex-col gap-1.5 p-2 px-3 sm:px-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-500/10 rounded-xl max-w-[85vw] sm:max-w-2xl break-all sm:break-normal'>
            <p className='text-sm dark:text-white'>{message.content}</p>
            <span className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full'/>
        </div>
      )
      :
      (
        <div className='inline-flex flex-col gap-1.5 p-2 px-3 sm:px-4 max-w-[95vw] sm:max-w-2xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10 rounded-xl my-3 sm:my-4 overflow-x-auto'>
          {message.isImage ? (
            <img src={message.content} alt="" className='w-full max-w-md mt-2 rounded-md'/>
          )
          :
          (
            <div className='text-sm dark:text-white reset-tw w-full'>
              <Markdown
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className && !String(children).includes('\n')
                    if (isInline) {
                      return <code className="codeblock-inline" {...props}>{children}</code>
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>
                  }
                }}
              >
                {message.content}
              </Markdown>
            </div>
          )}
          <span className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )
    }
    </div>
  )
}

export default Message
