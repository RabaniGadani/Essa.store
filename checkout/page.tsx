"use client"

import { useState, useEffect } from "react"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "@/components/checkout-form"
import { useCart } from "@/components/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Get the Stripe publishable key from env vars
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  // eslint-disable-next-line no-console
  console.error("Stripe publishable key is not set – add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your env vars.")
}

// Only load Stripe if we actually have a key
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export default function CheckoutPage() {
  const { getTotalPrice, items: cartItems } = useCart()
  const total = getTotalPrice()
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error creating payment intent:", error))
  }, [total])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "hsl(var(--ajrak-indigo))",
        colorText: "hsl(var(--foreground))",
        colorBackground: "hsl(var(--background))",
        colorDanger: "hsl(var(--destructive))",
        fontFamily: "Inter, sans-serif",
      },
    },
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
            <p className="text-gray-600 mb-8">Please add items to your cart before checking out.</p>
            <Button asChild className="bg-ajrak-indigo hover:bg-ajrak-red">
              <Link href="/catalog">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {clientSecret && stripePromise ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm total={total} />
          </Elements>
        ) : (
          <Card className="border-ajrak-indigo/20">
            <CardHeader>
              <CardTitle className="text-ajrak-indigo">
                {publishableKey ? "Loading Checkout…" : "Stripe key missing"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publishableKey ? (
                <p className="text-gray-600">Please wait while we prepare your payment details.</p>
              ) : (
                <p className="text-red-600">
                  Stripe publishable key is not configured. Add
                  <code className="mx-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
                  in your environment variables and redeploy.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
