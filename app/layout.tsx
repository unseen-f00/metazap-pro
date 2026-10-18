export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-1649623506369592" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1649623506369592"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafafa] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Global Navigation Header */}
          <GlobalHeader />

          {/* Semantic Main Content Container */}
          <main className="flex-1 w-full">{children}</main>

          {/* Global Footer */}
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
