const axios = require("axios");

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = "https://api.elevenlabs.io/v1";
    this.defaultVoiceId =
      process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"; // Adam voice (more basic)
    this.isAvailable = false;
    this.initializeElevenLabs();
  }

  async initializeElevenLabs() {
    if (this.apiKey) {
      try {
        // Test API connection by getting voices
        const response = await axios.get(`${this.baseUrl}/voices`, {
          headers: {
            "xi-api-key": this.apiKey,
          },
          timeout: 5000,
        });

        if (response.status === 200 && response.data.voices) {
          this.isAvailable = true;
          console.log("✅ ElevenLabs API initialized");
          console.log(`🎤 Available voices: ${response.data.voices.length}`);
        }
      } catch (error) {
        console.log("ℹ️ ElevenLabs not available:", error.message);
        console.log("💡 Set ELEVENLABS_API_KEY to use text-to-speech");
        this.isAvailable = false;
      }
    } else {
      console.log("ℹ️ ElevenLabs API key not found");
      console.log(
        "💡 Set ELEVENLABS_API_KEY environment variable for text-to-speech"
      );
    }
  }

  async getVoices() {
    if (!this.isAvailable) {
      throw new Error("ElevenLabs service is not available");
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          "xi-api-key": this.apiKey,
        },
        timeout: 10000,
      });

      if (response.status === 200 && response.data.voices) {
        return {
          success: true,
          voices: response.data.voices.map((voice) => ({
            voice_id: voice.voice_id,
            name: voice.name,
            category: voice.category,
            description: voice.description,
            labels: voice.labels,
            preview_url: voice.preview_url,
            accent: voice.labels?.accent || "Unknown",
            age: voice.labels?.age || "Unknown",
            gender: voice.labels?.gender || "Unknown",
            use_case: voice.labels?.use_case || "Unknown",
          })),
        };
      }

      throw new Error("Invalid response from ElevenLabs voices API");
    } catch (error) {
      console.error("Error fetching voices:", error.message);
      throw new Error(`Failed to fetch voices: ${error.message}`);
    }
  }

  setVoiceId(voiceId) {
    console.log(`🎤 Changing voice from ${this.defaultVoiceId} to ${voiceId}`);
    this.defaultVoiceId = voiceId;
  }

  async generateSpeech(text, voiceSettings = null) {
    if (!this.isAvailable) {
      throw new Error("ElevenLabs service is not available");
    }

    try {
      console.log(`🎤 Generating speech with ElevenLabs...`);
      console.log(`🔍 Using voice ID: ${this.defaultVoiceId}`);
      console.log(
        `🔍 API URL: ${this.baseUrl}/text-to-speech/${this.defaultVoiceId}`
      );
      console.log(
        `🔍 API Key preview: ${
          this.apiKey ? this.apiKey.substring(0, 8) + "..." : "NOT SET"
        }`
      );

      // Use multilingual model for Polish support
      const payload = {
        text: text,
        model_id: "eleven_multilingual_v2", // Multilingual model supports Polish
        voice_settings: voiceSettings || {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.5,
        },
      };

      console.log(`🔍 Request payload:`, JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${this.defaultVoiceId}`,
        payload,
        {
          headers: {
            "xi-api-key": this.apiKey,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          responseType: "arraybuffer",
          timeout: 30000, // Shorter timeout for testing
        }
      );

      console.log(`🎤 ElevenLabs response status: ${response.status}`);
      console.log(`🎤 Response headers:`, response.headers);

      if (response.status === 200) {
        return {
          audioBuffer: response.data,
          mimeType: "audio/mpeg",
          success: true,
        };
      } else {
        throw new Error(`ElevenLabs API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("🚨 ElevenLabs API Error Details:");
      console.error("- Message:", error.message);
      console.error("- Status:", error.response?.status);
      console.error("- Status Text:", error.response?.statusText);
      console.error("- Response Data:", error.response?.data);
      console.error("- Request URL:", error.config?.url);
      console.error("- Request Headers:", error.config?.headers);

      throw new Error(
        `Błąd generowania mowy: ${error.response?.status || error.message} - ${
          error.response?.statusText || "Unknown error"
        }`
      );
    }
  }

  async generateLecture(lectureData) {
    if (!this.isAvailable) {
      console.log("ElevenLabs not available, returning text-only lecture");
      return {
        ...lectureData,
        audioAvailable: false,
        message:
          "Audio generation not available - ElevenLabs API key not configured",
      };
    }

    try {
      // Use the full script if available, otherwise combine sections
      let fullScript = lectureData.script;

      if (!fullScript && lectureData.sections) {
        fullScript = lectureData.sections
          .map((section) => section.content)
          .join("\n\n");
      }

      if (!fullScript) {
        throw new Error("No script content found for lecture");
      }

      console.log(
        `🎤 Generating lecture audio (${fullScript.length} characters)`
      );

      // Generate audio for the full script
      const audioResult = await this.generateSpeech(fullScript);

      return {
        ...lectureData,
        audioAvailable: true,
        audioBuffer: audioResult.audioBuffer,
        audioMimeType: audioResult.mimeType,
        audioSize: audioResult.audioBuffer.byteLength,
        message: "Lecture audio generated successfully",
      };
    } catch (error) {
      console.error("Error generating lecture audio:", error.message);
      return {
        ...lectureData,
        audioAvailable: false,
        error: error.message,
        message: "Failed to generate audio, text-only version available",
      };
    }
  }

  async getVoices() {
    if (!this.isAvailable) {
      return { available: false, voices: [] };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          "xi-api-key": this.apiKey,
        },
      });

      return {
        available: true,
        voices: response.data.voices.map((voice) => ({
          voice_id: voice.voice_id,
          name: voice.name,
          category: voice.category,
          language: voice.labels?.language || "unknown",
        })),
      };
    } catch (error) {
      console.error("Error fetching voices:", error.message);
      return { available: false, error: error.message };
    }
  }

  async healthCheck() {
    try {
      if (!this.apiKey) {
        return {
          available: false,
          service: "ElevenLabs",
          error: "API key not configured",
        };
      }

      const response = await axios.get(`${this.baseUrl}/user`, {
        headers: {
          "xi-api-key": this.apiKey,
        },
        timeout: 5000,
      });

      return {
        available: true,
        service: "ElevenLabs",
        status: "healthy",
        characterLimit: response.data.subscription?.character_limit,
        charactersUsed: response.data.subscription?.character_count,
      };
    } catch (error) {
      return {
        available: false,
        service: "ElevenLabs",
        error: error.message,
      };
    }
  }

  // Utility function to estimate reading time
  estimateReadingTime(text) {
    const wordsPerMinute = 150; // Average reading speed
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  // Clean text for better speech synthesis
  cleanTextForSpeech(text) {
    return text
      .replace(/[^\w\s\.,!?;:-]/g, "") // Remove special characters except basic punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }
}

module.exports = new ElevenLabsService();
