'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function SellerDashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && userProfile && userProfile.role !== 'seller') {
      router.push(userProfile.role === 'buyer' ? '/dashboard/buyer' : '/select-role');
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
        <h1 className="text-2xl font-bold text-primary">TradeWave Seller Dashboard</h1>
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
                <CardTitle className="text-2xl">{userProfile.displayName || 'Seller'}</CardTitle>
                <CardDescription>{userProfile.email}</CardDescription>
              </div>
              <Badge variant="default" className="ml-auto bg-purple-600 text-white">Seller</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Token Balance</p>
                  <p className="text-xl font-semibold text-yellow-400">{userProfile.tokens || 0} Tokens</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-xl font-semibold text-green-500">${userProfile.totalEarnings || 0}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/content/upload')}>Upload Content</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
                <Button variant="secondary" size="sm" onClick={() => router.push('/withdraw')}>Withdraw Earnings</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="shadow-md rounded-lg">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent uploads and sales on TradeWave.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Content</CardTitle>
                  <CardDescription>Manage your uploaded content and projects.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">You haven't uploaded any content yet.</p>
                    <Button variant="link" onClick={() => router.push('/content/upload')}>Upload New Content</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sales" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales History</CardTitle>
                  <CardDescription>View your sales and earnings details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No sales recorded yet.</p>
                    <p className="text-sm text-muted-foreground">Promote your content to start earning tokens!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Manage your ongoing projects and collaborations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No active projects.</p>
                    <Button variant="link">Offer Services</Button>
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
