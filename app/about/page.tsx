import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "00" },
    { icon: Globe, label: "Countries", value: "1+" },
    { icon: Award, label: "Awards Won", value: "00" },
    { icon: Heart, label: "Years Experience", value: "0" },
  ]

  const team = [
    { name: "Muhammad Essa Gadani", role: "Founder", image: "/placeholder.svg?height=300&width=300" },
    { name: "Abid Ali Gadani", role: "Admin", image: "/placeholder.svg?height=300&width=300" },
    
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Essa.store</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a premium fashion brand dedicated to creating timeless pieces that blend contemporary design with
              exceptional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2025, Essa.store began as a vision to create clothing that empowers individuals to express
                their unique tradtion or style. Our journey started with a simple belief: fashion should be both beautiful and
                meaningful.
              </p>
              <p className="text-gray-600 mb-6">
                Today, we continue to push boundaries in design while maintaining our commitment to quality,
                sustainability, and ethical practices. Every piece in our collection tells a story of passion,
                creativity, and attention to detail.
              </p>
              <Button size="lg">Learn More About Our Process</Button>
            </div>
            <div className="relative">
              <Image
                src="/Logo.jpg"
                alt="About JA Fashion"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To create fashion that inspires confidence, celebrates individuality, and contributes to a more
              sustainable future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600">
                We use only the finest materials and work with skilled artisans to ensure every piece meets our high
                standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to responsible fashion practices and reducing our environmental impact.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                We believe in building a community of fashion lovers who share our values and vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The creative minds behind Essa.store</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
