import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

'use client';

export default function HomePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      if (userProfile?.role === 'buyer') {
        router.push('/dashboard/buyer');
      } else if (userProfile?.role === 'seller') {
        router.push('/dashboard/seller');
      } else {
        router.push('/select-role');
      }
    } else {
      router.push('/signin');
    }
  };

  const handleExploreMarketplace = () => {
    router.push('/marketplace');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#00BFA6] to-[#1E3A8A] text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FFD700]">TradeWave</h1>
        <div className="flex gap-4">
          {user ? (
            <Button 
              variant="outline" 
              className="bg-transparent border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1E3A8A]"
              onClick={() => router.push(userProfile?.role === 'buyer' ? '/dashboard/buyer' : userProfile?.role === 'seller' ? '/dashboard/seller' : '/select-role')}
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="bg-transparent border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1E3A8A]"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </Button>
          )}
          <Button 
            variant="outline" 
            className="bg-transparent border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1E3A8A]"
            onClick={handleExploreMarketplace}
          >
            Marketplace
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-6 max-w-5xl mx-auto animate-fade-in">
        <h2 className="text-5xl font-bold mb-6 text-[#FFD700]">Create, Share, and Monetize Your Content</h2>
        <p className="text-xl mb-8 max-w-3xl text-white/90">TradeWave is the premier platform for creators to upload videos, music, art, and services, and for fans to discover exclusive content.</p>
        <Button 
          size="lg" 
          className="bg-[#FFD700] text-[#1E3A8A] hover:bg-[#FFD700]/90 text-xl px-10 py-6"
          onClick={handleGetStarted}
        >
          {user ? 'Go to Dashboard' : 'Get Started'}
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#1E3A8A]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12 text-[#FFD700]">Why Choose TradeWave?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg bg-[#800080]/30 backdrop-blur-sm shadow-md animate-slide-in-left">
              <div className="text-[#FFD700] text-5xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2 text-white">Earn Tokens</h4>
              <p className="text-white/80">Creators can earn tokens from their content and services, convertible to real money.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#800080]/30 backdrop-blur-sm shadow-md animate-slide-in-up">
              <div className="text-[#FFD700] text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-2 text-white">Secure Payments</h4>
              <p className="text-white/80">Integrated Stripe for safe and easy transactions for token purchases and subscriptions.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#800080]/30 backdrop-blur-sm shadow-md animate-slide-in-right">
              <div className="text-[#FFD700] text-5xl mb-4">🌐</div>
              <h4 className="text-xl font-semibold mb-2 text-white">Global Community</h4>
              <p className="text-white/80">Connect with creators and fans worldwide, expanding your reach and influence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1E3A8A] to-[#800080]">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12 text-[#FFD700]">Featured Content</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-none shadow-lg overflow-hidden animate-fade-in-up">
              <CardContent className="p-0">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <span className="text-[#FFD700] text-xl">Video Content</span>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-1 text-[#FFD700]">Amazing Video Title</h4>
                  <p className="text-white/80 text-sm">Creator Name • 1.2K views</p>
                  <p className="text-[#FFD700] font-medium mt-1">5 Tokens</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-none shadow-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <span className="text-[#FFD700] text-xl">Music Track</span>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-1 text-[#FFD700]">Hit Single Track</h4>
                  <p className="text-white/80 text-sm">Artist Name • 3.4K streams</p>
                  <p className="text-[#FFD700] font-medium mt-1">3 Tokens</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-none shadow-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <span className="text-[#FFD700] text-xl">Digital Art</span>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-1 text-[#FFD700]">Unique Artwork</h4>
                  <p className="text-white/80 text-sm">Artist Name • 850 views</p>
                  <p className="text-[#FFD700] font-medium mt-1">8 Tokens</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button 
            variant="outline" 
            className="mt-10 bg-transparent border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1E3A8A]"
            onClick={handleExploreMarketplace}
          >
            Explore More Content
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#800080]/80 backdrop-blur-sm text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-[#FFD700]">Join TradeWave Today</h3>
          <p className="text-xl mb-8 text-white/90">Whether you're a creator looking to monetize your talents or a fan seeking exclusive content, TradeWave is the platform for you.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-[#FFD700] text-[#1E3A8A] hover:bg-[#FFD700]/90"
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Sign Up Now'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/20"
              onClick={() => window.open('mailto:support@tradewave.com')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-white/70 text-sm bg-[#1E3A8A]/90">
        <p>&copy; {new Date().getFullYear()} TradeWave. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:text-[#FFD700]">Terms of Service</a>
          <a href="#" className="hover:text-[#FFD700]">Privacy Policy</a>
          <a href="#" className="hover:text-[#FFD700]">Cookie Policy</a>
        </div>
      </footer>
    </div>
  );
}
