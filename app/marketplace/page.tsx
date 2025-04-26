"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, Download, ThumbsUp, MessageSquare, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [activeCategory, setActiveCategory] = useState("all")

  const marketplaceItems = [
    {
      id: 1,
      title: "Advanced React Component Library",
      creator: "Alex Johnson",
      category: "development",
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
      category: "3d",
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
      category: "templates",
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
      category: "data",
      image: "/placeholder.svg?height=150&width=300",
      views: 9300,
      likes: 721,
      comments: 92,
      downloads: 280,
      tokens: 250,
      tags: ["AI", "Analytics", "Dashboard"],
    },
    {
      id: 5,
      title: "Mobile App UI Kit",
      creator: "DesignMaster",
      category: "design",
      image: "/placeholder.svg?height=150&width=300",
      views: 7800,
      likes: 492,
      comments: 57,
      downloads: 180,
      tokens: 120,
      tags: ["UI Kit", "Mobile", "Design"],
    },
    {
      id: 6,
      title: "Video Editing Transitions Pack",
      creator: "VideoWizard",
      category: "video",
      image: "/placeholder.svg?height=150&width=300",
      views: 6500,
      likes: 385,
      comments: 41,
      downloads: 150,
      tokens: 100,
      tags: ["Video", "Transitions", "Editing"],
    },
    {
      id: 7,
      title: "Python Data Science Toolkit",
      creator: "DataScientist",
      category: "development",
      image: "/placeholder.svg?height=150&width=300",
      views: 11200,
      likes: 876,
      comments: 103,
      downloads: 420,
      tokens: 180,
      tags: ["Python", "Data Science", "ML"],
    },
    {
      id: 8,
      title: "Social Media Marketing Templates",
      creator: "MarketingPro",
      category: "marketing",
      image: "/placeholder.svg?height=150&width=300",
      views: 5400,
      likes: 312,
      comments: 38,
      downloads: 130,
      tokens: 80,
      tags: ["Marketing", "Social Media", "Templates"],
    },
  ]

  // Filter items based on search query and active category
  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || item.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Sort items based on selected sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads
      case "newest":
        return b.id - a.id // Using ID as a proxy for date in this example
      case "price-low":
        return a.tokens - b.tokens
      case "price-high":
        return b.tokens - a.tokens
      default:
        return 0
    }
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-teal-300">Marketplace</h1>
          <p className="text-teal-500">Discover and download content from the TradeWave community</p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-teal-400" />
            <Input
              type="search"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-teal-900/30 border-teal-800 text-teal-100 placeholder:text-teal-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-teal-900/30 border-teal-800 text-teal-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-teal-900 border-teal-800">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
          <TabsList className="bg-teal-900/30 border border-teal-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              All
            </TabsTrigger>
            <TabsTrigger
              value="development"
              className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
            >
              Development
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Design
            </TabsTrigger>
            <TabsTrigger value="3d" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              3D Assets
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Video
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
            >
              Marketing
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden bg-teal-900/20 border-teal-800">
                  <div className="relative h-40">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <Badge className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-1 font-semibold text-teal-300">{item.title}</h3>
                    <p className="text-sm text-teal-500">by {item.creator}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-teal-700 text-teal-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-teal-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{item.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{item.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{item.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t border-teal-800 p-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-teal-400">
                      <span>{item.tokens} tokens</span>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12 text-teal-500">
                No items found matching your search criteria
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
