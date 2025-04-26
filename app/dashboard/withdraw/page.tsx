"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

export default function WithdrawPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  const [payoutMethod, setPayoutMethod] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        const q = query(
          collection(db, "withdrawals"),
          where("uid", "==", user.uid),
          orderBy("requestedAt", "desc")
        );
        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchHistory();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("You must be logged in to withdraw.");
      setLoading(false);
      return;
    }
    if (!amount || !payoutMethod) {
      setError("Please enter an amount and payout method.");
      setLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        amount,
        payoutMethod,
        status: "pending",
        requestedAt: new Date(),
        fee: Math.round(amount * 0.1),
      });
      setSuccess("Withdrawal request submitted!");
      setAmount(0);
      setPayoutMethod("");
    } catch (err: any) {
      setError("Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
          <CardHeader>
            <CardTitle>Withdraw Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">You must be logged in to request a withdrawal.</p>
          </CardContent>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <CardHeader>
          <CardTitle>Withdraw Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={10}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="Enter amount to withdraw"
                className="bg-teal-900/30 border-teal-800 text-teal-100"
              />
            </div>
            <div>
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <Input
                id="payoutMethod"
                value={payoutMethod}
                onChange={e => setPayoutMethod(e.target.value)}
                placeholder="e.g. PayPal email"
                className="bg-teal-900/30 border-teal-800 text-teal-100"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? "Submitting..." : "Request Withdrawal"}
            </Button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}
          </form>
        </CardContent>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-teal-500">No withdrawal requests yet.</p>
            ) : (
              history.map((w) => (
                <div key={w.id} className="flex justify-between items-center border-b border-teal-800 py-2">
                  <span>{w.amount} tokens</span>
                  <span className="capitalize">{w.status}</span>
                  <span className="text-xs text-teal-400">{w.payoutMethod}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
} 