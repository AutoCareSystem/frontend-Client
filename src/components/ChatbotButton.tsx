import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatbotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex items-center gap-3 group z-50"> {/* Added z-50 for layering */}
        {/* Tooltip Message */}
        <div
          className={`bg-gray-800 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            transform: isHovering ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Check Available Time Slots
        </div>

        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative p-4 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 animate-pulse"
          aria-label="Check Available Slots"
        >
          <MessageCircle size={30} className="text-white" />
        </button>
      </div>
      
      {/* 4. Render the functional chat window, passing the state and close handler */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default ChatbotButton;