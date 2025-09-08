import Application from "@/api/app";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Headphones,
  Play,
  Search,
  Video
} from "lucide-react";
import { useEffect, useState } from "react";

interface EducationalProps {
  content: string;
  ["reference link"]: string;
  title: string;
}

export default function EducationalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "content">("list");
  const [selectedContent, setSelectedContent] =
    useState<EducationalProps | null>(null);
  const { toast } = useToast();
  const [educationalContent, setEducationalContent] = useState<
    EducationalProps[]
  >([]);

  const handleGetEducationalContent = () => {
    Application.getEducationalContent()
      .then((res) => {
        setEducationalContent(res.data);
      })
      .catch((res) => {
        toast({
          title: "Error",
          description: res.response.data.detail,
          variant: "destructive",
        });
      });
  };
  useEffect(() => {
    handleGetEducationalContent();
  }, []);

  const getFilteredContent = () => {
    if (!searchQuery) return educationalContent;

    return educationalContent.filter(
      (content) =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredContent = getFilteredContent();

  const startReading = (contentId: string) => {
    const content = educationalContent.find((c) => c.title === contentId);
    if (content) {
      setSelectedContent(content);
      setCurrentView("content");
    } else {
      toast({
        title: "Content Coming Soon",
        description:
          "This content is being prepared and will be available soon.",
      });
    }
  };

  const goBackToList = () => {
    setCurrentView("list");
    setSelectedContent(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "podcast":
        return Headphones;
      case "guide":
        return BookOpen;
      default:
        return FileText;
    }
  };

  const icons = [Video, Headphones, BookOpen, FileText];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "from-red-500 to-pink-500";
      case "podcast":
        return "from-purple-500 to-indigo-500";
      case "guide":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  const colors = [
    "from-red-500 to-pink-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
  ];

  const renderContentView = () => {
    if (!selectedContent) return null;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={goBackToList}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Button>

        {/* Content Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${colors[2]} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              {(() => {
                const TypeIcon = icons[3];
                return <TypeIcon className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div>
              <h1 className="text-lg font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {selectedContent.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <Card className="bg-white/90 dark:bg-gray-800/90 border shadow-lg backdrop-blur-sm">
          <CardContent className="p-8">
            {selectedContent.content ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {selectedContent.content.split("\n").map((line, index) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1
                        key={index}
                        className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
                      >
                        {line.slice(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200"
                      >
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-medium mb-3 mt-6 text-gray-700 dark:text-gray-300"
                      >
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (
                    line.startsWith("**") &&
                    line.endsWith("**") &&
                    line.length > 4
                  ) {
                    return (
                      <p
                        key={index}
                        className="font-semibold mb-2 text-gray-800 dark:text-gray-200"
                      >
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <li
                        key={index}
                        className="mb-1 ml-4 text-gray-600 dark:text-gray-400 list-disc"
                      >
                        {line.slice(2)}
                      </li>
                    );
                  }
                  if (line.match(/^\d+\. /)) {
                    return (
                      <li
                        key={index}
                        className="mb-1 ml-4 text-gray-600 dark:text-gray-400 list-decimal"
                      >
                        {line.slice(line.indexOf(" ") + 1)}
                      </li>
                    );
                  }
                  if (line.trim() === "") {
                    return <div key={index} className="mb-4"></div>;
                  }
                  return (
                    <p
                      key={index}
                      className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Content Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This content is being prepared and will be available soon.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (currentView === "content") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
        {renderContentView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Educational Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Browse health and wellness content
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((content) => {
            const TypeIcon = icons[3];
            return (
              <Card
                key={content.title}
                className="bg-gradient-to-br from-white/90 to-gray-50/60 dark:from-gray-800/90 dark:to-gray-700/60 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => startReading(content.title)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${colors[2]} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                        {content.content.slice(0, 200)}...
                      </p>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // startReading(content.title);
                          window.open(content["reference link"]);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {/* {content.title === "video"
                          ? "Watch"
                          : content.title === "podcast"
                          ? "Listen"
                          : "Read"} */}
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
