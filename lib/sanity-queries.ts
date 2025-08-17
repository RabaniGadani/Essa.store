import { client } from "./sanity"

// Product interface matching your Sanity schema
export interface Product {
  _id: string
  title: string
  slug: string
  price: number
  description: string
  category: string
  color?: string
  size?: string
  inStock: boolean
  featured: boolean
  isNew: boolean
  imageUrl: string
}

// City interface matching your Sanity schema
export interface City {
  _id: string
  name: string
  slug: string
  province?: string
  country: string
  shippingCost: number
  deliveryTime: number
  isActive: boolean
  description?: string
}

// GROQ query to fetch all products
export const getAllProductsQuery = `*[_type == "product"]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch featured products only
export const getFeaturedProductsQuery = `*[_type == "product" && featured == true]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch new products only
export const getNewProductsQuery = `*[_type == "product" && isNew == true]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch products by category
export const getProductsByCategoryQuery = (category: string) => `*[_type == "product" && category == $category]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch a single product by slug
export const getProductBySlugQuery = (slug: string) => `*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch products by color
export const getProductsByColorQuery = (color: string) => `*[_type == "product" && color == $color]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch products by size
export const getProductsBySizeQuery = (size: string) => `*[_type == "product" && size == $size]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  color,
  size,
  inStock,
  featured,
  isNew,
  "imageUrl": picture.asset->url
}`

// GROQ query to fetch all cities
export const getAllCitiesQuery = `*[_type == "city" && isActive == true]{
  _id,
  name,
  slug,
  province,
  country,
  shippingCost,
  deliveryTime,
  isActive,
  description
}`

// GROQ query to fetch cities by province
export const getCitiesByProvinceQuery = (province: string) => `*[_type == "city" && province == $province && isActive == true]{
  _id,
  name,
  slug,
  province,
  country,
  shippingCost,
  deliveryTime,
  isActive,
  description
}`

// GROQ query to fetch a single city by slug
export const getCityBySlugQuery = (slug: string) => `*[_type == "city" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  province,
  country,
  shippingCost,
  deliveryTime,
  isActive,
  description
}`

// GROQ query to fetch unique colors
export const getUniqueColorsQuery = `array::distinct(*[_type == "product" && defined(color)].color)`

// GROQ query to fetch unique sizes
export const getUniqueSizesQuery = `array::distinct(*[_type == "product" && defined(size)].size)`

// GROQ query to fetch unique provinces
export const getUniqueProvincesQuery = `array::distinct(*[_type == "city" && isActive == true].province)`

// Function to fetch all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await client.fetch(getAllProductsQuery)
  } catch (error) {
    console.error('Error fetching all products:', error)
    throw new Error('Failed to fetch products')
  }
}

// Function to fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await client.fetch(getFeaturedProductsQuery)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw new Error('Failed to fetch featured products')
  }
}

// Function to fetch new products
export async function getNewProducts(): Promise<Product[]> {
  try {
    return await client.fetch(getNewProductsQuery)
  } catch (error) {
    console.error('Error fetching new products:', error)
    throw new Error('Failed to fetch new products')
  }
}

// Function to fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await client.fetch(getProductsByCategoryQuery(category), { category })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }
}

// Function to fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await client.fetch(getProductBySlugQuery(slug), { slug })
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw new Error('Failed to fetch product')
  }
}

// Function to fetch products by color
export async function getProductsByColor(color: string): Promise<Product[]> {
  try {
    return await client.fetch(getProductsByColorQuery(color), { color })
  } catch (error) {
    console.error('Error fetching products by color:', error)
    throw new Error('Failed to fetch products by color')
  }
}

// Function to fetch products by size
export async function getProductsBySize(size: string): Promise<Product[]> {
  try {
    return await client.fetch(getProductsBySizeQuery(size), { size })
  } catch (error) {
    console.error('Error fetching products by size:', error)
    throw new Error('Failed to fetch products by size')
  }
}

// Function to fetch unique colors
export async function getUniqueColors(): Promise<string[]> {
  try {
    return await client.fetch(getUniqueColorsQuery)
  } catch (error) {
    console.error('Error fetching unique colors:', error)
    throw new Error('Failed to fetch unique colors')
  }
}

// Function to fetch unique sizes
export async function getUniqueSizes(): Promise<string[]> {
  try {
    return await client.fetch(getUniqueSizesQuery)
  } catch (error) {
    console.error('Error fetching unique sizes:', error)
    throw new Error('Failed to fetch unique sizes')
  }
}

// Function to fetch all cities
export async function getAllCities(): Promise<City[]> {
  try {
    return await client.fetch(getAllCitiesQuery)
  } catch (error) {
    console.error('Error fetching all cities:', error)
    throw new Error('Failed to fetch cities')
  }
}

// Function to fetch cities by province
export async function getCitiesByProvince(province: string): Promise<City[]> {
  try {
    return await client.fetch(getCitiesByProvinceQuery(province), { province })
  } catch (error) {
    console.error('Error fetching cities by province:', error)
    throw new Error('Failed to fetch cities by province')
  }
}

// Function to fetch a single city by slug
export async function getCityBySlug(slug: string): Promise<City | null> {
  try {
    return await client.fetch(getCityBySlugQuery(slug), { slug })
  } catch (error) {
    console.error('Error fetching city by slug:', error)
    throw new Error('Failed to fetch city')
  }
}

// Function to fetch unique provinces
export async function getUniqueProvinces(): Promise<string[]> {
  try {
    return await client.fetch(getUniqueProvincesQuery)
  } catch (error) {
    console.error('Error fetching unique provinces:', error)
    throw new Error('Failed to fetch unique provinces')
  }
}

// Function to search products by title or description
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    const query = `*[_type == "product" && (title match "*${searchTerm}*" || description match "*${searchTerm}*")]{
      _id,
      title,
      slug,
      price,
      description,
      category,
      color,
      size,
      inStock,
      featured,
      isNew,
      "imageUrl": picture.asset->url
    }`
    return await client.fetch(query)
  } catch (error) {
    console.error('Error searching products:', error)
    throw new Error('Failed to search products')
  }
} 