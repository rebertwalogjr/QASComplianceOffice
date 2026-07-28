import { Calendar, Grid2X2, Grid2X2Check, Grid2x2X, FileSearch, FolderSearch, FolderRoot, Building, Star, Asterisk, ChartBarBig, BookHeart, UserCog, UserPen, UserRoundCheck, SquareUserRound, CircleUser, Ampersand, Hash, Building2, CornerRightUp, UsersRound, Users, Boxes, FilePenLine, LucideDownload, Settings } from "lucide-react"

export const sidebarItems = {
  mainMenu: [
    { title: "QAS Master List", url: "/qas", icon: Grid2X2 },
    // { title: "Outstanding NCR", url: "#", icon: Grid2X2Check },
    // { title: "Cancelled NCR", url: "#", icon: Grid2x2X },
    // { title: "Closed NCR", url: "#", icon: Grid2X2 },
    { title: "QA Entry", url: "/qas/new", icon: FilePenLine },
    { title: "Export", url: "/qas/export", icon: LucideDownload},
    { title: "Settings", url: "/qas/settings", icon: Settings},
  ],

  adminMenu: [
    { title: "Users", url: "/qas/admin/users", icon: Users },
    { title: "Group", url: "/qas/admin/groups", icon: Boxes },
    { title: "Escalation", url: "/qas/admin/escalations", icon: CornerRightUp },
    { title: "Finding Type", url: "/qas/admin/types", icon: FileSearch },
    { title: "Finding Category", url: "/qas/admin/categories", icon: FolderSearch },
    { title: "Holiday", url: "/qas/admin/holidays", icon: Calendar },
    { title: "Project", url: "/qas/admin/projects", icon: Building2 },
    { title: "Company", url: "/qas/admin/companies", icon: Building },
    { title: "Engagement", url: "/qas/admin/engagements", icon: BookHeart },
    { title: "Rating", url: "/qas/admin/ratings", icon: Star },
    { title: "Audit Reports", url: "/qas/admin/auditreports", icon: Hash },
    // { title: "Manage Status", url: "/qas/admin/managestatus", icon: ChartBarBig },
  ],
}