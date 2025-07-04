# Virtera Energy Landing Page

A modern, responsive landing page for Virtera Energy, a sustainable energy consulting firm. Built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Features

### 🎨 Design & Animation
- **Hero Slider**: Animated hero section with rock-like geometric animations inspired by GreenHarbor design
- **Smooth Transitions**: Framer Motion animations throughout the site
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with consistent branding

### 📱 Pages
- **Home**: Hero slider with animated content transitions
- **About**: Company information, team, and values
- **Contact**: Interactive contact form with expandable information panel
- **Sustainability**: Corporate commitments and health & safety information
- **Portfolio**: Project showcase with filtering capabilities

### 🔐 Authentication
- **Supabase Integration**: Complete authentication system
- **Protected Routes**: Middleware for route protection
- **Auth Pages**: Sign in, sign up, and password reset functionality
- **User Management**: Profile and sign out functionality

### 🛠 Technical Stack
- **Next.js 15**: App Router with TypeScript
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Modern icon library
- **Supabase**: Authentication and database
- **Responsive Images**: Next.js Image optimization

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd virteralanding
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── contact/page.tsx   # Contact page
│   ├── sustainability/page.tsx # Sustainability page
│   ├── portfolio/page.tsx # Portfolio page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   │   ├── Navigation.tsx
│   │   └── Hero.tsx
│   ├── features/         # Feature components
│   └── shared/           # Shared components
├── lib/                  # Utility libraries
│   └── supabase.ts       # Supabase client
├── pages/                # Pages directory for auth
│   ├── _app.tsx          # Auth app wrapper
│   └── auth/             # Authentication pages
│       ├── signin.tsx
│       ├── signup.tsx
│       └── reset-password.tsx
└── middleware.ts         # Route protection middleware
```

## Key Features

### Hero Slider Animation
The main hero section features a unique animation system inspired by the GreenHarbor design:
- **Rock Animation**: Geometric shapes that rotate and scale continuously
- **Content Transitions**: Smooth text and image transitions between slides
- **Progress Indicators**: Visual progress bars and slide indicators
- **Auto-play**: Automatic slide transitions with manual controls

### Authentication System
Complete authentication flow with Supabase:
- **Server-side Auth**: Secure authentication with SSR support
- **Protected Routes**: Middleware protection for dashboard routes
- **Auth Pages**: Standalone authentication pages outside app directory
- **User Management**: Profile display and sign out functionality

### Responsive Design
Mobile-first responsive design:
- **Breakpoints**: Optimized for mobile, tablet, and desktop
- **Navigation**: Collapsible mobile menu
- **Images**: Responsive image optimization
- **Typography**: Scalable text sizing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)
- **Component Structure**: Functional components with hooks

### Performance

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Built-in bundle analyzer
- **SEO**: Meta tags and structured data

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
