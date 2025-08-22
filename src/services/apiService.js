import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes for AI processing
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for debugging
    this.api.interceptors.request.use(
      (config) => {
        console.log("API Request:", config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log("API Response:", response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error(
          "API Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(this.handleError(error));
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.error || "Błąd serwera",
        status: error.response.status,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message:
          "Brak połączenia z serwerem. Sprawdź czy backend jest uruchomiony.",
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || "Nieznany błąd",
        status: -1,
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Process file upload
  async processFile(file, processingType) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("processingType", processingType);

      const response = await this.api.post("/api/process-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${progress}%`);
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Process text input
  async processText(text, processingType) {
    try {
      const response = await this.api.post("/api/process-text", {
        text: text,
        processingType: processingType,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic processing method that determines the type
  async processContent(contentType, content, processingType) {
    switch (contentType) {
      case "file":
        return await this.processFile(content, processingType);
      case "text":
        return await this.processText(content, processingType);
      default:
        throw new Error(`Nieznany typ zawartości: ${contentType}`);
    }
  }

  // Get processing type label in Polish
  getProcessingTypeLabel(type) {
    const labels = {
      summary: "podsumowania",
      quiz: "quizu",
      lecture: "lektora",
    };
    return labels[type] || type;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export singleton instance
export default new ApiService();
