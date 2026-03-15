import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "NotePilot AI";
const APP_DEFAULT_TITLE = "NotePilot AI - Your Personal Second Brain";
const APP_TITLE_TEMPLATE = "%s | NotePilot AI";
const APP_DESCRIPTION = "The ultimate AI-powered Personal Knowledge Management system. Upload messy notes and let AI build your second brain with knowledge graphs, flashcards, and interactive study modes.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen flex antialiased selection:bg-indigo-500/30`}>
        {/* Grain Effect */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20">N</div>
            <span className="font-black tracking-tight">NotePilot</span>
          </div>
        </div>

        <Sidebar className="w-64 flex-none border-r border-white/5 bg-black/40 backdrop-blur-xl hidden md:block z-10" />

        <main className="flex-1 min-w-0 flex flex-col relative h-screen overflow-y-auto pt-16 md:pt-0 z-10">
          {children}
        </main>
        
        <Script id="register-sw" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', async function() {
                try {
                  const registration = await navigator.serviceWorker.register('/sw.js');
                  console.log('SW registered:', registration);
                  
                  // Background Sync
                  if ('SyncManager' in window) {
                    await registration.sync.register('sync-data');
                  }

                  // Periodic Sync
                  if ('periodicSync' in registration) {
                    const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                    if (status.state === 'granted') {
                      await registration.periodicSync.register('periodic-sync', {
                        minInterval: 24 * 60 * 60 * 1000,
                      });
                    }
                  }
                } catch (err) {
                  console.error('SW registration failed:', err);
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
