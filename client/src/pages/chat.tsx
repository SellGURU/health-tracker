import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Flag,
  RotateCcw,
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
  message_id?: number; // Add unique message ID
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
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(coaches[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number>(0);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<any>(null);
  const [messageReactions, setMessageReactions] = useState<
    Record<number, "liked" | "disliked" | null>
  >({});
  const [reportedMessages, setReportedMessages] = useState<Set<string>>(
    new Set()
  );
  // const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(
    null
  );
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); //
  const handleGetMessagesId = async () => {
    Application.getMessagesId({ message_from: activeMode })
      .then((res) => {
        setMessages(res.data.messages);
        setConversationId(res.data.conversation_id);

        // Sync feedback state with server data
        const feedbackState: Record<number, "liked" | "disliked" | null> = {};
        const reportedMessagesSet = new Set<string>();

        res.data.messages.forEach((msg: Message) => {
          if (msg.feedback === "like") {
            feedbackState[msg.conversation_id] = "liked";
          } else if (msg.feedback === "disliked") {
            feedbackState[msg.conversation_id] = "disliked";
          }

          // Add reported messages from server using unique key
          if (msg.reported) {
            const messageKey = `${msg.conversation_id}-${msg.date}-${msg.time}`;
            reportedMessagesSet.add(messageKey);
          }
        });

        setMessageReactions(feedbackState);
        setReportedMessages(reportedMessagesSet);
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
    handleGetMessagesId();
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
      conversation_id:
        messages
          .filter(
            (msg) => msg.sender_type === "ai" || msg.sender_type === "coach"
          )
          .pop()?.conversation_id || 1,
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
          // scrollToBottom()
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

  const handleMessageReaction = (
    conversationId: number,
    reaction: "liked" | "disliked" | null
  ) => {
    setMessageReactions((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId] === reaction ? null : reaction,
    }));

    // Show toast feedback
    if (reaction === "liked") {
      toast({
        title: "Thanks for the feedback!",
        description: "We're glad this response was helpful.",
      });
      Application.feeedBack("like", conversationId);
    } else if (reaction === "disliked") {
      toast({
        title: "Feedback received",
        description: "We'll work to improve our responses.",
      });
      Application.feeedBack("dislike", conversationId);
    }
  };

  const handleMessageMenu = (messageId: number) => {
    // This will be handled by the dropdown menu
  };

  const handleReportMessage = (messageId: number) => {
    setReportingMessageId(messageId);
    setShowReportModal(true);
  };

  const handleRegenerateMessage = async (messageId: number) => {
    // Find the last AI message
    const lastAIMessage = messages
      .filter((msg) => msg.sender_type === "ai")
      .pop();

    if (!lastAIMessage || lastAIMessage.conversation_id !== messageId) {
      toast({
        title: "Error",
        description: "Can only regenerate the last AI message.",
        variant: "destructive",
      });
      return;
    }

    // Find the last user message that prompted this AI response
    const userMessages = messages.filter(
      (msg) =>
        msg.sender_type === "patient" &&
        messages.indexOf(msg) < messages.indexOf(lastAIMessage)
    );

    if (userMessages.length === 0) {
      toast({
        title: "Error",
        description: "Could not find the original user message.",
        variant: "destructive",
      });
      return;
    }

    // Get the last user message (most recent one before the AI response)
    const userMessage = userMessages[userMessages.length - 1];

    // Remove the last AI message
    setMessages((prev) =>
      prev.filter((msg) => {
        if (msg.conversation_id === messageId && msg.sender_type === "ai") {
          return false;
        }
        return true;
      })
    );

    // Show loading state
    setIsLoading(true);

    // Resend the user message to regenerate response
    try {
      const res = await Application.sendMessage({
        conversation_id: userMessage.conversation_id,
        message_to: activeMode,
        text: userMessage.message_text,
      });

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
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.detail || "Failed to regenerate message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportReason("");
    setReportingMessageId(null);
  };

  const bookSession = () => {
    toast({
      title: "Session booking",
      description: "Redirecting to scheduling interface...",
    });
  };

  const handleSubmitReport = () => {
    if (reportingMessageId) {
      // Find the specific message to create unique key
      const messageToReport = messages.find(
        (msg) => msg.conversation_id === reportingMessageId
      );
      if (messageToReport) {
        const messageKey = `${messageToReport.conversation_id}-${messageToReport.date}-${messageToReport.time}`;

        // Add message to reported messages set
        setReportedMessages((prev) => {
          const newSet = new Set(prev);
          newSet.add(messageKey);
          return newSet;
        });
      }

      // Show success toast
      toast({
        title: "Report submitted",
        description: "Thank you for your feedback. We'll review this message.",
      });
    }

    setShowReportModal(false);
    setReportReason("");
    setReportDetails("");
    setReportingMessageId(null);

    // Call API to report message
    if (reportingMessageId) {
      Application.reportMessage(
        reportingMessageId,
        reportReason,
        reportDetails
      );
    }
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
        <div className="mb-6">
          <Select
            value={activeMode}
            onValueChange={(value: ChatMode) => setActiveMode(value)}
          >
            <SelectTrigger
              className=" group relative h-14 w-full pr-10
    bg-gradient-to-r from-gray-100/80 to-blue-100/50
    dark:from-gray-800/80 dark:to-blue-900/30
    border border-gray-200/30 dark:border-gray-700/20
    shadow-inner backdrop-blur-sm
    [&>[data-slot='select-icon']]:hidden
    [&>span[data-slot='select-icon']]:hidden
    [&>svg[data-slot='select-icon']]:hidden
    [&>svg:last-child]:hidden"
            >
              <SelectValue>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      activeMode === "ai"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                        : "bg-gradient-to-br from-emerald-500 to-teal-500"
                    }`}
                  >
                    {activeMode === "ai" ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      {activeMode === "ai" ? "AI Copilot" : "Coach"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activeMode === "ai"
                        ? "Instant responses"
                        : "Expert guidance"}
                    </div>
                  </div>
                </div>
              </SelectValue>
              <ChevronDown
                className="
        pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
        h-4 w-4 opacity-60 transition-transform duration-200
        group-data-[state=open]:rotate-180
      "
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">AI Copilot</div>
                    <div className="text-xs text-gray-500">
                      Instant responses
                    </div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="coach">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Coach</div>
                    <div className="text-xs text-gray-500">Expert guidance</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6">
          {/* Sidebar - Coach Selection */}
          {/* {activeMode === "coach" && selectedCoach === null && (
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
              </Card>
            </div>
          )} */}

          {/* Chat Messages */}
          {/* {(activeMode === "coach" && selectedCoach) || activeMode === "ai" ? ( */}
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
                    {/* <div className="text-sm text-emerald-600 dark:text-emerald-400">
                        {activeMode === "coach"
                          ? "Human Expert"
                          : "AI Assistant"}
                      </div> */}
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
                {messages.map((msg) => {
                  // Use unique key for reported messages
                  const messageKey = `${msg.conversation_id}-${msg.date}-${msg.time}`;
                  const isReported = reportedMessages.has(messageKey);
                  return (
                    <div
                      key={msg.conversation_id}
                      className={`flex ${
                        msg.sender_type === "patient"
                          ? "justify-end"
                          : "justify-start"
                      } ${isReported ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`max-w-[80%] group ${
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
                          <div className="flex items-center justify-between mt-2">
                            <p
                              className={`text-xs ${
                                msg.sender_type === "patient"
                                  ? "text-blue-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {msg.time}
                            </p>

                            {/* Action buttons for AI messages */}
                            {msg.sender_type === "ai" && !isReported && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/30 ${
                                    messageReactions[msg.conversation_id] ===
                                    "liked"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                                  }`}
                                  onClick={() =>
                                    handleMessageReaction(
                                      msg.conversation_id,
                                      "liked"
                                    )
                                  }
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 ${
                                    messageReactions[msg.conversation_id] ===
                                    "disliked"
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  }`}
                                  onClick={() =>
                                    handleMessageReaction(
                                      msg.conversation_id,
                                      "disliked"
                                    )
                                  }
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    {/* Show regenerate only for the last AI message */}
                                    {(() => {
                                      const lastAIMessage = messages
                                        .filter((m) => m.sender_type === "ai")
                                        .pop();
                                      const isLastAIMessage =
                                        lastAIMessage?.conversation_id ===
                                        msg.conversation_id;

                                      return isLastAIMessage ? (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRegenerateMessage(
                                              msg.conversation_id
                                            )
                                          }
                                          className="text-blue-600 dark:text-blue-400 focus:text-blue-600 dark:focus:text-blue-400"
                                        >
                                          <RotateCcw className="h-4 w-4 mr-2" />
                                          Regenerate
                                        </DropdownMenuItem>
                                      ) : null;
                                    })()}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleReportMessage(msg.conversation_id)
                                      }
                                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                    >
                                      <Flag className="h-4 w-4 mr-2" />
                                      Report
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}

                            {/* Show reported indicator for reported messages */}
                            {msg.sender_type === "ai" && isReported && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                  <Flag className="h-3 w-3" />
                                  Reported
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <img
                    src="/icons/empty.svg"
                    alt="No messages"
                    className="w-[150px] mx-auto"
                  />
                )}
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
                      className="!min-h-[40px] !h-[40px] placeholder:font-light resize-none placeholder:text-[10px] sm:placeholder:text-xs md:placeholder:text-sm bg-white/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30"
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
          {/* ) : null} */}
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report AI Response</DialogTitle>
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
                  <SelectItem value="inaccurate">
                    Inaccurate or misleading information
                  </SelectItem>
                  <SelectItem value="inappropriate">
                    Offensive, harmful, or inappropriate content
                  </SelectItem>
                  <SelectItem value="irrelevant">
                    Irrelevant or nonsensical response
                  </SelectItem>
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
              onClick={handleSubmitReport}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
