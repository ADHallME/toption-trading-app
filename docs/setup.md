# Project Setup Guide

This guide covers the complete setup process for the Virtera Energy landing page project.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package managers
- **Git** - Version control
- **Code editor** - VS Code recommended

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd virteralanding
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase client libraries

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Update your `.env.local` file with these values

### 5. Verify Installation

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to verify the application is running.

## Development Environment

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**

### VS Code Settings

Add these settings to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Project Structure

```
virteralanding/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── about/page.tsx  # About page
│   │   ├── contact/page.tsx # Contact page
│   │   ├── sustainability/page.tsx # Sustainability page
│   │   ├── portfolio/page.tsx # Portfolio page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── features/      # Feature components
│   │   └── shared/        # Shared components
│   ├── lib/               # Utility libraries
│   ├── pages/             # Pages directory (for auth)
│   └── middleware.ts      # Route protection
├── public/                # Static assets
├── docs/                  # Documentation
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Configuration Files

### Next.js Configuration (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
    },
  },
  plugins: [],
}
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

4. **Environment variables not loading**
   - Ensure `.env.local` is in the project root
   - Restart the development server
   - Check variable names match exactly

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](../troubleshooting.md)
2. Review the [Development Environment Guide](../development.md)
3. Create an issue in the repository

## Next Steps

After completing the setup:

1. Review the [Architecture Overview](../architecture.md)
2. Explore the [Component Library](../components.md)
3. Start with the [Development Environment](../development.md) guide
4. Check out the [Deployment Guide](../deployment.md) when ready to deploy

---

*Last updated: June 2024* 