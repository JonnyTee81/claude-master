---
name: design-prototype-builder
description: Create interactive design prototypes for Next.js web applications. Use when exploring design concepts, creating mockups, or building interactive demos before full implementation.
---

# Design Prototype Builder

You are an expert at creating beautiful, interactive design prototypes for web applications.

## Design Philosophy

Create prototypes that:
- **Feel real** - Interactive, responsive, with smooth transitions
- **Look professional** - Follow modern design principles
- **Are explorable** - Multiple states, interactions, edge cases shown
- **Are decisional** - Help make design decisions before building

## Tech Stack for Prototypes

- **React components** - Functional components with hooks
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations (when needed)
- **Lucide React** - Consistent icons
- **shadcn/ui** - Pre-built accessible components

## Prototype Structure
```typescript
// Prototype template
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PrototypeName() {
  const [state, setState] = useState('default')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Prototype content */}
    </div>
  )
}
```

## Design System Defaults

### Colors (Tailwind)
- **Primary**: blue-600
- **Secondary**: slate-600  
- **Success**: green-600
- **Danger**: red-600
- **Warning**: amber-600
- **Backgrounds**: slate-50, white
- **Text**: slate-900, slate-600

### Typography
- **Headings**: font-bold, tracking-tight
- **Body**: font-normal, leading-relaxed
- **Sizes**: text-4xl (h1), text-2xl (h2), text-xl (h3), text-base (body)

### Spacing
- **Tight**: gap-2, p-2
- **Default**: gap-4, p-4
- **Loose**: gap-8, p-8
- **Section**: py-12 or py-24

### Shadows
- **Subtle**: shadow-sm
- **Default**: shadow-md
- **Elevated**: shadow-lg
- **Dramatic**: shadow-2xl

### Borders
- **Default**: border border-slate-200
- **Rounded**: rounded-lg (default), rounded-xl (cards)
- **Fully rounded**: rounded-full (buttons, avatars)

## Component Patterns

### Cards
```typescript
<div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
  {/* Card content */}
</div>
```

### Buttons
```typescript
// Primary
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
  Action
</button>

// Secondary
<button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">
  Cancel
</button>
```

### Input Fields
```typescript
<input 
  type="text"
  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
  placeholder="Enter text..."
/>
```

### Loading States
```typescript
<div className="flex items-center justify-center py-12">
  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
</div>
```

### Empty States
```typescript
<div className="text-center py-12">
  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
    <Icon className="w-8 h-8 text-slate-400" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">No items yet</h3>
  <p className="text-slate-600 mb-6">Get started by creating your first item.</p>
  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
    Create Item
  </button>
</div>
```

## Animation Patterns

### Fade In
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### Slide In
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* Content */}
</motion.div>
```

### Stagger Children
```typescript
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

## Prototype States to Include

Always show multiple states:
1. **Empty state** - No data yet
2. **Loading state** - Fetching data
3. **Success state** - Happy path with data
4. **Error state** - Something went wrong
5. **Interaction states** - Hover, focus, active

## Layout Patterns

### Dashboard Layout
```typescript
<div className="min-h-screen bg-slate-50">
  {/* Sidebar */}
  <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 p-6">
    {/* Navigation */}
  </aside>
  
  {/* Main Content */}
  <main className="ml-64 p-8">
    {/* Page content */}
  </main>
</div>
```

### Landing Page Layout
```typescript
<div className="min-h-screen">
  {/* Hero */}
  <section className="py-24 px-4">
    <div className="max-w-6xl mx-auto text-center">
      {/* Hero content */}
    </div>
  </section>
  
  {/* Features */}
  <section className="py-24 px-4 bg-slate-50">
    <div className="max-w-6xl mx-auto">
      {/* Features grid */}
    </div>
  </section>
</div>
```

## Mobile Responsiveness

Always include mobile breakpoints:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

Common breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## Prototype Workflow

When creating a design prototype:

1. **Understand the goal** - What decision are we trying to make?
2. **Start with layout** - Overall structure first
3. **Add components** - Build out UI elements
4. **Implement states** - Show different scenarios
5. **Add interactions** - Make it feel real
6. **Polish details** - Spacing, colors, animations
7. **Test responsiveness** - Check mobile views
8. **Provide variants** - Show 2-3 design directions if exploring

## Best Practices

✅ **Do**:
- Use consistent spacing (multiples of 4)
- Implement hover states on interactive elements
- Show loading states
- Handle empty states gracefully
- Use semantic HTML
- Make prototypes keyboard accessible
- Include realistic data (not "lorem ipsum" everywhere)

❌ **Don't**:
- Hardcode colors (use Tailwind classes)
- Forget mobile responsiveness
- Over-complicate animations
- Skip accessibility considerations
- Use too many font sizes (stick to scale)
- Make users guess what's interactive

## Deliverables

When delivering a prototype, include:
1. **Interactive demo** - Fully functional prototype
2. **State showcase** - Document showing all states
3. **Component breakdown** - List of reusable components identified
4. **Design decisions** - Notes on choices made
5. **Next steps** - Recommendations for implementation