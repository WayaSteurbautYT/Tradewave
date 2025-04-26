"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWallet() {
      if (!user) return
      setLoading(true)
      // Get balance
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)
      setBalance(userSnap.exists() ? userSnap.data().tokens || 0 : 0)
      // Get transactions
      const snap = await getDocs(collection(db, "tokens", user.uid, "transactions"))
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    }
    fetchWallet()
  }, [user])

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-teal-300">Token Wallet</h1>
      <Card className="mb-8 bg-teal-950/60 border-teal-800">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-200">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-teal-400 mb-2">{loading ? '...' : balance} <span className="text-lg font-normal text-teal-500">WaveTokens</span></div>
          <Button disabled className="mt-2">Withdraw (Coming Soon)</Button>
        </CardContent>
      </Card>
      <Card className="mb-8 bg-teal-950/60 border-teal-800">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-200">Token History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-teal-200">
              <thead>
                <tr className="border-b border-teal-800">
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-teal-500">No transactions yet.</td></tr>
                )}
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-teal-900">
                    <td className="py-2 px-4">{tx.type}</td>
                    <td className={`py-2 px-4 font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount}</td>
                    <td className="py-2 px-4">{tx.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                    <td className="py-2 px-4">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-teal-950/60 border-teal-800">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-200">Token Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-teal-400 text-sm space-y-1">
            <li>Minimum token balance: 10% of total earned tokens</li>
            <li>Tokens are non-transferable (except for withdrawals)</li>
            <li>Tokens expire after 12 months of inactivity</li>
            <li>Withdrawals require a minimum balance and incur a transaction fee</li>
            <li>All earnings and spendings are recorded for transparency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 