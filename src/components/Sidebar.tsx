import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  BarChart3, 
  Brain,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cargar Datos", href: "/upload", icon: Upload },
  { name: "Datos & Limpieza", href: "/data", icon: Database },
  { name: "Visualización", href: "/visualization", icon: BarChart3 },
  { name: "Modelado ML", href: "/modeling", icon: Brain },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar-background via-sidebar-background to-sidebar-accent/30 opacity-50"></div>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 relative z-10">
        <Brain className="h-8 w-8 text-sidebar-primary" />
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">EduML</h1>
          <p className="text-xs text-sidebar-foreground/60">Sistema de Análisis</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4 relative z-10">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4 relative z-10">
        <div className="rounded-lg bg-sidebar-accent/30 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">Backend conectado</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">API Externa activa</p>
        </div>
      </div>
    </div>
  );
}
