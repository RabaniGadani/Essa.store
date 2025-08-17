"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Grid, LayoutGrid, Search, Filter } from "lucide-react"

// Import Sanity client
import { createClient } from "next-sanity"

// Helper to sanitize projectId (a-z, 0-9, dashes only)
function sanitizeProjectId(id?: string): string {
  if (!id) return ""
  return id.toLowerCase().replace(/[^a-z0-9-]/g, "")
}

// Helper to sanitize dataset (a-z, 0-9, _, -)
function sanitizeDataset(ds?: string): string {
  if (!ds) return ""
  return ds.toLowerCase().replace(/[^a-z0-9_-]/g, "")
}

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ""
const projectId = sanitizeProjectId(rawProjectId)
const dataset = sanitizeDataset(rawDataset)

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2023-12-01",
  useCdn: true,
})

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  color: string
  sizes: string[]
  imageUrls: string[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  rating: number
  description: string
  reviews?: number
  featured?: boolean
}

function getSanityImageUrl(ref: string, width = 400, height = 400) {
  if (!ref) return "/placeholder.svg"
  const [, id, size, format] = ref.split("-")
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}?w=${width}&h=${height}&fit=crop`
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [layout, setLayout] = useState<"masonry" | "grid">("masonry")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    setLoading(true)
    sanityClient
      .fetch(
        `*[_type == "portfolio"]{
          _id,
          title,
          price,
          originalPrice,
          category,
          color,
          sizes,
          "imageUrls": [
            images[0].asset->url,
            images[1].asset->url,
            images[2].asset->url
          ],
          inStock,
          isNew,
          isSale,
          rating,
          description,
          reviews
        }`
      )
      .then((data: any[]) => {
        const mapped = data.map((p) => ({
          _id: p._id || "",
          name: p.title || "",
          price: p.price || 0,
          originalPrice: p.originalPrice,
          category: p.category || "",
          color: p.color || "",
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls.map((url: string) => url || "/placeholder.svg").slice(0, 3) : ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
          inStock: typeof p.inStock === "boolean" ? p.inStock : true,
          isNew: p.isNew,
          isSale: p.isSale,
          rating: p.rating || 0,
          description: p.description || "",
          reviews: p.reviews,
        }))
        setProducts(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => (p.category ? p.category.toLowerCase() : "")))
    ).filter(Boolean)
    return [
      { id: "all", name: "All Products", count: products.length },
      ...cats.map((cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: products.filter((p) => (p.category || "").toLowerCase() === cat).length,
      })),
      { id: "featured", name: "Featured", count: products.filter((p) => p.featured).length },
    ]
  }, [products])

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products

    if (filter === "featured") {
      filtered = filtered.filter((p) => p.featured)
    } else if (filter !== "all") {
      filtered = filtered.filter((p) => (p.category || "").toLowerCase() === filter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered
  }, [products, filter, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/30 to-white">
      {/* Ajrak Pattern Header */}
      <div className="relative h-40 ajrak-geometric overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ajrak-indigo/90 to-ajrak-red/90"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Products</h1>
            <p className="text-ajrak-cream text-lg">Traditional Artistry Meets Modern Design</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ajrak-indigo w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-ajrak-indigo/30 focus:border-ajrak-indigo text-center"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                onClick={() => setFilter(category.id)}
                className={`text-sm ${
                  filter === category.id
                    ? "bg-ajrak-indigo hover:bg-ajrak-red text-white"
                    : "border-ajrak-indigo/30 text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white"
                }`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-ajrak-cream text-ajrak-indigo">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-ajrak-indigo/20">
            <Button
              variant={layout === "masonry" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("masonry")}
              className={layout === "masonry" ? "bg-ajrak-indigo hover:bg-ajrak-red" : "hover:bg-ajrak-cream"}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("grid")}
              className={layout === "grid" ? "bg-ajrak-indigo hover:bg-ajrak-red" : "hover:bg-ajrak-cream"}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-ajrak-indigo font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse">
              <Filter className="w-12 h-12 text-ajrak-indigo" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading products...</h3>
          </div>
        ) : filteredProducts.length > 0 ? (
          layout === "masonry" ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="break-inside-avoid mb-4 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-ajrak-indigo/10"
                >
                  <div className="relative">
                    <Image
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      alt={product.name || "Product image"}
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && <Badge className="absolute top-2 left-2 bg-ajrak-red text-white">Featured</Badge>}
                    <div className="absolute inset-0 bg-gradient-to-t from-ajrak-indigo/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ajrak-indigo mb-2 group-hover:text-ajrak-red transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1 capitalize">{product.category}</p>
                    {typeof product.price === "number" && (
                      <p className="text-ajrak-indigo font-bold mb-2">Rs {product.price}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {product.inStock === false && (
                        <Badge variant="outline" className="text-xs border-ajrak-red/30 text-ajrak-red">
                          Out of Stock
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge variant="outline" className="text-xs border-ajrak-indigo/30 text-ajrak-indigo">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative border border-ajrak-indigo/10"
                >
                  <Image
                    src={product.imageUrls[0] || "/placeholder.svg"}
                    alt={product.name || "Product image"}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-ajrak-red text-white z-10">Featured</Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ajrak-indigo/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white w-full">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-ajrak-cream capitalize">{product.category}</p>
                      {typeof product.price === "number" && (
                        <p className="text-ajrak-cream font-bold">Rs {product.price}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-ajrak-indigo" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setFilter("all")
                setSearchTerm("")
              }}
              className="bg-ajrak-indigo hover:bg-ajrak-red"
            >
              Show All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
