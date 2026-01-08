# User Profile Page - Design Prototype

## Overview
Interactive prototype showcasing a modern user profile page with four distinct states: loading, error, empty, and success.

## States Breakdown

### 1. Loading State
**Purpose**: Shown while fetching user data from the backend

**Design Elements**:
- Skeleton loaders with shimmer animation
- Pulsing placeholder elements that match final layout
- Spinning loader icon with descriptive text
- Maintains visual hierarchy even while loading

**UX Considerations**:
- Users see structure immediately (no blank screen)
- Animation indicates system is working
- Layout doesn't shift when data loads (skeleton matches content)

### 2. Error State
**Purpose**: Displayed when profile fails to load

**Design Elements**:
- Clear error icon (AlertCircle) in red color scheme
- Descriptive, human-friendly error message
- Primary action: "Try Again" (blue CTA)
- Secondary action: "Go Back" (subtle button)
- Collapsible technical details for debugging

**UX Considerations**:
- Non-technical language in main message
- Clear path forward with actionable buttons
- Technical details available but not overwhelming
- Visual hierarchy guides user to retry action

### 3. Empty State
**Purpose**: New users who haven't completed their profile

**Design Elements**:
- Minimal placeholder avatar
- Encouraging messaging focused on next steps
- Interactive checklist showing what to complete
- Single prominent CTA: "Set Up Profile"
- Lighter color scheme (not alarming)

**UX Considerations**:
- Positive, encouraging tone
- Clear checklist reduces overwhelming feeling
- Gamification element (checkboxes)
- One clear action to move forward

### 4. Success State
**Purpose**: Fully populated, active user profile

**Design Elements**:
- Gradient cover image with edit button
- Large, prominent avatar with camera icon overlay
- Clear typography hierarchy (name, username, bio)
- Meta information with icons (email, location, joined date)
- Interactive stats cards with hover effects
- Edit profile button prominently placed

**UX Considerations**:
- Visual polish indicates completeness
- Edit actions available but not intrusive
- Stats are interactive (hover effects suggest clickability)
- Information density balanced with whitespace

## Design System

### Color Palette
- **Primary**: Blue-600 (#2563eb)
- **Text**: Slate-900 (headings), Slate-600 (body)
- **Backgrounds**: White, Slate-50
- **Borders**: Slate-200
- **Error**: Red-600
- **Success**: Green-600

### Typography Scale
- **H1**: 3xl (30px) - User name
- **H2**: 2xl (24px) - State headings
- **Body**: lg (18px) - Bio text
- **Small**: sm (14px) - Meta info

### Spacing System
- Consistent 4px grid
- Card padding: 32px (p-8)
- Section gaps: 24px (gap-6)
- Stats grid: 16px gap (gap-4)

### Interactive Elements
- **Buttons**:
  - Primary: Blue-600 background, white text, shadow-md
  - Secondary: White background, border, slate text
  - Hover: Darker shade + increased shadow
- **Cards**: Rounded-2xl (16px), shadow-xl
- **Hover states**: Scale transform (1.02), color transitions

## Animations

### Page Transitions
- **Fade in**: opacity 0 → 1
- **Slide up**: y: 20 → 0
- **Duration**: 0.3s - 0.4s
- **Exit animations**: Reverse of entrance

### Loading Animations
- **Skeleton**: Pulse animation (built-in Tailwind)
- **Spinner**: Rotate animation
- **Smooth**: 60fps, hardware accelerated

### Interactive Feedback
- **Button hover**: Color transition (300ms)
- **Card hover**: Scale + shadow (smooth spring)
- **Stats hover**: Scale 1.02, border color change

## Component Breakdown

Reusable components identified:
1. **ProfileCard** - Main container with rounded corners, shadow
2. **Avatar** - Circular image with optional edit overlay
3. **StatCard** - Individual stat display with hover effect
4. **ActionButton** - Primary/secondary button variations
5. **EmptyStateIcon** - Circular background with icon
6. **LoadingSkeleton** - Animated placeholder

## Responsive Behavior

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px

### Layout Adjustments
- **Avatar & Name**: Stacked on mobile, side-by-side on tablet+
- **Action Buttons**: Full width on mobile, inline on tablet+
- **Stats Grid**: Always 3 columns (scales down on mobile)
- **Meta Info**: Wraps naturally with flex-wrap

## Accessibility Considerations

✅ **Implemented**:
- Semantic HTML structure
- Color contrast meets WCAG AA
- Interactive elements have hover states
- Loading state provides context
- Error messages are descriptive

🔄 **For Production**:
- Add ARIA labels to interactive elements
- Keyboard navigation support
- Screen reader announcements for state changes
- Focus management when states change
- Skip links for keyboard users

## Implementation Notes

### Dependencies Required
```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x"
}
```

### Usage in Next.js
```typescript
// In app/profile/[id]/page.tsx
import ProfilePrototype from '@/components/ProfilePrototype'

export default function ProfilePage() {
  return <ProfilePrototype />
}
```

### State Management
Current prototype uses local state for demo. In production:
- Replace state switcher with actual data fetching
- Use React Query or SWR for loading/error states
- Implement suspense boundaries
- Add error boundaries

### Data Fetching Pattern
```typescript
// Recommended approach
async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
```

## Design Decisions

### Why these specific states?
1. **Loading**: Users expect immediate feedback when navigating
2. **Error**: Network issues are common, need graceful degradation
3. **Empty**: New user onboarding is critical for retention
4. **Success**: The happy path, fully realized design

### Why skeleton loaders over spinners?
- Reduces perceived load time
- Maintains layout stability
- Provides context about what's loading
- Industry best practice (used by Facebook, LinkedIn, etc.)

### Why prominent edit actions?
- Profiles should be living documents
- Easy editing encourages profile completion
- Visual cues (camera icons) are universally understood

### Why interactive stats?
- Suggests additional functionality (click to view followers list)
- Adds polish and delight
- Common pattern in social platforms

## Next Steps for Implementation

1. **Connect to real data**
   - Replace mock data with Supabase queries
   - Implement actual loading/error states
   - Add profile edit functionality

2. **Add features**
   - Profile image upload
   - Cover image customization
   - Social links section
   - Activity timeline
   - Skills/interests tags

3. **Testing**
   - E2E tests for each state
   - Accessibility audit
   - Performance testing
   - Mobile device testing

4. **Deployment**
   - Set up proper error tracking
   - Add analytics events
   - Implement proper loading strategies
   - Configure CDN for images

## Variants to Consider

### Alternative Layouts
- **Centered**: Full-width stats bar below profile
- **Sidebar**: Stats in left sidebar, content on right
- **Minimal**: Remove cover image, simpler layout

### Alternative Styles
- **Dark mode**: Invert color scheme
- **Glassmorphism**: Translucent cards with backdrop blur
- **Brutalist**: Bold colors, sharp edges, high contrast

### Additional States
- **Pending verification**: Email not confirmed
- **Suspended**: Account temporarily disabled
- **Private profile**: Limited info for non-followers
