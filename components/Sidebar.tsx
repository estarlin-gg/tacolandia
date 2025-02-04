"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClipboardList, Package, BarChart, Settings, Home } from "lucide-react"

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Reportes", href: "/reportes", icon: BarChart },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tacolandia Express</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[300px] px-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href && "bg-muted font-semibold")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

