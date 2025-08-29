const Anthropic = require("@anthropic-ai/sdk");

class AIService {
  constructor() {
    this.anthropic = null;
    this.initializeClaude();
  }

  initializeClaude() {
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        console.log("✅ Claude (Anthropic) API initialized");
      } catch (error) {
        console.warn("⚠️ Claude initialization failed:", error.message);
        this.anthropic = null;
      }
    } else {
      console.log("ℹ️ Claude API key not found, using mock responses");
      console.log(
        "💡 Set ANTHROPIC_API_KEY environment variable to use real AI"
      );
    }
  }

  async generateContent(text, processingType) {
    // For testing purposes, let's try Claude first, then fall back to mock
    if (!this.anthropic) {
      console.log("Using mock AI content generation - Claude not initialized");
      return this.generateMockContent(text, processingType);
    }

    try {
      const prompt = this.buildPrompt(text, processingType);

      console.log(`🤖 Generating ${processingType} with Claude (Anthropic)`);

      const completion = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        temperature: 0.7,
        system:
          "Jesteś asystentem edukacyjnym specjalizującym się w tworzeniu materiałów do nauki w języku polskim.",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const result = completion.content[0].text;
      return this.formatResult(result, processingType);
    } catch (error) {
      console.error("Claude API Error:", error.message);
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
      console.warn("Failed to parse OpenAI response as JSON:", error.message);

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

  // Fallback method for when OpenAI is not available
  generateMockContent(text, processingType) {
    console.log("Using mock AI content generation");

    switch (processingType) {
      case "summary":
        return {
          type: "summary",
          data: {
            title: "Podsumowanie materiału",
            summary:
              "To jest przykładowe podsumowanie wygenerowane przez AI. W rzeczywistej implementacji tutaj byłaby analiza dostarczonego materiału przez OpenAI GPT-3.5-turbo.",
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
              "Witamy na dzisiejszym wykładzie. Omówimy kluczowe zagadnienia przedstawione w materiale. Główna treść wykładu zostałaby tutaj wygenerowana na podstawie analizy dostarczonego materiału przez OpenAI. Podsumowując, omówiliśmy najważniejsze aspekty materiału.",
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
                  "Główna treść wykładu zostałaby tutaj wygenerowana na podstawie analizy dostarczonego materiału przez OpenAI.",
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
    if (!this.anthropic) {
      console.log("Using mock quiz questions - Claude not initialized");
      return this.generateMockQuizQuestions(text, questionCount);
    }

    try {
      console.log(
        `🤖 Generating ${questionCount} quiz question(s) with Claude`
      );

      const prompt =
        `Oto materiał do przetworzenia:\n\n${text}\n\n` +
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

      const completion = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        temperature: 0.8, // Higher temperature for variety
        system:
          "Jesteś asystentem edukacyjnym specjalizującym się w tworzeniu pytań quizowych w języku polskim.",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const result = completion.content[0].text;
      const parsed = this.parseQuizResponse(result);

      return parsed.questions || [];
    } catch (error) {
      console.error("Claude API Error (quiz questions):", error.message);
      console.log("Falling back to mock quiz questions");
      return this.generateMockQuizQuestions(text, questionCount);
    }
  }

  // Parse quiz response from Claude
  parseQuizResponse(result) {
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanResult = result;
      cleanResult = cleanResult.replace(/```json\s*/g, "");
      cleanResult = cleanResult.replace(/```\s*/g, "");

      // Try to find JSON content between { and }
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResult = jsonMatch[0];
      }

      return JSON.parse(cleanResult);
    } catch (error) {
      console.warn(
        "Failed to parse Claude quiz response as JSON:",
        error.message
      );
      return { questions: [] };
    }
  }

  // Generate mock quiz questions for fallback
  generateMockQuizQuestions(text, questionCount = 1) {
    const mockQuestions = [];

    for (let i = 0; i < questionCount; i++) {
      mockQuestions.push({
        question: `Pytanie ${
          i + 1
        } na podstawie materiału - jakie jest główne zagadnienie?`,
        options: {
          A: "Pierwsza opcja odpowiedzi",
          B: "Druga opcja odpowiedzi (prawdopodobnie poprawna)",
          C: "Trzecia opcja odpowiedzi",
          D: "Czwarta opcja odpowiedzi",
        },
        correctAnswer: "B",
        explanation:
          "To jest przykładowe wyjaśnienie na podstawie dostarczonego materiału.",
      });
    }

    return mockQuestions;
  }

  // Check if Claude service is healthy
  async healthCheck() {
    try {
      if (!this.anthropic) {
        return {
          available: false,
          service: "Claude (Anthropic)",
          error: "API key not configured",
        };
      }

      // Simple test request to Claude
      const testResponse = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 5,
        messages: [{ role: "user", content: "test" }],
      });

      return {
        available: true,
        service: "Claude (Anthropic)",
        model: "claude-3-haiku-20240307",
        status: "healthy",
      };
    } catch (error) {
      return {
        available: false,
        service: "Claude (Anthropic)",
        error: error.message,
      };
    }
  }
}

module.exports = new AIService();
