import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  payload: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello! I'm your AlumniConnect assistant. How can I help you today?", 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick replies for user suggestions
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Update Profile', payload: 'How do I update my profile?' },
    { id: '2', text: 'Upcoming Events', payload: 'What events are coming up?' },
    { id: '3', text: 'Networking', payload: 'How can I connect with other alumni?' },
    { id: '4', text: 'Donations', payload: 'How can I make a donation?' },
    { id: '5', text: 'Mentorship', payload: 'Tell me about the mentorship program' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate unique ID for messages
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newMessage: Message = { 
      id: generateId(), 
      text: inputText, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      generateBotResponse(inputText);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (payload: string) => {
    const newMessage: Message = { 
      id: generateId(), 
      text: payload, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      generateBotResponse(payload);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string) => {
    let response = '';
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('profile') || lowerCaseMessage.includes('update')) {
      response = 'To update your profile, go to the Profile section from the main navigation. Click on the edit icon next to each field to make changes. You can update your contact information, work details, and privacy settings there.';
    } else if (lowerCaseMessage.includes('event') || lowerCaseMessage.includes('upcoming')) {
      response = 'We have several events coming up! The Annual Alumni Meet is on December 15th, and there\'s a Career Networking Workshop next week. Check the Events section for details and registration. You can also suggest events you\'d like to see organized.';
    } else if (lowerCaseMessage.includes('connect') || lowerCaseMessage.includes('network')) {
      response = 'You can connect with other alumni through the Alumni Directory. Use filters to find alumni by industry, location, or batch year. You can also join our LinkedIn group or attend our networking events. Would you like me to show you how to use the directory?';
    } else if (lowerCaseMessage.includes('donation') || lowerCaseMessage.includes('donate')) {
      response = 'To make a donation, visit the Donations section. You can choose to support scholarships, infrastructure development, or specific departments. All donations are tax-deductible, and we appreciate your support in advancing our institution.';
    } else if (lowerCaseMessage.includes('mentor') || lowerCaseMessage.includes('guidance')) {
      response = 'The Mentorship program connects experienced alumni with current students. You can sign up as a mentor or mentee in the Mentorship section. The program includes career guidance, skill development, and networking opportunities.';
    } else if (lowerCaseMessage.includes('job') || lowerCaseMessage.includes('career')) {
      response = 'We have a dedicated Job Board where employers post opportunities specifically for our alumni community. You can also schedule a career counseling session through the portal. Would you like me to direct you to the Job Board?';
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      response = 'Hello! How can I assist you with AlumniConnect today?';
    } else {
      response = 'I\'m here to help with AlumniConnect. You can ask me about updating your profile, upcoming events, connecting with alumni, making donations, or the mentorship program. What would you like to know?';
    }
    
    const botMessage: Message = { 
      id: generateId(), 
      text: response, 
      sender: 'bot', 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {isOpen && (
        <div className={`bg-white rounded-xl shadow-lg flex flex-col overflow-hidden absolute bottom-16 right-0 w-80 h-96 ${isMinimized ? 'h-12' : ''} transition-all duration-300`}>
          <div className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-3 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <i className="fas fa-robot"></i>
              <h3 className="text-base font-semibold m-0">AlumniConnect Assistant</h3>
              <span className="w-2 h-2 bg-green-400 rounded-full ml-1"></span>
            </div>
            <div className="flex gap-2">
              <button className="bg-transparent border-none text-white text-base cursor-pointer opacity-70 hover:opacity-100 w-6 h-6 flex items-center justify-center rounded transition-all" onClick={minimizeChat}>
                <i className="fas fa-minus"></i>
              </button>
              <button className="bg-transparent border-none text-white text-base cursor-pointer opacity-70 hover:opacity-100 w-6 h-6 flex items-center justify-center rounded transition-all" onClick={() => setIsOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 bg-gray-50">
                {messages.map((message) => (
                  <div key={message.id} className={`max-w-[80%] p-3 rounded-2xl flex flex-col animate-fadeIn ${message.sender === 'bot' ? 'bg-white self-start border border-gray-200 rounded-bl-md shadow-sm' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end rounded-br-md shadow-md'}`}>
                    <div className="mb-1 leading-tight">
                      {message.text}
                    </div>
                    <div className="text-xs opacity-70 self-end">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="max-w-[80%] p-3 rounded-2xl bg-white self-start border border-gray-200 rounded-bl-md shadow-sm">
                    <div className="flex gap-1 py-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-typing"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-typing animation-delay-200"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-typing animation-delay-400"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex flex-wrap p-3 gap-2 bg-white border-t border-gray-200">
                {quickReplies.map((reply) => (
                  <button 
                    key={reply.id}
                    className="bg-blue-50 text-blue-700 border-none px-3 py-2 rounded-2xl text-xs cursor-pointer transition-all font-medium hover:bg-blue-100 hover:-translate-y-0.5" 
                    onClick={() => handleQuickReply(reply.payload)}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
              
              <div className="flex p-3 border-t border-gray-200 bg-white gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSendMessage} disabled={inputText.trim() === ''}>
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex justify-center items-center cursor-pointer shadow-md transition-all hover:scale-105 hover:shadow-lg" onClick={toggleChat}>
        <i className="fas fa-comment-dots text-white text-xl"></i>
        {messages.length > 1 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes typing {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        .animate-typing {
          animation: typing 1.4s infinite both;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;