import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Store, CreditCard, Wallet, User, ShieldUser } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavUser } from './nav-user';
import { useAuth } from '@/pages/auth/auth-provider';

export function AppSidebar() {
  const { user } = useAuth()
  const location = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    {
      title: "Recebimentos", icon: Wallet, items: [
        { title: "Vendedor", url: "/admin/financeiro/vendedores", icon: User },
        { title: "Estabelecimento", url: "/admin/financeiro/estabelecimentos", icon: Store }
      ]
    },
    { title: "Estabelecimentos", url: "/admin/estabelecimentos", icon: Store },
  ]

  if (user?.role == "ADMINISTRADOR") {
    navItems.splice(2, 0, {
      title: "Usuários", icon: Users, items: [
        { title: "Vendedores", url: "/admin/vendedores", icon: User },
        { title: "Administradores", url: "/admin/administradores", icon: ShieldUser }
      ]
    })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CreditCard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Portal Unipag</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={location.pathname == item.url} asChild>
                    {item.url ?
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link> :
                      <span>
                        <item.icon />
                        <span>{item.title}</span>
                      </span>
                    }
                  </SidebarMenuButton>
                  {item.items && item.items.length > 0 && (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={location.pathname == item.url}>
                            <Link to={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}