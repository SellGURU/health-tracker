import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Search, 
  Play,
  Video,
  FileText,
  Headphones
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'guide';
}

const mockContent: EducationalContent[] = [
  {
    id: '1',
    title: 'Understanding Your Cholesterol Numbers',
    description: 'Learn how to interpret your lipid panel results and what different cholesterol levels mean for your cardiovascular health.',
    type: 'article'
  },
  {
    id: '2',
    title: 'The Mediterranean Diet: Your Heart\'s Best Friend',
    description: 'Discover how Mediterranean eating patterns can reduce inflammation, lower cholesterol, and promote longevity.',
    type: 'guide'
  },
  {
    id: '3',
    title: 'Stress and Your Health: Breaking the Cycle',
    description: 'Understanding how chronic stress affects your biomarkers and practical strategies for stress management.',
    type: 'video'
  },
  {
    id: '4',
    title: 'Biomarker Optimization for Longevity',
    description: 'Advanced strategies for optimizing key health biomarkers through lifestyle interventions and targeted supplementation.',
    type: 'guide'
  },
  {
    id: '5',
    title: 'Sleep Optimization for Better Health',
    description: 'How quality sleep impacts your biomarkers, hormone levels, and overall health. Practical tips for better rest.',
    type: 'podcast'
  },
  {
    id: '6',
    title: 'Exercise Prescriptions for Metabolic Health',
    description: 'Evidence-based exercise protocols to improve insulin sensitivity, metabolic flexibility, and cardiovascular fitness.',
    type: 'video'
  },
  {
    id: '7',
    title: 'Nutrition Timing and Metabolic Health',
    description: 'Learn how meal timing and intermittent fasting can optimize your metabolic markers and energy levels.',
    type: 'article'
  },
  {
    id: '8',
    title: 'Understanding Inflammation Markers',
    description: 'Deep dive into CRP, ESR, and other inflammatory biomarkers and how to interpret your results.',
    type: 'guide'
  },
  {
    id: '9',
    title: 'Hormone Balance and Wellness',
    description: 'How hormones affect your overall health and practical strategies for maintaining optimal hormone levels.',
    type: 'video'
  },
  {
    id: '10',
    title: 'Mindfulness and Health Optimization',
    description: 'Explore the connection between mental wellness and physical health through mindfulness practices.',
    type: 'podcast'
  }
];

export default function EducationalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const getFilteredContent = () => {
    if (!searchQuery) return mockContent;
    
    return mockContent.filter(content => 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredContent = getFilteredContent();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Educational Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">Browse health and wellness content</p>
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
            const TypeIcon = getTypeIcon(content.type);
            return (
              <Card 
                key={content.id} 
                className="bg-gradient-to-br from-white/90 to-gray-50/60 dark:from-gray-800/90 dark:to-gray-700/60 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(content.type)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                        {content.description}
                      </p>
                      
                      <Button 
                        onClick={() => startReading(content.id)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {content.type === 'video' ? 'Watch' : content.type === 'podcast' ? 'Listen' : 'Read'}
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No content found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}