# Nemo Portfolio

A modern, feature-rich portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

![Portfolio Preview](./public/images/preview.png)

## ✨ Features

### Core Features
- **🌓 Dark/Light Mode Toggle** - Smooth theme switching with system preference detection and localStorage persistence
- **✨ Micro-interactions & Animations** - Framer Motion powered page transitions, hover effects, and scroll animations
- **📝 Blog System** - MDX-based blog with article listing, individual posts, and tag filtering
- **👤 About Me Page** - Personal story with interactive timeline of development journey
- **🎯 Skills Visualization** - Animated skill bars with hover details and tech stack showcase
- **📁 Project Case Studies** - Detailed project pages with demos, code links, and tech used
- **📍 "Now" Page** - Current work, reading list, learning progress, and side projects
- **💬 Testimonials Section** - Quotes from collaborators and clients
- **📧 Interactive Contact Form** - Form validation and email integration ready
- **🎮 Easter Eggs** - Hidden surprises including Konami code activation
- **👥 Visitor Counter** - Live visitor stats display
- **📊 Analytics Dashboard** - Visual stats about site visits

### Design Features
- **Modern Aesthetic** - Clean design inspired by Dieter Rams / Swiss International Style
- **Unique Color Scheme** - Warm stone/red palette (not generic blue-purple gradients)
- **Excellent Typography** - Carefully selected font stack with proper hierarchy
- **Responsive Design** - Fully responsive across all devices
- **Fast Performance** - Optimized for Core Web Vitals

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── about/             # About page with timeline
│   ├── blog/              # Blog listing and posts
│   │   ├── [slug]/        # Individual blog post
│   │   └── tag/[tag]/     # Tag-filtered blog posts
│   ├── contact/           # Contact form page
│   ├── now/               # Now page (current activities)
│   ├── projects/          # Projects listing
│   │   └── [id]/          # Individual project case study
│   ├── secret/            # Secret Easter egg page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── analytics.tsx     # Analytics tracking
│   ├── analytics-dashboard.tsx
│   ├── easter-egg.tsx    # Konami code handler
│   ├── footer.tsx
│   ├── navigation.tsx
│   ├── testimonials.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── visitor-counter.tsx
├── lib/                   # Utility functions
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nemo-portfolio.git
cd nemo-portfolio/my-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static files will be generated in the `dist` folder.

## 🎮 Easter Eggs

Try these fun interactions:

1. **Konami Code**: Press ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard to unlock a secret page
2. **Theme Toggle**: Click the sun/moon icon in the navigation to switch themes
3. **Hover Effects**: Try hovering over cards, buttons, and links throughout the site

## 📝 Customization

### Personal Information
Update your personal information in:
- `app/layout.tsx` - Metadata and SEO
- `app/about/page.tsx` - Bio and timeline
- `app/contact/page.tsx` - Contact information
- `app/now/page.tsx` - Current activities

### Projects
Add your projects in `app/projects/page.tsx` and create detailed case studies in `app/projects/[id]/page.tsx`.

### Blog Posts
Add blog posts in `app/blog/page.tsx` and create individual posts in `app/blog/[slug]/page.tsx`.

### Colors
Customize the color scheme in `app/globals.css`:

```css
:root {
  --primary: #dc2626;      /* Change this to your primary color */
  /* ... other colors */
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for the animation library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework

---

Built with ❤️ by Nemo
