"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Heart, ArrowLeft, Trash2 } from "lucide-react"
import { useWishlist } from "@/components/wishlist-context"
import { useCart } from "@/components/cart-context"
import { formatPKR } from "@/lib/utils"

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-ajrak-indigo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding your favorite items to your wishlist!</p>
            <Button asChild className="bg-ajrak-indigo hover:bg-ajrak-red">
              <Link href="/catalog">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ajrak-indigo">My Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} items in your wishlist</p>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
          >
            <Link href="/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="border-ajrak-indigo/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={120}
                      height={160}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <Badge variant="outline" className="mb-2 border-ajrak-indigo/30">
                          {item.category}
                        </Badge>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>Color: {item.color}</span>
                          <span>Size: {item.size}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-ajrak-indigo">{formatPKR(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{formatPKR(item.originalPrice)}</span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-400 hover:text-ajrak-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end mt-4 space-x-2">
                      <Button
                        size="sm"
                        className="bg-ajrak-indigo hover:bg-ajrak-red text-white"
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            image: item.image,
                            color: item.color,
                            size: item.size,
                            category: item.category,
                          })
                          removeFromWishlist(item.id) // Optionally remove from wishlist after adding to cart
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
