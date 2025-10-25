import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  RefreshCw 
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
  const [data] = useState(sampleData);
  const [fillMissing, setFillMissing] = useState(false);
  const [removeOutliers, setRemoveOutliers] = useState(false);
  const { toast } = useToast();

  const nullCount = data.reduce((acc, row) => {
    return acc + (row.calif1 === null ? 1 : 0) + (row.calif2 === null ? 1 : 0) + (row.calif3 === null ? 1 : 0);
  }, 0);

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
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Calificación 1</TableHead>
                <TableHead>Calificación 2</TableHead>
                <TableHead>Calificación 3</TableHead>
                <TableHead>Asistencia %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>
                    {row.calif1 === null ? (
                      <span className="text-accent">NULL</span>
                    ) : (
                      row.calif1
                    )}
                  </TableCell>
                  <TableCell>
                    {row.calif2 === null ? (
                      <span className="text-accent">NULL</span>
                    ) : (
                      row.calif2
                    )}
                  </TableCell>
                  <TableCell>
                    {row.calif3 === null ? (
                      <span className="text-accent">NULL</span>
                    ) : (
                      row.calif3
                    )}
                  </TableCell>
                  <TableCell>{row.asistencia}%</TableCell>
                </TableRow>
              ))}
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
