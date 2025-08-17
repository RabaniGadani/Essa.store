import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Truck, RotateCcw, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react"

export default function CustomerServicePage() {
  const services = [
    {
      title: "Size Guide",
      description: "Find your perfect fit with our comprehensive sizing charts",
      icon: Ruler,
      href: "/customer-service/size-guide",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Shipping Info",
      description: "Learn about our shipping options and delivery times",
      icon: Truck,
      href: "/customer-service/shipping",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Returns & Exchanges",
      description: "Easy returns and exchanges within 30 days",
      icon: RotateCcw,
      href: "/customer-service/returns",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "FAQ",
      description: "Quick answers to frequently asked questions",
      icon: HelpCircle,
      href: "/customer-service/faq",
      color: "bg-purple-50 text-purple-600",
    },
  ]

  const contactOptions = [
    {
      title: "Phone Support",
      description: "Mon-Fri 9AM-6PM EST",
      contact: "+1 (555) 123-4567",
      icon: Phone,
    },
    {
      title: "Email Support",
      description: "Response within 24 hours",
      contact: "support@jafashion.com",
      icon: Mail,
    },
    {
      title: "Live Chat",
      description: "Available during business hours",
      contact: "Start Chat",
      icon: MessageCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Customer Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions or concerns. Find the information you need or get in touch with
            our support team.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => (
            <Link key={service.title} href={service.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <service.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Need More Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactOptions.map((option) => (
              <div key={option.title} className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-3">{option.description}</p>
                <p className="font-semibold text-gray-900">{option.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/customer-service/track-order"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <Truck className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Track Your Order</h3>
                <p className="text-sm text-gray-600">Check the status of your recent orders</p>
              </div>
            </Link>
            <Link
              href="/customer-service/account"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Account Help</h3>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
