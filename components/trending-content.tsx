import Image from "next/image"
import { Download, Eye, MessageSquare, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrendingContent() {
  const trendingItems = [
    {
      id: 1,
      title: "Advanced React Component Library",
      creator: "Alex Johnson",
      category: "Development",
      image: "/placeholder.svg?height=150&width=300",
      views: 12500,
      likes: 843,
      comments: 76,
      downloads: 320,
      tokens: 150,
      tags: ["React", "UI", "Components"],
    },
    {
      id: 2,
      title: "3D Character Animation Pack",
      creator: "Maya Design",
      category: "3D Assets",
      image: "/placeholder.svg?height=150&width=300",
      views: 8700,
      likes: 562,
      comments: 43,
      downloads: 210,
      tokens: 300,
      tags: ["3D", "Animation", "Characters"],
    },
    {
      id: 3,
      title: "Full-Stack E-commerce Template",
      creator: "WebDevPro",
      category: "Templates",
      image: "/placeholder.svg?height=150&width=300",
      views: 15200,
      likes: 1024,
      comments: 128,
      downloads: 450,
      tokens: 200,
      tags: ["E-commerce", "Next.js", "Full-Stack"],
    },
    {
      id: 4,
      title: "AI-Powered Analytics Dashboard",
      creator: "DataViz Studio",
      category: "Data & AI",
      image: "/placeholder.svg?height=150&width=300",
      views: 9300,
      likes: 721,
      comments: 92,
      downloads: 280,
      tokens: 250,
      tags: ["AI", "Analytics", "Dashboard"],
    },
  ]

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4 bg-teal-900/30 border border-teal-800">
        <TabsTrigger value="all" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
          All
        </TabsTrigger>
        <TabsTrigger value="development" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
          Development
        </TabsTrigger>
        <TabsTrigger value="design" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
          Design
        </TabsTrigger>
        <TabsTrigger value="3d" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
          3D Assets
        </TabsTrigger>
        <TabsTrigger value="templates" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
          Templates
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingItems && trendingItems.length > 0 ? (
            trendingItems.map((item) => (
              <Card key={item.id} className="overflow-hidden bg-teal-900/20 border-teal-800">
                <div className="relative h-40">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <Badge className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700">{item.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 font-semibold text-teal-300">{item.title}</h3>
                  <p className="text-sm text-teal-500">by {item.creator}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags &&
                      item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-teal-700 text-teal-400">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-teal-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{item.likes?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{item.comments?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{item.downloads?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-teal-800 p-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-teal-400">
                    <span>{item.tokens || 0} tokens</span>
                  </div>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-teal-500">No trending content available</div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="development">
        <div className="text-center py-8 text-teal-500">Switch to the "All" tab to see all trending content</div>
      </TabsContent>
      <TabsContent value="design">
        <div className="text-center py-8 text-teal-500">Switch to the "All" tab to see all trending content</div>
      </TabsContent>
      <TabsContent value="3d">
        <div className="text-center py-8 text-teal-500">Switch to the "All" tab to see all trending content</div>
      </TabsContent>
      <TabsContent value="templates">
        <div className="text-center py-8 text-teal-500">Switch to the "All" tab to see all trending content</div>
      </TabsContent>
    </Tabs>
  )
}
