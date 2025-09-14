import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

  // Process file for quiz with page selection
  async processFileForQuiz(file, pageNumbers = []) {
    try {
      console.log("🚀 API: Starting processFileForQuiz");
      console.log("📁 File:", file.name, "Size:", file.size);
      console.log("📄 Page numbers:", pageNumbers);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", JSON.stringify(pageNumbers));

      console.log("📤 Sending POST request to /api/process-file-quiz");

      const response = await this.api.post("/api/process-file-quiz", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minute timeout
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Quiz upload progress: ${progress}%`);
        },
      });

      console.log("✅ API: Response received:", response.status);
      console.log("📋 Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("💥 API Error in processFileForQuiz:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
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

  // Interactive Quiz API methods
  async startQuiz(text) {
    try {
      const response = await this.api.post("/api/start-quiz", {
        text: text,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async submitAnswer(sessionId, questionIndex, selectedAnswer) {
    try {
      const response = await this.api.post(`/api/quiz/${sessionId}/answer`, {
        questionIndex: questionIndex,
        selectedAnswer: selectedAnswer,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getNextQuestion(sessionId) {
    try {
      const response = await this.api.post(
        `/api/quiz/${sessionId}/next-question`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async endQuiz(sessionId) {
    try {
      const response = await this.api.post(`/api/quiz/${sessionId}/end`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Materials Management API methods
  async uploadMaterial(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.api.post("/api/upload-material", formData, {
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

  async getMaterials() {
    try {
      const response = await this.api.get("/api/materials");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async generateSummary(materialId, selectedPages = null) {
    try {
      const response = await this.api.post(
        `/api/materials/${materialId}/summary`,
        {
          selectedPages: selectedPages,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSummary(materialId) {
    try {
      const response = await this.api.get(
        `/api/materials/${materialId}/summary`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteSummary(materialId) {
    try {
      const response = await this.api.delete(
        `/api/materials/${materialId}/summary`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get page preview
  async getPagePreview(file, pageNumber) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumber", pageNumber.toString());

      const response = await this.api.post("/api/page-preview", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout for preview
      });

      return response.data;
    } catch (error) {
      throw error;
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

  // ElevenLabs Voice Management
  async getVoices() {
    const response = await this.api.get("/api/elevenlabs/voices");
    return response.data;
  }

  async setVoice(voiceId) {
    const response = await this.api.post("/api/elevenlabs/set-voice", {
      voiceId,
    });
    return response.data;
  }

  // ElevenLabs Testing Methods
  async testElevenLabs() {
    const response = await this.api.get("/api/elevenlabs/test");
    return response.data;
  }

  async diagnosElevenLabs() {
    const response = await this.api.get("/api/elevenlabs/diagnose");
    return response.data;
  }

  async testElevenLabsSpeech(text) {
    const response = await this.api.post(
      "/api/elevenlabs/test-speech",
      { text },
      {
        responseType: "blob",
        timeout: 60000, // 1 minute timeout for audio generation
      }
    );
    return response;
  }
}

// Export singleton instance
export default new ApiService();
