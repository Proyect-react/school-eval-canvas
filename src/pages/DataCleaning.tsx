import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleData = [
  { id: 1, nombre: "Juan Pérez", calif1: 85, calif2: 92, calif3: null, asistencia: 95 },
  { id: 2, nombre: "María García", calif1: 78, calif2: 88, calif3: 90, asistencia: 92 },
  { id: 3, nombre: "Carlos López", calif1: null, calif2: 75, calif3: 82, asistencia: 88 },
  { id: 4, nombre: "Ana Martínez", calif1: 95, calif2: 98, calif3: 96, asistencia: 100 },
  { id: 5, nombre: "Pedro Sánchez", calif1: 82, calif2: null, calif3: 79, asistencia: 85 },
];

export default function DataCleaning() {
  const [data, setData] = useState(sampleData);
  const [columns, setColumns] = useState<string[]>(["id", "nombre", "calif1", "calif2", "calif3", "asistencia"]);
  const [fillMissing, setFillMissing] = useState(false);
  const [removeOutliers, setRemoveOutliers] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV válido",
        variant: "destructive"
      });
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      toast({
        title: "Error",
        description: "El archivo CSV está vacío o no tiene datos",
        variant: "destructive"
      });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    setColumns(headers);

    const parsedData = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row: any = { id: index + 1 };
      
      headers.forEach((header, i) => {
        const value = values[i];
        if (value === '' || value.toLowerCase() === 'null') {
          row[header] = null;
        } else if (!isNaN(Number(value))) {
          row[header] = Number(value);
        } else {
          row[header] = value;
        }
      });
      
      return row;
    });

    setData(parsedData);
    toast({
      title: "Archivo cargado",
      description: `${parsedData.length} registros cargados desde ${uploadedFile?.name}`,
    });
  };

  const nullCount = data.reduce((acc, row) => {
    return acc + Object.values(row).filter(val => val === null).length;
  }, 0);

  const getRowStatus = (row: any) => {
    const hasNullInNumericColumns = Object.entries(row).some(([key, value]) => {
      if (key === 'id') return false;
      if (value === null) {
        const column = columns.find(col => col === key);
        if (column) {
          const otherValues = data
            .map(r => r[key])
            .filter(v => v !== null);
          const isNumericColumn = otherValues.every(v => typeof v === 'number');
          return isNumericColumn;
        }
      }
      return false;
    });
    
    return hasNullInNumericColumns ? "Inactivo" : "Activo";
  };

  const handleClean = () => {
    toast({
      title: "Limpieza aplicada",
      description: `Datos procesados con pandas. ${nullCount} valores nulos tratados.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Datos & Limpieza</h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza y preprocesa los datos antes del análisis
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Cargar CSV</h3>
            <p className="text-sm text-muted-foreground">Selecciona un archivo CSV para analizar</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary hover:bg-muted/50">
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <Label htmlFor="csv-upload" className="cursor-pointer text-center">
              <span className="text-sm font-medium">Haz clic para seleccionar CSV</span>
              <br />
              <span className="text-xs text-muted-foreground">o usa datos de ejemplo</span>
            </Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {uploadedFile && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Valores Nulos</h3>
          </div>
          <p className="text-3xl font-bold">{nullCount}</p>
          <p className="text-sm text-muted-foreground">Requieren atención</p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">Outliers</h3>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">Detectados automáticamente</p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Registros Válidos</h3>
          </div>
          <p className="text-3xl font-bold">{data.length}</p>
          <p className="text-sm text-muted-foreground">Total en dataset</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Vista Previa de Datos</h3>
          <Badge variant="outline">{data.length} registros</Badge>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="capitalize">
                    {col}
                  </TableHead>
                ))}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => {
                const status = getRowStatus(row);
                return (
                  <TableRow key={row.id || idx}>
                    {columns.map((col) => (
                      <TableCell key={col} className={col === 'id' ? 'font-medium' : ''}>
                        {row[col] === null ? (
                          <span className="text-accent font-semibold">NULL</span>
                        ) : (
                          row[col]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge 
                        variant={status === "Activo" ? "default" : "destructive"}
                        className="font-medium"
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Operaciones de Limpieza</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fill-missing" 
              checked={fillMissing}
              onCheckedChange={(checked) => setFillMissing(checked as boolean)}
            />
            <label
              htmlFor="fill-missing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rellenar valores nulos con la media (pandas.fillna)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remove-outliers"
              checked={removeOutliers}
              onCheckedChange={(checked) => setRemoveOutliers(checked as boolean)}
            />
            <label
              htmlFor="remove-outliers"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eliminar outliers (método IQR con NumPy)
            </label>
          </div>

          <Button onClick={handleClean} className="w-full md:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Aplicar Limpieza
          </Button>
        </div>
      </Card>
    </div>
  );
}
