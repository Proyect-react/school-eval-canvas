import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Database, Key, Bell, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona las conexiones y preferencias del sistema
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Conexión Backend</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backend-url">URL del Backend</Label>
            <Input
              id="backend-url"
              placeholder="https://api.backend.com"
              defaultValue="https://api.backend.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-name">Nombre de Base de Datos</Label>
            <Input id="db-name" placeholder="school_grades" defaultValue="school_grades" />
          </div>
          <Button>Probar Conexión</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-secondary/10 p-2">
            <Key className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold">Credenciales API</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" type="password" placeholder="••••••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-secret">API Secret</Label>
            <Input id="api-secret" type="password" placeholder="••••••••••••" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold">Notificaciones</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Entrenamiento</p>
              <p className="text-sm text-muted-foreground">Notificar cuando el modelo termine</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Errores</p>
              <p className="text-sm text-muted-foreground">Notificar sobre errores en el pipeline</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-destructive/10 p-2">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Seguridad</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autenticación de dos factores</p>
              <p className="text-sm text-muted-foreground">Protección adicional para tu cuenta</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Logs de Auditoría</p>
              <p className="text-sm text-muted-foreground">Registrar todas las acciones</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}
