import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Award, AlertCircle } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

const performanceData = [
  { mes: "Ene", promedio: 78, aprobados: 85 },
  { mes: "Feb", promedio: 82, aprobados: 88 },
  { mes: "Mar", promedio: 79, aprobados: 83 },
  { mes: "Abr", promedio: 85, aprobados: 92 },
  { mes: "May", promedio: 88, aprobados: 94 },
  { mes: "Jun", promedio: 86, aprobados: 91 },
];

const gradeDistribution = [
  { rango: "0-59", cantidad: 12 },
  { rango: "60-69", cantidad: 28 },
  { rango: "70-79", cantidad: 45 },
  { rango: "80-89", cantidad: 62 },
  { rango: "90-100", cantidad: 38 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard General</h1>
        <p className="mt-2 text-muted-foreground">
          Resumen del sistema de calificaciones y análisis ML
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Estudiantes"
          value="1,847"
          icon={Users}
          change="+12% vs mes anterior"
          trend="up"
        />
        <StatCard
          title="Promedio General"
          value="84.2"
          icon={TrendingUp}
          change="+3.5 puntos"
          trend="up"
        />
        <StatCard
          title="Tasa Aprobación"
          value="89.3%"
          icon={Award}
          change="+2.1%"
          trend="up"
        />
        <StatCard
          title="En Riesgo"
          value="127"
          icon={AlertCircle}
          change="-8 estudiantes"
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Evolución de Rendimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="mes" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="promedio" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Promedio"
              />
              <Line 
                type="monotone" 
                dataKey="aprobados" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="% Aprobados"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Distribución de Calificaciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="rango" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar 
                dataKey="cantidad" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
                name="Estudiantes"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Modelos ML Activos</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="font-medium">Predicción de Rendimiento</p>
              <p className="text-sm text-muted-foreground">Random Forest - Precisión: 87.3%</p>
            </div>
            <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Activo
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="font-medium">Detección de Riesgo</p>
              <p className="text-sm text-muted-foreground">Neural Network - Precisión: 92.1%</p>
            </div>
            <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Activo
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
