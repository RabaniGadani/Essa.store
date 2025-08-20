"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Heart, Eye, Check } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useWishlist } from "@/components/wishlist-context"
import { Product } from "@/lib/sanity-queries"
import { useToast } from "@/hooks/use-toast"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (productId: string) => void
  cart: { [key: string]: number }
}

export function ProductGrid({ products, onAddToCart, cart }: ProductGridProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (product: Product) => {
    if (addingToCart) return // Prevent multiple clicks
    
    setAddingToCart(product._id)
    
    try {
      // Add to cart context
      const itemToAdd = {
        id: product._id,
        name: product.title, // Use title as name
        price: product.price,
        image: product.imageUrl, // Changed to 'image' to match CartItem interface
        color: product.color || "Default", // Use actual color or default
        size: product.size || "One Size", // Use actual size or default
        category: product.category,
      }
      addToCart(itemToAdd)
      
      // Also call the parent handler for local cart state
      onAddToCart(product._id)
      
      // Show success toast
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart!`,
      })
      
      // Show success feedback briefly
      setTimeout(() => {
        setAddingToCart(null)
      }, 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
      setAddingToCart(null)
    }
  }

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        id: product._id,
        name: product.title, // Use title as name
        price: product.price,
        image: product.imageUrl, // Changed to 'image' to match WishlistItem interface
        color: product.color || "Default", // Use actual color or default
        size: product.size || "One Size", // Use actual size or default
        category: product.category,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => {
        const inCart = isInCart(product._id)
        const cartQuantity = getItemQuantity(product._id)
        const isAdding = addingToCart === product._id
        
        return (
          <Card
            key={product._id}
            className="relative overflow-hidden group rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=256&width=256"}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-ajrak-indigo text-white text-xs px-2 py-1 rounded-full">New</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-ajrak-red text-white text-xs px-2 py-1 rounded-full">Featured</Badge>
                )}
                {inCart && (
                  <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    In Cart ({cartQuantity})
                  </Badge>
                )}
              </div>
              <div
                className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                  hoveredProduct === product._id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white text-ajrak-indigo hover:text-ajrak-red"
                  onClick={() => console.log("Quick view:", product.title)} // Placeholder for quick view
                >
                  <Eye className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white text-ajrak-indigo hover:text-ajrak-red"
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdding || !product.inStock}
                >
                  {isAdding ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <ShoppingBag className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className={`rounded-full bg-white/80 hover:bg-white ${
                    isInWishlist(product._id) ? "text-ajrak-red" : "text-ajrak-indigo hover:text-ajrak-red"
                  }`}
                  onClick={() => handleToggleWishlist(product)}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-ajrak-indigo truncate">{product.title}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
                          <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-ajrak-red">Rs {product.price.toFixed(2)}</span>
            </div>
              {product.description && (
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className={`w-full transition-all duration-200 ${
                  inCart 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-ajrak-indigo hover:bg-ajrak-red'
                }`}
                onClick={() => handleAddToCart(product)}
                disabled={isAdding || !product.inStock}
              >
                {isAdding ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Added!
                  </span>
                ) : inCart ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    In Cart ({cartQuantity})
                  </span>
                ) : (
                  product.inStock ? 'Add to Cart' : 'Out of Stock'
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
