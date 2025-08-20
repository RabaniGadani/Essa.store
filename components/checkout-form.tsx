"use client"

import type React from "react"
import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-context"
import { useRouter } from "next/navigation"
import { formatPKR } from "@/lib/utils"

interface CheckoutFormProps {
  total: number
}

export function CheckoutForm({ total }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const router = useRouter()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/order-success`,
      },
    })

    // This point will only be reached if there's an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
    if (!error) {
      clearCart() // Clear cart on successful payment initiation
      router.push("/order-success") // Redirect to success page
    }
  }

  return (
    <Card className="border-ajrak-indigo/20">
      <CardHeader>
        <CardTitle className="text-ajrak-indigo">Complete Your Order</CardTitle>
        <CardDescription>Total: {formatPKR(total)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement id="payment-element" />
          <Button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="w-full bg-ajrak-indigo hover:bg-ajrak-red text-lg py-6"
          >
            <span id="button-text">{isLoading ? "Processing..." : "Pay now"}</span>
          </Button>
          {/* Show any error or success messages */}
          {message && (
            <div id="payment-message" className="mt-4 text-center text-red-500">
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
