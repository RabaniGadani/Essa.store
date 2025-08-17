import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Contact our customer service team or use our online return portal",
    },
    {
      step: 2,
      title: "Package Your Items",
      description: "Pack items securely in original packaging with all tags attached",
    },
    {
      step: 3,
      title: "Ship Your Return",
      description: "Use the prepaid return label we provide or drop off at any authorized location",
    },
    {
      step: 4,
      title: "Processing",
      description: "We'll process your return within 3-5 business days of receiving it",
    },
  ]

  const eligibleItems = [
    "Unworn clothing with original tags",
    "Shoes in original box with no wear",
    "Accessories in original packaging",
    "Items purchased within 30 days",
  ]

  const nonEligibleItems = [
    "Worn or damaged items",
    "Items without original tags",
    "Intimate apparel and swimwear",
    "Final sale items",
    "Items purchased over 30 days ago",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        {/* Return Policy Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="w-6 h-6 mr-2" />
              30-Day Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Free Returns</h3>
                <p className="text-gray-600 text-sm">Free return shipping on all domestic orders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy Exchanges</h3>
                <p className="text-gray-600 text-sm">Quick and simple size or color exchanges</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-gray-600 text-sm">Refunds processed within 3-5 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {returnSteps.map((step) => (
                <div key={step.step} className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg">Start Return Process</Button>
            </div>
          </CardContent>
        </Card>

        {/* Eligible vs Non-Eligible Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-2" />
                Not Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Refund Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Processing Time</h4>
              <p className="text-gray-600">
                Refunds are processed within 3-5 business days after we receive your return. You'll receive an email
                confirmation once your refund has been processed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Refund Method</h4>
              <p className="text-gray-600">
                Refunds will be issued to the original payment method used for the purchase. Credit card refunds may
                take 5-10 business days to appear on your statement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Partial Refunds</h4>
              <p className="text-gray-600">
                Items that show signs of wear, are missing tags, or are damaged may be subject to a partial refund or
                may not be eligible for return.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Information */}
        <Card>
          <CardHeader>
            <CardTitle>Exchanges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Size & Color Exchanges</h4>
              <p className="text-gray-600">
                We offer free exchanges for different sizes or colors of the same item, subject to availability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Exchange Process</h4>
              <p className="text-gray-600">
                Contact our customer service team to initiate an exchange. We'll send you the new item and provide a
                return label for the original item.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">International Exchanges</h4>
              <p className="text-gray-600">
                International customers are responsible for return shipping costs. We recommend processing a return and
                placing a new order for faster service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
