import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Clock,
  User,
  Bookmark,
  BookmarkCheck,
  Play,
  Heart,
  Brain,
  Activity,
  Leaf,
  Zap,
  Target,
  Award,
  TrendingUp,
  Settings,
  ChevronRight,
  Video,
  FileText,
  Headphones
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: number;
  author: string;
  publishedAt: Date;
  saved: boolean;
  completed: boolean;
  progress: number;
  rating: number;
  type: 'article' | 'video' | 'podcast' | 'guide';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const mockContent: EducationalContent[] = [
  {
    id: '1',
    title: 'Understanding Your Cholesterol Numbers',
    description: 'Learn how to interpret your lipid panel results and what different cholesterol levels mean for your cardiovascular health.',
    category: 'Cardiovascular Health',
    tags: ['cholesterol', 'heart-health', 'lab-results'],
    readingTime: 8,
    author: 'Dr. Sarah Chen',
    publishedAt: new Date('2025-01-15'),
    saved: true,
    completed: false,
    progress: 60,
    rating: 4.8,
    type: 'article',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'The Mediterranean Diet: Your Heart\'s Best Friend',
    description: 'Discover how Mediterranean eating patterns can reduce inflammation, lower cholesterol, and promote longevity.',
    category: 'Nutrition',
    tags: ['mediterranean-diet', 'heart-health', 'nutrition'],
    readingTime: 15,
    author: 'Maria Rodriguez, RD',
    publishedAt: new Date('2025-01-20'),
    saved: false,
    completed: true,
    progress: 100,
    rating: 4.9,
    type: 'guide',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Stress and Your Health: Breaking the Cycle',
    description: 'Understanding how chronic stress affects your biomarkers and practical strategies for stress management.',
    category: 'Mental Health',
    tags: ['stress-management', 'cortisol', 'wellness'],
    readingTime: 12,
    author: 'Dr. Michael Kim',
    publishedAt: new Date('2025-01-18'),
    saved: true,
    completed: false,
    progress: 25,
    rating: 4.7,
    type: 'video',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    title: 'Biomarker Optimization for Longevity',
    description: 'Advanced strategies for optimizing key health biomarkers through lifestyle interventions and targeted supplementation.',
    category: 'Longevity',
    tags: ['biomarkers', 'longevity', 'optimization'],
    readingTime: 22,
    author: 'Dr. Emma Wilson',
    publishedAt: new Date('2025-01-10'),
    saved: false,
    completed: false,
    progress: 0,
    rating: 4.9,
    type: 'guide',
    difficulty: 'advanced'
  },
  {
    id: '5',
    title: 'Sleep Optimization for Better Health',
    description: 'How quality sleep impacts your biomarkers, hormone levels, and overall health. Practical tips for better rest.',
    category: 'Lifestyle',
    tags: ['sleep', 'recovery', 'hormones'],
    readingTime: 10,
    author: 'Dr. Lisa Park',
    publishedAt: new Date('2025-01-12'),
    saved: true,
    completed: false,
    progress: 40,
    rating: 4.6,
    type: 'podcast',
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'Exercise Prescriptions for Metabolic Health',
    description: 'Evidence-based exercise protocols to improve insulin sensitivity, metabolic flexibility, and cardiovascular fitness.',
    category: 'Fitness',
    tags: ['exercise', 'metabolism', 'fitness'],
    readingTime: 18,
    author: 'Marcus Rodriguez, CSCS',
    publishedAt: new Date('2025-01-08'),
    saved: false,
    completed: true,
    progress: 100,
    rating: 4.8,
    type: 'video',
    difficulty: 'intermediate'
  }
];

const categories = [
  { name: 'All', icon: BookOpen, count: mockContent.length },
  { name: 'Cardiovascular Health', icon: Heart, count: mockContent.filter(c => c.category === 'Cardiovascular Health').length },
  { name: 'Nutrition', icon: Leaf, count: mockContent.filter(c => c.category === 'Nutrition').length },
  { name: 'Mental Health', icon: Brain, count: mockContent.filter(c => c.category === 'Mental Health').length },
  { name: 'Fitness', icon: Activity, count: mockContent.filter(c => c.category === 'Fitness').length },
  { name: 'Lifestyle', icon: Zap, count: mockContent.filter(c => c.category === 'Lifestyle').length },
  { name: 'Longevity', icon: Target, count: mockContent.filter(c => c.category === 'Longevity').length }
];

export default function EducationalPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { toast } = useToast();

  const filteredContent = mockContent.filter(content => {
    const matchesCategory = selectedCategory === 'All' || content.category === selectedCategory;
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSaved = !showSavedOnly || content.saved;
    
    return matchesCategory && matchesSearch && matchesSaved;
  });

  const toggleSaved = (contentId: string) => {
    toast({
      title: "Content saved",
      description: "Added to your reading list",
    });
  };

  const startReading = (contentId: string) => {
    toast({
      title: "Opening content",
      description: "Starting your learning session",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'podcast': return Headphones;
      case 'guide': return BookOpen;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-red-500 to-pink-500';
      case 'podcast': return 'from-purple-500 to-indigo-500';
      case 'guide': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const inProgressContent = mockContent.filter(c => c.progress > 0 && c.progress < 100);
  const completedContent = mockContent.filter(c => c.completed);
  const savedContent = mockContent.filter(c => c.saved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-thin bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                Health Library
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-light">Evidence-based content for your health journey</p>
            </div>
            <Button
              onClick={() => toast({ title: "Settings", description: "Learning preferences coming soon" })}
              variant="outline"
              size="sm"
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, videos..."
                className="pl-10 bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner"
              />
            </div>
            <Button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              variant={showSavedOnly ? "default" : "outline"}
              className={showSavedOnly 
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                : "backdrop-blur-sm bg-white/60 dark:bg-gray-700/60 border-gray-200/50 dark:border-gray-600/50"
              }
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved Only
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:w-80 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-thin bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {inProgressContent.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {completedContent.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-xl backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-thin bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:shadow-lg ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg border border-emerald-200/50 dark:border-emerald-800/30'
                        : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedCategory === category.name 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md' 
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        <category.icon className="w-4 h-4" />
                      </div>
                      <span className={`font-medium text-sm ${
                        selectedCategory === category.name 
                          ? 'text-emerald-800 dark:text-emerald-200' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={selectedCategory === category.name 
                        ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300' 
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-800/80 dark:to-emerald-900/30 p-2 rounded-2xl backdrop-blur-lg border border-white/30 dark:border-gray-700/20 shadow-xl">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-4 py-2"
                >
                  <span className="font-medium">All Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-4 py-2"
                >
                  <span className="font-medium">Saved ({savedContent.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="progress" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-4 py-2"
                >
                  <span className="font-medium">In Progress ({inProgressContent.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {filteredContent.map((content) => {
                    const TypeIcon = getTypeIcon(content.type);
                    return (
                      <Card key={content.id} className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1 pr-2">
                              <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(content.type)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <TypeIcon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100 leading-tight mb-2 break-words">
                                  {content.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                                    {content.category}
                                  </Badge>
                                  <Badge variant={content.difficulty === 'advanced' ? 'destructive' : content.difficulty === 'intermediate' ? 'default' : 'secondary'} className="text-xs">
                                    {content.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSaved(content.id)}
                              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex-shrink-0"
                            >
                              {content.saved ? (
                                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Bookmark className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                            {content.description}
                          </p>
                          
                          {content.progress > 0 && (
                            <div className="space-y-3 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl p-3 backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{content.progress}%</span>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 shadow-inner">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full shadow-sm transition-all duration-500" 
                                    style={{ width: `${content.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {content.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{content.readingTime} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{content.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{content.rating}</span>
                              </div>
                            </div>
                            <span>{formatDate(content.publishedAt)}</span>
                          </div>

                          <div className="pt-2">
                            <Button 
                              onClick={() => startReading(content.id)}
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {content.progress > 0 ? 'Continue' : 'Start'} {content.type === 'video' ? 'Watching' : content.type === 'podcast' ? 'Listening' : 'Reading'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {savedContent.map((content) => {
                    const TypeIcon = getTypeIcon(content.type);
                    return (
                      <Card key={content.id} className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(content.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {content.title}
                              </CardTitle>
                              <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                                {content.category}
                              </Badge>
                            </div>
                            <BookmarkCheck className="w-5 h-5 text-blue-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">{content.description}</p>
                          <Button 
                            onClick={() => startReading(content.id)}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Open Saved Content
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6 mt-6">
                <div className="space-y-4">
                  {inProgressContent.map((content) => {
                    const TypeIcon = getTypeIcon(content.type);
                    return (
                      <Card key={content.id} className="bg-gradient-to-br from-white/90 via-white/80 to-orange-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-orange-900/20 border-0 shadow-xl backdrop-blur-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(content.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{content.title}</h3>
                                <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold">{content.progress}%</span>
                              </div>
                              <div className="mb-3">
                                <Progress value={content.progress} className="h-2 bg-gray-200/50 dark:bg-gray-700/50" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                                  {content.category}
                                </Badge>
                                <Button 
                                  onClick={() => startReading(content.id)}
                                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Continue
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}