import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileContext } from "@/contexts/FileContext";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const { toast } = useToast();
  const { addFile } = useFileContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "Archivo seleccionado",
        description: `${selectedFile.name} listo para cargar`,
      });
    }
  };

  const handleUpload = () => {
    if (file) {
      addFile(file);
      toast({
        title: "Archivo guardado",
        description: `${file.name} está disponible en Datos y Limpieza`,
      });
    }
  };

  const handleApiConnect = () => {
    if (apiEndpoint) {
      toast({
        title: "Conectando a API...",
        description: "Estableciendo conexión con el backend externo",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cargar Datos</h1>
        <p className="mt-2 text-muted-foreground">
          Importa datos desde archivos CSV o conéctate a tu API externa
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cargar desde Archivo</h3>
              <p className="text-sm text-muted-foreground">CSV, Excel, JSON</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary hover:bg-muted/50">
              <UploadIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium">Haz clic para seleccionar</span>
                <span className="text-sm text-muted-foreground"> o arrastra archivos aquí</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {file && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!file} className="w-full">
              Cargar y Procesar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2">
              <Database className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Conectar API Externa</h3>
              <p className="text-sm text-muted-foreground">Backend con pandas/numpy</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api-endpoint">Endpoint de API</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com/data"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="api-key">API Key (opcional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="••••••••••••"
                className="mt-2"
              />
            </div>

            <Button onClick={handleApiConnect} disabled={!apiEndpoint} className="w-full" variant="secondary">
              Conectar a Base de Datos
            </Button>

            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="mb-2 text-sm font-medium">Formato esperado:</h4>
              <pre className="overflow-x-auto text-xs text-muted-foreground">
{`{
  "estudiante_id": int,
  "calificaciones": [float],
  "asistencia": float,
  "participacion": float
}`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
