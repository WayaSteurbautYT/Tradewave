import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Content</h1>
        <p className="text-muted-foreground">
          Discover amazing content from creators around the world
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample Content Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started with Next.js</CardTitle>
            <CardDescription>By John Doe</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn the basics of Next.js and build your first application
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced CSS Techniques</CardTitle>
            <CardDescription>By Jane Smith</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Master modern CSS with these advanced techniques and tips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building with Tailwind CSS</CardTitle>
            <CardDescription>By Alex Johnson</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create beautiful, responsive designs with Tailwind CSS
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 