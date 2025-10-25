import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, Play, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function Modeling() {
  const [model, setModel] = useState("");
  const [targetVariable, setTargetVariable] = useState("");
  const [epochs, setEpochs] = useState([100]);
  const [learningRate, setLearningRate] = useState([0.001]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleTrain = () => {
    setIsTraining(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast({
            title: "Entrenamiento completado",
            description: `Modelo ${model} entrenado exitosamente con PyTorch`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modelado ML</h1>
        <p className="mt-2 text-muted-foreground">
          Configura y entrena modelos con PyTorch y Scikit-learn
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Configuración del Modelo</h3>
              <p className="text-sm text-muted-foreground">Ajusta los hiperparámetros</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model-type">Tipo de Modelo</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-type">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neural-network">Red Neuronal (PyTorch)</SelectItem>
                  <SelectItem value="random-forest">Random Forest (Scikit-learn)</SelectItem>
                  <SelectItem value="svm">Support Vector Machine</SelectItem>
                  <SelectItem value="gradient-boost">Gradient Boosting</SelectItem>
                  <SelectItem value="linear-regression">Regresión Lineal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epochs">Épocas: {epochs[0]}</Label>
              <Slider
                id="epochs"
                min={10}
                max={500}
                step={10}
                value={epochs}
                onValueChange={setEpochs}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning-rate">
                Learning Rate: {learningRate[0].toFixed(4)}
              </Label>
              <Slider
                id="learning-rate"
                min={0.0001}
                max={0.1}
                step={0.0001}
                value={learningRate}
                onValueChange={setLearningRate}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input id="batch-size" type="number" defaultValue="32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-split">Test Split (%)</Label>
                <Input id="test-split" type="number" defaultValue="20" />
              </div>
            </div>

            {isTraining && (
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Entrenando modelo...</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleTrain}
                disabled={!model || isTraining}
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                Entrenar Modelo
              </Button>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Guardar Config
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Métricas del Modelo</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">Precisión</p>
              <p className="text-2xl font-bold text-primary">87.3%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">Recall</p>
              <p className="text-2xl font-bold text-secondary">84.7%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">F1-Score</p>
              <p className="text-2xl font-bold text-accent">85.9%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">Loss</p>
              <p className="text-2xl font-bold">0.342</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Configuración de Variables</h3>
        
        <div className="mb-6 space-y-2">
          <Label htmlFor="target-variable" className="text-base font-semibold">
            Variable Objetivo a Predecir
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Selecciona la variable que el modelo debe aprender a predecir
          </p>
          <Select value={targetVariable} onValueChange={setTargetVariable}>
            <SelectTrigger id="target-variable" className="bg-primary/5 border-primary/20">
              <SelectValue placeholder="Selecciona la variable objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calificacion-final">Calificación Final</SelectItem>
              <SelectItem value="aprobado">Aprobado/Reprobado</SelectItem>
              <SelectItem value="calificacion-siguiente">Calificación Siguiente Periodo</SelectItem>
              <SelectItem value="riesgo-desercion">Riesgo de Deserción</SelectItem>
              <SelectItem value="nivel-rendimiento">Nivel de Rendimiento</SelectItem>
              <SelectItem value="promedio-final">Promedio Final</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="mb-4 text-base font-semibold">Features (Variables Predictoras)</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Selecciona las características que el modelo usará para hacer predicciones
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {["Calificación Anterior", "Asistencia", "Participación", "Tareas Entregadas", "Exámenes", "Proyectos", "Comportamiento", "Tiempo de Estudio"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-soft hover:border-primary/30">
                <input type="checkbox" defaultChecked className="rounded border-primary/30 text-primary focus:ring-primary" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
