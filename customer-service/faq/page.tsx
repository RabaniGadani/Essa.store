"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const faqCategories = [
    {
      category: "Orders & Payment",
      questions: [
        {
          id: 1,
          question: "How can I track my order?",
          answer:
            "You'll receive a tracking number via email once your order ships. You can use this number to track your package on our website or the carrier's website. You can also log into your account to view order status and tracking information.",
        },
        {
          id: 2,
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through our encrypted payment system.",
        },
        {
          id: 3,
          question: "Can I modify or cancel my order?",
          answer:
            "Orders can be modified or cancelled within 1 hour of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact customer service immediately if you need to make changes.",
        },
        {
          id: 4,
          question: "Do you offer payment plans?",
          answer:
            "Yes, we partner with Klarna and Afterpay to offer flexible payment options. You can split your purchase into 4 interest-free payments or choose longer-term financing options at checkout.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          id: 5,
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. International shipping times vary by destination (7-28 business days).",
        },
        {
          id: 6,
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 25 countries worldwide. International shipping rates and delivery times vary by destination. Please note that international orders may be subject to customs duties and taxes.",
        },
        {
          id: 7,
          question: "What if my package is lost or damaged?",
          answer:
            "All packages are insured. If your package is lost or arrives damaged, please contact us immediately with photos (if damaged) and we'll resolve the issue quickly by sending a replacement or issuing a full refund.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          id: 8,
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for unworn items with original tags. Returns are free for domestic orders. Items must be in original condition and packaging to be eligible for return.",
        },
        {
          id: 9,
          question: "How do I return an item?",
          answer:
            "You can initiate a return through your account, our return portal, or by contacting customer service. We'll provide a prepaid return label and instructions. Refunds are processed within 3-5 business days of receiving your return.",
        },
        {
          id: 10,
          question: "Can I exchange items for different sizes?",
          answer:
            "Yes, we offer free exchanges for different sizes or colors of the same item, subject to availability. Contact customer service to initiate an exchange, and we'll send you the new item with a return label for the original.",
        },
      ],
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          id: 11,
          question: "How do I find my size?",
          answer:
            "Please refer to our detailed size guide, which includes measurements for all clothing categories. If you're between sizes, we generally recommend sizing up. Our customer service team can also provide personalized sizing advice.",
        },
        {
          id: 12,
          question: "Are your products true to size?",
          answer:
            "Our products generally run true to size, but fit can vary by style. Each product page includes specific fit information and customer reviews with sizing feedback. When in doubt, consult our size guide or contact customer service.",
        },
        {
          id: 13,
          question: "What materials are your clothes made from?",
          answer:
            "We use high-quality, sustainable materials including organic cotton, linen, silk, and recycled fibers. Each product page lists the specific fabric composition and care instructions. We're committed to using eco-friendly materials whenever possible.",
        },
      ],
    },
    {
      category: "Account & Membership",
      questions: [
        {
          id: 14,
          question: "Do I need an account to place an order?",
          answer:
            "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, access exclusive member benefits, and makes future shopping faster and easier.",
        },
        {
          id: 15,
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email, check your spam folder or contact customer service.",
        },
        {
          id: 16,
          question: "Do you have a loyalty program?",
          answer:
            "Yes, our JA Fashion Rewards program offers points for purchases, exclusive access to sales, birthday discounts, and early access to new collections. You'll automatically earn points with every purchase when you're logged into your account.",
        },
      ],
    },
  ]

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find quick answers to common questions about our products, orders, and policies.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-left p-0 h-auto font-semibold text-gray-900 hover:bg-transparent"
                        onClick={() => toggleItem(faq.id)}
                      >
                        <span className="text-left">{faq.question}</span>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 flex-shrink-0" />
                        )}
                      </Button>
                      {openItems.includes(faq.id) && (
                        <div className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you with any questions not covered in our FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Support</Button>
              <Button variant="outline" size="lg">
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
