import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Globe, Clock, Shield } from "lucide-react"

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "Free on orders Rs 75+",
      time: "5-7 business days",
      description: "Our most popular shipping option",
    },
    {
      name: "Express Shipping",
      price: "Rs 9.99",
      time: "2-3 business days",
      description: "Faster delivery for urgent orders",
    },
    {
      name: "Overnight Shipping",
      price: "Rs 24.99",
      time: "1 business day",
      description: "Next day delivery available",
    },
  ]

  const internationalRates = [
    { region: "Canada", standard: "Rs 12.99", express: "Rs 24.99", time: "7-14 days" },
    { region: "Europe", standard: "Rs 19.99", express: "Rs 39.99", time: "10-21 days" },
    { region: "Asia", standard: "Rs 24.99", express: "Rs 49.99", time: "14-28 days" },
    { region: "Australia", standard: "Rs 29.99", express: "Rs 59.99", time: "14-28 days" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">
            Fast, reliable shipping options to get your order to you quickly and safely.
          </p>
        </div>

        {/* Domestic Shipping */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-6 h-6 mr-2" />
              Domestic Shipping (US)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shippingOptions.map((option) => (
                <div key={option.name} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{option.price}</p>
                  <p className="text-gray-600 mb-2">{option.time}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* International Shipping */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Region</th>
                    <th className="text-left p-3 font-semibold">Standard</th>
                    <th className="text-left p-3 font-semibold">Express</th>
                    <th className="text-left p-3 font-semibold">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  {internationalRates.map((rate) => (
                    <tr key={rate.region} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{rate.region}</td>
                      <td className="p-3">{rate.standard}</td>
                      <td className="p-3">{rate.express}</td>
                      <td className="p-3">{rate.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              * International orders may be subject to customs duties and taxes, which are the responsibility of the
              customer.
            </p>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Order Processing</h4>
              <p className="text-gray-600">
                All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be
                processed the next business day.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cut-off Times</h4>
              <p className="text-gray-600">
                Orders placed before 2:00 PM EST Monday-Friday will be processed the same day. Orders placed after 2:00
                PM will be processed the next business day.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tracking Information</h4>
              <p className="text-gray-600">
                You'll receive a tracking number via email once your order ships. You can track your package using this
                number on our website or the carrier's website.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Shipping Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Package Protection</h4>
              <p className="text-gray-600">
                All packages are insured and require a signature upon delivery for orders over Rs 200.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Delivery Attempts</h4>
              <p className="text-gray-600">
                If you're not available to receive your package, the carrier will make up to 3 delivery attempts before
                returning the package to our facility.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Address Changes</h4>
              <p className="text-gray-600">
                Address changes can only be made within 1 hour of placing your order. Please contact customer service
                immediately if you need to change your shipping address.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">PO Boxes</h4>
              <p className="text-gray-600">
                We cannot ship to PO Boxes for express or overnight shipping options. Standard shipping to PO Boxes is
                available.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
