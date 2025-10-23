import Application from "@/api/app";
import SimpleModeSelect from "@/components/chat/simple-mode-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Flag,
  MoreVertical,
  RotateCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [displayedMessages, setDisplayedMessages] = useState<
    Record<number, string>
  >({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [previousCount, setPreviousCount] = useState(0);
  console.log("messages => ", messages);
  const [conversationId, setConversationId] = useState<number>(0);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 100);
    }
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

  // Check if disclaimer has been shown before
  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('chat-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  useEffect(() => {
    if (activeMode == "coach") {
      const interval = setInterval(() => {
        handleGetMessagesId();
      }, 15000); // 15 seconds
      return () => clearInterval(interval);
    }

    // Cleanup interval on component unmount or when activeMode changes
  }, [activeMode]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      conversation_id: 0,
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

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem('chat-disclaimer-seen', 'true');
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
  useEffect(() => {
    if (!messages.length) return;
    if (previousCount === 0) {
      const initMessages: Record<number, string> = {};
      messages.forEach((msg) => {
        initMessages[msg.conversation_id] = msg.message_text;
      });
      setDisplayedMessages(initMessages);
      setPreviousCount(messages.length);
      return;
    }

    const lastMsg = messages[messages.length - 1];
    const isNewMessage = messages.length > previousCount;

    if (isNewMessage && lastMsg.sender_type === "ai") {
      let i = 0;
      const text = lastMsg.message_text;

      const interval = setInterval(() => {
        i++;
        setDisplayedMessages((prev) => ({
          ...prev,
          [lastMsg.conversation_id]: text.slice(0, i),
        }));

        if (i >= text.length) clearInterval(interval);
      }, 20);

      setPreviousCount(messages.length);
    } else if (isNewMessage) {
      setDisplayedMessages((prev) => ({
        ...prev,
        [lastMsg.conversation_id]: lastMsg.message_text,
      }));
      setPreviousCount(messages.length);
    }
  }, [messages]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedMessages]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20 relative">
      {/* Disclaimer Toast */}
      {showDisclaimer && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">!</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    For wellness purposes only — not medical advice.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDismissDisclaimer}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                OK, I Understand
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Mode Toggle */}
        <SimpleModeSelect
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
        <div className="flex flex-col gap-6">
          {/* Chat Messages */}
          <Card
            className={`${
              activeMode === "coach" ? "lg:col-span-3" : "lg:col-span-3"
            } !bg-transparent !border-none !shadow-none`}
          >
            <CardContent className="flex-1 p-0">
              <div
                className="h-[calc(100vh-355px)] md:h-[calc(100vh-335px)] overflow-y-auto space-y-4"
                style={{ scrollbarWidth: "thin" }}
              >
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
                            {msg.sender_type === "ai"
                              ? displayedMessages[msg.conversation_id] || ""
                              : msg.message_text}
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
                    className="w-[190px] mx-auto"
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="px-4 py-2 bg-transparent fixed bottom-16 md:bottom-[108px] left-0 right-0 z-10 max-w-md mx-auto w-full">
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
              className={`h-[40px] w-[40px] rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                activeMode === "coach"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              }`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
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
