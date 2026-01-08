# Profile Prototype Demo

Interactive user profile page prototype with multiple states (loading, error, empty, success).

## Quick Start

```bash
# Navigate to the project
cd profile-demo

# Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **4 Interactive States**: Loading, Error, Empty, and Success
- **State Switcher**: Toggle between states to explore different UI scenarios
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS

## Project Structure

```
profile-demo/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   └── ProfilePrototype.tsx  # Main prototype component
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## How to Use

Once the app is running:

1. Use the state switcher buttons at the top of the page
2. Click on **Loading**, **Error**, **Empty**, or **Success**
3. Explore how the UI changes for each state
4. Test responsive behavior by resizing your browser

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Next Steps

To turn this into a real profile page:

1. Connect to Supabase or your backend
2. Replace state switcher with actual data fetching
3. Implement profile edit functionality
4. Add image upload for avatar/cover
5. Add error tracking and analytics
