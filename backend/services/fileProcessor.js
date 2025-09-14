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

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // .docx
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.template": // .dotx
        case "application/msword": // .doc
        case "application/vnd.ms-word.document.macroEnabled.12": // .docm
        case "application/vnd.ms-word.template.macroEnabled.12": // .dotm
          return await this.extractFromDOCX(buffer);

        case "application/vnd.openxmlformats-officedocument.presentationml.presentation": // .pptx
        case "application/vnd.openxmlformats-officedocument.presentationml.slideshow": // .ppsx
        case "application/vnd.openxmlformats-officedocument.presentationml.template": // .potx
        case "application/vnd.ms-powerpoint": // .ppt
        case "application/vnd.ms-powerpoint.presentation.macroEnabled.12": // .pptm
        case "application/vnd.ms-powerpoint.slideshow.macroEnabled.12": // .ppsm
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

  async extractTextFromPages(file, pageNumbers = []) {
    try {
      // First extract all text to know the total content
      const fullText = await this.extractText(file);
      const pageCount = await this.estimatePageCount(file);

      // If no specific pages requested or single page document, return all text
      if (!pageNumbers || pageNumbers.length === 0 || pageCount <= 1) {
        return fullText;
      }

      // Estimate page breaks based on text length and page count
      const textLength = fullText.length;
      const avgPageLength = textLength / pageCount;

      let extractedText = "";
      for (const pageNum of pageNumbers) {
        if (pageNum <= pageCount && pageNum > 0) {
          const startPos = Math.floor((pageNum - 1) * avgPageLength);
          const endPos = Math.floor(pageNum * avgPageLength);
          const pageText = fullText.substring(startPos, endPos);
          extractedText += pageText + "\n\n";
        }
      }

      return extractedText.trim();
    } catch (error) {
      console.error("Error extracting text from pages:", error);
      throw new Error(
        `Błąd podczas wyodrębniania tekstu z wybranych stron: ${error.message}`
      );
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
      const estimatedPages = Math.max(
        1,
        Math.ceil(textLength / charactersPerPage)
      );

      // Cap at reasonable maximum for demo purposes
      return Math.min(estimatedPages, 50);
    } catch (error) {
      console.error("Error estimating page count:", error);
      return 1; // Default to 1 page if estimation fails
    }
  }

  // Get preview content for a specific page
  async getPagePreview(file, pageNumber) {
    try {
      const fullText = await this.extractText(file);
      const pageCount = await this.estimatePageCount(file, fullText);

      if (pageNumber < 1 || pageNumber > pageCount) {
        throw new Error(
          `Invalid page number: ${pageNumber}. Document has ${pageCount} pages.`
        );
      }

      // Try to split text by common page break indicators first
      let pages = this.splitTextIntoPages(fullText, pageCount);

      if (pages.length >= pageNumber) {
        let pageText = pages[pageNumber - 1];

        // Clean up the text
        pageText = pageText
          .replace(/\s+/g, " ")
          .replace(/\u00A0/g, " ") // Replace non-breaking spaces
          .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
          .trim();

        // Limit preview to first 2000 characters but try to break at sentence end
        if (pageText.length > 2000) {
          let truncated = pageText.substring(0, 2000);

          // Try to find the last complete sentence
          const lastSentenceEnd = Math.max(
            truncated.lastIndexOf("."),
            truncated.lastIndexOf("!"),
            truncated.lastIndexOf("?")
          );

          if (lastSentenceEnd > 1000) {
            // If we found a sentence ending after 1000 chars, use it
            pageText = truncated.substring(0, lastSentenceEnd + 1) + "...";
          } else {
            // Otherwise, try to break at word boundary
            const lastSpace = truncated.lastIndexOf(" ");
            if (lastSpace > 1000) {
              pageText = truncated.substring(0, lastSpace) + "...";
            } else {
              pageText = truncated + "...";
            }
          }
        }

        return {
          pageNumber,
          content: pageText,
          wordCount: pageText.replace(/\.\.\.$/, "").split(" ").length,
          charCount: pageText.length,
        };
      } else {
        // Fallback to simple division if splitting failed
        return this.getPagePreviewFallback(fullText, pageNumber, pageCount);
      }
    } catch (error) {
      console.error("Error getting page preview:", error);
      throw new Error(
        `Błąd podczas pobierania podglądu strony: ${error.message}`
      );
    }
  }

  // Helper method to split text into logical pages
  splitTextIntoPages(text, expectedPageCount) {
    // Try different approaches to split text into pages

    // Approach 1: Look for form feed characters (page breaks)
    if (text.includes("\f")) {
      const pages = text.split("\f").filter((page) => page.trim().length > 0);
      if (pages.length > 1) {
        return pages;
      }
    }

    // Approach 2: Look for multiple consecutive line breaks that might indicate page breaks
    const paragraphs = text.split(/\n\s*\n/);
    if (paragraphs.length >= expectedPageCount) {
      // Group paragraphs into pages
      const pagesApprox = [];
      const paragraphsPerPage = Math.ceil(
        paragraphs.length / expectedPageCount
      );

      for (let i = 0; i < expectedPageCount; i++) {
        const startIdx = i * paragraphsPerPage;
        const endIdx = Math.min((i + 1) * paragraphsPerPage, paragraphs.length);
        const pageContent = paragraphs.slice(startIdx, endIdx).join("\n\n");
        if (pageContent.trim()) {
          pagesApprox.push(pageContent);
        }
      }

      if (pagesApprox.length > 0) {
        return pagesApprox;
      }
    }

    // Approach 3: Simple equal division with sentence boundary awareness
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length >= expectedPageCount) {
      const sentencesPerPage = Math.ceil(sentences.length / expectedPageCount);
      const pages = [];

      for (let i = 0; i < expectedPageCount; i++) {
        const startIdx = i * sentencesPerPage;
        const endIdx = Math.min((i + 1) * sentencesPerPage, sentences.length);
        const pageContent = sentences.slice(startIdx, endIdx).join(" ");
        if (pageContent.trim()) {
          pages.push(pageContent);
        }
      }

      return pages;
    }

    // Fallback: simple character-based division
    return this.simpleTextDivision(text, expectedPageCount);
  }

  // Fallback method for simple text division
  simpleTextDivision(text, pageCount) {
    const pages = [];
    const textLength = text.length;
    const avgPageLength = textLength / pageCount;

    for (let i = 0; i < pageCount; i++) {
      const startPos = Math.floor(i * avgPageLength);
      const endPos = Math.floor((i + 1) * avgPageLength);
      const pageText = text.substring(startPos, endPos);
      pages.push(pageText);
    }

    return pages;
  }

  // Fallback preview method
  getPagePreviewFallback(fullText, pageNumber, pageCount) {
    const textLength = fullText.length;
    const avgPageLength = textLength / pageCount;

    const startPos = Math.floor((pageNumber - 1) * avgPageLength);
    const endPos = Math.floor(pageNumber * avgPageLength);
    let pageText = fullText.substring(startPos, endPos);

    // Clean up the text and limit length for preview
    pageText = pageText.replace(/\s+/g, " ").trim();

    // Limit preview to first 1600 characters for better UX
    if (pageText.length > 1600) {
      pageText = pageText.substring(0, 1600) + "...";
    }

    return {
      pageNumber,
      content: pageText,
      wordCount: pageText.split(" ").length,
      charCount: pageText.length,
    };
  }

  // Extract text from specific pages (placeholder for future implementation)
  async extractTextFromPages(file, pageNumbers) {
    // In a real implementation, this would extract text from specific pages
    // For now, we'll return the full text
    try {
      const fullText = await this.extractText(file);
      return fullText;
    } catch (error) {
      throw new Error(
        `Błąd podczas wyodrębniania tekstu ze stron: ${error.message}`
      );
    }
  }

  // Generate page thumbnails (placeholder for future implementation)
  async generatePageThumbnails(file) {
    // In a real implementation, this would generate thumbnail images of pages
    // For now, we'll return mock thumbnails
    try {
      const pageCount = await this.estimatePageCount(
        file,
        await this.extractText(file)
      );
      const thumbnails = [];

      for (let i = 1; i <= pageCount; i++) {
        thumbnails.push({
          pageNumber: i,
          thumbnailUrl: `/api/thumbnails/${file.originalname}/page-${i}.jpg`, // Mock URL
          title: `Strona ${i}`,
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
