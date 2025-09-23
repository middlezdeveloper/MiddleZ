# Claude Code Prompt: AI vs AI+HCD Interactive Demo

## Project Brief
Create an interactive web demo that showcases the difference between raw AI output and AI enhanced with Human-Centered Design (HCD). This will be a key feature for Middle Z's website to demonstrate their unique approach to AI-powered strategy.

## Core Concept
**"Same AI. Different Human."** - Show how Human-Centered Design transforms generic AI responses into empathetic, actionable insights through better prompting and human understanding.

## Technical Requirements

### Tech Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: OpenAI API (GPT-4) or Claude API
- **Build**: Vite
- **Deployment**: Ready for Vercel/Netlify

### Core Features
1. **Split-screen comparison interface**
2. **Real-time AI response generation**
3. **Smooth animations showing transformation**
4. **Interactive input form**
5. **Shareable results**
6. **Mobile responsive design**

## UX Flow

### 1. Hero Section
```
Title: "Same AI. Different Human."
Subtitle: "Watch how Human-Centered Design transforms artificial intelligence into authentic insight"
CTA: "Try the Demo"
```

### 2. Input Phase
- Clean form asking for business challenge
- Placeholder: "e.g., Our customers aren't engaging with our new product feature"
- Submit button: "Generate Solutions"
- Loading state with anticipation-building animation

### 3. Split-Screen Results
**Left Side - Raw AI:**
- Title: "Standard AI Response"
- Cold, clinical design (blues, sharp edges)
- Generic, feature-focused recommendations
- Robotic typing animation

**Right Side - AI + HCD:**
- Title: "Human-Centered AI"
- Warm, empathetic design (warm purples, rounded corners)
- Human-focused insights with emotional intelligence
- Thoughtful, deliberate reveal animation

### 4. The Transformation
- Show the prompting difference
- Animate the evolution from cold → warm
- Highlight key differentiators
- Show projected impact metrics

## Design Specifications

### Visual Style
- **Raw AI Side**: 
  - Colors: Cool blues (#3B82F6), grays
  - Typography: Monospace for code-like feel
  - Icons: Geometric, angular
  - Animation: Mechanical, linear

- **AI + HCD Side**:
  - Colors: Warm purples (#7C3AED), oranges (#F97316)
  - Typography: Humanist, readable
  - Icons: Rounded, friendly
  - Animation: Organic, eased

### Key Components Needed
1. **InputForm**: Challenge submission
2. **SplitScreen**: Comparison layout
3. **AIResponse**: Response containers with different styling
4. **TypewriterEffect**: Animated text reveal
5. **TransformationOverlay**: Shows the HCD process
6. **ShareButton**: Export/share functionality
7. **LoadingState**: Engaging loading animation

## AI Integration Logic

### Prompt Engineering
Create two distinct prompting strategies:

**Raw AI Prompt:**
```
"Analyze this business challenge and provide recommendations: [USER_INPUT]"
```

**HCD-Enhanced Prompt:**
```
"You are a human-centered design strategist. First, identify the human needs behind this challenge: [USER_INPUT]

Consider:
1. Who are the real people affected?
2. What emotions are at play?
3. What's the deeper 'job-to-be-done'?
4. How does this fit existing human behavior?

Provide recommendations that address both business goals and human needs."
```

### Response Processing
- Parse responses to highlight key differences
- Extract emotional vs. logical elements
- Format for visual comparison
- Add impact predictions

## Interactive Elements

### 1. Hover States
- Raw AI: Sharp, immediate responses
- HCD AI: Warm, contextual information

### 2. Click-to-Reveal
- Show prompting methodology
- Reveal HCD frameworks used
- Display additional insights

### 3. Animation Triggers
- Scroll-based reveals
- Staggered text animations
- Morphing between states

## Content Examples

### Sample Responses for Testing

**Business Challenge:** "Our customers aren't using our new dashboard feature"

**Raw AI Response:**
```
Dashboard Feature Adoption Strategy:
• Improve onboarding flow
• Add tooltips and guides
• Send email campaigns
• Track usage metrics
• A/B test different layouts
• Provide customer support training
```

**HCD AI Response:**
```
The Real Challenge: Change is Hard for Humans

🎯 The Human Truth: Your customers have existing workflows that feel safe
💡 The Insight: Features don't fail because they're bad—they fail because they disrupt comfort
🛠️ The Human-Centered Solution:

Phase 1: Shadow 5 customers using the old system
Phase 2: Map their emotional journey (frustration points, success moments)
Phase 3: Design transition bridges, not feature pushes
Result: 67% adoption vs. industry average of 23%
```

## Performance Requirements
- **Load Time**: < 2 seconds initial load
- **API Response**: < 5 seconds for AI generation
- **Animations**: 60fps smooth
- **Mobile**: Responsive design for all screen sizes

## Analytics & Tracking
- Demo completion rates
- Most common challenge types
- Sharing behavior
- Time spent on each side of comparison

## Future Enhancements (V2)
- Multiple challenge categories (marketing, product, strategy)
- Video testimonials from real clients
- Integration with Middle Z contact form
- A/B testing different HCD frameworks

## Success Metrics
- **Engagement**: Average time on demo > 2 minutes
- **Conversion**: Demo to contact form > 15%
- **Sharing**: Social shares and bookmarks
- **Wow Factor**: User feedback "I never thought about AI this way"

## File Structure
```
/ai-hcd-demo
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── InputForm.tsx
│   │   ├── SplitScreen.tsx
│   │   ├── AIResponse.tsx
│   │   ├── TransformationView.tsx
│   │   └── ShareButton.tsx
│   ├── hooks/
│   │   ├── useAIGeneration.ts
│   │   └── useTypewriter.ts
│   ├── utils/
│   │   ├── aiService.ts
│   │   └── promptTemplates.ts
│   └── types/
│       └── index.ts
├── public/
└── package.json
```

## Implementation Notes
1. **API Keys**: Handle securely, consider backend proxy
2. **Rate Limiting**: Implement to prevent abuse
3. **Error Handling**: Graceful fallbacks for API failures
4. **Accessibility**: Full ARIA support, keyboard navigation
5. **SEO**: Server-side rendering for demo landing page

## Brand Integration
- Use Middle Z color palette (#4F46E5, #7C3AED)
- Include Middle Z logo and branding
- Link to main website and contact
- Consistent typography with main site

---

**Deliverables:**
- Fully functional React application
- Mobile-responsive design
- AI integration with real API calls
- Smooth animations and interactions
- Ready for production deployment
- Documentation for customization

**Timeline Estimate:** 2-3 days for full implementation

**The Goal:** Visitors should leave thinking "I need to work with people who understand AI like this."