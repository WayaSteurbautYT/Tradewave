'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function BuyerDashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && userProfile && userProfile.role !== 'buyer') {
      router.push(userProfile.role === 'seller' ? '/dashboard/seller' : '/select-role');
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  if (!userProfile) {
    return <div className="flex items-center justify-center min-h-screen">Profile not found. Please complete your profile.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b px-6 py-3">
        <h1 className="text-2xl font-bold text-primary">TradeWave Buyer Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || 'User'} />
                <AvatarFallback>{userProfile.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userProfile.displayName || 'Buyer'}</CardTitle>
                <CardDescription>{userProfile.email}</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-auto">Buyer</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Token Balance</p>
                  <p className="text-xl font-semibold text-yellow-400">{userProfile.tokens || 0} Tokens</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription Status</p>
                  <p className={`text-xl font-semibold ${userProfile.subscriptionActive ? 'text-green-500' : 'text-red-500'}`}>
                    {userProfile.subscriptionActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/buy-tokens')}>Buy Tokens</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
                {userProfile.subscriptionActive ? (
                  <Button variant="destructive" size="sm">Cancel Subscription</Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => router.push('/subscribe')}>Subscribe</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="shadow-md rounded-lg">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent purchases and interactions on TradeWave.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="purchases" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>View all content and services you've purchased.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">You haven't made any purchases yet.</p>
                    <Button variant="link" onClick={() => router.push('/marketplace')}>Browse Marketplace</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subscriptions" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Manage your subscription to access premium content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="font-medium">{userProfile.subscriptionActive ? 'Premium Viewer Plan - $9.99/month' : 'Free Plan'}</p>
                    </div>
                    {userProfile.subscriptionActive ? (
                      <div>
                        <p className="text-sm text-muted-foreground">Next Billing Date</p>
                        <p className="font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <Button variant="destructive" size="sm" className="mt-2">Cancel Subscription</Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Upgrade to access exclusive content and features.</p>
                        <Button variant="secondary" size="sm" className="mt-2" onClick={() => router.push('/subscribe')}>Subscribe Now</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
