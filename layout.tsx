import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-context"
import { WishlistProvider } from "@/components/wishlist-context"
import { Toaster } from "@/components/ui/toaster"



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sindhi Fashion - Balochi Fashion Collection",
  description: "Discover our exclusive fashion collections and timeless designs",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <Header />
         
            <main>{children}</main>
         
            <Footer />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
