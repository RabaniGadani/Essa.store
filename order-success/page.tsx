"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-ajrak-indigo hover:bg-ajrak-red">
            <Link href="/orders">View My Orders</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
          >
            <Link href="/catalog">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
