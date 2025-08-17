"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-context"

export function CartDisplay() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  if (getTotalItems() === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50 mb-32">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-ajrak-indigo hover:bg-ajrak-red text-white rounded-full p-3 shadow-lg"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
        
        {isOpen && (
          <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden shadow-xl">
            <CardContent className="p-4">
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add some products to get started!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 mb-32">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-ajrak-indigo hover:bg-ajrak-red text-white rounded-full p-3 shadow-lg relative"
      >
        <ShoppingCart className="w-6 h-6" />
        <Badge className="absolute -top-2 -right-2 bg-ajrak-red text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
          {getTotalItems()}
        </Badge>
      </Button>
      
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden shadow-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Shopping Cart</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-sm font-semibold text-ajrak-red">Rs {item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 w-6 h-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-ajrak-red">{getTotalPrice()}</span>
              </div>
              <Button className="w-full bg-ajrak-indigo hover:bg-ajrak-red">
                Checkout ({getTotalItems()} items)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 