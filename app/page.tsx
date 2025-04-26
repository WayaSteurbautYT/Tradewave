import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

'use client';

export default function Home() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      if (!userProfile?.role) router.push('/signin');
      else router.replace('/profile/overview');
    }
  }, [user, userProfile, loading, router]);
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user) return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-500 via-blue-900 to-purple-900 text-white">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJoMnYtNGgtMmMtMSAwLTIgMS0yIDJ6TTMwIDRDMTMuNDMxIDQgMCAxNy40MzEgMCAzNHMxMy40MzEgMzAgMzAgMzAgMzAtMTMuNDMxIDMwLTMwUzQ2LjU2OSA0IDMwIDR6TTEwLjIyNSA0Mi42OGMtMi45ODQtOS45NDQtMS4zNTUtMjAuNDA5IDQuNDczLTI4Ljk3OUMyMS41MDcgNS4xMDcgMzAuOTkzIDIuMDk4IDQwLjY4IDQuNDdsMS41MDYsMS44M2MtOS45OTMsMi45NT0tMjAuNDMsMS4zMTQtMjksNC40MDZDNS45NDYsMTUuOTkzIDIuOTMsMjUuNDg5IDUuODMsMzUuNDM0YzIuOTUsOS45OTMsMS4zMTYsMjAuNDMsNC40MDYsMjkuMDU5QzE1Ljk5Nyw1MS45MzYsMjUuNDksNTQuOTQ1LDM1LjQ4LDQ1Ljk4OGM5Ljk5MS05Ljk1OCwyMC40MS0xMS41OSwyOS4wNDYsNC40NDdsMS44MDMsMS41MDZDMjcuMDU3LDQ5Ljc'}] bg-repeat" />
        </div>
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-in-up">
            Welcome to <span className="text-yellow-400">TradeWave</span>
          </h1>
          <p className="mt-6 text-lg text-gray-200 md:text-xl animate-fade-in-up delay-100">
            A platform for creators, freelancers, and fans to connect, hire, and stream.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-in-up delay-200">
            <Button asChild className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
              <Link href="/signin">Get Started</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:py-24 lg:py-32 bg-blue-950/50">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-yellow-400 md:text-4xl animate-fade-in-up">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-gray-200 animate-fade-in-up delay-100">
            Everything you need to create, connect, and earn.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 animate-fade-in-up delay-200">
            <Card className="border-teal-700 bg-teal-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-teal-400">Content Marketplace</CardTitle>
                <CardDescription className="text-gray-300">Upload, share, and monetize your videos and projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Connect with fans and buyers through a vibrant marketplace.
                  </p>
                  <Button>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-700 bg-red-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400">Hiring Platform</CardTitle>
                <CardDescription className="text-gray-300">Post projects, bid on jobs, and collaborate seamlessly.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Find the perfect freelancer or project with our escrow system.
                  </p>
                  <Button>
                    Hire Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-700 bg-purple-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Streaming & Tokens</CardTitle>
                <CardDescription className="text-gray-300">Go live, earn tokens, and engage with your audience.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Stream directly on TradeWave and monetize with WaveTokens.
                  </p>
                  <Button>
                    Start Streaming <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Feature Cards */}
      <section className="py-16 px-4 md:py-24 lg:py-32 bg-purple-950/50">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-yellow-400 md:text-4xl animate-fade-in-up">
            More to Explore
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 animate-fade-in-up delay-100">
            <Card className="border-yellow-700 bg-yellow-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400">Community Features</CardTitle>
                <CardDescription className="text-gray-300">Follow creators, comment, rate, and message.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Build connections and engage with a supportive community.
                  </p>
                  <Button>
                    Join Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-teal-700 bg-teal-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-teal-400">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-300">Track views, engagement, revenue, and growth.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Get detailed insights to optimize your content and strategy.
                  </p>
                  <Button>
                    View Analytics <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-700 bg-red-900/30 text-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400">AI-Powered Tools</CardTitle>
                <CardDescription className="text-gray-300">Enhance content with AI moderation and recommendations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-300">
                    Our AI-powered tools help you create better content, match with the right projects, and grow your audience.
                  </p>
                  <Button>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
