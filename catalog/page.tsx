"use client"
import { useState, useEffect } from "react"
import { getAllProducts, getProductsByColor, getProductsBySize, Product } from "@/lib/sanity-queries"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { CartDisplay } from "@/components/cart-display"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()

  // Fetch products on mount
  useEffect(() => {
    let isMounted = true
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data: Product[] = await getAllProducts()
        
        if (isMounted) {
          setProducts(data)
          setFilteredProducts(data)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err)
          setError('Failed to load products. Please try again later.')
          setLoading(false)
        }
      }
    }

    fetchProducts()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Apply filters when color or size changes
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let filtered = products

        // Apply color filter
        if (selectedColor) {
          filtered = filtered.filter(product => product.color === selectedColor)
        }

        // Apply size filter
        if (selectedSize) {
          filtered = filtered.filter(product => product.size === selectedSize)
        }

        setFilteredProducts(filtered)
      } catch (error) {
        console.error('Error applying filters:', error)
      }
    }

    applyFilters()
  }, [selectedColor, selectedSize, products])

  // Add to cart handler
  const handleAddToCart = (productId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }))
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedColor(undefined)
    setSelectedSize(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
      {/* Ajrak Pattern Header */}
      <div className="ajrak-pattern h-32 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-ajrak-indigo/80"></div>
        <div className="relative text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Fashion Catalog</h1>
          <p className="text-ajrak-cream text-lg">Discover Traditional & Contemporary Designs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <ProductFilters
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-ajrak-indigo text-xl">Loading products...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <span className="text-ajrak-red text-xl block mb-4">{error}</span>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-ajrak-indigo text-white px-4 py-2 rounded hover:bg-ajrak-red transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <span className="text-ajrak-indigo text-xl block mb-4">
                {products.length === 0 ? "No products found." : "No products match your filters."}
              </span>
              {products.length > 0 && (
                <button 
                  onClick={handleClearFilters} 
                  className="bg-ajrak-indigo text-white px-4 py-2 rounded hover:bg-ajrak-red transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} cart={cart} />
        )}
      </div>
      
      {/* Cart Display */}
      <CartDisplay />
    </div>
  )
}
