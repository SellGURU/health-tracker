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
  Headphones,
  ArrowLeft,
  Clock
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'guide';
  content?: string;
  author?: string;
  readingTime?: number;
  publishedAt?: string;
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

// Detailed content for each educational item
const contentDetails: Record<string, EducationalContent> = {
  '1': {
    id: '1',
    title: 'Understanding Your Cholesterol Numbers',
    description: 'Learn how to interpret your lipid panel results and what different cholesterol levels mean for your cardiovascular health.',
    type: 'article',
    author: 'Dr. Sarah Johnson',
    readingTime: 8,
    publishedAt: 'January 15, 2025',
    content: `# Understanding Your Cholesterol Numbers

Cholesterol is a waxy substance found in your blood that your body needs to build healthy cells. However, high levels of cholesterol can increase your risk of heart disease.

## Types of Cholesterol

### LDL Cholesterol ("Bad" Cholesterol)
Low-density lipoprotein (LDL) cholesterol carries cholesterol particles throughout your body. LDL cholesterol builds up in the walls of your arteries, making them hard and narrow.

**Optimal levels:**
- Less than 100 mg/dL: Optimal
- 100-129 mg/dL: Near optimal
- 130-159 mg/dL: Borderline high
- 160-189 mg/dL: High
- 190 mg/dL and above: Very high

### HDL Cholesterol ("Good" Cholesterol)
High-density lipoprotein (HDL) cholesterol absorbs cholesterol and carries it back to the liver, which flushes it from the body.

**Optimal levels:**
- 60 mg/dL and above: High (protective against heart disease)
- 40 mg/dL and above for men: Acceptable
- 50 mg/dL and above for women: Acceptable
- Below 40 mg/dL for men: Low (risk factor)
- Below 50 mg/dL for women: Low (risk factor)

## Improving Your Cholesterol

### Dietary Changes
1. **Reduce saturated fats** - Found in red meat and dairy products
2. **Eliminate trans fats** - Often found in processed foods
3. **Eat omega-3 fatty acids** - Found in salmon, walnuts, and flaxseeds
4. **Increase soluble fiber** - Found in oats, beans, and fruits

### Lifestyle Modifications
- **Exercise regularly** - Aim for 150 minutes of moderate activity per week
- **Lose weight** - Even a 5-10% weight loss can help
- **Quit smoking** - Improves HDL cholesterol
- **Limit alcohol** - Moderate consumption may help raise HDL

## When to See Your Doctor

Contact your healthcare provider if:
- Your total cholesterol is above 240 mg/dL
- Your LDL is above 160 mg/dL
- Your HDL is below 40 mg/dL (men) or 50 mg/dL (women)
- You have other risk factors for heart disease

Remember, these numbers are just one part of your overall health picture. Work with your healthcare provider to understand what your specific numbers mean for you.`
  },
  '2': {
    id: '2',
    title: 'The Mediterranean Diet: Your Heart\'s Best Friend',
    description: 'Discover how Mediterranean eating patterns can reduce inflammation, lower cholesterol, and promote longevity.',
    type: 'guide',
    author: 'Dr. Maria Rodriguez',
    readingTime: 12,
    publishedAt: 'January 10, 2025',
    content: `# The Mediterranean Diet: Your Heart's Best Friend

The Mediterranean diet has been extensively studied and proven to be one of the most effective eating patterns for heart health, longevity, and overall wellness.

## What is the Mediterranean Diet?

The Mediterranean diet is based on the traditional eating patterns of countries bordering the Mediterranean Sea, including Greece, Italy, Spain, and southern France.

### Core Components

**Primary Foods (Daily):**
- Vegetables and fruits
- Whole grains
- Legumes and nuts
- Olive oil as the primary fat source
- Herbs and spices

**Secondary Foods (Weekly):**
- Fish and seafood (2-3 times per week)
- Poultry (2-3 times per week)
- Eggs (up to 4 per week)
- Dairy products (moderate amounts)

**Occasional Foods (Monthly):**
- Red meat (limited)
- Processed foods (minimal)
- Sweets (occasional treats)

## Health Benefits

### Cardiovascular Health
- **50% reduction** in heart disease risk
- **Lower blood pressure** and improved circulation
- **Reduced inflammation** markers like CRP
- **Better cholesterol profiles** with higher HDL

### Metabolic Benefits
- Improved insulin sensitivity
- Better blood sugar control
- Reduced risk of type 2 diabetes
- Healthy weight management

### Cognitive Health
- Reduced risk of Alzheimer's disease
- Better memory and cognitive function
- Lower rates of depression
- Improved mood and mental clarity

## Getting Started

### Week 1: Foundation
1. **Switch to olive oil** for cooking and dressings
2. **Add a serving of nuts** to your daily routine
3. **Include fish** in 2 meals this week
4. **Eat more vegetables** with each meal

### Week 2: Expansion
1. **Try new whole grains** like quinoa and farro
2. **Add legumes** to soups and salads
3. **Use herbs and spices** instead of salt
4. **Have fruit** for dessert instead of sweets

### Week 3: Integration
1. **Plan Mediterranean meals** for the entire week
2. **Try new recipes** from different Mediterranean countries
3. **Enjoy meals socially** when possible
4. **Include a glass of red wine** with dinner (optional)

The Mediterranean diet isn't just about food—it's a lifestyle that emphasizes fresh, whole foods, social eating, and mindful consumption.`
  },
  '3': {
    id: '3',
    title: 'Stress and Your Health: Breaking the Cycle',
    description: 'Understanding how chronic stress affects your biomarkers and practical strategies for stress management.',
    type: 'video',
    author: 'Dr. Michael Chen',
    readingTime: 15,
    publishedAt: 'January 8, 2025',
    content: `# Stress and Your Health: Breaking the Cycle

Chronic stress is one of the most significant yet overlooked factors affecting your health biomarkers. Understanding this connection is crucial for optimal wellness.

## How Stress Affects Your Body

### Immediate Stress Response
When you encounter stress, your body releases hormones like cortisol and adrenaline. This "fight-or-flight" response is designed to help you handle short-term threats.

### Chronic Stress Impact
When stress becomes chronic, these hormonal changes can seriously impact your health:

**Cardiovascular Effects:**
- Increased blood pressure
- Elevated heart rate
- Higher cholesterol levels
- Increased inflammation (elevated CRP)

**Metabolic Consequences:**
- Insulin resistance
- Higher blood glucose
- Weight gain (especially abdominal)
- Disrupted sleep patterns

## Effective Stress Management Strategies

### Mind-Body Techniques

**1. Meditation and Mindfulness**
- Start with 5 minutes daily
- Use apps like Headspace or Calm
- Practice deep breathing exercises
- Try body scan meditation

**2. Progressive Muscle Relaxation**
- Tense and release muscle groups
- Start from toes, work up to head
- Practice 10-15 minutes before bed

### Physical Strategies

**1. Regular Exercise**
- Cardio: 30 minutes, 5 times per week
- Strength training: 2-3 times per week
- Nature walks: Proven to reduce cortisol
- Swimming: Low-impact stress relief

**2. Sleep Optimization**
- Maintain consistent sleep schedule
- Create a relaxing bedtime routine
- Limit screens 1 hour before bed
- Keep bedroom cool and dark

Remember, managing stress is not about eliminating it completely—it's about developing healthy ways to cope with life's inevitable challenges.`
  }
};

export default function EducationalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'content'>('list');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
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
    const content = contentDetails[contentId] || mockContent.find(c => c.id === contentId);
    if (content) {
      setSelectedContent(content);
      setCurrentView('content');
    } else {
      toast({
        title: "Content Coming Soon",
        description: "This content is being prepared and will be available soon.",
      });
    }
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedContent(null);
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
            <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(selectedContent.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
              {(() => {
                const TypeIcon = getTypeIcon(selectedContent.type);
                return <TypeIcon className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div>
              <h1 className="text-3xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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
                {selectedContent.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-medium mb-3 mt-6 text-gray-700 dark:text-gray-300">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                    return <p key={index} className="font-semibold mb-2 text-gray-800 dark:text-gray-200">{line.slice(2, -2)}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index} className="mb-1 ml-4 text-gray-600 dark:text-gray-400 list-disc">{line.slice(2)}</li>;
                  }
                  if (line.match(/^\d+\. /)) {
                    return <li key={index} className="mb-1 ml-4 text-gray-600 dark:text-gray-400 list-decimal">{line.slice(line.indexOf(' ') + 1)}</li>;
                  }
                  if (line.trim() === '') {
                    return <div key={index} className="mb-4"></div>;
                  }
                  return <p key={index} className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">{line}</p>;
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Content Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400">This content is being prepared and will be available soon.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (currentView === 'content') {
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
                className="bg-gradient-to-br from-white/90 to-gray-50/60 dark:from-gray-800/90 dark:to-gray-700/60 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => startReading(content.id)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          startReading(content.id);
                        }}
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