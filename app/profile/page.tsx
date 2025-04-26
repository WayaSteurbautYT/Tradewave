"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard-header"
import { TokenDisplay } from "@/components/token-display"
import {
  Edit,
  Save,
  Github,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  FileCode,
  Video,
  Users,
  Star,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    username: "alexjohnson",
    bio: "Full-stack developer specializing in React, Next.js, and Node.js. Creating digital products and open-source projects. Currently working on TradeWave platform.",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    github: "alexjohnson",
    twitter: "alexjohnson_dev",
    linkedin: "alexjohnson",
    joinDate: "January 2023",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "UI/UX", "API Design"],
    tokens: 1250,
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In a real app, you would save the profile to the backend here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const userContent = [
    {
      id: 1,
      title: "Advanced React Component Library",
      type: "project",
      image: "/placeholder.svg?height=150&width=300",
      downloads: 320,
      views: 12500,
      tokens: 150,
    },
    {
      id: 2,
      title: "Building a Full-Stack App with Next.js",
      type: "video",
      image: "/placeholder.svg?height=150&width=300",
      downloads: 0,
      views: 8700,
      tokens: 100,
    },
    {
      id: 3,
      title: "Modern UI Design Principles",
      type: "project",
      image: "/placeholder.svg?height=150&width=300",
      downloads: 210,
      views: 5400,
      tokens: 80,
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-teal-300">Profile</h2>
          {isEditing ? (
            <Button onClick={handleSaveProfile} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-7 md:col-span-3 bg-[#0f172a] border-teal-800">
            <CardHeader className="relative pb-8">
              <div className="absolute inset-0 h-24 bg-gradient-to-r from-teal-600 to-cyan-600"></div>
              <div className="relative mt-12 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-[#0f172a]">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl bg-teal-900 text-teal-300">AJ</AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="mt-4 text-center text-xl font-bold bg-teal-900/30 border-teal-800 text-teal-100"
                  />
                ) : (
                  <h3 className="mt-4 text-xl font-bold text-teal-300">{profile.name}</h3>
                )}
                {isEditing ? (
                  <Input
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    className="mt-1 text-center text-sm bg-teal-900/30 border-teal-800 text-teal-100"
                  />
                ) : (
                  <p className="text-sm text-teal-500">@{profile.username}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <TokenDisplay tokens={profile.tokens} />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
                >
                  <Star className="mr-1 h-4 w-4" /> Become Pro
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-teal-300">About</h4>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    className="min-h-[100px] bg-teal-900/30 border-teal-800 text-teal-100"
                  />
                ) : (
                  <p className="text-sm text-teal-400">{profile.bio}</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-teal-300">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    {isEditing ? (
                      <Input
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="h-8 bg-teal-900/30 border-teal-800 text-teal-100"
                      />
                    ) : (
                      <span className="text-teal-400">{profile.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-teal-500" />
                    {isEditing ? (
                      <Input
                        name="website"
                        value={profile.website}
                        onChange={handleInputChange}
                        className="h-8 bg-teal-900/30 border-teal-800 text-teal-100"
                      />
                    ) : (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500" />
                    <span className="text-teal-400">Joined {profile.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-teal-300">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} className="bg-teal-800/50 text-teal-300 hover:bg-teal-700">
                      {skill}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 border-dashed border-teal-800 text-teal-500 hover:bg-teal-900 hover:text-teal-300"
                    >
                      + Add Skill
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-4 bg-teal-800" />

              <div className="space-y-2">
                <h4 className="font-medium text-teal-300">Social Links</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-teal-500" />
                    {isEditing ? (
                      <Input
                        name="github"
                        value={profile.github}
                        onChange={handleInputChange}
                        className="h-8 bg-teal-900/30 border-teal-800 text-teal-100"
                        placeholder="GitHub username"
                      />
                    ) : (
                      <a
                        href={`https://github.com/${profile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline"
                      >
                        {profile.github}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-teal-500" />
                    {isEditing ? (
                      <Input
                        name="twitter"
                        value={profile.twitter}
                        onChange={handleInputChange}
                        className="h-8 bg-teal-900/30 border-teal-800 text-teal-100"
                        placeholder="Twitter username"
                      />
                    ) : (
                      <a
                        href={`https://twitter.com/${profile.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline"
                      >
                        {profile.twitter}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-teal-500" />
                    {isEditing ? (
                      <Input
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={handleInputChange}
                        className="h-8 bg-teal-900/30 border-teal-800 text-teal-100"
                        placeholder="LinkedIn username"
                      />
                    ) : (
                      <a
                        href={`https://linkedin.com/in/${profile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline"
                      >
                        {profile.linkedin}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="col-span-7 md:col-span-4 space-y-4">
            <Card className="bg-[#0f172a] border-teal-800">
              <CardHeader>
                <CardTitle className="text-teal-300">Activity</CardTitle>
                <CardDescription>Your content and engagement on TradeWave</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList className="bg-teal-900/30 border border-teal-800">
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
                    >
                      My Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
                    >
                      Projects
                    </TabsTrigger>
                    <TabsTrigger
                      value="videos"
                      className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
                    >
                      Videos
                    </TabsTrigger>
                    <TabsTrigger
                      value="network"
                      className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100"
                    >
                      Network
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {userContent.map((item) => (
                        <Card key={item.id} className="overflow-hidden bg-teal-900/20 border-teal-800">
                          <div className="relative h-32">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            <Badge className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700">
                              {item.type === "project" ? (
                                <FileCode className="mr-1 h-3 w-3" />
                              ) : (
                                <Video className="mr-1 h-3 w-3" />
                              )}
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="line-clamp-1 font-semibold text-teal-300">{item.title}</h3>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-teal-500">{item.views.toLocaleString()} views</span>
                              <span className="text-teal-500">{item.downloads.toLocaleString()} downloads</span>
                              <span className="text-teal-400">{item.tokens} tokens</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        asChild
                        variant="outline"
                        className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
                      >
                        <Link href="/upload">Upload New Content</Link>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileCode className="h-12 w-12 text-teal-500 mb-4" />
                      <h3 className="text-xl font-medium text-teal-300 mb-2">No Projects Yet</h3>
                      <p className="text-teal-500 mb-4">Upload your first project to start earning tokens</p>
                      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                        <Link href="/upload">Upload Project</Link>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="videos">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Video className="h-12 w-12 text-teal-500 mb-4" />
                      <h3 className="text-xl font-medium text-teal-300 mb-2">No Videos Yet</h3>
                      <p className="text-teal-500 mb-4">Upload your first video to start earning tokens</p>
                      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                        <Link href="/upload?type=video">Upload Video</Link>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="network">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-12 w-12 text-teal-500 mb-4" />
                      <h3 className="text-xl font-medium text-teal-300 mb-2">Build Your Network</h3>
                      <p className="text-teal-500 mb-4">Connect with other creators and collaborators</p>
                      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                        <Link href="/network">Find WaveRiders</Link>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-teal-800">
              <CardHeader>
                <CardTitle className="text-teal-300">Stats</CardTitle>
                <CardDescription>Your performance and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-teal-800 bg-teal-900/20 p-4">
                    <span className="text-2xl font-bold text-teal-300">3</span>
                    <span className="text-xs text-teal-500">Content Items</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-teal-800 bg-teal-900/20 p-4">
                    <span className="text-2xl font-bold text-teal-300">26.6K</span>
                    <span className="text-xs text-teal-500">Total Views</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-teal-800 bg-teal-900/20 p-4">
                    <span className="text-2xl font-bold text-teal-300">530</span>
                    <span className="text-xs text-teal-500">Downloads</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-teal-800 bg-teal-900/20 p-4">
                    <span className="text-2xl font-bold text-teal-300">1,250</span>
                    <span className="text-xs text-teal-500">Tokens Earned</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
