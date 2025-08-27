import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Paperclip, 
  Calendar, 
  Clock,
  MessageCircle,
  Bot,
  User,
  Phone,
  Video
} from "lucide-react";

type ChatMode = 'coach' | 'copilot';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach' | 'copilot';
  timestamp: Date;
  type: 'text' | 'booking' | 'attachment';
}

export default function ChatPage() {
  const [activeMode, setActiveMode] = useState<ChatMode>('copilot');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI health copilot. I can help you understand your health data, create plans, and answer questions about your wellness journey.',
      sender: 'copilot',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      content: 'Hi! I\'m Sarah, your health coach. I\'m here to provide personalized guidance and support. Would you like to schedule a session to discuss your health goals?',
      sender: 'coach',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    }
  ]);
  const [coachAvailable, setCoachAvailable] = useState(true);
  const { toast } = useToast();

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: activeMode === 'copilot' 
          ? 'I understand your question. Based on your health data, I recommend...'
          : 'Thanks for reaching out! I\'ll get back to you within 2 hours during business hours.',
        sender: activeMode,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleBooking = () => {
    toast({
      title: "Booking Session",
      description: "Opening coaching session booking...",
    });
  };

  const handleAttachment = () => {
    toast({
      title: "Add Attachment",
      description: "You can attach images, videos, or CSV files",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with Mode Switcher */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chat</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleAttachment}>
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={activeMode === 'copilot' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveMode('copilot')}
          >
            <Bot className="w-4 h-4 mr-2" />
            Copilot
          </Button>
          <Button
            variant={activeMode === 'coach' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveMode('coach')}
          >
            <User className="w-4 h-4 mr-2" />
            Coach
          </Button>
        </div>
        
        {/* Coach Status */}
        {activeMode === 'coach' && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${coachAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {coachAvailable ? 'Coach available' : 'Coach offline'}
              </span>
              <Badge variant="secondary" className="text-xs">
                {coachAvailable ? 'Live chat' : 'Async response'}
              </Badge>
            </div>
            <Button size="sm" onClick={handleBooking}>
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter(msg => msg.sender === activeMode || msg.sender === 'user')
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  {msg.sender === 'user' ? (
                    <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                  ) : msg.sender === 'coach' ? (
                    <AvatarImage src="/coach-avatar.jpg" />
                  ) : (
                    <AvatarFallback className="bg-purple-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Booking Banner for Coach */}
      {activeMode === 'coach' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Book a 30-min session to get personalized guidance
              </span>
            </div>
            <Button size="sm" onClick={handleBooking} className="bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${activeMode === 'coach' ? 'your coach' : 'AI copilot'}...`}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}