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
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "https://your-frontend-domain.vercel.app"
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

// Quiz session management
const quizSessions = new Map();

// Start a new quiz session
app.post("/api/start-quiz", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Brak tekstu do przetworzenia" });
    }

    const sessionId = `quiz_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    console.log(`Starting quiz session: ${sessionId}`);

    // Generate initial batch of 3 questions
    const initialQuestions = await aiService.generateQuizQuestions(text, 3);

    const session = {
      id: sessionId,
      sourceText: text,
      questions: initialQuestions,
      score: 0,
      totalAnswered: 0,
      startTime: new Date(),
      isActive: true,
    };

    quizSessions.set(sessionId, session);

    res.json({
      success: true,
      sessionId: sessionId,
      questions: initialQuestions,
      totalQuestions: initialQuestions.length,
      hasMore: true,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    res.status(500).json({
      error: "Błąd podczas tworzenia quizu",
      details: error.message,
    });
  }
});

// Get next question for quiz session
app.post("/api/quiz/:sessionId/next-question", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = quizSessions.get(sessionId);

    if (!session || !session.isActive) {
      return res
        .status(404)
        .json({ error: "Sesja quizu nie została znaleziona lub wygasła" });
    }

    console.log(`Generating next question for session: ${sessionId}`);

    // Generate one new question
    const newQuestions = await aiService.generateQuizQuestions(
      session.sourceText,
      1
    );

    if (newQuestions && newQuestions.length > 0) {
      session.questions.push(...newQuestions);

      res.json({
        success: true,
        question: newQuestions[0],
        questionNumber: session.questions.length,
        hasMore: true,
      });
    } else {
      res.json({
        success: false,
        message: "Nie udało się wygenerować nowego pytania",
        hasMore: false,
      });
    }
  } catch (error) {
    console.error("Error generating next question:", error);
    res.status(500).json({
      error: "Błąd podczas generowania pytania",
      details: error.message,
    });
  }
});

// Submit answer and get feedback
app.post("/api/quiz/:sessionId/answer", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex, selectedAnswer } = req.body;
    const session = quizSessions.get(sessionId);

    if (!session || !session.isActive) {
      return res
        .status(404)
        .json({ error: "Sesja quizu nie została znaleziona" });
    }

    const question = session.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ error: "Pytanie nie zostało znalezione" });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    session.totalAnswered++;
    if (isCorrect) {
      session.score++;
    }

    console.log(
      `Answer submitted for session ${sessionId}: ${
        isCorrect ? "Correct" : "Incorrect"
      }`
    );

    res.json({
      success: true,
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      score: session.score,
      totalAnswered: session.totalAnswered,
      percentage: Math.round((session.score / session.totalAnswered) * 100),
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({
      error: "Błąd podczas sprawdzania odpowiedzi",
      details: error.message,
    });
  }
});

// End quiz session
app.post("/api/quiz/:sessionId/end", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = quizSessions.get(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ error: "Sesja quizu nie została znaleziona" });
    }

    session.isActive = false;
    session.endTime = new Date();

    console.log(`Quiz session ended: ${sessionId}`);

    res.json({
      success: true,
      finalResults: {
        score: session.score,
        totalAnswered: session.totalAnswered,
        percentage:
          session.totalAnswered > 0
            ? Math.round((session.score / session.totalAnswered) * 100)
            : 0,
        duration: Math.round((session.endTime - session.startTime) / 1000), // in seconds
        questionsGenerated: session.questions.length,
      },
    });

    // Clean up session after 1 hour
    setTimeout(() => {
      quizSessions.delete(sessionId);
    }, 3600000);
  } catch (error) {
    console.error("Error ending quiz:", error);
    res.status(500).json({
      error: "Błąd podczas kończenia quizu",
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ULeary Backend API is running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);

  if (NODE_ENV === "production") {
    console.log(
      `🔒 CORS enabled for: ${
        process.env.FRONTEND_URL || "https://your-frontend-domain.vercel.app"
      }`
    );
  }
});
