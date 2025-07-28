# 🚀 Toption - Top Options Trading Platform

## Quick Start
1. Open this folder in Cursor
2. Run `npm install`
3. Run `npm run dev`
4. Visit http://localhost:3000

## Deploy to Vercel
```bash
npm run build
npx vercel --prod
```

## Features
- Smart options screening with Yahoo Finance data
- Real-time market quotes
- Trade journal & watchlists
- User authentication via Supabase
- Free tier (5 scans/day) + Pro/Premium plans
- Modern UI with Tailwind CSS

## Tech Stack
- Next.js 14 + TypeScript
- Supabase (auth + database)
- Yahoo Finance API (free)
- Tailwind CSS + Lucide icons
- Vercel deployment

## Domain
Ready for: toption.trade 🎯

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── auth/page.tsx      # Auth page
│   ├── dashboard/page.tsx # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
│       ├── quotes/route.ts
│       ├── options/route.ts
│       ├── screener/route.ts
│       ├── watchlist/route.ts
│       └── trades/route.ts
├── components/            # React components
│   ├── auth/             # Auth components
│   │   └── AuthForm.tsx
│   └── dashboard/        # Dashboard components
│       ├── EnhancedOverview.tsx
│       └── OptionsScreener.tsx
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── yahooFinance.ts   # Yahoo Finance API
├── types/                # TypeScript types
│   └── database.ts       # Database types
└── middleware.ts         # Route protection middleware
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

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
