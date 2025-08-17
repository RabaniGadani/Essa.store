
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react"
import { client } from "@/lib/sanity"
import WhatssapContact from "@/components/whatssapIcon"



export default async function HomePage() {
  // Fetch featured products from Sanity
  let featuredProducts: {
    _id: string
    title: string
    price: number
    images: { asset: { url: string } }[]
    category?: string
    inStock?: boolean
    badge?: string
  }[] = []
  let featuredError: string | null = null

  try {
    featuredProducts = await client.fetch(
      `*[_type == "product" && featured == true]{
        _id,
        title,
        price,
        "images": picture.asset->{url},
        category,
        inStock
      }`
    )
    // Convert images to array for compatibility with old code
    featuredProducts = featuredProducts.map((p: any) => ({
      ...p,
      images: p.images ? [{ asset: { url: p.images.url } }] : []
    }))
  } catch (err) {
    featuredError = "Failed to load featured products."
  }

  // Fetch testimonials from Sanity (server-side)
  let testimonials: {
    _id: string
    customerName: string
    testimonial: string
    rating: number
    product?: {
      images: { asset: { url: string } }[]
      title: string
    }
  }[] = []
  let testimonialsError: string | null = null

  try {
    testimonials = await client.fetch(
      `*[_type == "customerTestimonial"]{
        _id,
        customerName,
        testimonial,
        rating,
        product->{
          images[]->{asset->{url}},
          title
        }
      }`
    )
  } catch (err) {
    testimonialsError = "Failed to load testimonials."
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 ajrak-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-ajrak-indigo/80 via-ajrak-red/60 to-ajrak-indigo/80"></div>
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Fashion Hero"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative text-center max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Balochi and Sindhi
            <span className="block text-ajrak-cream">Heritage Fashion Collection</span>
          </h1>
          <p className="text-xl text-ajrak-cream mb-8 max-w-2xl mx-auto">
            Discover the timeless beauty of traditional Ajrak artistry reimagined for contemporary fashion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3 bg-ajrak-red hover:bg-ajrak-indigo">
              <Link href="/catalog">
                Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 bg-transparent border-ajrak-cream text-ajrak-cream hover:bg-ajrak-cream hover:text-ajrak-indigo"
            >
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>
   
   <WhatssapContact/>
  

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-ajrak-cream/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ajrak-indigo mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600">Handpicked pieces celebrating traditional Prodects</p>
          </div>

          {featuredError ? (
            <div className="text-center py-12 text-red-500">{featuredError}</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-ajrak-indigo/70">No featured products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-ajrak-indigo/10 relative">
                    <Image
                      src={product.images?.[0]?.asset?.url || "/placeholder.svg"}
                      alt={product.title}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-ajrak-red text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ajrak-indigo/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-ajrak-indigo mb-2 group-hover:text-ajrak-red transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-ajrak-indigo">Rs {product.price}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-ajrak-indigo hover:bg-ajrak-red">
              <Link href="/catalog">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white ajrak-geometric">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ajrak-indigo to-ajrak-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ajrak-indigo mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over Rs 20,000 in Pakistan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ajrak-indigo to-ajrak-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ajrak-indigo mb-2">Authentic Craftsmanship</h3>
              <p className="text-gray-600">Traditional Dress techniques and premium materials guaranteed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ajrak-indigo to-ajrak-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ajrak-indigo mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated customer support team always ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-ajrak-cream/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ajrak-indigo mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our valued customers</p>
          </div>

          {/* Fetch customerTestimonial from Sanity */}
          {testimonialsError ? (
            <div className="text-center py-12 text-red-500">{testimonialsError}</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-ajrak-indigo/70">No testimonials found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-ajrak-indigo/10 hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  {/* Product Picture from Sanity */}
                  {testimonial.product && testimonial.product.images && testimonial.product.images[0]?.asset?.url && (
                    <div className="mb-4">
                      <img
                        src={testimonial.product.images[0].asset.url}
                        alt={testimonial.product.title || "Product"}
                        className="w-24 h-24 object-cover rounded-full border-2 border-ajrak-indigo shadow"
                      />
                    </div>
                  )}
                  {/* Stars for Card */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (testimonial.rating ?? 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill={i < (testimonial.rating ?? 0) ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 text-center">"{testimonial.testimonial}"</p>
                  <p className="font-semibold text-ajrak-indigo">{testimonial.customerName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-ajrak-indigo to-ajrak-red text-white ajrak-pattern">
        <div className="absolute inset-0 bg-ajrak-indigo/80"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-4xl font-bold mb-4">Stay Connected</h2>
          <p className="text-xl text-ajrak-cream mb-8">
            Subscribe to our newsletter for the latest Ajrak collections and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-ajrak-indigo placeholder-gray-500 border-0 focus:ring-2 focus:ring-ajrak-cream"
            />
            <Button size="lg" className="bg-ajrak-cream text-ajrak-indigo hover:bg-white font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
