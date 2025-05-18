
import { Home, Users, Calendar, FileText, DollarSign, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  {
    title: "Visão Geral",
    icon: Home,
    href: "/admin",
    exact: true
  },
  {
    title: "Terapeutas",
    icon: ShieldCheck,
    href: "/admin?tab=therapists"
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/admin?tab=clients"
  },
  {
    title: "Sessões",
    icon: Calendar,
    href: "/admin?tab=sessions"
  },
  {
    title: "Documentos",
    icon: FileText,
    href: "/admin?tab=documents"
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    href: "/admin?tab=financial"
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/admin?tab=settings"
  }
];

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  return (
    <div className="w-64 bg-teal-800/90 h-full p-4 flex flex-col border-r border-lavender-400/10">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Sequentia Admin</h2>
        <p className="text-white/70 text-sm">Painel Administrativo</p>
      </div>
      <Separator className="bg-lavender-400/20 my-2" />
      <nav className="space-y-1 flex-1">
        {sidebarItems.map((item) => {
          const isActive = item.exact 
            ? currentPath === item.href 
            : currentPath.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-lavender-400/30 text-white" 
                  : "text-white/70 hover:text-white hover:bg-lavender-400/10"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <Separator className="bg-lavender-400/20 my-2" />
      <div className="mt-auto text-white/50 text-xs">
        <p>Sequentia Empath Hub</p>
        <p>v1.0.0</p>
      </div>
    </div>
  );
}
