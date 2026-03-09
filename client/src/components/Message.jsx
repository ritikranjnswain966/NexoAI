import React from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import CodeBlock from './CodeBlock'

const Message = ({message, isLatest}) => {

  return (
    <div className={`chat-msg ${message.role === 'user' ? 'chat-msg--user' : 'chat-msg--ai'} ${isLatest ? 'chat-msg--latest' : ''}`}>
      {/* Avatar */}
      <div className='chat-msg__avatar-wrap'>
        {message.role === 'user' ? (
          <img src={assets.user_icon} alt="You" className='chat-msg__avatar' />
        ) : (
          <div className='chat-msg__avatar chat-msg__avatar--ai'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className='chat-msg__bubble-wrap'>
        <div className={`chat-msg__bubble ${message.role === 'user' ? 'chat-msg__bubble--user' : 'chat-msg__bubble--ai'}`}>
          {message.role === 'user' ? (
            <p className='chat-msg__text'>{message.content}</p>
          ) : (
            message.isImage ? (
              <img src={message.content} alt="AI generated" className='chat-msg__image' />
            ) : (
              <div className='chat-msg__text chat-msg__markdown reset-tw'>
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
            )
          )}
        </div>
        <span className='chat-msg__time'>
          {moment(message.timestamp).fromNow()}
        </span>
      </div>
    </div>
  )
}

export default Message
