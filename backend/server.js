const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const aiService = require("./services/aiService");
const fileProcessor = require("./services/fileProcessor");
const elevenLabsService = require("./services/elevenLabsService");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Nieprawidłowy typ pliku. Dozwolone: PDF, DOCX, PPTX"),
        false
      );
    }
  },
});

// Routes

// Health check
app.get("/health", async (req, res) => {
  try {
    const [aiHealth, elevenLabsHealth] = await Promise.all([
      aiService.healthCheck(),
      elevenLabsService.healthCheck(),
    ]);

    res.json({
      status: "OK",
      message: "ULeary Backend API is running",
      services: {
        ai: aiHealth,
        textToSpeech: elevenLabsHealth,
      },
    });
  } catch (error) {
    res.json({
      status: "OK",
      message: "ULeary Backend API is running",
      services: {
        ai: { available: false, error: error.message },
        textToSpeech: { available: false, error: error.message },
      },
    });
  }
});

// AI status check
app.get("/api/ai-status", async (req, res) => {
  try {
    const status = await aiService.healthCheck();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message,
    });
  }
});

// ElevenLabs status check
app.get("/api/elevenlabs-status", async (req, res) => {
  try {
    const status = await elevenLabsService.healthCheck();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message,
    });
  }
});

// Process file upload
app.post("/api/process-file", upload.single("file"), async (req, res) => {
  try {
    const { processingType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Brak pliku do przetworzenia" });
    }

    if (!processingType) {
      return res.status(400).json({ error: "Brak typu przetwarzania" });
    }

    console.log(
      `Processing file: ${file.originalname}, type: ${processingType}`
    );

    // Extract text from file
    const extractedText = await fileProcessor.extractText(file);

    if (!extractedText || extractedText.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Nie udało się wyodrębnić tekstu z pliku" });
    }

    // Generate AI content based on processing type
    let result = await aiService.generateContent(extractedText, processingType);

    // If processing type is lecture, also generate audio with ElevenLabs
    if (processingType === "lecture" && result.data) {
      try {
        const lectureWithAudio = await elevenLabsService.generateLecture(
          result.data
        );
        result.data = lectureWithAudio;
      } catch (error) {
        console.error("Failed to generate lecture audio:", error.message);
        result.data.audioError = error.message;
      }
    }

    res.json({
      success: true,
      processingType,
      fileName: file.originalname,
      result,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      error: "Błąd podczas przetwarzania pliku",
      details: error.message,
    });
  }
});

// Process text input
app.post("/api/process-text", async (req, res) => {
  try {
    const { text, processingType } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Brak tekstu do przetworzenia" });
    }

    if (!processingType) {
      return res.status(400).json({ error: "Brak typu przetwarzania" });
    }

    console.log(`Processing text, type: ${processingType}`);

    // Generate AI content
    let result = await aiService.generateContent(text, processingType);

    // If processing type is lecture, also generate audio with ElevenLabs
    if (processingType === "lecture" && result.data) {
      try {
        const lectureWithAudio = await elevenLabsService.generateLecture(
          result.data
        );
        result.data = lectureWithAudio;
      } catch (error) {
        console.error("Failed to generate lecture audio:", error.message);
        result.data.audioError = error.message;
      }
    }

    res.json({
      success: true,
      processingType,
      result,
    });
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).json({
      error: "Błąd podczas przetwarzania tekstu",
      details: error.message,
    });
  }
});

// Download lecture audio
app.get("/api/download-audio/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // In a real implementation, you would store audio files temporarily
    // and retrieve them by session ID. For now, we'll return an error
    // as audio is embedded in the response.

    res.status(404).json({
      error: "Audio download not implemented yet",
      message: "Audio is currently embedded in the response",
    });
  } catch (error) {
    console.error("Error downloading audio:", error);
    res.status(500).json({
      error: "Błąd podczas pobierania audio",
      details: error.message,
    });
  }
});

// ElevenLabs voices endpoint
app.get("/api/voices", async (req, res) => {
  try {
    const voices = await elevenLabsService.getVoices();
    res.json(voices);
  } catch (error) {
    console.error("Error getting voices:", error);
    res.status(500).json({
      error: "Błąd podczas pobierania głosów",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Plik jest za duży. Maksymalny rozmiar: 50MB" });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Wewnętrzny błąd serwera" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint nie został znaleziony" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ULeary Backend API is running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});
