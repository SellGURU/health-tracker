# Health Analytics Wearable Dashboard - Design Guidelines

## Design Approach
**Glassmorphism Aesthetic** with futuristic health tech inspiration. Drawing from modern health apps like Oura, Whoop, and Apple Health but with enhanced glass effects and teal-blue gradient treatments.

## Typography
- **Primary Font**: Inter or DM Sans (Google Fonts)
- **Headings**: Bold weights (700), large sizes for dashboard metrics (48-64px for primary stats)
- **Body**: Regular (400) and Medium (500) weights, 14-16px
- **Data Points**: Tabular figures, medium weight for consistency

## Layout System
**Tailwind Spacing Primitives**: Use units of 4, 6, 8, 12, 16 consistently
- Cards: p-6 or p-8
- Sections: py-12 to py-20
- Gaps: gap-4 or gap-6 for grids
- Rounded corners: rounded-2xl (16px) or rounded-3xl (24px) throughout

## Core Components

### Navigation
**Mobile-first bottom navigation bar** with 4-5 icons (Dashboard, Activity, Insights, Profile). Fixed positioning with glassmorphic background (backdrop-blur-xl, semi-transparent white/dark background with alpha 0.1-0.2).

**Desktop**: Persistent left sidebar (280px width) with same glass treatment, gradient border on right edge.

### Hero/Dashboard Header
Large hero card featuring:
- Full-width gradient background (blue-teal diagonal gradient: from-blue-500 via-teal-400 to-cyan-500)
- User greeting + daily step count visualization
- Circular progress ring showing primary health metric (steps/calories/heart rate)
- Backdrop blur effect on overlaying content cards
- Height: 40vh on mobile, 50vh on desktop

### Card System
**Primary Health Cards** (glassmorphic treatment):
- Background: rgba(255, 255, 255, 0.08) on dark / rgba(255, 255, 255, 0.6) on light
- Backdrop filter: blur(20px)
- Border: 1px solid with gradient (white/teal with 0.2 opacity)
- Shadow: Soft neumorphic shadow (0 8px 32px rgba(0, 0, 0, 0.1))
- Padding: p-6
- Rounded: rounded-2xl

**Card Types**:
1. **Metric Cards**: Large number display with icon, subtitle, and mini sparkline chart
2. **Activity Cards**: Timeline of daily activities with icons and duration
3. **Goal Progress Cards**: Circular/linear progress bars with gamification badges
4. **Weekly Summary**: 7-day grid with color-coded intensity blocks

### Gamification Elements
**Progress Indicators**:
- Circular rings with gradient strokes (blue-teal)
- Percentage badges in corners with glass background
- Achievement badges: Floating glass pills with icons
- Streak counters: Animated number with flame/trophy icon

**Level System**:
Display user level in top-right of hero with XP bar beneath (thin, rounded, gradient-filled)

### Data Visualization
- **Line Charts**: Gradient fills beneath lines (from color to transparent)
- **Bar Charts**: Rounded top corners, glass-effect bars with slight transparency
- **Heart Rate Zones**: Stacked horizontal bars with color-coded intensities
- Grid: 2-column on mobile, 3-4 column on desktop (grid-cols-2 lg:grid-cols-4)

### Forms & Inputs
Glass-styled input fields:
- Background: Semi-transparent with backdrop blur
- Border: 1px solid teal/blue gradient (low opacity)
- Rounded: rounded-xl
- Floating labels with smooth transitions
- Focus state: Stronger gradient border, increased backdrop blur

## Responsive Breakpoints
- Mobile: Single column, bottom nav, condensed cards (gap-4)
- Tablet (md:768px): 2-column grid, persistent top nav option
- Desktop (lg:1024px): 3-4 column dashboard grid, sidebar navigation, larger card sizes

## Images

**Hero Section Image**:
- **Placement**: Full-width background of hero/dashboard header (40-50vh)
- **Content**: Abstract health/fitness imagery - close-up of smartwatch displaying metrics, or person's wrist with fitness band in motion, or abstract data visualization with glowing points
- **Treatment**: Apply overlay gradient (blue-teal) with 0.6-0.7 opacity, backdrop blur on content cards placed on top
- **Mobile**: Maintain full-width, reduce height to 40vh

**Metric Visualization Icons**:
- **Placement**: Within metric cards as accent elements
- **Content**: Simple line-art icons of heart, steps, calories, sleep moon, water droplet
- **Treatment**: Teal-blue gradient fill, 48-64px size, positioned top-right of metric cards

**Achievement Badges**:
- **Placement**: Gamification section, goal completion cards
- **Content**: Trophy, medal, star, flame icons with glass backgrounds
- **Treatment**: Floating above cards with stronger glass effect and gradient borders

**No traditional large hero image banner** - instead use gradient overlay on dashboard header with wearable device imagery as subtle background texture.

## Animation Principles
**Minimal, purposeful motion**:
- Card hover: Subtle lift (translate-y-1) and increased shadow
- Progress rings: Smooth circular fills (animated stroke-dashoffset)
- Number counters: Count-up animation on page load
- Page transitions: Fade and slide (200-300ms duration)