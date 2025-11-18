import { Calendar, Grid2X2, Grid2X2Check, Grid2x2X, FileSearch, FolderSearch, FolderRoot, Building, Star, Asterisk, ChartBarBig, BookHeart, UserCog, UserPen, UserRoundCheck, SquareUserRound, CircleUser, Ampersand, Hash, Building2, CornerRightUp, UsersRound, Users, Boxes } from "lucide-react"

export const sidebarItems = {
  mainMenu: [
    { title: "QAS Master List", url: "/qas", icon: Grid2X2 },
    { title: "Outstanding NCR", url: "#", icon: Grid2X2Check },
    { title: "Cancelled NCR", url: "#", icon: Grid2x2X },
    { title: "Closed NCR", url: "#", icon: Grid2X2 },
  ],

  adminMenu: [
    { title: "Users", url: "#", icon: Users },
    { title: "Group", url: "#", icon: Boxes },
    { title: "Escalation", url: "#", icon: CornerRightUp },
    { title: "Finding Type", url: "#", icon: FileSearch },
    { title: "Finding Category", url: "#", icon: FolderSearch },
    { title: "Holiday", url: "#", icon: Calendar },
    { title: "Project", url: "#", icon: Building2 },
    { title: "Company", url: "#", icon: Building },
    { title: "Audit Engagement", url: "#", icon: BookHeart },
    { title: "Audit Rating", url: "#", icon: Star },
    { title: "Audit Number", url: "#", icon: Hash },
    { title: "Manage Status", url: "#", icon: ChartBarBig },
  ],

  accounts: [
    { name: "Rebert Walog Jr.", title: "Admin", logo: UserCog },
    { name: "Rebert Walog Jr.", title: "Auditor", logo: UserPen },
    { name: "Rebert Walog Jr.", title: "Recipient", logo: UserRoundCheck },
    { name: "Rebert Walog Jr.", title: "Team Leader", logo: CircleUser },
    { name: "Rebert Walog Jr.", title: "Manager", logo: SquareUserRound },
  ],
}