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
  Video,
  Star,
  Heart,
  Zap,
  Brain,
  Settings,
  Activity
} from "lucide-react";

type ChatMode = 'coach' | 'copilot';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach' | 'copilot';
  timestamp: Date;
  type: 'text' | 'booking' | 'attachment';
}

interface Coach {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  available: boolean;
  responseTime: string;
  experience: string;
}

const coaches: Coach[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialization: 'Metabolic Health',
    avatar: '/avatars/sarah.jpg',
    rating: 4.9,
    available: true,
    responseTime: '~2 hours',
    experience: '8+ years'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    specialization: 'Fitness & Nutrition',
    avatar: '/avatars/marcus.jpg',
    rating: 4.8,
    available: false,
    responseTime: '~4 hours',
    experience: '6+ years'
  },
  {
    id: '3',
    name: 'Dr. Emma Wilson',
    specialization: 'Longevity Medicine',
    avatar: '/avatars/emma.jpg',
    rating: 4.9,
    available: true,
    responseTime: '~1 hour',
    experience: '12+ years'
  }
];

export default function ChatPage() {
  const [activeMode, setActiveMode] = useState<ChatMode>('copilot');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(coaches[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI health copilot. I can help you understand your health data, create personalized plans, and answer questions about your wellness journey. What would you like to explore today?',
      sender: 'copilot',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      content: 'Hi! I\'m Dr. Sarah Chen, your health coach. I\'m here to provide personalized guidance and support for your health goals. Would you like to schedule a session to discuss your recent lab results?',
      sender: 'coach',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    }
  ]);
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
          ? 'I understand your question. Based on your health data and goals, here are my recommendations...'
          : 'Thanks for reaching out! I\'ll analyze your question and provide detailed guidance. Let me review your recent health data.',
        sender: activeMode,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const bookSession = () => {
    toast({
      title: "Session booking",
      description: "Redirecting to scheduling interface...",
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRelevantMessages = () => {
    return messages.filter(msg => 
      msg.sender === 'user' || msg.sender === activeMode
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20">
      {/* Minimal Header with Mode Selector */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/10 dark:border-gray-700/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gradient-to-r from-gray-100/80 to-blue-100/50 dark:from-gray-800/80 dark:to-blue-900/30 p-2 rounded-2xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 shadow-inner">
            <Button
              onClick={() => setActiveMode('copilot')}
              variant={activeMode === 'copilot' ? 'default' : 'ghost'}
              className={`flex-1 transition-all duration-300 ${
                activeMode === 'copilot' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeMode === 'copilot' ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  <Bot className={`w-4 h-4 ${activeMode === 'copilot' ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">AI Copilot</div>
                  <div className={`text-xs ${activeMode === 'copilot' ? 'text-blue-100' : 'text-gray-500'}`}>Instant responses</div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveMode('coach')}
              variant={activeMode === 'coach' ? 'default' : 'ghost'}
              className={`flex-1 transition-all duration-300 ${
                activeMode === 'coach' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeMode === 'coach' ? 'bg-white/20' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}>
                  <User className={`w-4 h-4 ${activeMode === 'coach' ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">Human Coach</div>
                  <div className={`text-xs ${activeMode === 'coach' ? 'text-emerald-100' : 'text-gray-500'}`}>Expert guidance</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Coach Selection */}
          {activeMode === 'coach' && (
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-thin text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Available Coaches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coaches.map((coach) => (
                    <div
                      key={coach.id}
                      onClick={() => setSelectedCoach(coach)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedCoach?.id === coach.id
                          ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg border border-emerald-200/50 dark:border-emerald-800/30'
                          : 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarImage src={coach.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                            {coach.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{coach.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(coach.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{coach.rating}</span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${coach.available ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`} />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coach.specialization}</div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                        <span>Response: {coach.responseTime}</span>
                        <span>{coach.experience}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardContent className="p-4 space-y-3">
                  <Button 
                    onClick={bookSession}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full backdrop-blur-sm bg-white/60 dark:bg-gray-700/60 border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Copilot Sidebar */}
          {activeMode === 'copilot' && (
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-thin text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    AI Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Brain, label: 'Health Analysis', desc: 'Interpret lab results' },
                    { icon: Activity, label: 'Trend Tracking', desc: 'Monitor biomarkers' },
                    { icon: Zap, label: 'Quick Answers', desc: 'Instant responses' },
                    { icon: Heart, label: 'Recommendations', desc: 'Personalized advice' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-xl backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.label}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Messages */}
          <Card className={`${activeMode === 'coach' ? 'lg:col-span-3' : 'lg:col-span-3'} bg-gradient-to-br from-white/95 via-white/90 to-gray-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-900/20 border-0 shadow-2xl backdrop-blur-xl`}>
            <CardHeader className="border-b border-gray-200/30 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeMode === 'coach' ? (
                    <Avatar className="w-10 h-10 ring-2 ring-emerald-200 shadow-lg">
                      <AvatarImage src={selectedCoach?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                        {selectedCoach?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {activeMode === 'coach' ? selectedCoach?.name : 'AI Health Copilot'}
                    </div>
                    <div className={`text-sm flex items-center gap-2 ${
                      activeMode === 'coach' 
                        ? selectedCoach?.available ? 'text-emerald-600' : 'text-gray-500'
                        : 'text-blue-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activeMode === 'coach' 
                          ? selectedCoach?.available ? 'bg-emerald-500' : 'bg-gray-400'
                          : 'bg-blue-500'
                      }`} />
                      {activeMode === 'coach' ? 
                        (selectedCoach?.available ? 'Available' : 'Away') : 
                        'Online'
                      }
                    </div>
                  </div>
                </div>
                <Badge variant={activeMode === 'coach' ? 'default' : 'secondary'} className={
                  activeMode === 'coach' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }>
                  {activeMode === 'coach' ? 'Human Expert' : 'AI Assistant'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {getRelevantMessages().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white ml-auto'
                            : activeMode === 'coach'
                            ? 'bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 dark:from-gray-700 dark:via-emerald-900/20 dark:to-teal-900/10 border border-emerald-200/30 dark:border-emerald-800/20'
                            : 'bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30 dark:from-gray-700 dark:via-blue-900/20 dark:to-cyan-900/10 border border-blue-200/30 dark:border-blue-800/20'
                        }`}
                      >
                        <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                          {msg.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          msg.sender === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/20 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={activeMode === 'coach' ? "Ask your health coach anything..." : "Ask your AI copilot anything..."}
                      className="resize-none bg-white/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 bottom-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className={`px-6 shadow-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      activeMode === 'coach'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}