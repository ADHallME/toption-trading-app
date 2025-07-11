// 📁 Install: npm install @supabase/auth-helpers-nextjs nodemailer
// 📁 Or use Resend: npm install resend (easier)

// 📁 .env.local (ADD EMAIL CONFIG)
RESEND_API_KEY=re_your_resend_key
FROM_EMAIL=hello@toption.trade

// 📁 src/lib/email.ts
interface WelcomeEmailData {
  email: string
  firstName?: string
}

export const sendWelcomeEmail = async ({ email, firstName }: WelcomeEmailData) => {
  try {
    const response = await fetch('/api/email/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName })
    })
    return response.ok
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

// 📁 src/app/api/email/welcome/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json()
    
    // Using Resend (easier than nodemailer)
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: 'Welcome to Toption - Your AI Options Screener',
      html: getWelcomeEmailHTML(firstName)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

function getWelcomeEmailHTML(firstName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #10b981, #14b8a6); padding: 40px 30px; text-align: center; }
    .logo { width: 48px; height: 48px; background: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .content { padding: 40px 30px; color: #e2e8f0; }
    .button { display: inline-block; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .feature { margin: 20px 0; padding: 16px; background: #334155; border-radius: 8px; }
    .footer { padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span style="color: #10b981; font-weight: bold; font-size: 24px;">T</span>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Toption!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 18px;">Your AI-powered options screener is ready</p>
    </div>
    
    <div class="content">
      <h2 style="color: white;">Hi${firstName ? ` ${firstName}` : ''}! 👋</h2>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Thanks for joining Toption! You now have access to professional-grade options screening 
        that finds high-probability opportunities in seconds, not hours.
      </p>
      
      <a href="https://toption-app.vercel.app/dashboard" class="button">
        Start Screening Options →
      </a>
      
      <h3 style="color: white; margin-top: 40px;">What you get with your free account:</h3>
      
      <div class="feature">
        <h4 style="color: #10b981; margin: 0 0 8px;">🎯 5 AI Scans Daily</h4>
        <p style="margin: 0; color: #cbd5e1;">Smart algorithms find the best opportunities automatically</p>
      </div>
      
      <div class="feature">
        <h4 style="color: #10b981; margin: 0 0 8px;">📊 Curated Opportunities</h4>
        <p style="margin: 0; color: #cbd5e1;">Pre-filtered for optimal risk/reward ratios</p>
      </div>
      
      <div class="feature">
        <h4 style="color: #10b981; margin: 0 0 8px;">📈 Real-Time Analytics</h4>
        <p style="margin: 0; color: #cbd5e1;">Live Greeks, IV analysis, and probability calculations</p>
      </div>
      
      <h3 style="color: white; margin-top: 40px;">Quick Start Guide:</h3>
      <ol style="color: #cbd5e1; line-height: 1.8;">
        <li><strong>Complete your setup</strong> - Tell us your trading preferences</li>
        <li><strong>Run your first scan</strong> - Click "Screener" and hit "Run Scan"</li>
        <li><strong>Add to watchlist</strong> - Save interesting opportunities</li>
        <li><strong>Track trades</strong> - Use the trade journal to monitor performance</li>
      </ol>
      
      <a href="https://toption-app.vercel.app/dashboard" class="button">
        Get Started Now →
      </a>
      
      <p style="margin-top: 40px; color: #94a3b8;">
        Questions? Just reply to this email - we're here to help!
      </p>
    </div>
    
    <div class="footer">
      <p>Happy trading!</p>
      <p><strong>The Toption Team</strong></p>
      <p style="margin-top: 20px;">
        <a href="https://toption-app.vercel.app" style="color: #10b981;">toption-app.vercel.app</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// 📁 UPDATE: src/components/auth/AuthForm.tsx (Add email trigger)
// Add this after successful signup:

if (data.user) {
  // Send welcome email
  await sendWelcomeEmail({ 
    email: email,
    firstName: email.split('@')[0] // Extract name from email
  })
  
  setSuccess('Account created! Check your email for next steps.')
}

// 📁 SETUP STEPS:
// 1. Sign up at resend.com (free tier: 3k emails/month)
// 2. Get API key → Add to Vercel environment variables
// 3. Verify domain (or use resend subdomain for testing)
// 4. npm install resend
// 5. Test with your email first!