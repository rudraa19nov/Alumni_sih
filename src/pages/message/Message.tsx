import React, { useState, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  participants: string[]; // user IDs
  lastMessage?: Message;
  unreadCount: number;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'online' },
  { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'online' },
  { id: '3', name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'away', lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '4', name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'offline', lastSeen: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '5', name: 'Michael Wilson', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'online' },
  { id: '6', name: 'Sarah Brown', avatar: 'https://randomuser.me/api/portraits/women/6.jpg', status: 'online' },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    participants: ['1', '2'],
    lastMessage: {
      id: '101',
      senderId: '2',
      text: 'Hey there! How are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      read: true,
      type: 'text'
    },
    unreadCount: 0
  },
  {
    id: '2',
    type: 'direct',
    name: 'Robert Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    participants: ['1', '3'],
    lastMessage: {
      id: '102',
      senderId: '1',
      text: 'Thanks for your help with the project!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: true,
      type: 'text'
    },
    unreadCount: 0
  },
  {
    id: '3',
    type: 'group',
    name: 'Alumni Committee',
    participants: ['1', '2', '4', '5'],
    lastMessage: {
      id: '103',
      senderId: '5',
      text: 'The next meeting is scheduled for Friday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
      type: 'text'
    },
    unreadCount: 3
  },
  {
    id: '4',
    type: 'group',
    name: 'Class of 2018',
    participants: ['1', '2', '3', '4', '5', '6'],
    lastMessage: {
      id: '104',
      senderId: '6',
      text: 'Who is coming to the reunion?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      type: 'text'
    },
    unreadCount: 0
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: '2', text: 'Hi there!', timestamp: new Date(Date.now() - 1000 * 60 * 10), read: true, type: 'text' },
    { id: '2', senderId: '1', text: 'Hello Jane! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 9), read: true, type: 'text' },
    { id: '3', senderId: '2', text: 'I\'m doing great! Just finished the project we were working on.', timestamp: new Date(Date.now() - 1000 * 60 * 7), read: true, type: 'text' },
    { id: '4', senderId: '2', text: 'How about you?', timestamp: new Date(Date.now() - 1000 * 60 * 7), read: true, type: 'text' },
    { id: '5', senderId: '1', text: 'That\'s awesome! I\'m pretty good too.', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: true, type: 'text' },
    { id: '6', senderId: '2', text: 'Hey there! How are you doing?', timestamp: new Date(Date.now() - 1000 * 60 * 2), read: true, type: 'text' },
  ],
  '3': [
    { id: '7', senderId: '4', text: 'Hello everyone!', timestamp: new Date(Date.now() - 1000 * 60 * 60), read: true, type: 'text' },
    { id: '8', senderId: '5', text: 'Hi Sarah! How is the planning going?', timestamp: new Date(Date.now() - 1000 * 60 * 55), read: true, type: 'text' },
    { id: '9', senderId: '4', text: 'It\'s going well. We need to finalize the venue.', timestamp: new Date(Date.now() - 1000 * 60 * 50), read: true, type: 'text' },
    { id: '10', senderId: '2', text: 'I have some suggestions for venues.', timestamp: new Date(Date.now() - 1000 * 60 * 48), read: true, type: 'text' },
    { id: '11', senderId: '5', text: 'The next meeting is scheduled for Friday.', timestamp: new Date(Date.now() - 1000 * 60 * 45), read: false, type: 'text' },
  ]
};

const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users for contacts tab
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== '1' // Exclude current user
  );

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = mockMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: '1', // Current user
      text: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update the conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIndicator = (status: User['status']) => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'away':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return null;
    }
  };

  const startNewChat = (user: User) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.type === 'direct' && conv.participants.includes(user.id)
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        type: 'direct',
        name: user.name,
        avatar: user.avatar,
        participants: ['1', user.id],
        unreadCount: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
    
    setActiveTab('chats');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <div className="flex mt-4">
            <button
              className={`flex-1 py-2 text-center font-medium ${activeTab === 'chats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium ${activeTab === 'contacts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conversations or Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' ? (
            // Conversations list
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={conversation.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.type === 'group' && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-800">{conversation.name}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Contacts list
            filteredUsers.map(user => (
              <div
                key={user.id}
                className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => startNewChat(user)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      {getStatusIndicator(user.status)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <div className="relative">
                <img
                  src={selectedConversation.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedConversation.type === 'direct' && (
                  <div className="absolute -bottom-1 -right-1">
                    {getStatusIndicator(mockUsers.find(u => u.id === selectedConversation.participants.find(p => p !== '1'))?.status || 'offline')}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-gray-800">{selectedConversation.name}</h2>
                {selectedConversation.type === 'direct' ? (
                  <p className="text-xs text-gray-500">
                    {mockUsers.find(u => u.id === selectedConversation.participants.find(p => p !== '1'))?.status === 'online' 
                      ? 'Online' 
                      : 'Offline'}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {selectedConversation.participants.length} members
                  </p>
                )}
              </div>
              <div className="ml-auto flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex mb-4 ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.senderId === '1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-lg px-4 py-2 shadow-sm`}>
                          <p>{message.text}</p>
                          <div className={`text-xs mt-1 ${message.senderId === '1' ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation by sending a message</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <div className="flex-1 mx-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button 
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === ''}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-700">Select a conversation</h3>
              <p className="mt-2 text-gray-500">Choose a conversation from the sidebar or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;