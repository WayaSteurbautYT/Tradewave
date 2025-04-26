import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'project', file: null });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    async function fetchPortfolio() {
      if (!user) return;
      const profileRef = doc(db, 'profiles', user.uid);
      const snap = await getDoc(profileRef);
      if (snap.exists() && snap.data().portfolio) {
        setPortfolio(snap.data().portfolio);
      }
    }
    fetchPortfolio();
  }, [user]);
  const handlePortfolioInput = (e: any) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };
  const handleUploadPortfolio = async (e: any) => {
    e.preventDefault();
    if (!user || !newItem.file) return;
    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `portfolio/${user.uid}/${Date.now()}_${newItem.file.name}`);
    await uploadBytes(storageRef, newItem.file);
    const url = await getDownloadURL(storageRef);
    const item = { ...newItem, fileUrl: url, fileName: newItem.file.name };
    const { file, ...itemForFirestore } = item;
    const updatedPortfolio = [...portfolio, itemForFirestore];
    setPortfolio(updatedPortfolio);
    await setDoc(doc(db, 'profiles', user.uid), { portfolio: updatedPortfolio }, { merge: true });
    setNewItem({ title: '', description: '', type: 'project', file: null });
    setUploading(false);
  };
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Portfolio</h2>
      <form onSubmit={handleUploadPortfolio} className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <Input name="title" value={newItem.title} onChange={handlePortfolioInput} placeholder="Title" required className="md:w-1/4" />
        <Textarea name="description" value={newItem.description} onChange={handlePortfolioInput} placeholder="Description" required className="md:w-1/3" />
        <select name="type" value={newItem.type} onChange={handlePortfolioInput} className="md:w-1/6 p-2 rounded border border-teal-800 bg-teal-900 text-teal-100">
          <option value="project">Project</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="other">Other</option>
        </select>
        <Input type="file" accept="image/*,video/*,.pdf,.zip,.rar,.doc,.docx" onChange={handleFileChange} required className="md:w-1/4" />
        <Button type="submit" disabled={uploading} className="bg-teal-600 hover:bg-teal-700 text-white">{uploading ? 'Uploading...' : 'Upload'}</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolio.map((item, idx) => (
          <Card key={idx} className="bg-teal-900/20 border-teal-800">
            <CardHeader>
              <CardTitle className="text-teal-300">{item.title}</CardTitle>
              <CardDescription>{item.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-teal-400">{item.description}</p>
              {item.fileUrl && item.type === 'image' && (
                <img src={item.fileUrl} alt={item.title} className="rounded w-full" />
              )}
              {item.fileUrl && item.type === 'video' && (
                <video src={item.fileUrl} controls className="rounded w-full" />
              )}
              {item.fileUrl && item.type === 'project' && (
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">Download Project</a>
              )}
              {item.fileUrl && item.type === 'other' && (
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">Download File</a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 