"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, ArrowLeft } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

// You may want to move these to your env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type OrderItem = {
  id?: number
  order_id: number
  product_id?: string
  name: string
  price: number
  original_price?: number | null
  image?: string
  color?: string
  size?: string
  quantity: number
  category?: string
}

type Order = {
  id: number
  created_at: string
  status: string
  total: number
  subtotal: number
  savings?: number
  promo_code?: string
  promo_discount?: number
  shipping?: number
  tax?: number
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  customer_address?: string
  customer_city?: string
  customer_postal_code?: string
  items: OrderItem[]
}

function formatOrderStatus(status: string) {
  // Map status to display and color
  switch (status?.toLowerCase()) {
    case "delivered":
      return { label: "Delivered", color: "bg-green-500" }
    case "shipped":
      return { label: "Shipped", color: "bg-blue-500" }
    case "processing":
      return { label: "Processing", color: "bg-yellow-500" }
    case "cancelled":
      return { label: "Cancelled", color: "bg-red-500" }
    default:
      return { label: status, color: "bg-gray-400" }
  }
}

function formatOrderDate(date: string) {
  // Format ISO date to e.g. "Dec 15, 2024"
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      
      // Show loading toast
      toast({
        title: "Loading orders...",
        description: "Please wait while we fetch your order history.",
      })
      
      // TODO: Replace with user-specific filter if you have auth
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) {
        setError("Failed to fetch orders.")
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        toast({
          title: "No orders found",
          description: "You haven't placed any orders yet.",
        })
        setLoading(false)
        return
      }

      // Fetch all order items for these orders
      const orderIds = ordersData.map((o) => o.id)
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)

      if (itemsError) {
        setError("Failed to fetch order items.")
        toast({
          title: "Error",
          description: "Failed to fetch order details. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Group items by order_id
      const itemsByOrder: Record<number, OrderItem[]> = {}
      for (const item of itemsData || []) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
        itemsByOrder[item.order_id].push(item)
      }

      // Attach items to orders
      const ordersWithItems: Order[] = ordersData.map((order: any) => ({
        ...order,
        items: itemsByOrder[order.id] || [],
      }))

      setOrders(ordersWithItems)
      
      // Show success toast
      toast({
        title: "Orders loaded successfully",
        description: `Found ${ordersWithItems.length} order${ordersWithItems.length !== 1 ? 's' : ''} in your history.`,
      })
      
      setLoading(false)
    }

    fetchOrders()
  }, [toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ajrak-indigo"></div>
        <span className="ml-4 text-ajrak-indigo text-lg font-semibold">Loading orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-ajrak-red" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading orders</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button 
            className="bg-ajrak-indigo hover:bg-ajrak-red"
            onClick={() => {
              toast({
                title: "Navigating to Shop",
                description: "Taking you back to our shop.",
              })
              // Navigate after a short delay to show the toast
              setTimeout(() => {
                window.location.href = "/catalog"
              }, 500)
            }}
          >
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="ajrak-geometric w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-ajrak-indigo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
            <p className="text-gray-600 mb-8">It looks like you haven't placed any orders yet.</p>
            <Button 
              className="bg-ajrak-indigo hover:bg-ajrak-red"
              onClick={() => {
                toast({
                  title: "Navigating to Catalog",
                  description: "Taking you to our product catalog.",
                })
                // Navigate after a short delay to show the toast
                setTimeout(() => {
                  window.location.href = "/catalog"
                }, 500)
              }}
            >
              Start Shopping
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
            <h1 className="text-3xl font-bold text-ajrak-indigo">My Orders</h1>
            <p className="text-gray-600">{orders.length} orders</p>
          </div>
          <Button
            variant="outline"
            className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
            onClick={() => {
              toast({
                title: "Navigating to Profile",
                description: "Taking you back to your profile page.",
              })
              // Navigate after a short delay to show the toast
              setTimeout(() => {
                window.location.href = "/profile"
              }, 500)
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const status = formatOrderStatus(order.status)
            return (
              <Card key={order.id} className="border-ajrak-indigo/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-ajrak-indigo">Order {order.id}</CardTitle>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatOrderDate(order.created_at)}</span>
                    </span>
                    <span>Total: {formatPKR(order.total)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
                  <div className="space-y-3">
                    {order.items.length === 0 && (
                      <div className="text-sm text-gray-500">No items found for this order.</div>
                    )}
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} | Price: {formatPKR(item.price)}
                          </p>
                        </div>
                        <span className="font-semibold text-ajrak-indigo">
                          {formatPKR(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="text-right">
                    <Button
                      variant="outline"
                      className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
                      onClick={() => {
                        toast({
                          title: "Order Details",
                          description: `Viewing details for Order #${order.id}`,
                        })
                      }}
                    >
                      View Order Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
