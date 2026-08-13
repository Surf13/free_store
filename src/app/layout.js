import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FreeStore",
  description: "Where Everything is Free!",
};

function Header(){
  return (
    <header className="bg-slate-500 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
               <Link href="/">Main Page</Link>
            </div>

            <div>
               <Link href="/product">Product</Link>
            </div>

            <div>
              <Link href="/contact">Contact</Link>
            </div>
           
           <div>
              <Link href="/cart">Cart</Link>
           </div>
          </nav>
        </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Header/> 
        {children}
      </body>
    </html>
  );
}
