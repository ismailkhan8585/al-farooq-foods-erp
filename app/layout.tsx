import type { Metadata, Viewport } from 'next'
import { THEME_INIT_SCRIPT } from '@/lib/theme-script'
import './globals.css'

export const metadata: Metadata = {
  title: 'AL FAROOQ FOODS - Business Management System',
  description: 'Offline-first business and production management for AL FAROOQ FOODS (Juices, Mineral Water, Confectionery & Snacks).',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/al-farooq-foods-logo.png', type: 'image/png' },
    ],
    apple: '/al-farooq-foods-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#7CB518',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Sets data-theme before first paint to avoid a flash of the wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  try {
                    navigator.serviceWorker.register('/sw.js').catch(function(e) {
                      console.log('SW registration note:', e);
                    });
                  } catch (e) {}
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
