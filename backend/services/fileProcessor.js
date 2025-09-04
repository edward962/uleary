const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

class FileProcessor {
  async extractText(file) {
    try {
      const mimeType = file.mimetype;
      const buffer = file.buffer;

      switch (mimeType) {
        case "application/pdf":
          return await this.extractFromPDF(buffer);

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          return await this.extractFromDOCX(buffer);

        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.ms-powerpoint":
          return await this.extractFromPPTX(buffer);

        default:
          throw new Error(`Nieobsługiwany typ pliku: ${mimeType}`);
      }
    } catch (error) {
      console.error("Error extracting text from file:", error);
      throw new Error(`Błąd podczas wyodrębniania tekstu: ${error.message}`);
    }
  }

  async extractFromPDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text.trim();
    } catch (error) {
      throw new Error(`Błąd podczas czytania PDF: ${error.message}`);
    }
  }

  async extractFromDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } catch (error) {
      throw new Error(`Błąd podczas czytania DOCX: ${error.message}`);
    }
  }

  async extractFromPPTX(buffer) {
    try {
      // For PPTX, we'll use a simplified approach
      // In production, you might want to use a specialized library like 'officegen' or 'pptx2json'

      // For now, we'll convert buffer to string and try to extract readable text
      const text = buffer.toString("utf8");

      // Extract text between common XML tags found in PPTX files
      const textMatches = text.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);

      if (textMatches) {
        const extractedText = textMatches
          .map((match) => match.replace(/<[^>]*>/g, ""))
          .join(" ")
          .trim();

        if (extractedText.length > 0) {
          return extractedText;
        }
      }

      // Fallback: try to extract any readable ASCII text
      const readableText = text
        .replace(/[^\x20-\x7E\u00A0-\u017F\u0100-\u017F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (readableText.length < 100) {
        throw new Error(
          "Nie znaleziono wystarczającej ilości tekstu w prezentacji"
        );
      }

      return readableText;
    } catch (error) {
      throw new Error(`Błąd podczas czytania PPTX: ${error.message}`);
    }
  }

  // Helper method to validate file content
  validateFileContent(text, minLength = 50) {
    if (!text || typeof text !== "string") {
      throw new Error("Nie udało się wyodrębnić tekstu z pliku");
    }

    const cleanText = text.trim();

    if (cleanText.length < minLength) {
      throw new Error(`Tekst jest za krótki (minimum ${minLength} znaków)`);
    }

    return cleanText;
  }

  // Get file info
  getFileInfo(file) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Estimate page count based on text content and file type
  async estimatePageCount(file, extractedText) {
    try {
      const mimeType = file.mimetype;
      const textLength = extractedText.length;
      
      // Average characters per page varies by document type
      let charactersPerPage;
      
      switch (mimeType) {
        case "application/pdf":
          // PDFs typically have more text per page
          charactersPerPage = 2000;
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          // Word documents, standard page size
          charactersPerPage = 2500;
          break;
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.ms-powerpoint":
          // Presentations typically have less text per slide
          charactersPerPage = 500;
          break;
        default:
          charactersPerPage = 2000;
      }

      // Calculate estimated pages (minimum 1 page)
      const estimatedPages = Math.max(1, Math.ceil(textLength / charactersPerPage));
      
      // Cap at reasonable maximum for demo purposes
      return Math.min(estimatedPages, 50);
    } catch (error) {
      console.error("Error estimating page count:", error);
      return 1; // Default to 1 page if estimation fails
    }
  }

  // Extract text from specific pages (placeholder for future implementation)
  async extractTextFromPages(file, pageNumbers) {
    // In a real implementation, this would extract text from specific pages
    // For now, we'll return the full text
    try {
      const fullText = await this.extractText(file);
      return fullText;
    } catch (error) {
      throw new Error(`Błąd podczas wyodrębniania tekstu ze stron: ${error.message}`);
    }
  }

  // Generate page thumbnails (placeholder for future implementation)
  async generatePageThumbnails(file) {
    // In a real implementation, this would generate thumbnail images of pages
    // For now, we'll return mock thumbnails
    try {
      const pageCount = await this.estimatePageCount(file, await this.extractText(file));
      const thumbnails = [];
      
      for (let i = 1; i <= pageCount; i++) {
        thumbnails.push({
          pageNumber: i,
          thumbnailUrl: `/api/thumbnails/${file.originalname}/page-${i}.jpg`, // Mock URL
          title: `Strona ${i}`
        });
      }
      
      return thumbnails;
    } catch (error) {
      console.error("Error generating thumbnails:", error);
      return [];
    }
  }
}

module.exports = new FileProcessor();

