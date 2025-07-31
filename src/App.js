import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageCircle, X, Send, Settings, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import ShelliCore from './core/ShelliCore';
import ChatInterface from './components/ChatInterface';
import VideoBackground from './components/VideoBackground';
import LoadingScreen from './components/LoadingScreen';
import VoiceVisualizer from './components/VoiceVisualizer';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [shelli, setShelli] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const recognitionRef = useRef(null);
  const shelliRef = useRef(null);

  // Initialize Shelli on component mount
  useEffect(() => {
    initializeShelli();
  }, []);

  const initializeShelli = async () => {
    try {
      console.log('Initializing Shelli...');
      setConnectionStatus('connecting');
      
      const shelliInstance = await ShelliCore.getInstance();
      setShelli(shelliInstance);
      shelliRef.current = shelliInstance;
      
      // Setup voice recognition
      setupVoiceRecognition();
      
      setConnectionStatus('connected');
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        content: "Hello! I'm Shelli, your digital companion. I'm here to listen, learn, and grow with you. How are you feeling today?",
        timestamp: new Date(),
        emotion: 'happy'
      };
      
      setMessages([welcomeMessage]);
      setCurrentEmotion('happy');
      
      // Hide loading screen after initialization
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to initialize Shelli:', error);
      setConnectionStatus('error');
      setIsLoading(false);
    }
  };

  const setupVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript && shelliRef.current) {
        await processUserInput(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const processUserInput = async (input) => {
    if (!shelli || !input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    setCurrentEmotion('thinking');

    try {
      // Get response from Shelli
      const response = await shelli.think(input);
      
      // Determine emotion based on response content
      const emotion = determineEmotionFromResponse(response);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        emotion: emotion
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentEmotion(emotion);
      
    } catch (error) {
      console.error('Error processing input:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm having trouble processing that right now. Let me gather my thoughts...",
        timestamp: new Date(),
        emotion: 'contemplative'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setCurrentEmotion('contemplative');
    } finally {
      setIsThinking(false);
    }
  };

  const determineEmotionFromResponse = (response) => {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('happy') || lowerResponse.includes('excited') || lowerResponse.includes('wonderful')) {
      return 'happy';
    } else if (lowerResponse.includes('think') || lowerResponse.includes('consider') || lowerResponse.includes('analyze')) {
      return 'thinking';
    } else if (lowerResponse.includes('encourage') || lowerResponse.includes('great') || lowerResponse.includes('amazing')) {
      return 'encouraging';
    } else if (lowerResponse.includes('dance') || lowerResponse.includes('celebrate') || lowerResponse.includes('fun')) {
      return 'dancing';
    } else if (lowerResponse.includes('sorry') || lowerResponse.includes('understand') || lowerResponse.includes('difficult')) {
      return 'contemplative';
    }
    
    return 'neutral';
  };

  const handleChatMessage = async (message) => {
    await processUserInput(message);
  };

  const clearConversation = () => {
    setMessages([]);
    if (shelli) {
      shelli.clearHistory();
    }
  };

  return (
    <div className="app">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <VideoBackground emotion={currentEmotion} />

      <div className="content-overlay">
        {/* Connection Status */}
        <div className={`connection-status ${connectionStatus}`}>
          <div className="status-indicator"></div>
          <span>
            {connectionStatus === 'connecting' && 'Connecting to Shelli...'}
            {connectionStatus === 'connected' && 'Shelli is ready'}
            {connectionStatus === 'error' && 'Connection error'}
          </span>
        </div>

        {/* Voice Transcript */}
        <AnimatePresence>
          {(transcript || isThinking) && (
            <motion.div
              className="transcript-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {isThinking ? (
                <div className="thinking-indicator">
                  <div className="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>Shelli is thinking...</p>
                </div>
              ) : (
                <p>{transcript}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Visualizer */}
        {isListening && <VoiceVisualizer />}

        {/* Control Panel */}
        <div className="control-panel">
          <motion.button
            className="control-btn settings-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {/* Settings functionality */}}
          >
            <Settings size={20} />
          </motion.button>

          <motion.button
            className="control-btn chat-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
            <span>{isChatOpen ? 'Close' : 'Chat'}</span>
          </motion.button>
        </div>

        {/* Main Microphone Button */}
        <div className="mic-container">
          <motion.button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!shelli}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </motion.button>
          
          <motion.div
            className="mic-pulse"
            animate={isListening ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Chat Interface */}
        <ChatInterface
          isOpen={isChatOpen}
          messages={messages}
          onSendMessage={handleChatMessage}
          onClose={() => setIsChatOpen(false)}
          onClear={clearConversation}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
}

export default App;