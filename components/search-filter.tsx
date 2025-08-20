"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"

interface FilterState {
  search: string
  categories: string[]
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void
  totalResults: number
}

export function SearchFilter({ onFilterChange, totalResults }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 1000],
    sortBy: "newest",
    inStock: false,
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = [
    "Dresses",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Shoes",
    "Accessories",
    "Bags",
    "Jewelry",
    "Scarves",
    "Traditional Wear",
    "Sindhi Caps",
    "Balochi Dresses",
    "Kurtas & Shirts",
  ]

  const colors = [
    { name: "Ajrak Indigo", value: "ajrak-indigo", color: "bg-ajrak-indigo" },
    { name: "Ajrak Red", value: "ajrak-red", color: "bg-ajrak-red" },
    { name: "Cream", value: "cream", color: "bg-ajrak-cream border" },
    { name: "Black", value: "black", color: "bg-ajrak-black" },
    { name: "White", value: "white", color: "bg-white border" },
    { name: "Navy", value: "navy", color: "bg-navy-600" },
    { name: "Brown", value: "brown", color: "bg-amber-800" },
    { name: "Green", value: "green", color: "bg-green-600" },
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "Name: A to Z" },
    { value: "name-za", label: "Name: Z to A" },
    { value: "popular", label: "Most Popular" },
  ]

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const toggleArrayFilter = (array: string[], value: string, key: keyof FilterState) => {
    const newArray = array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
    updateFilters({ [key]: newArray })
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      categories: [],
      colors: [],
      sizes: [],
      priceRange: [0, 1000],
      sortBy: "newest",
      inStock: false,
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const activeFilterCount =
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-base font-semibold text-ajrak-indigo mb-3 block">Categories</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleArrayFilter(filters.categories, category, "categories")}
              />
              <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label className="text-base font-semibold text-ajrak-indigo mb-3 block">Colors</Label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <div key={color.value} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => toggleArrayFilter(filters.colors, color.value, "colors")}
                className={`w-8 h-8 rounded-full ${color.color} border-2 transition-all ${
                  filters.colors.includes(color.value)
                    ? "border-ajrak-red scale-110"
                    : "border-gray-300 hover:border-ajrak-indigo"
                }`}
                title={color.name}
              />
              <span className="text-xs text-center">{color.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <Label className="text-base font-semibold text-ajrak-indigo mb-3 block">Sizes</Label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleArrayFilter(filters.sizes, size, "sizes")}
              className={filters.sizes.includes(size) ? "bg-ajrak-indigo hover:bg-ajrak-red" : ""}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold text-ajrak-indigo mb-3 block">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
          max={1000}
          min={0}
          step={10}
          className="w-full"
        />
      </div>

      {/* In Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={filters.inStock}
          onCheckedChange={(checked) => updateFilters({ inStock: checked as boolean })}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-ajrak-red text-ajrak-red hover:bg-ajrak-red hover:text-white bg-transparent"
        >
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10 pr-4 py-3 border-ajrak-indigo/20 focus:border-ajrak-indigo"
        />
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden border-ajrak-indigo text-ajrak-indigo bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-ajrak-red text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-ajrak-indigo">Filter Products</SheetTitle>
                <SheetDescription>Refine your search with these filters</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filter Toggle */}
          <Button
            variant="outline"
            className="hidden sm:flex border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-ajrak-red text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <span className="text-sm text-gray-600">{totalResults} products found</span>
        </div>

        {/* Sort Dropdown */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="w-48 border-ajrak-indigo/20 focus:border-ajrak-indigo">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="bg-ajrak-indigo text-white">
              {category}
              <button
                onClick={() => toggleArrayFilter(filters.categories, category, "categories")}
                className="ml-1 hover:text-ajrak-red"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="bg-ajrak-red text-white">
              {colors.find((c) => c.value === color)?.name}
              <button
                onClick={() => toggleArrayFilter(filters.colors, color, "colors")}
                className="ml-1 hover:text-ajrak-cream"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="bg-ajrak-indigo text-white">
              Size {size}
              <button
                onClick={() => toggleArrayFilter(filters.sizes, size, "sizes")}
                className="ml-1 hover:text-ajrak-red"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Desktop Filters Panel */}
      {isFilterOpen && (
        <div className="hidden sm:block border border-ajrak-indigo/20 rounded-lg p-6 bg-ajrak-cream/10">
          <FilterContent />
        </div>
      )}
    </div>
  )
}
