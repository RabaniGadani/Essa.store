"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Heart, Star, Info } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useWishlist } from "@/components/wishlist-context"
import { formatPKR } from "@/lib/utils"

// --- Sanity Client Setup ---
import { createClient } from "next-sanity"

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-06-01",
  useCdn: true,
})

// --- GROQ Queries ---
// Fetch Sindhi Capes from "Sindhi Capes" folder and Balochi Dresses from "Balochi" folder
const PRODUCTS_QUERY = `
  [
    ...*[_type == "sindhiCape"]{
      _id,
      name,
      price,
      originalPrice,
      "image": images[0].asset->url,
      rating,
      reviews,
      colors,
      sizes,
      description,
      features,
      isNew,
      isSale,
      isLimited,
      inStock,
      "category": "sindhi-cap"
    },
    ...*[_type == "balochiDress"]{
      _id,
      name,
      price,
      originalPrice,
      "image": images[0].asset->url,
      rating,
      reviews,
      colors,
      sizes,
      description,
      features,
      isNew,
      isSale,
      isLimited,
      inStock,
      "category": "balochi-dress"
    }
  ]
`

export default function TraditionalWearPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await sanityClient.fetch(PRODUCTS_QUERY)
        setProducts(data)
      } catch (err) {
        setProducts([])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Categorize products
  const sindhiCaps = products.filter((p) => p.category === "sindhi-cap")
  const balochiDresses = products.filter((p) => p.category === "balochi-dress")
  const allProducts = products

  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : selectedCategory === "sindhi-caps"
      ? sindhiCaps
      : balochiDresses

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
      {/* Hero Section */}
      <div className="relative h-64 ajrak-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ajrak-indigo/90 to-ajrak-red/90"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Traditional Wear</h1>
            <p className="text-ajrak-cream text-lg">Authentic Sindhi Caps & Balochi Dresses</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cultural Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-ajrak-indigo/20">
            <CardHeader>
              <CardTitle className="text-ajrak-indigo flex items-center">
                <Info className="w-5 h-5 mr-2" />
                About Sindhi Caps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                The Sindhi cap (Sindhi Topi) is a traditional headwear worn by Sindhi men. It's an integral part of
                Sindhi culture and identity, often featuring intricate embroidery, mirror work, and traditional
                patterns.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Traditional embroidery and mirror work</li>
                <li>• Available in various colors and designs</li>
                <li>• Perfect for cultural events and daily wear</li>
                <li>• Handcrafted by skilled artisans</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-ajrak-red/20">
            <CardHeader>
              <CardTitle className="text-ajrak-red flex items-center">
                <Info className="w-5 h-5 mr-2" />
                About Balochi Dresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Balochi dresses are known for their vibrant colors, intricate embroidery, and traditional patterns.
                These garments represent the rich cultural heritage of the Baloch people and are perfect for special
                occasions.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Hand-embroidered with traditional motifs</li>
                <li>• Rich colors and premium fabrics</li>
                <li>• Perfect for weddings and festivals</li>
                <li>• Authentic cultural designs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-ajrak-cream/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white">
              All Items ({allProducts.length})
            </TabsTrigger>
            <TabsTrigger
              value="sindhi-caps"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
            >
              Sindhi Caps ({sindhiCaps.length})
            </TabsTrigger>
            <TabsTrigger
              value="balochi-dresses"
              className="data-[state=active]:bg-ajrak-red data-[state=active]:text-white"
            >
              Balochi Dresses ({balochiDresses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {loading ? (
              <div className="text-center text-ajrak-indigo py-12">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ajrak-indigo/10">
                      {/* Product Image */}
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && <Badge className="bg-ajrak-red text-white">New</Badge>}
                        {product.isSale && <Badge className="bg-ajrak-indigo text-white">Sale</Badge>}
                        {product.isLimited && <Badge className="bg-amber-500 text-white">Limited</Badge>}
                        {product.inStock === false && (
                          <Badge variant="secondary" className="bg-gray-500 text-white">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="secondary"
                          className={`w-8 h-8 p-0 bg-white/90 hover:bg-white ${
                            isInWishlist(product._id) ? "text-ajrak-red" : "text-gray-400"
                          }`}
                          onClick={() => {
                            if (isInWishlist(product._id)) {
                              removeFromWishlist(product._id)
                            } else {
                              addToWishlist({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.image,
                                color: product.colors?.[0] || "",
                                size: product.sizes?.[0] || "",
                                category: "Traditional Wear",
                              })
                            }
                          }}
                        >
                          <Heart className="w-4 h-4" fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                        </Button>
                      </div>

                      {/* Quick Add to Cart */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          className="w-full bg-ajrak-indigo hover:bg-ajrak-red text-white"
                          disabled={product.inStock === false}
                          onClick={() => {
                            if (product.inStock !== false) {
                              addToCart({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.image,
                                color: product.colors?.[0] || "",
                                size: product.sizes?.[0] || "",
                                category: "Traditional Wear",
                              })
                            }
                          }}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-ajrak-indigo transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-ajrak-red fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-ajrak-indigo">{formatPKR(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{formatPKR(product.originalPrice)}</span>
                        )}
                      </div>

                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Colors:</span>
                          <div className="flex gap-1">
                            {product.colors.slice(0, 3).map((color: string, index: number) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: color.toLowerCase().includes("indigo")
                                    ? "hsl(var(--ajrak-indigo))"
                                    : color.toLowerCase().includes("red") ||
                                        color.toLowerCase().includes("crimson") ||
                                        color.toLowerCase().includes("maroon")
                                      ? "hsl(var(--ajrak-red))"
                                      : color.toLowerCase().includes("white") ||
                                          color.toLowerCase().includes("cream") ||
                                          color.toLowerCase().includes("ivory")
                                        ? "hsl(var(--ajrak-cream))"
                                        : color.toLowerCase().includes("black")
                                          ? "hsl(var(--ajrak-black))"
                                          : color.toLowerCase().includes("gold")
                                            ? "#FFD700"
                                            : color.toLowerCase().includes("green")
                                              ? "#22c55e"
                                              : color.toLowerCase().includes("blue")
                                                ? "#3b82f6"
                                                : "#6b7280",
                                }}
                                title={color}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.slice(0, 4).map((size: string) => (
                            <Badge key={size} variant="outline" className="text-xs border-ajrak-indigo/30">
                              {size}
                            </Badge>
                          ))}
                          {product.sizes.length > 4 && (
                            <Badge variant="outline" className="text-xs border-ajrak-indigo/30">
                              +{product.sizes.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Features */}
                      {product.features && (
                        <div className="text-xs text-gray-500">
                          {Array.isArray(product.features)
                            ? product.features.slice(0, 2).join(" • ")
                            : ""}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Cultural Heritage Section */}
        <div className="mt-16 bg-gradient-to-r from-ajrak-indigo/10 to-ajrak-red/10 rounded-lg p-8 ajrak-geometric">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ajrak-indigo mb-4">Preserving Cultural Heritage</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              Our traditional wear collection celebrates the rich cultural heritage of Sindhi and Balochi communities.
              Each piece is carefully crafted by skilled artisans who have passed down these techniques through
              generations, ensuring authenticity and quality in every garment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-ajrak-indigo rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">100%</span>
                </div>
                <h3 className="font-semibold text-ajrak-indigo mb-1">Authentic</h3>
                <p className="text-sm text-gray-600">Traditional designs and techniques</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ajrak-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">50+</span>
                </div>
                <h3 className="font-semibold text-ajrak-red mb-1">Artisans</h3>
                <p className="text-sm text-gray-600">Skilled craftspeople involved</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ajrak-indigo rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">5★</span>
                </div>
                <h3 className="font-semibold text-ajrak-indigo mb-1">Quality</h3>
                <p className="text-sm text-gray-600">Premium materials and craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
