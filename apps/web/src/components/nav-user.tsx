import {
    LogOut,
} from "lucide-react"
import {
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/pages/auth/auth-provider"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"


export function NavUser() {
    const { user, logout } = useAuth()

    return (
        <SidebarMenu>
            <Separator />
            <SidebarMenuItem className="flex p-2">
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.email}</span>
                    <span className="truncate text-xs">{user?.role}</span>
                </div>
                <Button size="icon" variant="ghost" onClick={logout}>
                    <LogOut className="text-destructive" />
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
