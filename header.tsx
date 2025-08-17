"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Session } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, ShoppingBag, Search, User, ChevronDown, Heart, Package } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { useCart } from "@/components/cart-context"
import { useWishlist } from "@/components/wishlist-context"

// Add toast import
import { toast } from "sonner"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTraditionalWearMenuOpen, setIsTraditionalWearMenuOpen] = useState(false)
  const pathname = usePathname()
  const { getTotalItems: getTotalCartItems } = useCart()
  const { getTotalItems: getTotalWishlistItems } = useWishlist()
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("supabaseSession")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  })
  const supabase = createClientComponentClient()

  const totalCartItems = getTotalCartItems()
  const totalWishlistItems = getTotalWishlistItems()

  // For closing sidebar on outside click
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setSession(data.session)
        if (typeof window !== "undefined") {
          if (data.session) {
            window.localStorage.setItem("supabaseSession", JSON.stringify(data.session))
          } else {
            window.localStorage.removeItem("supabaseSession")
          }
        }
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        setSession(session)
        if (typeof window !== "undefined") {
          if (session) {
            window.localStorage.setItem("supabaseSession", JSON.stringify(session))
          } else {
            window.localStorage.removeItem("supabaseSession")
          }
        }
      }
    })

    return () => {
      isMounted = false
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe()
      }
    }
  }, [supabase])

  // Close sidebar on outside click
  useEffect(() => {
    if (!isMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false)
        setIsTraditionalWearMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isMenuOpen])

  const traditionalWearMenu = [
    { name: "All Traditional Wear", href: "/traditional-wear" },
    { name: "Sindhi Caps", href: "/traditional-wear?category=sindhi-caps" },
    { name: "Balochi Dresses", href: "/traditional-wear?category=balochi-dresses" },
    { name: " Heritage Fashion Collection", href: "/catalog?search=ajrak" },
  ]

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Catalog", href: "/catalog" },
    {
      name: "Traditional Wear",
      href: "/traditional-wear",
      submenu: traditionalWearMenu,
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    
  ]

  // Logout handler with toast
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("supabaseSession")
      }
      // Show toast before redirect
      toast.success("Logged out successfully")
      // Delay redirect to allow toast to show
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }, 100) // 100ms delay, adjust as needed for your toast duration
    } catch (error) {
      toast.error("Logout failed. Please try again.")
    }
  }

  // Logout handler for mobile (no redirect)
  const handleMobileLogout = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("supabaseSession")
      }
      setIsMenuOpen(false)
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-ajrak-indigo/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src="/Logo.jpg" alt="Logo" className="w-10 h-10 rounded mr-2 object-cover" />
            <span className="ml-2 text-xl font-bold text-ajrak-indigo group-hover:text-ajrak-red transition-colors">
             Essa.store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) =>
              item.name === "Traditional Wear" ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium transition-colors hover:text-ajrak-red relative ${
                        pathname.startsWith(item.href) ? "text-ajrak-indigo" : "text-gray-600"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                      {pathname.startsWith(item.href) && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-ajrak-indigo to-ajrak-red" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {traditionalWearMenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} className="cursor-pointer">
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-ajrak-red relative ${
                    pathname === item.href ? "text-ajrak-indigo" : "text-gray-600"
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-ajrak-indigo to-ajrak-red" />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-ajrak-indigo hover:text-ajrak-red hover:bg-ajrak-cream/50">
              <Search className="w-4 h-4" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="text-ajrak-indigo hover:text-ajrak-red hover:bg-ajrak-cream/50 relative" asChild>
              <Link href="/wishlist">
                <Heart className="w-4 h-4" />
                {totalWishlistItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-ajrak-red text-white text-xs">
                    {totalWishlistItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-ajrak-indigo hover:text-ajrak-red hover:bg-ajrak-cream/50">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left"
                      >
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="text-ajrak-indigo hover:text-ajrak-red hover:bg-ajrak-cream/50 relative" asChild>
              <Link href="/cart">
                <ShoppingBag className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-ajrak-red text-white text-xs">
                    {totalCartItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-ajrak-indigo hover:text-ajrak-red"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar Menu for Mobile */}
      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            aria-hidden="true"
            onClick={() => {
              setIsMenuOpen(false)
              setIsTraditionalWearMenuOpen(false)
            }}
          />
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className="relative w-72 max-w-full h-full bg-white shadow-lg border-r border-ajrak-indigo/10 flex flex-col transition-transform duration-300 ease-in-out"
            style={{ transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)" }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-ajrak-indigo/10">
              <span className="text-xl font-bold text-ajrak-indigo">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-ajrak-indigo hover:text-ajrak-red"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsTraditionalWearMenuOpen(false)
                }}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col px-4 py-4 space-y-2 flex-1 overflow-y-auto">
              {navigation.map((item) =>
                item.name === "Traditional Wear" ? (
                  <div key={item.name} className="flex flex-col">
                    <button
                      type="button"
                      className="text-sm font-medium text-ajrak-indigo mb-1 flex items-center focus:outline-none"
                      onClick={() => setIsTraditionalWearMenuOpen((open) => !open)}
                      aria-expanded={isTraditionalWearMenuOpen}
                      aria-controls="traditional-wear-sidebar-menu"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isTraditionalWearMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isTraditionalWearMenuOpen && (
                      <div id="traditional-wear-sidebar-menu" className="pl-4 flex flex-col space-y-1">
                        {traditionalWearMenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`text-sm transition-colors hover:text-ajrak-red ${
                              pathname === subItem.href ? "text-ajrak-indigo font-semibold" : "text-gray-600"
                            }`}
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsTraditionalWearMenuOpen(false)
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-ajrak-red ${
                      pathname === item.href ? "text-ajrak-indigo" : "text-gray-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {/* Orders Tab for Mobile - only show if logged in */}
              {session && (
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-colors hover:text-ajrak-red ${
                    pathname === "/orders" ? "text-ajrak-indigo" : "text-gray-600"
                  } flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </Link>
              )}
            </nav>
            {/* Actions */}
            <div className="flex items-center px-4 py-2 space-x-4 border-t border-ajrak-indigo/10">
              <Link href="/wishlist" className="relative text-ajrak-indigo hover:text-ajrak-red" onClick={() => setIsMenuOpen(false)}>
                <Heart className="w-5 h-5" />
                {totalWishlistItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-ajrak-red text-white text-xs">
                    {totalWishlistItems}
                  </Badge>
                )}
              </Link>
              <Link href="/cart" className="relative text-ajrak-indigo hover:text-ajrak-red" onClick={() => setIsMenuOpen(false)}>
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-ajrak-red text-white text-xs">
                    {totalCartItems}
                  </Badge>
                )}
              </Link>
              {session ? (
                <Link
                  href="/profile"
                  className="text-ajrak-indigo hover:text-ajrak-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-ajrak-indigo hover:text-ajrak-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
            {!session && (
              <div className="px-4 py-2">
                <Button
                  variant="outline"
                  className="w-full text-ajrak-indigo border-ajrak-indigo hover:bg-ajrak-indigo hover:text-white"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
            {session && (
              <div className="px-4 py-2">
                <Button
                  variant="outline"
                  className="w-full text-ajrak-red border-ajrak-red hover:bg-ajrak-red hover:text-white"
                  onClick={handleMobileLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
