// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface DataStats {
  total_rows: number;
  total_columns: number;
  null_values: number;
  columns: string[];
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  loss?: number;
}

interface PredictionResult {
  predictions: number[];
  confidence: number[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Subir archivo CSV
  async uploadFile(file: File): Promise<ApiResponse<DataStats>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Obtener vista previa de datos
  async getDataPreview(limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/data/preview?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting data preview:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Limpiar datos (pandas operations)
  async cleanData(options: {
    fillMissing?: boolean;
    removeOutliers?: boolean;
    fillMethod?: 'mean' | 'median' | 'mode';
  }): Promise<ApiResponse<DataStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/data/clean`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cleaning data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Entrenar modelo
  async trainModel(config: {
    model_type: 'neural-network' | 'random-forest' | 'svm' | 'gradient-boost' | 'linear-regression';
    target_variable: string;
    features: string[];
    epochs?: number;
    learning_rate?: number;
    batch_size?: number;
    test_split?: number;
  }): Promise<ApiResponse<{ job_id: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/model/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error training model:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Obtener estado del entrenamiento
  async getTrainingStatus(jobId: string): Promise<ApiResponse<{
    status: 'pending' | 'training' | 'completed' | 'failed';
    progress: number;
    metrics?: ModelMetrics;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/model/status/${jobId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting training status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Hacer predicciones
  async predict(data: any[]): Promise<ApiResponse<PredictionResult>> {
    try {
      const response = await fetch(`${this.baseUrl}/model/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making predictions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Obtener métricas del modelo
  async getModelMetrics(): Promise<ApiResponse<ModelMetrics>> {
    try {
      const response = await fetch(`${this.baseUrl}/model/metrics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting model metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Obtener estadísticas de datos
  async getDataStats(): Promise<ApiResponse<DataStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/data/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting data stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Exportar modelo entrenado
  async exportModel(format: 'pytorch' | 'onnx' | 'pickle'): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/model/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting model:', error);
      return null;
    }
  }

  // Probar conexión con backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;