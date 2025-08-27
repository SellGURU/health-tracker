import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search,
  Clock,
  BookOpen,
  Share,
  Bookmark,
  Plus,
  Heart,
  Activity,
  Brain,
  Utensils,
  Moon,
  Dumbbell
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  readingTime: number;
  tags: string[];
  category: string;
  content: string;
  saved: boolean;
}

const educationalContent: EducationalContent[] = [
  {
    id: '1',
    title: 'Understanding Your Biological Age',
    description: 'Learn how biological age differs from chronological age and what factors influence it.',
    readingTime: 8,
    tags: ['aging', 'biomarkers', 'longevity'],
    category: 'Health Science',
    content: 'Biological age represents how well your body is functioning...',
    saved: false
  },
  {
    id: '2',
    title: 'Optimizing Sleep for Better Health',
    description: 'Discover evidence-based strategies to improve your sleep quality and duration.',
    readingTime: 12,
    tags: ['sleep', 'recovery', 'wellness'],
    category: 'Lifestyle',
    content: 'Sleep is one of the most important pillars of health...',
    saved: true
  },
  {
    id: '3',
    title: 'The Science of Intermittent Fasting',
    description: 'Explore the metabolic benefits and different approaches to intermittent fasting.',
    readingTime: 15,
    tags: ['nutrition', 'metabolism', 'fasting'],
    category: 'Nutrition',
    content: 'Intermittent fasting has gained popularity for its health benefits...',
    saved: false
  },
  {
    id: '4',
    title: 'Building a Sustainable Exercise Routine',
    description: 'Create a workout plan that fits your lifestyle and health goals.',
    readingTime: 10,
    tags: ['exercise', 'fitness', 'habit'],
    category: 'Fitness',
    content: 'Regular physical activity is crucial for maintaining health...',
    saved: false
  },
  {
    id: '5',
    title: 'Stress Management Techniques',
    description: 'Learn practical methods to manage stress and improve mental health.',
    readingTime: 7,
    tags: ['stress', 'mindfulness', 'mental-health'],
    category: 'Mental Health',
    content: 'Chronic stress can have significant impacts on health...',
    saved: true
  },
  {
    id: '6',
    title: 'Reading Lab Results: A Complete Guide',
    description: 'Understand what your blood work means and how to interpret key biomarkers.',
    readingTime: 20,
    tags: ['lab-results', 'biomarkers', 'health-data'],
    category: 'Health Science',
    content: 'Understanding your lab results empowers you to take control...',
    saved: false
  }
];

const categoryIcons = {
  'Health Science': Brain,
  'Lifestyle': Heart,
  'Nutrition': Utensils,
  'Fitness': Dumbbell,
  'Mental Health': Moon
};

export default function EducationalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>(['2', '5']);
  const { toast } = useToast();

  const categories = Array.from(new Set(educationalContent.map(item => item.category)));

  const filteredContent = educationalContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSave = (contentId: string) => {
    setSavedItems(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
    
    toast({
      title: savedItems.includes(contentId) ? "Removed from saved" : "Saved successfully",
      description: savedItems.includes(contentId) 
        ? "Content removed from your saved items" 
        : "Content added to your saved items",
    });
  };

  const handleShare = (content: EducationalContent) => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Content link copied to clipboard",
      });
    }
  };

  const handleAddToPlan = (content: EducationalContent) => {
    toast({
      title: "Added to Action Plan",
      description: `"${content.title}" has been added to your action plan as a reading task`,
    });
  };

  if (selectedContent) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Content Reader Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedContent(null)}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(selectedContent.id)}
              >
                <Bookmark className={`w-4 h-4 ${savedItems.includes(selectedContent.id) ? 'fill-current text-blue-600' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(selectedContent)}
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAddToPlan(selectedContent)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Plan
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {selectedContent.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedContent.readingTime} min read
              </div>
              <Badge variant="secondary">{selectedContent.category}</Badge>
            </div>
            <div className="flex gap-2">
              {selectedContent.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto prose dark:prose-invert">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {selectedContent.description}
            </p>
            <div className="text-gray-900 dark:text-gray-100">
              {selectedContent.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Educational</h1>
          <Badge variant="secondary" className="text-xs">
            {filteredContent.length} articles
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search articles, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((content) => {
            const IconComponent = categoryIcons[content.category as keyof typeof categoryIcons];
            return (
              <Card 
                key={content.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedContent(content)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <Badge variant="secondary" className="text-xs">
                        {content.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(content.id);
                      }}
                    >
                      <Bookmark className={`w-4 h-4 ${savedItems.includes(content.id) ? 'fill-current text-blue-600' : ''}`} />
                    </Button>
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {content.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {content.readingTime} min
                    </div>
                    <div className="flex gap-1">
                      {content.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{content.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}