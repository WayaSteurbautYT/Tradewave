"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentActivity } from "@/components/recent-activity"
import { StatsCards } from "@/components/stats-cards"
import { TokenEconomy } from "@/components/token-economy"
import { TrendingContent } from "@/components/trending-content"
import { ErrorBoundary } from "react-error-boundary"

// Create a fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-800">
      <h2 className="text-lg font-semibold">Something went wrong:</h2>
      <p className="text-sm">{error.message}</p>
      <button onClick={resetErrorBoundary} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        Try again
      </button>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-teal-900/30 border border-teal-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Projects
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Earnings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <StatsCards />
            </ErrorBoundary>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-[#0f172a] border-teal-800">
                <CardHeader>
                  <CardTitle className="text-teal-300">Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <RecentActivity />
                  </ErrorBoundary>
                </CardContent>
              </Card>
              <Card className="col-span-3 bg-[#0f172a] border-teal-800">
                <CardHeader>
                  <CardTitle className="text-teal-300">Token Economy</CardTitle>
                  <CardDescription>Your token earnings and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <TokenEconomy />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-[#0f172a] border-teal-800">
              <CardHeader>
                <CardTitle className="text-teal-300">Trending Content</CardTitle>
                <CardDescription>Popular content you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <TrendingContent />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
