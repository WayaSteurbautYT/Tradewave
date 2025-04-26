import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ActivityPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Activity</h2>
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="bg-teal-900/30 border border-teal-800">
          <TabsTrigger value="content">My Content</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="content">Your uploaded content will appear here.</TabsContent>
        <TabsContent value="projects">Your projects will appear here.</TabsContent>
        <TabsContent value="videos">Your videos will appear here.</TabsContent>
        <TabsContent value="network">Your network will appear here.</TabsContent>
      </Tabs>
    </div>
  );
} 