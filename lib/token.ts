import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc, setDoc, collection, addDoc, serverTimestamp, increment, getDocs } from "firebase/firestore"

// Get user's token balance
export async function getTokenBalance(uid: string): Promise<number> {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data().tokens || 0 : 0
}

// Earn tokens (add to balance and log transaction)
export async function earnTokens(uid: string, amount: number, description = "Earned tokens") {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, { tokens: increment(amount) })
  const txRef = collection(userRef, "transactions")
  await addDoc(txRef, {
    type: "earn",
    amount,
    description,
    timestamp: serverTimestamp(),
  })
}

// Spend tokens (subtract from balance and log transaction)
export async function spendTokens(uid: string, amount: number, description = "Spent tokens") {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, { tokens: increment(-amount) })
  const txRef = collection(userRef, "transactions")
  await addDoc(txRef, {
    type: "spend",
    amount: -amount,
    description,
    timestamp: serverTimestamp(),
  })
}

// Apply commission (deduct percentage and log transaction)
export async function applyCommission(uid: string, baseAmount: number, percent = 10, description = "Commission fee") {
  const commission = Math.round((baseAmount * percent) / 100)
  await spendTokens(uid, commission, description)
  return commission
}

// Get all transactions for a user
export async function getTransactions(uid: string) {
  const txRef = collection(doc(db, "users", uid), "transactions")
  const snapshot = await getDocs(txRef)
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
} 