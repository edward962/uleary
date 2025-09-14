const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeGemini();
  }

  initializeGemini() {
    if (process.env.GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        console.log("✅ Gemini (Google) API initialized");
      } catch (error) {
        console.warn("⚠️ Gemini initialization failed:", error.message);
        this.genAI = null;
        this.model = null;
      }
    } else {
      console.log("ℹ️ Gemini API key not found, using mock responses");
      console.log("💡 Set GEMINI_API_KEY environment variable to use real AI");
    }
  }

  async generateContent(text, processingType) {
    // For testing purposes, let's try Gemini first, then fall back to mock
    if (!this.model) {
      console.log("Using mock AI content generation - Gemini not initialized");
      return this.generateMockContent(text, processingType);
    }

    try {
      const prompt = this.buildPrompt(text, processingType);

      console.log(`🤖 Generating ${processingType} with Gemini (Google)`);

      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Jesteś asystentem edukacyjnym specjalizującym się w tworzeniu materiałów do nauki w języku polskim.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      });

      const response = await result.response;
      const textResult = response.text();
      return this.formatResult(textResult, processingType);
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      console.log("Falling back to mock content generation");
      return this.generateMockContent(text, processingType);
    }
  }

  buildPrompt(text, processingType) {
    const baseText = `Oto materiał do przetworzenia:\n\n${text}\n\n`;

    switch (processingType) {
      case "summary":
        return (
          baseText +
          `Stwórz zwięzłe i przejrzyste podsumowanie tego materiału w języku polskim.
Podsumowanie powinno:
- Zawierać najważniejsze informacje i kluczowe punkty
- Być podzielone na logiczne sekcje
- Być napisane prostym i zrozumiałym językiem
- Mieć długość około 200-300 słów

WAŻNE: Odpowiedz TYLKO w formacie JSON, bez dodatkowych komentarzy:
{
  "title": "Tytuł podsumowania",
  "summary": "Treść podsumowania",
  "keyPoints": ["punkt 1", "punkt 2", "punkt 3"]
}`
        );

      case "quiz":
        return (
          baseText +
          `Stwórz quiz wielokrotnego wyboru na podstawie tego materiału w języku polskim.
Quiz powinien:
- Zawierać 5-6 pytań różnej trudności
- Każde pytanie ma 4 opcje odpowiedzi (A, B, C, D)
- Tylko jedna odpowiedź jest prawidłowa
- Pytania powinny sprawdzać zrozumienie materiału

WAŻNE: Odpowiedz TYLKO w formacie JSON, bez dodatkowych komentarzy:
{
  "title": "Tytuł quizu",
  "questions": [
    {
      "question": "Treść pytania?",
      "options": {
        "A": "Opcja A",
        "B": "Opcja B",
        "C": "Opcja C",
        "D": "Opcja D"
      },
      "correctAnswer": "A",
      "explanation": "Wyjaśnienie dlaczego ta odpowiedź jest prawidłowa"
    }
  ]
}`
        );

      case "lecture":
        return (
          baseText +
          `Stwórz skrypt lektora/wykładu na podstawie tego materiału w języku polskim.
Skrypt powinien:
- Być napisany w sposób naturalny, jakby lektor opowiadał materiał
- Zawierać wprowadzenie, główną część i podsumowanie
- Używać prostego języka i przykładów
- Być podzielony na sekcje z czasem trwania
- Mieć długość około 3-5 minut czytania

WAŻNE: Odpowiedz TYLKO w formacie JSON, bez dodatkowych komentarzy:
{
  "title": "Tytuł wykładu",
  "duration": "5 minut",
  "script": "Pełny tekst do przeczytania przez lektora w sposób naturalny i płynny",
  "sections": [
    {
      "title": "Wprowadzenie",
      "content": "Tekst do przeczytania przez lektora",
      "duration": "1 minuta"
    },
    {
      "title": "Główna część",
      "content": "Tekst głównej części",
      "duration": "3 minuty"
    },
    {
      "title": "Podsumowanie",
      "content": "Tekst podsumowania",
      "duration": "1 minuta"
    }
  ]
}`
        );

      default:
        throw new Error(`Nieznany typ przetwarzania: ${processingType}`);
    }
  }

  formatResult(result, processingType) {
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanResult = result;

      // Remove ```json and ``` markers
      cleanResult = cleanResult.replace(/```json\s*/g, "");
      cleanResult = cleanResult.replace(/```\s*/g, "");

      // Try to find JSON content between { and }
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResult = jsonMatch[0];
      }

      // Try to parse as JSON
      const parsed = JSON.parse(cleanResult);
      return {
        type: processingType,
        data: parsed,
        formatted: true,
      };
    } catch (error) {
      console.warn("Failed to parse Gemini response as JSON:", error.message);

      // If JSON parsing fails, return as plain text with structure
      return {
        type: processingType,
        data: this.createFallbackStructure(result, processingType),
        formatted: true,
      };
    }
  }

  createFallbackStructure(text, processingType) {
    switch (processingType) {
      case "summary":
        return {
          title: "Podsumowanie materiału",
          summary: text,
          keyPoints: ["Główne informacje z materiału"],
        };
      case "quiz":
        return {
          title: "Quiz z materiału",
          questions: [
            {
              question:
                "Na podstawie materiału - jakie jest główne zagadnienie?",
              options: {
                A: "Opcja A",
                B: "Opcja B",
                C: "Opcja C",
                D: "Opcja D",
              },
              correctAnswer: "A",
              explanation: text.substring(0, 200) + "...",
            },
          ],
        };
      case "lecture":
        return {
          title: "Wykład na podstawie materiału",
          duration: "5 minut",
          script: text,
          sections: [
            {
              title: "Treść wykładu",
              content: text,
              duration: "5 minut",
            },
          ],
        };
      default:
        return { content: text };
    }
  }

  // Fallback method for when Gemini is not available
  generateMockContent(text, processingType) {
    console.log("Using mock AI content generation");

    switch (processingType) {
      case "summary":
        return {
          type: "summary",
          data: {
            title: "Podsumowanie materiału",
            summary:
              "To jest przykładowe podsumowanie wygenerowane przez AI. W rzeczywistej implementacji tutaj byłaby analiza dostarczonego materiału przez Google Gemini.",
            keyPoints: [
              "Główny punkt 1 z materiału",
              "Kluczowa informacja 2",
              "Ważny wniosek 3",
            ],
          },
          formatted: true,
        };

      case "quiz":
        return {
          type: "quiz",
          data: {
            title: "Quiz z materiału",
            questions: [
              {
                question: "Jakie jest główne zagadnienie omawiane w materiale?",
                options: {
                  A: "Opcja pierwsza",
                  B: "Opcja druga (prawidłowa)",
                  C: "Opcja trzecia",
                  D: "Opcja czwarta",
                },
                correctAnswer: "B",
                explanation:
                  "Ta odpowiedź jest prawidłowa na podstawie materiału...",
              },
            ],
          },
          formatted: true,
        };

      case "lecture":
        return {
          type: "lecture",
          data: {
            title: "Wykład na podstawie materiału",
            duration: "5 minut",
            script:
              "Witamy na dzisiejszym wykładzie. Omówimy kluczowe zagadnienia przedstawione w materiale. Główna treść wykładu zostałaby tutaj wygenerowana na podstawie analizy dostarczonego materiału przez Google Gemini. Podsumowując, omówiliśmy najważniejsze aspekty materiału.",
            sections: [
              {
                title: "Wprowadzenie",
                content:
                  "Witamy na dzisiejszym wykładzie. Omówimy kluczowe zagadnienia przedstawione w materiale.",
                duration: "1 minuta",
              },
              {
                title: "Główna część",
                content:
                  "Główna treść wykładu zostałaby tutaj wygenerowana na podstawie analizy dostarczonego materiału przez Google Gemini.",
                duration: "3 minuty",
              },
              {
                title: "Podsumowanie",
                content:
                  "Podsumowując, omówiliśmy najważniejsze aspekty materiału.",
                duration: "1 minuta",
              },
            ],
          },
          formatted: true,
        };

      default:
        throw new Error(`Nieznany typ przetwarzania: ${processingType}`);
    }
  }

  // Generate quiz questions on-demand (for interactive quiz)
  async generateQuizQuestions(text, questionCount = 1) {
    if (!this.model) {
      console.log("Using mock quiz questions - Gemini not initialized");
      return this.generateMockQuizQuestions(text, questionCount);
    }

    try {
      console.log(
        `🤖 Generating ${questionCount} quiz question(s) with Gemini`
      );

      // Add small delay to help with rate limiting (only for subsequent questions)
      if (questionCount === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }

      // Limit text size to avoid rate limiting - use first 3000 characters
      const limitedText =
        text.length > 3000 ? text.substring(0, 3000) + "..." : text;

      const prompt =
        `Oto materiał do przetworzenia:\n\n${limitedText}\n\n` +
        `Stwórz ${questionCount} pytań wielokrotnego wyboru na podstawie tego materiału w języku polskim.
Każde pytanie powinno:
- Być różne od poprzednich pytań na ten temat
- Mieć 4 opcje odpowiedzi (A, B, C, D)
- Mieć tylko jedną prawidłową odpowiedź
- Sprawdzać zrozumienie materiału
- Być jasne i precyzyjne

WAŻNE: Odpowiedz TYLKO w formacie JSON, bez dodatkowych komentarzy:
{
  "questions": [
    {
      "question": "Treść pytania?",
      "options": {
        "A": "Opcja A",
        "B": "Opcja B", 
        "C": "Opcja C",
        "D": "Opcja D"
      },
      "correctAnswer": "A",
      "explanation": "Wyjaśnienie dlaczego ta odpowiedź jest prawidłowa"
    }
  ]
}`;

      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Jesteś asystentem edukacyjnym specjalizującym się w tworzeniu pytań quizowych w języku polskim.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 800, // Reduced to help with rate limiting
          temperature: 0.5, // Lower temperature for more consistent questions
        },
      });

      const response = await result.response;
      const textResult = response.text();
      console.log(
        "🤖 [AI] Raw Gemini response:",
        textResult.substring(0, 500) + "..."
      );

      const parsed = this.parseQuizResponse(textResult);
      console.log("🔄 [AI] Parsed response:", JSON.stringify(parsed, null, 2));

      if (!parsed.questions || parsed.questions.length === 0) {
        console.log(
          "⚠️ [AI] No questions in parsed response, falling back to mock"
        );
        return this.generateMockQuizQuestions(text, questionCount);
      }

      console.log(
        `✅ [AI] Successfully generated ${parsed.questions.length} questions`
      );
      return parsed.questions || [];
    } catch (error) {
      console.error(
        "💥 [AI] Gemini API Error (quiz questions):",
        error.message
      );
      console.error("🔍 [AI] Error details:", error);
      console.log("🔄 [AI] Falling back to mock quiz questions");
      return this.generateMockQuizQuestions(text, questionCount);
    }
  }

  // Parse quiz response from Gemini
  parseQuizResponse(result) {
    try {
      console.log("🔧 [AI] Starting to parse quiz response...");
      // Clean the response - remove markdown code blocks if present
      let cleanResult = result;
      cleanResult = cleanResult.replace(/```json\s*/g, "");
      cleanResult = cleanResult.replace(/```\s*/g, "");

      console.log(
        "🧹 [AI] Cleaned result:",
        cleanResult.substring(0, 300) + "..."
      );

      // Try to find JSON content between { and }
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResult = jsonMatch[0];
        console.log(
          "🎯 [AI] Found JSON match:",
          cleanResult.substring(0, 200) + "..."
        );
      } else {
        console.log("⚠️ [AI] No JSON pattern found in response");
      }

      const parsed = JSON.parse(cleanResult);
      console.log(
        "✅ [AI] Successfully parsed JSON, questions count:",
        parsed.questions?.length || 0
      );
      return parsed;
    } catch (error) {
      console.warn(
        "💥 [AI] Failed to parse Gemini quiz response as JSON:",
        error.message
      );
      console.log("📋 [AI] Raw response that failed to parse:", result);
      return { questions: [] };
    }
  }

  // Generate mock quiz questions for fallback
  generateMockQuizQuestions(text, questionCount = 1) {
    console.log(
      `🎭 [AI] Generating ${questionCount} mock quiz questions as fallback`
    );
    const mockQuestions = [];

    // Extract key concepts from the text for more realistic questions
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = [
      "i",
      "a",
      "w",
      "z",
      "na",
      "do",
      "po",
      "o",
      "że",
      "się",
      "lub",
      "oraz",
      "może",
      "to",
      "jest",
      "są",
      "można",
      "także",
      "przez",
      "tej",
      "tym",
      "tej",
    ];
    const keyWords = words
      .filter((word) => word.length > 4 && !commonWords.includes(word))
      .slice(0, 20);

    // Basic concept extraction
    const sentences = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);

    const questionTemplates = [
      "Zgodnie z materiałem, co dotyczy",
      "Na podstawie tekstu, które stwierdzenie jest prawdziwe odnośnie",
      "Materiał wskazuje, że głównym aspektem",
      "W kontekście omawianego tematu, co charakteryzuje",
      "Według przedstawionych informacji",
    ];

    for (let i = 0; i < questionCount; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      const keyword = keyWords[i % keyWords.length] || "omawianego zagadnienia";

      // Create more realistic options based on text
      const randomSentence =
        sentences[i % sentences.length] ||
        "podstawowych zagadnień omówionych w materiale";
      const concept1 =
        keyWords[(i * 2) % keyWords.length] || "pierwszego aspektu";
      const concept2 =
        keyWords[(i * 2 + 1) % keyWords.length] || "drugiego aspektu";

      mockQuestions.push({
        question: `${template} ${keyword}?`,
        options: {
          A: `Odnosi się do ${concept1} i powiązanych zagadnień`,
          B: `Dotyczy ${concept2} oraz związanych z nim procesów`,
          C: `Koncentruje się na ${randomSentence.substring(0, 50)}...`,
          D: `Obejmuje inne aspekty niż wymienione powyżej`,
        },
        correctAnswer: ["A", "B", "C"][i % 3],
        explanation: `Na podstawie analizy materiału, prawidłowa odpowiedź odnosi się do kluczowych konceptów omówionych w tekście.`,
      });
    }

    console.log(`✅ [AI] Generated ${mockQuestions.length} mock questions`);
    return mockQuestions;
  }

  // Check if Gemini service is healthy
  async healthCheck() {
    try {
      if (!this.model) {
        return {
          available: false,
          service: "Gemini (Google)",
          error: "API key not configured",
        };
      }

      // Simple test request to Gemini
      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: "test" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 5,
        },
      });

      await result.response;

      return {
        available: true,
        service: "Gemini (Google)",
        model: "gemini-1.5-flash",
        status: "healthy",
      };
    } catch (error) {
      return {
        available: false,
        service: "Gemini (Google)",
        error: error.message,
      };
    }
  }
}

module.exports = new AIService();
