import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import type { ChatMessage, ChatResponse, TimeSlot } from "../types/ChatTypes"; // Import types

// ⚠️ IMPORTANT: Backend Chatbot Service URL
// const CHATBOT_API_URL = 'http://localhost:5294'; 
const CHATBOT_API_URL = 'http://localhost:5294'; 

const API_ENDPOINT = `${CHATBOT_API_URL}/api/Chatbot/chat`; // Endpoint defined in ChatbotController.cs

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: "Hello! I can check available time slots for the next 7 days. What service are you interested in and what date would you prefer?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to format the time slots for display
  const formatSlotsForDisplay = (slots: TimeSlot[]): string => {
    const available = slots.filter(s => s.IsAvailable);
    if (available.length === 0) {
        return "\n\nNo available slots were found based on your query.";
    }

    // Group by Date for better readability
    const groupedSlots = available.reduce((acc, slot) => {
        const dateKey = new Date(slot.Date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot.Time);
        return acc;
    }, {} as Record<string, string[]>);

    let slotsText = "\n\n--- Structured Availability ---\n";
    for (const [date, times] of Object.entries(groupedSlots)) {
        slotsText += `**${date}**: ${times.join(', ')}\n`;
    }
    return slotsText;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userPrompt = input.trim();
    
    // 1. Add user message to state
    const userMessage: ChatMessage = { content: userPrompt, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // 2. API Call: POST to the Chatbot service
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Body matches ChatRequestDto from backend
            body: JSON.stringify({ message: userPrompt }), 
        });

        if (!response.ok) {
            throw new Error(`API status: ${response.status}`);
        }

        const data: ChatResponse = await response.json();

        let botContent = data.message;
        
        // 3. Process structured data if available
        if (data.availableSlots && data.availableSlots.length > 0) {
            botContent += formatSlotsForDisplay(data.availableSlots);
        }

        // 4. Add bot response to state
        const botMessage: ChatMessage = { content: botContent, sender: 'bot', timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Chat API Error:", error);
        const errorMessage: ChatMessage = { 
            content: "I couldn't reach the service. Please ensure the Chatbot Backend is running on port 5294.", 
            sender: 'bot', 
            timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 bg-red-600 text-white flex justify-between items-center rounded-t-xl">
        <h3 className="font-semibold">AutoService AI Bot</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-red-700" aria-label="Close Chat">
          <X size={20} />
        </button>
      </div>

      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white p-3 rounded-lg flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;