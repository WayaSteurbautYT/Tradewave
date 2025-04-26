'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function UploadContentPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('video');
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState('5');
  const [isPremium, setIsPremium] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && userProfile && userProfile.role !== 'seller') {
      router.push(userProfile.role === 'buyer' ? '/dashboard/buyer' : '/select-role');
    }
  }, [user, userProfile, loading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !file || !price) {
      setError('Please fill in all required fields and upload a file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically upload the file to Firebase Storage or another storage service
      // and save the content metadata to Firestore
      console.log('Uploading content:', { title, description, category, price, isPremium, file });

      // Reset form after successful upload
      setTitle('');
      setDescription('');
      setCategory('video');
      setFile(null);
      setPrice('5');
      setIsPremium(false);
      setUploading(false);

      router.push('/dashboard/seller?tab=content');
    } catch (err: any) {
      console.error('Error uploading content:', err);
      setError(err.message || 'Failed to upload content. Please try again.');
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Upload New Content</CardTitle>
          <CardDescription className="text-center">Share your creations with the TradeWave community and earn tokens.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your content"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content in detail"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (Tokens)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="video/*,audio/*,image/*"
                required
              />
              {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isPremium" checked={isPremium} onCheckedChange={(checked) => setIsPremium(checked === true)} />
              <Label htmlFor="isPremium">Premium Content (Only for subscribed users)</Label>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={uploading} onClick={handleSubmit}>
            {uploading ? 'Uploading...' : 'Upload Content'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
