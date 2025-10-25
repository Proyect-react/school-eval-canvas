import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

const studentPerformance = [
  { estudiante: "Est1", matematicas: 85, ciencias: 78, literatura: 92 },
  { estudiante: "Est2", matematicas: 92, ciencias: 88, literatura: 85 },
  { estudiante: "Est3", matematicas: 78, ciencias: 82, literatura: 88 },
  { estudiante: "Est4", matematicas: 88, ciencias: 92, literatura: 90 },
  { estudiante: "Est5", matematicas: 95, ciencias: 90, literatura: 94 },
];

const gradeDistribution = [
  { name: "Excelente", value: 35, color: "hsl(var(--secondary))" },
  { name: "Muy Bueno", value: 28, color: "hsl(var(--primary))" },
  { name: "Bueno", value: 22, color: "hsl(var(--accent))" },
  { name: "Regular", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Bajo", value: 3, color: "hsl(var(--destructive))" },
];

const correlationData = Array.from({ length: 50 }, () => ({
  asistencia: Math.random() * 100,
  calificacion: Math.random() * 100,
}));

export default function Visualization() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visualización de Datos</h1>
          <p className="mt-2 text-muted-foreground">
            Análisis gráfico con matplotlib/seaborn style
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Gráficos
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Rendimiento por Materia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="estudiante" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar dataKey="matematicas" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ciencias" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="literatura" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Distribución de Niveles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tendencia Temporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="estudiante" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="matematicas"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                type="monotone"
                dataKey="ciencias"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--secondary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Correlación Asistencia-Calificación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" dataKey="asistencia" name="Asistencia" unit="%" className="text-xs" />
              <YAxis type="number" dataKey="calificacion" name="Calificación" className="text-xs" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Estudiantes" data={correlationData} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
