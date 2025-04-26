import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 text-center md:px-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Earn money by creating content
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join our content marketplace that combines videos, gigs, and AI-powered tools, helping you to monetize your skills and projects.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="w-full">
                Explore Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Content Marketplace</CardTitle>
                <CardDescription>
                  Buy and sell digital content with our secure token system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload videos, code, designs, and more. Set token prices for downloads and views.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Hiring Platform</CardTitle>
                <CardDescription>
                  Connect with talented creators and get your projects done
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Post projects, hire creators, and collaborate seamlessly with secure payments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Live Streaming</CardTitle>
                <CardDescription>
                  Stream your content and engage with your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Go live, interact with viewers, and monetize your streams with our token system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Streamline workflows with AI</CardTitle>
              <CardDescription>
                Access AI tools to assist you with content requests and marketplace interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Our AI-powered tools help you create better content, match with the right projects, and grow your audience.
                </p>
                <Button>
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
