import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Calendar, 
  Clock,
  MessageCircle,
  Bot,
  User,
  Phone,
  Star,
  Heart,
  Zap,
  Brain,
  Settings,
  Activity,
  Flag,
  X
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
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

  const handleReportMessage = (messageId: string) => {
    setReportingMessageId(messageId);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!reportReason) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback. Our team will review this message.",
    });
    
    setShowReportModal(false);
    setReportingMessageId(null);
    setReportReason('');
    setReportDetails('');
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Mode Toggle */}
        <div className="flex bg-gradient-to-r from-gray-100/80 to-blue-100/50 dark:from-gray-800/80 dark:to-blue-900/30 p-1.5 sm:p-2 rounded-2xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 shadow-inner mb-4 sm:mb-6">
            <Button
              onClick={() => setActiveMode('copilot')}
              variant={activeMode === 'copilot' ? 'default' : 'ghost'}
              className={`flex-1 transition-all duration-300 ${
                activeMode === 'copilot' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  activeMode === 'copilot' ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  <Bot className={`w-3 h-3 sm:w-4 sm:h-4 ${activeMode === 'copilot' ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-base font-medium">AI Copilot</div>
                  <div className={`text-xs ${activeMode === 'copilot' ? 'text-blue-100' : 'text-gray-500'} hidden sm:block`}>Instant responses</div>
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
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  activeMode === 'coach' ? 'bg-white/20' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}>
                  <User className={`w-3 h-3 sm:w-4 sm:h-4 ${activeMode === 'coach' ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-base font-medium">Human Coach</div>
                  <div className={`text-xs ${activeMode === 'coach' ? 'text-emerald-100' : 'text-gray-500'} hidden sm:block`}>Expert guidance</div>
                </div>
              </div>
            </Button>
          </div>
        
        <div className="space-y-4">

          {/* Chat Messages */}
          <Card className="bg-gradient-to-br from-white/95 via-white/90 to-gray-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-900/20 border-0 shadow-2xl backdrop-blur-xl">
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
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {activeMode === 'coach' ? selectedCoach?.name : 'AI Health Copilot'}
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      {activeMode === 'coach' ? 'Human Expert' : 'AI Assistant'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeMode === 'coach' && (
                    <Button 
                      onClick={bookSession}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Book Session</span>
                      <span className="sm:hidden">Book</span>
                    </Button>
                  )}
                  <Badge variant={activeMode === 'coach' ? 'default' : 'secondary'} className={
                    activeMode === 'coach' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }>
                    {activeMode === 'coach' ? 'Expert' : 'AI'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <div className="h-[50vh] sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {getRelevantMessages().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`p-3 sm:p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white ml-auto'
                            : activeMode === 'coach'
                            ? 'bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 dark:from-gray-700 dark:via-emerald-900/20 dark:to-teal-900/10 border border-emerald-200/30 dark:border-emerald-800/20'
                            : 'bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30 dark:from-gray-700 dark:via-blue-900/20 dark:to-cyan-900/10 border border-blue-200/30 dark:border-blue-800/20'
                        }`}
                      >
                        <p className={`text-sm sm:text-base ${msg.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                          {msg.content}
                        </p>
                        <div className="flex items-center justify-between mt-1 sm:mt-2">
                          <p className={`text-xs ${
                            msg.sender === 'user' 
                              ? 'text-blue-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTimestamp(msg.timestamp)}
                          </p>
                          {(msg.sender === 'copilot' && activeMode === 'copilot') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReportMessage(msg.id)}
                              className="h-6 w-6 p-0 opacity-50 hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <Flag className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200/30 dark:border-gray-700/20 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 backdrop-blur-sm">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={activeMode === 'coach' ? "Ask your health coach anything..." : "Ask your AI copilot anything..."}
                      className="resize-none bg-white/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 text-sm sm:text-base"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className={`px-3 sm:px-6 shadow-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      activeMode === 'coach'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Message Dialog */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Report AI Response</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReportModal(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <DialogDescription>
                Tell us what was wrong with this response.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Reason for Reporting
                </label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inaccurate">Inaccurate or misleading information</SelectItem>
                    <SelectItem value="inappropriate">Offensive, harmful, or inappropriate content</SelectItem>
                    <SelectItem value="irrelevant">Irrelevant or nonsensical response</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Additional Details (optional)
                </label>
                <Textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe the issue in more detail"
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={submitReport}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}