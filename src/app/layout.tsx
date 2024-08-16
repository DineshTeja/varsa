import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Varsa Model Playground",
  description: "A quick way to test and compare all sorts of LLMs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.8, maximum-scale=0.8" />
      </head>
      <body className={`${inter.className} bg-gray-100`}>
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90 text-green-900 p-4">
          <div className="text-center">
          <h2 className="text-4xl font-thin font-serif text-green-800 mb-3">varsa</h2>
            <p className="text-md mx-3">Unfortunately, this site is optimized for larger screens. Please use a tablet or desktop device to access varsa&apos;s model playground.</p>
          </div>
        </div>
        <div className="hidden md:block">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}