import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Settings, X } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ 
  isOpen, 
  messages, 
  onSendMessage, 
  onClose, 
  onClear, 
  isThinking 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEmotionEmoji = (emotion) => {
    const emotionEmojis = {
      happy: '😊',
      thinking: '🤔',
      encouraging: '💪',
      dancing: '💃',
      contemplative: '🧘',
      neutral: '🤖'
    };
    return emotionEmojis[emotion] || '💬';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="chat-interface"
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-title">
              <div className="shelli-avatar">
                <span>S</span>
              </div>
              <div className="title-text">
                <h3>Shelli</h3>
                <p>Your Digital Companion</p>
              </div>
            </div>
            
            <div className="chat-controls">
              <button 
                className="control-icon"
                onClick={onClear}
                title="Clear conversation"
              >
                <Trash2 size={18} />
              </button>
              <button 
                className="control-icon"
                onClick={onClose}
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    {message.type === 'assistant' && (
                      <div className="message-avatar">
                        <span>{getEmotionEmoji(message.emotion)}</span>
                      </div>
                    )}
                    
                    <div className="message-bubble">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking Indicator */}
            <AnimatePresence>
              {(isThinking || isTyping) && (
                <motion.div
                  className="message assistant"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="message-content">
                    <div className="message-avatar">
                      <span>🤔</span>
                    </div>
                    <div className="message-bubble thinking">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p>Shelli is thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to Shelli..."
                className="chat-input"
                rows="1"
                disabled={isThinking}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!inputValue.trim() || isThinking}
              >
                <Send size={20} />
              </button>
            </div>
          </form>

          {/* Connection Status */}
          <div className="chat-status">
            <div className="status-indicator online"></div>
            <span>Shelli is online and ready to chat</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;