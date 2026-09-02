import type { Metadata, Viewport } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/lib/toast-context';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileNav } from '@/components/layout/MobileNav';
import { JsonLd } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-serif' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blackora.com';

export const viewport: Viewport = {
  themeColor: '#0b0c10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Blackora | Haute Horlogerie & Luxury Watches Pakistan',
    template: '%s | Blackora Luxury Watches',
  },
  description:
    'Discover Blackora Pakistan — Premier destination for luxury chronographs, automatic skeleton series, and executive diamond timepieces. 100% Genuine, Cash on Delivery & EasyPaisa across Pakistan.',
  keywords: [
    'Blackora',
    'Blackora watches',
    'luxury watches Pakistan',
    'men watches Pakistan',
    'women luxury watches Pakistan',
    'buy watches online Pakistan',
    'chronograph watches',
    'skeleton automatic watches',
    'cash on delivery watches Pakistan',
    'luxury timepieces Karachi Lahore Islamabad',
    'watch affiliate program Pakistan',
  ],
  authors: [{ name: 'Blackora Haute Horlogerie' }],
  creator: 'Blackora',
  publisher: 'Blackora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Blackora | Haute Horlogerie & Luxury Timepieces Pakistan',
    description:
      'Precision engineered luxury timepieces. Automatic skeleton movements, chronographs & diamond bezel watches with express delivery across Pakistan.',
    url: siteUrl,
    siteName: 'Blackora',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/favicon.svg',
        width: 512,
        height: 512,
        alt: 'Blackora Luxury Watches Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blackora | Haute Horlogerie & Executive Watches',
    description:
      'Pakistan’s premier luxury watch destination. Cash on Delivery & EasyPaisa nationwide.',
    images: ['/favicon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-[#0b0c10] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-black w-full max-w-full overflow-x-hidden relative`}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
              <Footer />
              <CartDrawer />
              <MobileNav />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
