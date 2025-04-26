import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "hire",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      description: "Requested a WaveHire project",
      time: "2 hours ago",
      amount: "+500 tokens",
    },
    {
      id: 2,
      type: "view",
      user: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SM",
      },
      description: "Viewed your React component library",
      time: "5 hours ago",
      amount: "+25 tokens",
    },
    {
      id: 3,
      type: "download",
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "YO",
      },
      description: "Downloaded 3D model assets from MarketPlace",
      time: "Yesterday",
      amount: "-100 tokens",
    },
    {
      id: 4,
      type: "stream",
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "YO",
      },
      description: "Started a WaveCast session",
      time: "2 days ago",
      amount: "+150 tokens",
    },
    {
      id: 5,
      type: "upload",
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "YO",
      },
      description: "Uploaded new open-source project",
      time: "3 days ago",
      amount: "+200 tokens",
    },
  ]

  return (
    <div className="space-y-4">
      {activities && activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-teal-800">
              <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-teal-900 text-teal-300">{activity.user?.initials || "??"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none text-teal-100">
                <span className="font-semibold">{activity.user?.name || "Unknown User"}</span> {activity.description}
              </p>
              <p className="text-xs text-teal-500">{activity.time}</p>
            </div>
            <div
              className={`text-sm font-medium ${activity.amount?.startsWith("+") ? "text-teal-400" : "text-red-400"}`}
            >
              {activity.amount}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-teal-500">No recent activity</div>
      )}
    </div>
  )
}
