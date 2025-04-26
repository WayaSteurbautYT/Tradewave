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

// Spend tokens and split between platform, owner, creator/team, and buyer reward
export async function spendAndSplitTokens({
  buyerUid,
  creatorUid,
  teamUid = null,
  amount,
  description = "Token payment",
  split = { platform: 0.1, owner: 0.05, creator: 0.8, buyer: 0.05 },
  ownerUid = "owner",
  platformUid = "platform"
}: {
  buyerUid: string,
  creatorUid: string,
  teamUid?: string | null,
  amount: number,
  description?: string,
  split?: { platform: number, owner: number, creator: number, buyer: number },
  ownerUid?: string,
  platformUid?: string
}) {
  // Calculate splits
  const platformShare = Math.round(amount * split.platform)
  const ownerShare = Math.round(amount * split.owner)
  const creatorShare = Math.round(amount * split.creator)
  const buyerReward = Math.round(amount * split.buyer)
  const totalSplit = platformShare + ownerShare + creatorShare + buyerReward
  const adjustment = amount - totalSplit

  // Adjust creator share if rounding error
  const finalCreatorShare = creatorShare + adjustment

  // Deduct from buyer
  await spendTokens(buyerUid, amount, description)

  // Add to creator or team
  if (teamUid) {
    await earnTokens(teamUid, finalCreatorShare, `Team earnings: ${description}`)
  } else {
    await earnTokens(creatorUid, finalCreatorShare, `Creator earnings: ${description}`)
  }

  // Add to platform
  await earnTokens(platformUid, platformShare, `Platform fee: ${description}`)

  // Add to owner
  await earnTokens(ownerUid, ownerShare, `Owner fee: ${description}`)

  // Reward buyer (optional)
  if (buyerReward > 0) {
    await earnTokens(buyerUid, buyerReward, `Buyer reward: ${description}`)
  }

  // Optionally: return split details
  return {
    platform: platformShare,
    owner: ownerShare,
    creator: finalCreatorShare,
    buyer: buyerReward
  }
} 