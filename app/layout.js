import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Use Google Fonts via standard link to avoid turbopack/font loader issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased text-gray-700`} >
        <Toaster />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
