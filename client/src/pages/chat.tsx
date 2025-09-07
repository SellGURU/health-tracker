import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import Application from "@/api/app";

type ChatMode = "coach" | "ai";

interface Message {
  conversation_id: number;
  date: string;
  feedback?: string;
  images?: string[];
  message_text: string;
  replied_message_id?: string;
  reported: boolean;
  sender_iamge?: string;
  sender_id?: string;
  sender_name?: string;
  sender_type: "patient" | "coach" | "ai" | "user";
  time: string;
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
    id: "1",
    name: "clinic",
    specialization: "Metabolic Health",
    avatar: "/avatars/sarah.jpg",
    rating: 4.9,
    available: true,
    responseTime: "~2 hours",
    experience: "8+ years",
  },
];

export default function ChatPage() {
  const [activeMode, setActiveMode] = useState<ChatMode>("ai");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number>(0);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); //  
  const CallLoginAuthApi = async () => {
    Application.getMessagesId({ message_from: activeMode })
      .then((res) => {
        setMessages(res.data.messages);
        setConversationId(res.data.conversation_id);
      })
      .catch((res) => {
        if (res.response.data.detail) {
          toast({
            title: "Error",
            description: res.response.data.detail,
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setMessages([]);
    setConversationId(0);
    setIsLoading(true);
    // handleGetMessagesId();
  }, [activeMode]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      conversation_id: conversationId,
      date: new Date().toISOString(),
      message_text: message,
      sender_type: "patient",
      time: new Date().toLocaleTimeString(),
      reported: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    Application.sendMessage({
      conversation_id: messages.find((msg) => msg.sender_type === "ai"|| msg.sender_type == 'coach')?.conversation_id || 1,
      message_to: activeMode,
      text: message,
    })
      .then((res) => {    
        if (res.data?.answer) {
          const newMessage: Message = {
            conversation_id: res.data.current_conversation_id,
            date: new Date().toISOString(),
            message_text: res.data.answer,
            sender_type: activeMode,
            time: new Date().toLocaleTimeString(),
            reported: false,
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      })
      .catch((res) => {
        toast({
          title: "Error",
          description: res.response.data.detail,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Simulate response
    // setTimeout(() => {
    //   const responseMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     content:
    //       activeMode === "ai"
    //         ? "I understand your question. Based on your health data and goals, here are my recommendations..."
    //         : "Thanks for reaching out! I'll analyze your question and provide detailed guidance. Let me review your recent health data.",
    //     sender: activeMode,
    //     timestamp: new Date(),
    //     type: "text",
    //   };
    //   setMessages((prev) => [...prev, responseMessage]);
    // }, 1500);
  };

  const bookSession = () => {
    toast({
      title: "Session booking",
      description: "Redirecting to scheduling interface...",
    });
  };

  // const formatTimestamp = (timestamp: Date) => {
  //   return timestamp.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mode Toggle */}
        <div className="flex bg-gradient-to-r from-gray-100/80 to-blue-100/50 dark:from-gray-800/80 dark:to-blue-900/30 p-2 rounded-2xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 shadow-inner mb-6">
          <Button
            onClick={() => setActiveMode("ai")}
            variant={activeMode === "ai" ? "default" : "ghost"}
            className={`flex-1 transition-all duration-300 ${
              activeMode === "ai"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeMode === "ai"
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-blue-500 to-cyan-500"
                }`}
              >
                <Bot
                  className={`w-4 h-4 ${
                    activeMode === "ai" ? "text-white" : "text-white"
                  }`}
                />
              </div>
              <div className="text-left">
                <div className="font-medium">AI Copilot</div>
                <div
                  className={`text-xs ${
                    activeMode === "ai" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  Instant responses
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setActiveMode("coach")}
            variant={activeMode === "coach" ? "default" : "ghost"}
            className={`flex-1 transition-all duration-300 ${
              activeMode === "coach"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeMode === "coach"
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
                }`}
              >
                <User
                  className={`w-4 h-4 ${
                    activeMode === "coach" ? "text-white" : "text-white"
                  }`}
                />
              </div>
              <div className="text-left">
                <div className="font-medium">Human Coach</div>
                <div
                  className={`text-xs ${
                    activeMode === "coach"
                      ? "text-emerald-100"
                      : "text-gray-500"
                  }`}
                >
                  Expert guidance
                </div>
              </div>
            </div>
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Sidebar - Coach Selection */}
          {activeMode === "coach" && selectedCoach === null && (
            <div className="lg:col-span-1 space-y-4 w-full">
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-thin text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Available Coaches
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div
                    className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg border border-emerald-200/50 dark:border-emerald-800/30"
                    onClick={() => {
                      if (selectedCoach) {
                        setSelectedCoach(null);
                      } else {
                        setSelectedCoach(coaches[0]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                        <AvatarImage src={coaches[0].avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                          {coaches[0].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {coaches[0].name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* 
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardContent className="p-4">
                  <Button
                    onClick={bookSession}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          )}

          {/* Chat Messages */}
          {(activeMode === "coach" && selectedCoach) || activeMode === "ai" ? (
            <Card
              className={`${
                activeMode === "coach" ? "lg:col-span-3" : "lg:col-span-3"
              } bg-gradient-to-br from-white/95 via-white/90 to-gray-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-900/20 border-0 shadow-2xl backdrop-blur-xl`}
            >
              <CardHeader className="border-b border-gray-200/30 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeMode === "coach" ? (
                      <Avatar className="w-10 h-10 ring-2 ring-emerald-200 shadow-lg">
                        <AvatarImage src={selectedCoach?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                          {selectedCoach?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {activeMode === "coach"
                          ? selectedCoach?.name
                          : "AI Health Copilot"}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">
                        {activeMode === "coach"
                          ? "Human Expert"
                          : "AI Assistant"}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={activeMode === "coach" ? "default" : "secondary"}
                    className={
                      activeMode === "coach"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }
                  >
                    {activeMode === "coach" ? "Human Expert" : "AI Assistant"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <div className="h-[calc(100vh-482px)] overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.conversation_id}
                      className={`flex ${
                        msg.sender_type === "patient"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          msg.sender_type === "patient" ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                            msg.sender_type === "patient"
                              ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white ml-auto"
                              : activeMode === "coach"
                              ? "bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 dark:from-gray-700 dark:via-emerald-900/20 dark:to-teal-900/10 border border-emerald-200/30 dark:border-emerald-800/20"
                              : "bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30 dark:from-gray-700 dark:via-blue-900/20 dark:to-cyan-900/10 border border-blue-200/30 dark:border-blue-800/20"
                          }`}
                        >
                          <p
                            className={`text-sm ${
                              msg.sender_type === "patient"
                                ? "text-white"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {msg.message_text}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              msg.sender_type === "patient"
                                ? "text-blue-100"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/20 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 backdrop-blur-sm">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          activeMode === "coach"
                            ? "Ask your health coach anything..."
                            : "Ask your AI copilot anything..."
                        }
                        className="!min-h-[40px] !h-[40px] resize-none bg-white/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className={`px-6 shadow-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        activeMode === "coach"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      }`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
