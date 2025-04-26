"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Video, Code, ImageIcon, Music, File, X, Plus, DollarSign, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export default function UploadPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [tokenPrice, setTokenPrice] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [contentType, setContentType] = useState("project")
  const router = useRouter()
  const { toast } = useToast()

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag) && tags.length < 5) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove))
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0]
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-teal-400" />
      case "video":
        return <Video className="h-4 w-4 text-teal-400" />
      case "audio":
        return <Music className="h-4 w-4 text-teal-400" />
      case "text":
        return <FileText className="h-4 w-4 text-teal-400" />
      case "application":
        if (file.type.includes("pdf")) {
          return <FileText className="h-4 w-4 text-teal-400" />
        } else if (file.type.includes("json") || file.type.includes("javascript") || file.type.includes("html")) {
          return <Code className="h-4 w-4 text-teal-400" />
        }
        return <File className="h-4 w-4 text-teal-400" />
      default:
        return <File className="h-4 w-4 text-teal-400" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || files.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields and upload at least one file.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Content uploaded successfully",
        description: "Your content has been uploaded to TradeWave.",
      })

      // Redirect to the dashboard after successful upload
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An error occurred during upload. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-300">Launchpad</h1>
          <p className="text-teal-500">Upload and share your content with the TradeWave community</p>
        </div>

        <Tabs defaultValue="project" className="space-y-4" onValueChange={setContentType}>
          <TabsList className="bg-teal-900/30 border border-teal-800">
            <TabsTrigger value="project" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Project
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Video
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Code
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-teal-800 data-[state=active]:text-teal-100">
              Design
            </TabsTrigger>
          </TabsList>

          <Card className="bg-[#0f172a] border-teal-800">
            <CardHeader>
              <CardTitle className="text-teal-300">
                {contentType === "project" && "Upload Project"}
                {contentType === "video" && "Upload Video"}
                {contentType === "code" && "Upload Code"}
                {contentType === "design" && "Upload Design"}
              </CardTitle>
              <CardDescription>
                {contentType === "project" && "Share your project files, documentation, and resources"}
                {contentType === "video" && "Share your video tutorials, courses, or content"}
                {contentType === "code" && "Share your code snippets, libraries, or frameworks"}
                {contentType === "design" && "Share your design assets, templates, or UI kits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-teal-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a title for your content"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-teal-900/30 border-teal-800 text-teal-100 placeholder:text-teal-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-teal-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your content..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="min-h-[120px] bg-teal-900/30 border-teal-800 text-teal-100 placeholder:text-teal-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-teal-300">
                        Category
                      </Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-teal-900/30 border-teal-800 text-teal-100 placeholder:text-teal-600">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-teal-900 border-teal-800">
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-teal-300">
                        Tags (max 5)
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tags"
                          placeholder="Add a tag"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="bg-teal-900/30 border-teal-800 text-teal-100 placeholder:text-teal-600"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddTag()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddTag}
                          disabled={!currentTag || tags.length >= 5}
                          className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add tag</span>
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-teal-800/50 text-teal-300 hover:bg-teal-700"
                            >
                              {tag}
                              <button
                                type="button"
                                className="ml-1 rounded-full outline-none hover:text-teal-100"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {tag}</span>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="files" className="text-teal-300">
                      Upload Files
                    </Label>
                    <div className="border-2 border-dashed border-teal-800 rounded-lg p-6 text-center bg-teal-900/20">
                      <Input id="files" type="file" multiple onChange={handleFileChange} className="hidden" />
                      <Label htmlFor="files" className="cursor-pointer flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-teal-500 mb-2" />
                        <span className="text-teal-300 font-medium">Click to upload or drag and drop</span>
                        <span className="text-teal-500 text-sm mt-1">
                          {contentType === "video" ? "MP4, WebM, MOV up to 2GB" : "Any file type up to 500MB"}
                        </span>
                      </Label>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-teal-300">Selected Files</Label>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-teal-900/30 rounded-md border border-teal-800"
                            >
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file)}
                                <span className="text-teal-300 text-sm truncate max-w-[200px]">{file.name}</span>
                                <span className="text-teal-500 text-xs">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFile(file)}
                                className="h-6 w-6 text-teal-500 hover:text-teal-300 hover:bg-teal-800/50"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove {file.name}</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public" className="text-teal-300">
                          Visibility
                        </Label>
                        <p className="text-xs text-teal-500">
                          {isPublic
                            ? "Anyone can discover and access your content"
                            : "Only you can access your content"}
                        </p>
                      </div>
                      <Switch
                        id="public"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        className="data-[state=checked]:bg-teal-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="price" className="text-teal-300">
                          Token Price
                        </Label>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-teal-400" />
                          <span className="text-teal-300 font-medium">{tokenPrice} WaveTokens</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="price"
                          value={[tokenPrice]}
                          min={0}
                          max={1000}
                          step={10}
                          onValueChange={(value) => setTokenPrice(value[0])}
                          className="flex-1"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-teal-400">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">Token pricing info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-teal-900 border-teal-700">
                              <p className="max-w-xs text-sm">
                                Setting a price of 0 makes your content free. Higher prices may reduce downloads but
                                increase revenue per download.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-teal-500">
                        {tokenPrice === 0
                          ? "Your content will be free for everyone"
                          : `You'll earn ${Math.floor(tokenPrice * 0.7)} tokens per download (after platform fee)`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => router.push("/dashboard")}
                    className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
                    {isLoading ? "Uploading..." : "Upload Content"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
