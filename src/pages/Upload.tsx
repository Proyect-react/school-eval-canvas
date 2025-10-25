// src/pages/Upload.tsx - ACTUALIZADO
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet, Database, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import apiService from "@/services/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dataStats, setDataStats] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo CSV válido",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setUploadSuccess(false);
      toast({
        title: "Archivo seleccionado",
        description: `${selectedFile.name} listo para cargar (${(selectedFile.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await apiService.uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        setDataStats(result.data);
        setUploadSuccess(true);
        toast({
          title: "✓ Carga exitosa",
          description: `Archivo procesado: ${result.data.total_rows} filas, ${result.data.total_columns} columnas`,
        });
      } else {
        throw new Error(result.error || "Error al cargar el archivo");
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Error al cargar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleApiConnect = async () => {
    if (!apiEndpoint) return;

    toast({
      title: "Conectando a API...",
      description: "Estableciendo conexión con el backend externo",
    });

    try {
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        toast({
          title: "✓ Conexión exitosa",
          description: "Backend conectado correctamente",
        });
      } else {
        throw new Error("No se pudo conectar al backend");
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
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
              <p className="text-sm text-muted-foreground">Formato CSV requerido</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary hover:bg-muted/50">
              <UploadIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer text-center">
                <span className="text-sm font-medium">Haz clic para seleccionar CSV</span>
                <br />
                <span className="text-xs text-muted-foreground">
                  Columnas esperadas: estudiante_id, calificaciones, asistencia, etc.
                </span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>

            {file && (
              <div className={`rounded-lg border-2 p-4 transition-colors ${
                uploadSuccess 
                  ? 'border-secondary bg-secondary/10' 
                  : 'border-border bg-muted'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      {file.name}
                      {uploadSuccess && (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Cargando...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadSuccess && dataStats && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-background p-2">
                      <span className="text-muted-foreground">Filas:</span>
                      <span className="ml-1 font-semibold">{dataStats.total_rows}</span>
                    </div>
                    <div className="rounded bg-background p-2">
                      <span className="text-muted-foreground">Columnas:</span>
                      <span className="ml-1 font-semibold">{dataStats.total_columns}</span>
                    </div>
                    <div className="rounded bg-background p-2 col-span-2">
                      <span className="text-muted-foreground">Valores nulos:</span>
                      <span className="ml-1 font-semibold text-accent">{dataStats.null_values}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading || uploadSuccess} 
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : uploadSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Archivo Cargado
                </>
              ) : (
                'Cargar y Procesar con pandas'
              )}
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
              <p className="text-sm text-muted-foreground">Backend con pandas/numpy/PyTorch</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api-endpoint">Endpoint de API</Label>
              <Input
                id="api-endpoint"
                placeholder="http://localhost:5000/api"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                URL del backend Flask/FastAPI
              </p>
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

            <Button 
              onClick={handleApiConnect} 
              disabled={!apiEndpoint} 
              className="w-full" 
              variant="secondary"
            >
              <Database className="mr-2 h-4 w-4" />
              Probar Conexión Backend
            </Button>

            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="mb-2 text-sm font-medium">Formato esperado del CSV:</h4>
              <pre className="overflow-x-auto text-xs text-muted-foreground">
{`estudiante_id,nombre,calif1,calif2,calif3,asistencia
1,Juan Pérez,85,92,88,95
2,María García,78,88,90,92
3,Carlos López,82,75,82,88
...`}
              </pre>
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs">
              <p className="font-medium mb-1">💡 Stack del Backend:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Flask/FastAPI para endpoints</li>
                <li>• pandas para procesamiento de datos</li>
                <li>• NumPy para operaciones numéricas</li>
                <li>• PyTorch/Scikit-learn para ML</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}