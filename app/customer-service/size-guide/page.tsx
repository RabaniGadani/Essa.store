import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SizeGuidePage() {
  const womensSizes = [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36", numeric: "0-2" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38", numeric: "4-6" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40", numeric: "8-10" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42", numeric: "12-14" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44", numeric: "16-18" },
    { size: "XXL", bust: "42-44", waist: "34-36", hips: "44-46", numeric: "20-22" },
  ]

  const mensSizes = [
    { size: "XS", chest: "34-36", waist: "28-30", neck: "14-14.5" },
    { size: "S", chest: "36-38", waist: "30-32", neck: "15-15.5" },
    { size: "M", chest: "38-40", waist: "32-34", neck: "16-16.5" },
    { size: "L", chest: "40-42", waist: "34-36", neck: "17-17.5" },
    { size: "XL", chest: "42-44", waist: "36-38", neck: "18-18.5" },
    { size: "XXL", chest: "44-46", waist: "38-40", neck: "19-19.5" },
  ]

  const shoeSizes = [
    { us: "5", uk: "2.5", eu: "35", cm: "22" },
    { us: "5.5", uk: "3", eu: "35.5", cm: "22.5" },
    { us: "6", uk: "3.5", eu: "36", cm: "23" },
    { us: "6.5", uk: "4", eu: "37", cm: "23.5" },
    { us: "7", uk: "4.5", eu: "37.5", cm: "24" },
    { us: "7.5", uk: "5", eu: "38", cm: "24.5" },
    { us: "8", uk: "5.5", eu: "38.5", cm: "25" },
    { us: "8.5", uk: "6", eu: "39", cm: "25.5" },
    { us: "9", uk: "6.5", eu: "40", cm: "26" },
    { us: "9.5", uk: "7", eu: "40.5", cm: "26.5" },
    { us: "10", uk: "7.5", eu: "41", cm: "27" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600">
            Find your perfect fit with our comprehensive sizing charts. All measurements are in inches.
          </p>
        </div>

        <Tabs defaultValue="womens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="womens">Women's</TabsTrigger>
            <TabsTrigger value="mens">Men's</TabsTrigger>
            <TabsTrigger value="shoes">Shoes</TabsTrigger>
          </TabsList>

          <TabsContent value="womens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Women's Clothing Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Size</th>
                        <th className="text-left p-3 font-semibold">Bust</th>
                        <th className="text-left p-3 font-semibold">Waist</th>
                        <th className="text-left p-3 font-semibold">Hips</th>
                        <th className="text-left p-3 font-semibold">Numeric</th>
                      </tr>
                    </thead>
                    <tbody>
                      {womensSizes.map((size) => (
                        <tr key={size.size} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{size.size}</td>
                          <td className="p-3">{size.bust}"</td>
                          <td className="p-3">{size.waist}"</td>
                          <td className="p-3">{size.hips}"</td>
                          <td className="p-3">{size.numeric}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Measure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Bust</h4>
                  <p className="text-gray-600">
                    Measure around the fullest part of your bust, keeping the tape parallel to the floor.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Waist</h4>
                  <p className="text-gray-600">
                    Measure around your natural waistline, keeping the tape comfortably loose.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hips</h4>
                  <p className="text-gray-600">
                    Measure around the fullest part of your hips, about 7-9 inches below your waistline.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Men's Clothing Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Size</th>
                        <th className="text-left p-3 font-semibold">Chest</th>
                        <th className="text-left p-3 font-semibold">Waist</th>
                        <th className="text-left p-3 font-semibold">Neck</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mensSizes.map((size) => (
                        <tr key={size.size} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{size.size}</td>
                          <td className="p-3">{size.chest}"</td>
                          <td className="p-3">{size.waist}"</td>
                          <td className="p-3">{size.neck}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Measure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Chest</h4>
                  <p className="text-gray-600">
                    Measure around the fullest part of your chest, under your arms and over your shoulder blades.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Waist</h4>
                  <p className="text-gray-600">
                    Measure around your natural waistline, where you normally wear your pants.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Neck</h4>
                  <p className="text-gray-600">Measure around the base of your neck where your collar would sit.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shoe Size Conversion Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">US</th>
                        <th className="text-left p-3 font-semibold">UK</th>
                        <th className="text-left p-3 font-semibold">EU</th>
                        <th className="text-left p-3 font-semibold">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shoeSizes.map((size) => (
                        <tr key={size.us} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{size.us}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Measure Your Feet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Step 1</h4>
                  <p className="text-gray-600">Place a piece of paper on the floor against a wall.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 2</h4>
                  <p className="text-gray-600">Stand on the paper with your heel against the wall.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 3</h4>
                  <p className="text-gray-600">Mark the longest part of your foot on the paper.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 4</h4>
                  <p className="text-gray-600">Measure the distance from the wall to the mark in centimeters.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
