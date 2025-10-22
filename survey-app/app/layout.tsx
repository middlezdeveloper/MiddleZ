import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Middle Z Survey - Consulting Engagement Assessment",
  description: "Human-centered survey system using the HCD Impact Framework and Net Promoter Score",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/MiddleZ_logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/MiddleZ_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="leadfeeder"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(ss,ex){
                window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));};
                (function(d,s){
                  fs=d.getElementsByTagName(s)[0];
                  function ce(src){
                    var cs=d.createElement(s);
                    cs.src=src;
                    cs.async=1;
                    fs.parentNode.insertBefore(cs,fs);
                  };
                  ce('https://sc.lfeeder.com/lftracker_v1_'+ss+(ex?'_'+ex:'')+'.js');
                })(document,'script');
              })('p1e024Bl3YW8GB6d');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
