"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield, MessageCircle, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { formatPKR } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  color: string
  size: string
  quantity: number
  inStock: boolean
  category: string
}

interface RecommendedProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
}

const WHATSAPP_NUMBER = "923051070920"

function getWhatsappOrderMessage(
  cartItems: CartItem[],
  subtotal: number,
  savings: number,
  promoDiscount: number,
  appliedPromo: string | null,
  shipping: number,
  tax: number,
  total: number,
  addressForm: AddressFormState
) {
  let message = `*Order Summary*\n\n`
  cartItems.forEach((item, idx) => {
    message += `*${idx + 1}. ${item.name}*\n`
    message += `  - Category: ${item.category}\n`
    message += `  - Color: ${item.color}\n`
    message += `  - Size: ${item.size}\n`
    message += `  - Price: Rs${formatPKR(item.price)} x ${item.quantity} = ${formatPKR(item.price * item.quantity)}\n`
    if (item.originalPrice) {
      message += `  - Original: Rs${formatPKR(item.originalPrice)}\n`
    }
    message += `\n`
  })
  message += `Subtotal: Rs${formatPKR(subtotal)}\n`
  if (savings > 0) {
    message += `You Save: -Rs${formatPKR(savings)}\n`
  }
  if (promoDiscount > 0 && appliedPromo) {
    message += `Promo (${appliedPromo}): -Rs${formatPKR(promoDiscount)}\n`
  }
  message += `Shipping: Rs${formatPKR(shipping)}\n`
  message += `Tax: Rs${formatPKR(tax)}\n`
  message += `*Total: Rs${formatPKR(total)}*\n\n`
  message += `*Customer Details:*\n`
  message += `Name: ${addressForm.name || ""}\n`
  message += `Phone: ${addressForm.phone || ""}\n`
  message += `Email: ${addressForm.email || ""}\n`
  message += `Address: ${addressForm.address || ""}\n`
  message += `City: ${addressForm.city || ""}\n`
  message += `Postal Code: ${addressForm.postalCode || ""}\n`
  return encodeURIComponent(message)
}

interface AddressFormState {
  name: string
  phone: string
  email: string
  address: string
  city: string
  postalCode: string
}

const STATIC_RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: "rec1",
    name: "Classic Ajrak Shawl",
    price: 2500,
    image: "/static/ajrak-shawl.jpg",
    category: "Shawls",
  },
  {
    id: "rec2",
    name: "Sindhi Topi",
    price: 1200,
    image: "/static/sindhi-topi.jpg",
    category: "Accessories",
  },
  {
    id: "rec3",
    name: "Traditional Kurta",
    price: 3200,
    image: "/static/traditional-kurta.jpg",
    category: "Men's Wear",
  },
  {
    id: "rec4",
    name: "Embroidered Dupatta",
    price: 1800,
    image: "/static/embroidered-dupatta.jpg",
    category: "Dupattas",
  },
  {
    id: "rec5",
    name: "Handmade Khussa",
    price: 2200,
    image: "/static/handmade-khussa.jpg",
    category: "Footwear",
  },
  {
    id: "rec6",
    name: "Ajrak Print Dress",
    price: 3500,
    image: "/static/ajrak-dress.jpg",
    category: "Women's Wear",
  },
]

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, addToCart } = useCart()
  const { toast } = useToast()

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const [addressForm, setAddressForm] = useState<AddressFormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const [addressFormTouched, setAddressFormTouched] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  // Just use static recommended products
  const recommended = STATIC_RECOMMENDED_PRODUCTS

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    })
  }

  const isAddressFormValid =
    !!addressForm.name.trim() &&
    !!addressForm.phone.trim() &&
    !!addressForm.email.trim() &&
    !!addressForm.address.trim() &&
    !!addressForm.city.trim() &&
    !!addressForm.postalCode.trim()

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10")
      toast({
        title: "Promo code applied!",
        description: "WELCOME10 - 10% discount applied to your order.",
      })
    } else if (promoCode.toLowerCase() === "traditional20") {
      setAppliedPromo("TRADITIONAL20")
      toast({
        title: "Promo code applied!",
        description: "TRADITIONAL20 - 20% discount applied to your order.",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      })
    }
    setPromoCode("")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)

  const promoDiscount =
    appliedPromo === "WELCOME10" ? subtotal * 0.1 : appliedPromo === "TRADITIONAL20" ? subtotal * 0.2 : 0

  const shipping = 300
  const tax = 0
  const total = subtotal - promoDiscount + shipping + tax

  const whatsappMessage = getWhatsappOrderMessage(
    cartItems.map(item => ({ ...item, inStock: true })),
    subtotal,
    savings,
    promoDiscount,
    appliedPromo,
    shipping,
    tax,
    total,
    addressForm
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const handleWhatsappOrder = async () => {
    setOrderLoading(true)
    setAddressFormTouched(true)
    if (!isAddressFormValid) {
      setOrderLoading(false)
      return
    }
    try {
      // 1. Insert into "orders" table
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: addressForm.name,
            customer_phone: addressForm.phone,
            customer_email: addressForm.email,
            customer_address: addressForm.address,
            customer_city: addressForm.city,
            customer_postal_code: addressForm.postalCode,
            subtotal,
            savings,
            promo_code: appliedPromo || null,
            promo_discount: promoDiscount,
            shipping,
            tax,
            total,
            status: "pending"
          }
        ])
        .select()
        .single()

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order")
      }

      // 2. Insert order items into "order_items" table
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        original_price: item.originalPrice || null,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        throw new Error(itemsError.message)
      }

      toast({
        title: "Order sent to WhatsApp!",
        description: "Your order has been saved and WhatsApp will open for confirmation.",
      })

      // Clear the cart after successful order
      cartItems.forEach(item => removeFromCart(item.id))

      // Reset form
      setAddressForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
      })
      setAddressFormTouched(false)
      setAppliedPromo(null)

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank")
    } catch (err: any) {
      toast({
        title: "Order failed",
        description: err.message || "Failed to send order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-ajrak-indigo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our beautiful traditional wear collection</p>
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
            <h1 className="text-3xl font-bold text-ajrak-indigo">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} items in your cart</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
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
                          onClick={() => {
                            removeFromCart(item.id)
                            toast({
                              title: "Item removed",
                              description: `${item.name} has been removed from your cart.`,
                            })
                          }}
                          className="text-gray-400 hover:text-ajrak-red"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1)
                                toast({
                                  title: "Quantity updated",
                                  description: `Quantity of ${item.name} reduced to ${item.quantity - 1}.`,
                                })
                              } else {
                                toast({
                                  title: "Cannot reduce quantity",
                                  description: "Quantity cannot be less than 1.",
                                  variant: "destructive",
                                })
                              }
                            }}
                            className="w-8 h-8 p-0 border-ajrak-indigo/30"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateQuantity(item.id, item.quantity + 1)
                              toast({
                                title: "Quantity updated",
                                description: `Quantity of ${item.name} increased to ${item.quantity + 1}.`,
                              })
                            }}
                            className="w-8 h-8 p-0 border-ajrak-indigo/30"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-ajrak-indigo">{formatPKR(item.price * item.quantity)}</p>
                          {item.originalPrice && (
                            <p className="text-sm text-gray-500">
                              Save {formatPKR((item.originalPrice - item.price) * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Address Form */}
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-3"
                  autoComplete="off"
                  onSubmit={e => {
                    e.preventDefault()
                    setAddressFormTouched(true)
                  }}
                >
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    required
                  />
                  <Input
                    name="email"
                    placeholder="Email"
                    value={addressForm.email}
                    onChange={handleAddressChange}
                    className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    type="email"
                    required
                  />
                  <Input
                    name="address"
                    placeholder="Street Address"
                    value={addressForm.address}
                    onChange={handleAddressChange}
                    className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    required
                  />
                  <div className="flex space-x-2">
                    <Input
                      name="city"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                      required
                    />
                    <Input
                      name="postalCode"
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={handleAddressChange}
                      className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                      required
                    />
                  </div>
                  {addressFormTouched && !isAddressFormValid && (
                    <div className="text-red-600 text-xs mt-1">Please fill in all address fields.</div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">{appliedPromo} Applied!</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAppliedPromo(null)
                        toast({
                          title: "Promo code removed",
                          description: "Promo code has been removed from your order.",
                        })
                      }}
                      className="text-green-700 hover:text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  <p>Try: WELCOME10 (10% off) or TRADITIONAL20 (20% off)</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>{formatPKR(savings)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount ({appliedPromo})</span>
                    <span>{formatPKR(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs{formatPKR(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPKR(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold text-ajrak-indigo">
                  <span>Total</span>
                  <span>{formatPKR(total)}</span>
                </div>

                {/* Place Order Button (Supabase) */}
                {/* Removed the old Place Order button */}

                {/* WhatsApp Order Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 mt-2 flex items-center justify-center"
                  style={{ backgroundColor: "#25D366" }}
                  disabled={!isAddressFormValid || orderLoading}
                  onClick={handleWhatsappOrder}
                >
                  {orderLoading ? (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Sending to WhatsApp...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Order via WhatsApp
                    </>
                  )}
                </Button>
                {/* Shopping Cart Button */}
                <Button
                  className="w-full bg-ajrak-indigo hover:bg-ajrak-red text-lg py-6 mt-2 flex items-center justify-center"
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    View Shopping Cart
                  </Link>
                </Button>
                {!isAddressFormValid && (
                  <div className="text-red-600 text-xs mt-1 text-center">
                    Please fill in your address details to order via WhatsApp.
                  </div>
                )}

                {/* Benefits */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-ajrak-indigo" />
                    <span>Standard shipping: Rs 300</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-ajrak-indigo" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommended.length === 0 ? (
                    <div className="text-gray-500 text-sm">No recommendations found.</div>
                  ) : (
                    recommended.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3">
                        <Image
                          src={product.image || "/placeholder.svg?height=60&width=60"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <p className="text-sm text-ajrak-indigo font-semibold">{formatPKR(product.price)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-ajrak-indigo text-ajrak-indigo bg-transparent"
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: undefined,
                              image: product.image,
                              color: "",
                              size: "",
                              category: product.category,
                            })
                            toast({
                              title: "Added to cart",
                              description: `${product.name} has been added to your cart.`,
                            })
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
