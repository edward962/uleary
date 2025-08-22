<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar elevation="1" color="white">
      <template #prepend>
        <v-icon size="32" color="primary">mdi-brain</v-icon>
      </template>
      <v-app-bar-title class="text-h5 font-weight-bold text-primary">
        ULeary
      </v-app-bar-title>

      <template #append>
        <v-btn variant="outlined" class="mr-2">
          <v-icon left>mdi-account-plus</v-icon>
          Zaproś
        </v-btn>
        <v-btn variant="outlined" class="mr-4">
          <v-icon left>mdi-message-text</v-icon>
          Feedback
        </v-btn>
        <v-avatar color="primary" size="36">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-background">
      <v-container class="py-8">
        <!-- Study Kit Card -->
        <v-card class="mx-auto mb-8 elevation-8" max-width="800" rounded="xl">
          <v-card-text class="pa-8">
            <div class="d-flex align-center mb-6">
              <v-icon size="48" color="primary" class="mr-4">
                mdi-book-open-variant
              </v-icon>
              <h2 class="text-h4 font-weight-bold">Zestaw do nauki</h2>
            </div>

            <v-list class="bg-transparent mb-6">
              <v-list-item
                v-for="(feature, index) in features"
                :key="index"
                class="px-0"
              >
                <template #prepend>
                  <v-icon color="success" size="24">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1">
                  {{ feature }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-btn
              color="primary"
              size="large"
              variant="flat"
              rounded="lg"
              @click="showMaterialDialog = true"
              append-icon="mdi-arrow-right"
              class="text-none"
            >
              Stwórz zestaw do nauki
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Empty State -->
        <v-card
          v-if="!showMaterialDialog"
          class="mx-auto text-center"
          max-width="800"
          color="blue-grey-50"
          variant="tonal"
        >
          <v-card-text class="pa-8">
            <v-icon size="64" color="blue-grey-300" class="mb-4">
              mdi-folder-remove
            </v-icon>
            <p class="text-body-1 text-blue-grey-600">
              Wszystkie Twoje materiały do nauki zostały usunięte! Przełącz
              widok usuniętych, aby je zobaczyć, lub stwórz nowy zestaw do nauki
              powyżej.
            </p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Material Upload Dialog -->
    <v-dialog
      v-model="showMaterialDialog"
      max-width="700"
      persistent
      scrollable
    >
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center justify-space-between pa-6">
          <span class="text-h5 font-weight-bold">Dostarcz swoje materiały</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeMaterialDialog"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <!-- Upload Options -->
          <v-row class="mb-6" justify="center">
            <v-col cols="12" sm="5" md="4">
              <v-card
                :class="{ 'border-primary': selectedOption === 'upload' }"
                :color="selectedOption === 'upload' ? 'primary' : 'default'"
                :variant="selectedOption === 'upload' ? 'tonal' : 'outlined'"
                class="text-center cursor-pointer h-100"
                @click="selectOption('upload')"
                hover
              >
                <v-card-text class="pa-4">
                  <v-chip
                    v-if="selectedOption === 'upload'"
                    color="success"
                    size="small"
                    class="mb-2"
                  >
                    Polecane
                  </v-chip>
                  <v-icon size="48" class="mb-3">mdi-cloud-upload</v-icon>
                  <h4 class="text-h6 mb-2">Wgraj</h4>
                  <p class="text-body-2">Wgraj swoje pliki</p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="5" md="4">
              <v-card
                :class="{ 'border-primary': selectedOption === 'paste' }"
                :color="selectedOption === 'paste' ? 'primary' : 'default'"
                :variant="selectedOption === 'paste' ? 'tonal' : 'outlined'"
                class="text-center cursor-pointer h-100"
                @click="selectOption('paste')"
                hover
              >
                <v-card-text class="pa-4">
                  <v-icon size="48" class="mb-3">mdi-content-paste</v-icon>
                  <h4 class="text-h6 mb-2">Wklej</h4>
                  <p class="text-body-2">Wklej swoje notatki lub terminy</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Content Input Area -->
          <div v-if="selectedOption">
            <!-- File Upload -->
            <div v-if="selectedOption === 'upload'">
              <v-file-input
                v-model="uploadedFiles"
                accept=".pdf,.docx,.pptx,.doc,.ppt"
                label="Wybierz plik"
                placeholder="Kliknij aby wybrać plik"
                prepend-icon="mdi-paperclip"
                show-size
                chips
                variant="outlined"
                class="mb-4"
              >
                <template #selection="{ fileNames }">
                  <template v-for="fileName in fileNames" :key="fileName">
                    <v-chip color="primary" size="small" label class="me-2">
                      <v-icon start>mdi-file</v-icon>
                      {{ fileName }}
                    </v-chip>
                  </template>
                </template>
              </v-file-input>

              <v-alert
                v-if="uploadedFiles && uploadedFiles.length > 0"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                <template #prepend>
                  <v-icon>mdi-check-circle</v-icon>
                </template>
                Plik został pomyślnie wybrany: {{ uploadedFiles[0].name }}
              </v-alert>
            </div>

            <!-- Text Paste -->
            <div v-if="selectedOption === 'paste'">
              <v-textarea
                v-model="pastedText"
                label="Twoje materiały"
                placeholder="Wklej swoje notatki, tekst lub terminy tutaj..."
                variant="outlined"
                rows="8"
                auto-grow
                class="mb-4"
              ></v-textarea>
            </div>
          </div>

          <!-- Processing Options -->
          <div v-if="hasContent">
            <v-divider class="my-6"></v-divider>

            <h4 class="text-h6 mb-4">Co chcesz zrobić z materiałem?</h4>

            <v-row>
              <v-col cols="12" sm="4">
                <v-card
                  :color="
                    selectedProcessing === 'summary' ? 'primary' : 'default'
                  "
                  :variant="
                    selectedProcessing === 'summary' ? 'flat' : 'outlined'
                  "
                  class="text-center cursor-pointer"
                  @click="selectedProcessing = 'summary'"
                  hover
                >
                  <v-card-text class="pa-4">
                    <v-icon size="32" class="mb-2">mdi-text-box-outline</v-icon>
                    <div class="text-subtitle-1 font-weight-medium">
                      Podsumowanie
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="4">
                <v-card
                  :color="selectedProcessing === 'quiz' ? 'primary' : 'default'"
                  :variant="selectedProcessing === 'quiz' ? 'flat' : 'outlined'"
                  class="text-center cursor-pointer"
                  @click="selectedProcessing = 'quiz'"
                  hover
                >
                  <v-card-text class="pa-4">
                    <v-icon size="32" class="mb-2"
                      >mdi-help-circle-outline</v-icon
                    >
                    <div class="text-subtitle-1 font-weight-medium">Quiz</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="4">
                <v-card
                  :color="
                    selectedProcessing === 'lecture' ? 'primary' : 'default'
                  "
                  :variant="
                    selectedProcessing === 'lecture' ? 'flat' : 'outlined'
                  "
                  class="text-center cursor-pointer"
                  @click="selectedProcessing = 'lecture'"
                  hover
                >
                  <v-card-text class="pa-4">
                    <v-icon size="32" class="mb-2">mdi-microphone</v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Lektor</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Action Buttons -->
        <v-card-actions class="pa-6">
          <v-btn
            variant="text"
            @click="proceedWithoutMaterials"
            class="text-none"
          >
            Kontynuuj bez materiałów
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            :disabled="!canProceed || isProcessing"
            :loading="isProcessing"
            @click="processContent"
            size="large"
            class="text-none"
          >
            <template v-if="isProcessing"> Przetwarzanie... </template>
            <template v-else>
              {{
                selectedProcessing ? `Stwórz ${getProcessingLabel()}` : "Dalej"
              }}
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Results Dialog -->
    <v-dialog v-model="showResultDialog" max-width="900" scrollable>
      <v-card v-if="processedResult" rounded="xl">
        <v-card-title class="d-flex align-center justify-space-between pa-6">
          <span class="text-h5 font-weight-bold">
            {{ getResultTitle() }}
          </span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showResultDialog = false"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6" style="max-height: 70vh">
          <!-- Summary Results -->
          <div v-if="processedResult.processingType === 'summary'">
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <h3 class="text-h6 mb-3">
                  {{ processedResult.result.data.title }}
                </h3>
                <p class="text-body-1 mb-4">
                  {{ processedResult.result.data.summary }}
                </p>

                <h4 class="text-subtitle-1 mb-2">Kluczowe punkty:</h4>
                <v-list density="compact">
                  <v-list-item
                    v-for="(point, index) in processedResult.result.data
                      .keyPoints"
                    :key="index"
                  >
                    <template #prepend>
                      <v-icon color="primary" size="small"
                        >mdi-circle-small</v-icon
                      >
                    </template>
                    <v-list-item-title>{{ point }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>

          <!-- Quiz Results -->
          <div v-if="processedResult.processingType === 'quiz'">
            <h3 class="text-h6 mb-4">
              {{ processedResult.result.data.title }}
            </h3>

            <v-card
              v-for="(question, index) in processedResult.result.data.questions"
              :key="index"
              variant="outlined"
              class="mb-4"
            >
              <v-card-text>
                <h4 class="text-subtitle-1 mb-3">
                  {{ index + 1 }}. {{ question.question }}
                </h4>

                <v-radio-group :model-value="question.correctAnswer" readonly>
                  <v-radio
                    v-for="(option, key) in question.options"
                    :key="key"
                    :label="`${key}. ${option}`"
                    :value="key"
                    :color="
                      key === question.correctAnswer ? 'success' : 'default'
                    "
                  ></v-radio>
                </v-radio-group>

                <v-alert type="info" variant="tonal" class="mt-3">
                  <strong>Wyjaśnienie:</strong> {{ question.explanation }}
                </v-alert>
              </v-card-text>
            </v-card>
          </div>

          <!-- Lecture Results -->
          <div v-if="processedResult.processingType === 'lecture'">
            <div class="d-flex align-center mb-4">
              <h3 class="text-h6">{{ processedResult.result.data.title }}</h3>
              <v-spacer></v-spacer>
              <v-chip color="primary" variant="tonal">
                <v-icon start>mdi-clock-outline</v-icon>
                {{ processedResult.result.data.duration }}
              </v-chip>
            </div>

            <v-card
              v-for="(section, index) in processedResult.result.data.sections"
              :key="index"
              variant="outlined"
              class="mb-4"
            >
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-play-circle-outline</v-icon>
                {{ section.title }}
                <v-spacer></v-spacer>
                <v-chip size="small" variant="tonal">{{
                  section.duration
                }}</v-chip>
              </v-card-title>
              <v-card-text>
                <p class="text-body-1">{{ section.content }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-btn variant="text" @click="showResultDialog = false">
            Zamknij
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            variant="flat"
            @click="downloadResult"
            prepend-icon="mdi-download"
          >
            Pobierz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Zamknij </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import apiService from "./services/apiService";

export default {
  name: "App",
  data() {
    return {
      showMaterialDialog: false,
      selectedOption: null,
      uploadedFiles: null,
      pastedText: "",
      selectedProcessing: null,
      showSnackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      isProcessing: false,
      processedResult: null,
      showResultDialog: false,
      features: [
        "Dowolny przedmiot, dowolny materiał",
        "Spersonalizowane, adaptacyjne pytania",
        "Wszystko czego potrzebujesz do nauki",
      ],
    };
  },
  computed: {
    hasContent() {
      return (
        (this.selectedOption === "upload" &&
          this.uploadedFiles &&
          this.uploadedFiles.length > 0) ||
        (this.selectedOption === "paste" && this.pastedText.trim())
      );
    },
    canProceed() {
      return this.hasContent && this.selectedProcessing;
    },
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
      this.resetContent();
    },
    resetContent() {
      this.uploadedFiles = null;
      this.pastedText = "";
      this.selectedProcessing = null;
    },
    closeMaterialDialog() {
      this.showMaterialDialog = false;
      this.resetContent();
      this.selectedOption = null;
    },
    proceedWithoutMaterials() {
      this.showNotification(
        'Funkcja "Kontynuuj bez materiałów" zostanie wkrótce zaimplementowana',
        "info"
      );
    },
    async processContent() {
      if (this.isProcessing) return;

      this.isProcessing = true;

      try {
        let result;
        let contentInfo = "";

        if (
          this.selectedOption === "upload" &&
          this.uploadedFiles &&
          this.uploadedFiles.length > 0
        ) {
          const file = this.uploadedFiles[0];
          contentInfo = `Plik: ${file.name}`;
          result = await apiService.processFile(file, this.selectedProcessing);
        } else if (this.selectedOption === "paste") {
          contentInfo = `Tekst: ${this.pastedText.substring(0, 50)}...`;
          result = await apiService.processText(
            this.pastedText,
            this.selectedProcessing
          );
        }

        if (result && result.success) {
          this.processedResult = result;
          this.showResultDialog = true;
          this.closeMaterialDialog();

          const processingType = this.getProcessingLabel();
          this.showNotification(
            `Pomyślnie wygenerowano ${processingType} dla: ${contentInfo}`,
            "success"
          );
        } else {
          throw new Error("Nieprawidłowa odpowiedź z serwera");
        }
      } catch (error) {
        console.error("Error processing content:", error);

        let errorMessage = "Wystąpił błąd podczas przetwarzania";

        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        this.showNotification(errorMessage, "error");
      } finally {
        this.isProcessing = false;
      }
    },
    getProcessingLabel() {
      const labels = {
        summary: "podsumowania",
        quiz: "quizu",
        lecture: "lektora",
      };
      return labels[this.selectedProcessing] || "";
    },
    showNotification(text, color = "success") {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },
    getResultTitle() {
      if (!this.processedResult) return "";

      const typeLabels = {
        summary: "Podsumowanie",
        quiz: "Quiz",
        lecture: "Lektor",
      };

      return typeLabels[this.processedResult.processingType] || "Wynik";
    },
    downloadResult() {
      if (!this.processedResult) return;

      const data = this.processedResult.result.data;
      const type = this.processedResult.processingType;

      let content = "";
      let filename = "";

      switch (type) {
        case "summary":
          content = `${data.title}\n\n${
            data.summary
          }\n\nKluczowe punkty:\n${data.keyPoints
            .map((point) => `• ${point}`)
            .join("\n")}`;
          filename = "podsumowanie.txt";
          break;

        case "quiz":
          content = `${data.title}\n\n${data.questions
            .map(
              (q, i) =>
                `${i + 1}. ${q.question}\n${Object.entries(q.options)
                  .map(([key, value]) => `${key}. ${value}`)
                  .join("\n")}\nPrawidłowa odpowiedź: ${
                  q.correctAnswer
                }\nWyjaśnienie: ${q.explanation}\n`
            )
            .join("\n")}`;
          filename = "quiz.txt";
          break;

        case "lecture":
          content = `${data.title}\nCzas trwania: ${
            data.duration
          }\n\n${data.sections
            .map(
              (section) =>
                `${section.title} (${section.duration})\n${section.content}\n`
            )
            .join("\n")}`;
          filename = "lektor.txt";
          break;
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      this.showNotification("Plik został pobrany!", "success");
    },
  },
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.cursor-pointer {
  cursor: pointer;
}

.border-primary {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}
</style>
