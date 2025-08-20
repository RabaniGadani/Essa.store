"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { getUniqueColors, getUniqueSizes } from "@/lib/sanity-queries"

interface ProductFiltersProps {
  selectedColor?: string
  selectedSize?: string
  onColorChange: (color: string | undefined) => void
  onSizeChange: (size: string | undefined) => void
  onClearFilters: () => void
}

export function ProductFilters({
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true)
        const [colorsData, sizesData] = await Promise.all([
          getUniqueColors(),
          getUniqueSizes(),
        ])
        setColors(colorsData)
        setSizes(sizesData)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [])

  const hasActiveFilters = selectedColor || selectedSize

  const handleColorChange = (value: string) => {
    onColorChange(value === "all" ? undefined : value)
  }

  const handleSizeChange = (value: string) => {
    onSizeChange(value === "all" ? undefined : value)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-ajrak-indigo" />
          <h2 className="text-xl font-semibold text-ajrak-indigo">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-ajrak-red border-ajrak-red hover:bg-ajrak-red hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <Select
            value={selectedColor || "all"}
            onValueChange={handleColorChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedColor && (
            <div className="mt-2">
              <Badge 
                variant="secondary" 
                className="bg-ajrak-indigo/10 text-ajrak-indigo border-ajrak-indigo/20"
              >
                {selectedColor}
                <button
                  onClick={() => onColorChange(undefined)}
                  className="ml-1 hover:text-ajrak-red"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <Select
            value={selectedSize || "all"}
            onValueChange={handleSizeChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSize && (
            <div className="mt-2">
              <Badge 
                variant="secondary" 
                className="bg-ajrak-indigo/10 text-ajrak-indigo border-ajrak-indigo/20"
              >
                {selectedSize}
                <button
                  onClick={() => onSizeChange(undefined)}
                  className="ml-1 hover:text-ajrak-red"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-500">
          Loading filter options...
        </div>
      )}
    </div>
  )
} 