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
                @change="handleFileChange"
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
                Plik został pomyślnie wybrany:
                {{
                  Array.isArray(uploadedFiles)
                    ? uploadedFiles[0].name
                    : uploadedFiles.name
                }}
                <div class="mt-2">
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="small"
                    @click="uploadAndProcessFile"
                    :loading="isProcessing"
                    prepend-icon="mdi-upload"
                  >
                    Wgraj i przeanalizuj
                  </v-btn>
                </div>
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
                selectedProcessing
                  ? `Stwórz ${getProcessingLabel()}`
                  : selectedOption === "upload"
                  ? "Dodaj do materiałów"
                  : "Dalej"
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

    <!-- Interactive Quiz Dialog -->
    <v-dialog v-model="showQuizDialog" max-width="900" persistent scrollable>
      <v-card v-if="quizSession" rounded="xl">
        <!-- ACTIVE QUIZ MODE -->
        <div v-if="quizMode === 'active' && currentQuestion">
          <!-- Quiz Header with Progress -->
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon size="32" color="primary" class="mr-3"
                >mdi-help-circle</v-icon
              >
              <div>
                <span class="text-h5 font-weight-bold">Quiz Interaktywny</span>
                <div class="text-caption text-grey-600">
                  Pytanie {{ currentQuestionIndex + 1 }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <v-chip
                :color="totalQuizAnswered > 0 ? 'success' : 'primary'"
                variant="tonal"
                class="mb-1"
              >
                {{ quizScore }} z {{ totalQuizAnswered }} poprawnych
              </v-chip>
              <div class="text-caption">
                {{ quizScore }} poprawnych z {{ totalQuizAnswered }} odpowiedzi
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Question -->
            <v-card variant="outlined" class="mb-6">
              <v-card-text class="pa-4">
                <h3 class="text-h6 mb-4">{{ currentQuestion.question }}</h3>

                <!-- Answer Options -->
                <v-radio-group
                  v-model="selectedAnswer"
                  @update:model-value="selectQuizAnswer"
                  :disabled="showFeedback"
                >
                  <v-radio
                    v-for="(option, key) in currentQuestion.options"
                    :key="key"
                    :label="`${key}. ${option}`"
                    :value="key"
                    :color="getOptionColor(key)"
                    class="mb-2"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>

            <!-- Feedback Section -->
            <v-card
              v-if="showFeedback"
              :color="
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'success'
                  : 'error'
              "
              variant="tonal"
              class="mb-4"
            >
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">
                    {{
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "mdi-check-circle"
                        : "mdi-close-circle"
                    }}
                  </v-icon>
                  <strong>
                    {{
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "Prawidłowa odpowiedź!"
                        : "Nieprawidłowa odpowiedź"
                    }}
                  </strong>
                </div>
                <div
                  v-if="selectedAnswer !== currentQuestion.correctAnswer"
                  class="mb-2"
                >
                  <strong>Poprawna odpowiedź:</strong>
                  {{ currentQuestion.correctAnswer }}.
                  {{ currentQuestion.options[currentQuestion.correctAnswer] }}
                </div>
                <div class="text-body-2">
                  <strong>Wyjaśnienie:</strong>
                  {{ currentQuestion.explanation }}
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Active Quiz Actions -->
          <v-card-actions class="pa-6">
            <v-btn
              variant="outlined"
              @click="endQuiz"
              :disabled="quizCompleted"
            >
              Zakończ quiz
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              v-if="!showFeedback && selectedAnswer"
              color="primary"
              variant="flat"
              @click="submitQuizAnswer"
              prepend-icon="mdi-check"
            >
              Sprawdź odpowiedź
            </v-btn>

            <v-btn
              v-if="showFeedback && !quizCompleted"
              color="primary"
              variant="flat"
              @click="nextQuestion"
              :loading="isLoadingNextQuestion"
              append-icon="mdi-arrow-right"
            >
              Następne pytanie
            </v-btn>
          </v-card-actions>
        </div>

        <!-- COMPLETED QUIZ RESULTS MODE -->
        <div v-if="quizMode === 'completed' && quizResults">
          <!-- Results Header -->
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon size="32" color="success" class="mr-3">mdi-trophy</v-icon>
              <div>
                <span class="text-h5 font-weight-bold">Wyniki Quizu</span>
                <div class="text-caption text-grey-600">Quiz zakończony</div>
              </div>
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="closeQuizDialog"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Results Summary -->
            <v-row class="mb-6">
              <v-col cols="12" md="4">
                <v-card color="success" variant="tonal" class="text-center">
                  <v-card-text class="pa-4">
                    <v-icon size="36" class="mb-2">mdi-check-circle</v-icon>
                    <div class="text-h4 font-weight-bold">
                      {{ quizResults.score }}
                    </div>
                    <div class="text-body-2">Poprawne odpowiedzi</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="error" variant="tonal" class="text-center">
                  <v-card-text class="pa-4">
                    <v-icon size="36" class="mb-2">mdi-close-circle</v-icon>
                    <div class="text-h4 font-weight-bold">
                      {{ quizResults.totalAnswered - quizResults.score }}
                    </div>
                    <div class="text-body-2">Błędne odpowiedzi</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="primary" variant="tonal" class="text-center">
                  <v-card-text class="pa-4">
                    <v-icon size="36" class="mb-2">mdi-percent</v-icon>
                    <div class="text-h4 font-weight-bold">
                      {{ quizResults.percentage }}%
                    </div>
                    <div class="text-body-2">Dokładność</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Additional Stats -->
            <v-card variant="outlined" class="mb-6">
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1"
                    ><strong>Łączna liczba pytań:</strong></span
                  >
                  <span class="text-h6">{{ quizResults.totalAnswered }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1"
                    ><strong>Czas trwania:</strong></span
                  >
                  <span class="text-h6"
                    >{{ Math.floor(quizResults.duration / 60) }}m
                    {{ quizResults.duration % 60 }}s</span
                  >
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-body-1"
                    ><strong>Wygenerowano pytań:</strong></span
                  >
                  <span class="text-h6">{{
                    quizResults.questionsGenerated
                  }}</span>
                </div>
              </v-card-text>
            </v-card>

            <!-- Questions List -->
            <v-card variant="outlined">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Przegląd pytań
              </v-card-title>
              <v-divider></v-divider>
              <v-list>
                <v-list-item
                  v-for="(question, index) in quizSession.questions.slice(
                    0,
                    quizResults.totalAnswered
                  )"
                  :key="index"
                  @click="goToReviewQuestion(index)"
                  class="cursor-pointer"
                  hover
                >
                  <template #prepend>
                    <v-avatar
                      :color="index < quizResults.score ? 'success' : 'error'"
                      size="32"
                    >
                      <v-icon size="18">
                        {{
                          index < quizResults.score ? "mdi-check" : "mdi-close"
                        }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Pytanie {{ index + 1 }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ question.question.substring(0, 80)
                    }}{{ question.question.length > 80 ? "..." : "" }}
                  </v-list-item-subtitle>
                  <template #append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Results Actions -->
          <v-card-actions class="pa-6">
            <v-btn
              variant="outlined"
              @click="startQuizReview"
              prepend-icon="mdi-eye"
            >
              Przejrzyj pytania
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              variant="outlined"
              @click="regenerateQuiz"
              prepend-icon="mdi-refresh"
              class="mr-2"
            >
              Wygeneruj quiz ponownie
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              @click="returnToMaterials"
              prepend-icon="mdi-arrow-left"
            >
              Wróć do materiałów
            </v-btn>
          </v-card-actions>
        </div>

        <!-- REVIEW MODE -->
        <div
          v-if="
            quizMode === 'review' && quizSession.questions[reviewQuestionIndex]
          "
        >
          <!-- Review Header -->
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon size="32" color="info" class="mr-3">mdi-eye</v-icon>
              <div>
                <span class="text-h5 font-weight-bold">Przegląd pytań</span>
                <div class="text-caption text-grey-600">
                  Pytanie {{ reviewQuestionIndex + 1 }} z
                  {{ quizResults.totalAnswered }}
                </div>
              </div>
            </div>
            <v-btn
              variant="text"
              @click="backToResults"
              prepend-icon="mdi-arrow-left"
            >
              Powrót do wyników
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Review Question -->
            <v-card variant="outlined" class="mb-6">
              <v-card-text class="pa-4">
                <h3 class="text-h6 mb-4">
                  {{ quizSession.questions[reviewQuestionIndex].question }}
                </h3>

                <!-- Review Options (all shown with correct answer highlighted) -->
                <v-list>
                  <v-list-item
                    v-for="(option, key) in quizSession.questions[
                      reviewQuestionIndex
                    ].options"
                    :key="key"
                    :class="
                      key ===
                      quizSession.questions[reviewQuestionIndex].correctAnswer
                        ? 'bg-success-lighten-4'
                        : ''
                    "
                  >
                    <template #prepend>
                      <v-avatar
                        :color="
                          key ===
                          quizSession.questions[reviewQuestionIndex]
                            .correctAnswer
                            ? 'success'
                            : 'grey-lighten-1'
                        "
                        size="32"
                      >
                        <span class="text-white font-weight-bold">{{
                          key
                        }}</span>
                      </v-avatar>
                    </template>
                    <v-list-item-title>
                      {{ option }}
                    </v-list-item-title>
                    <template
                      #append
                      v-if="
                        key ===
                        quizSession.questions[reviewQuestionIndex].correctAnswer
                      "
                    >
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Explanation -->
            <v-card color="info" variant="tonal">
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">mdi-lightbulb</v-icon>
                  <strong>Wyjaśnienie</strong>
                </div>
                <div class="text-body-1">
                  {{ quizSession.questions[reviewQuestionIndex].explanation }}
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Review Navigation -->
          <v-card-actions class="pa-6">
            <v-btn
              variant="outlined"
              @click="prevReviewQuestion"
              :disabled="reviewQuestionIndex === 0"
              prepend-icon="mdi-arrow-left"
            >
              Poprzednie
            </v-btn>

            <v-spacer></v-spacer>

            <v-chip variant="tonal" class="mx-2">
              {{ reviewQuestionIndex + 1 }} / {{ quizResults.totalAnswered }}
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              variant="outlined"
              @click="nextReviewQuestion"
              :disabled="reviewQuestionIndex === quizResults.totalAnswered - 1"
              append-icon="mdi-arrow-right"
            >
              Następne
            </v-btn>
          </v-card-actions>
        </div>
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
      // Interactive quiz data
      showQuizDialog: false,
      quizSession: null,
      currentQuestion: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
      quizScore: 0,
      totalQuizAnswered: 0,
      isLoadingNextQuestion: false,
      quizCompleted: false,
      quizResults: null,
      quizMode: "active", // 'active', 'completed', 'review'
      reviewQuestionIndex: 0,
      sourceText: "", // Store original text for quiz regeneration
      // Materials management
      materials: [],
      showMaterialsView: false,
      isLoadingMaterials: false,
      // Summary system
      showSummaryDialog: false,
      showPageSelectionDialog: false,
      currentMaterial: null,
      selectedPages: [],
      isGeneratingSummary: false,
      currentSummary: null,
      summaryMode: "view", // 'select', 'generating', 'view'
    };
  },
  computed: {
    hasContent() {
      const hasFile =
        this.selectedOption === "upload" &&
        this.uploadedFiles &&
        (Array.isArray(this.uploadedFiles)
          ? this.uploadedFiles.length > 0
          : true);

      const hasText = this.selectedOption === "paste" && this.pastedText.trim();

      console.log(
        "hasContent check - hasFile:",
        hasFile,
        "hasText:",
        hasText,
        "uploadedFiles:",
        this.uploadedFiles
      );

      return hasFile || hasText;
    },
    canProceed() {
      console.log(
        "canProceed computed - selectedOption:",
        this.selectedOption,
        "hasContent:",
        this.hasContent,
        "uploadedFiles:",
        this.uploadedFiles
      );

      // For file uploads, allow proceeding without processing type selection
      // (will go to materials management)
      if (this.selectedOption === "upload" && this.hasContent) {
        return true;
      }
      // For text paste, still require processing type selection
      return this.hasContent && this.selectedProcessing;
    },
  },
  watch: {
    uploadedFiles(newVal, oldVal) {
      console.log("uploadedFiles watcher - old:", oldVal, "new:", newVal);
      console.log(
        "hasContent:",
        this.hasContent,
        "canProceed:",
        this.canProceed
      );
    },
  },
  async mounted() {
    await this.loadMaterials();
  },
  methods: {
    // Materials Management Methods
    async loadMaterials() {
      this.isLoadingMaterials = true;
      try {
        const response = await apiService.getMaterials();
        if (response.success) {
          this.materials = response.materials;
        }
      } catch (error) {
        console.error("Error loading materials:", error);
        this.showNotification("Błąd podczas ładowania materiałów", "error");
      } finally {
        this.isLoadingMaterials = false;
      }
    },
    async uploadNewMaterial(file) {
      try {
        this.isProcessing = true;
        const response = await apiService.uploadMaterial(file);
        if (response.success) {
          await this.loadMaterials(); // Refresh materials list

          // Check if we should auto-generate summary
          if (response.material.pageCount <= 5) {
            // Auto-generate summary for small documents
            this.generateSummaryForMaterial(response.material);
          } else {
            // Show page selection for large documents
            this.showPageSelection(response.material);
          }

          this.showNotification(
            `Materiał "${response.material.name}" został wgrany pomyślnie`,
            "success"
          );
        }
      } catch (error) {
        console.error("Error uploading material:", error);
        this.showNotification("Błąd podczas wgrywania materiału", "error");
      } finally {
        this.isProcessing = false;
      }
    },
    showMaterialsList() {
      this.showMaterialsView = true;
      this.closeMaterialDialog();
    },
    hideMaterialsList() {
      this.showMaterialsView = false;
    },
    // Summary Management Methods
    async openSummary(material) {
      this.currentMaterial = material;

      if (material.hasSummary) {
        // Load existing summary
        try {
          const response = await apiService.getSummary(material.id);
          if (response.success) {
            this.currentSummary = response.summary;
            this.summaryMode = "view";
            this.showSummaryDialog = true;
          }
        } catch (error) {
          console.error("Error loading summary:", error);
          this.showNotification("Błąd podczas ładowania podsumowania", "error");
        }
      } else {
        // Generate new summary
        if (material.pageCount <= 5) {
          // Auto-generate for small documents
          this.generateSummaryForMaterial(material);
        } else {
          // Show page selection for large documents
          this.showPageSelection(material);
        }
      }
    },
    showPageSelection(material) {
      this.currentMaterial = material;
      this.selectedPages = [];
      this.showPageSelectionDialog = true;
    },
    togglePageSelection(pageNumber) {
      const index = this.selectedPages.indexOf(pageNumber);
      if (index === -1) {
        if (this.selectedPages.length < 5) {
          this.selectedPages.push(pageNumber);
        } else {
          this.showNotification("Możesz wybrać maksymalnie 5 stron", "warning");
        }
      } else {
        this.selectedPages.splice(index, 1);
      }
    },
    async generateSummaryForMaterial(material, selectedPages = null) {
      this.currentMaterial = material;
      this.isGeneratingSummary = true;
      this.summaryMode = "generating";
      this.showSummaryDialog = true;
      this.showPageSelectionDialog = false;

      try {
        const response = await apiService.generateSummary(
          material.id,
          selectedPages
        );
        if (response.success) {
          this.currentSummary = response.summary;
          this.summaryMode = "view";
          await this.loadMaterials(); // Refresh to update hasSummary status

          if (!response.isExisting) {
            this.showNotification(
              "Podsumowanie zostało wygenerowane",
              "success"
            );
          }
        }
      } catch (error) {
        console.error("Error generating summary:", error);
        this.showNotification("Błąd podczas generowania podsumowania", "error");
        this.showSummaryDialog = false;
      } finally {
        this.isGeneratingSummary = false;
      }
    },
    async deleteSummary(materialId) {
      try {
        const response = await apiService.deleteSummary(materialId);
        if (response.success) {
          this.showNotification("Podsumowanie zostało usunięte", "success");
          this.showSummaryDialog = false;
          await this.loadMaterials(); // Refresh materials list
        }
      } catch (error) {
        console.error("Error deleting summary:", error);
        this.showNotification("Błąd podczas usuwania podsumowania", "error");
      }
    },
    closeSummaryDialog() {
      this.showSummaryDialog = false;
      this.currentSummary = null;
      this.currentMaterial = null;
      this.summaryMode = "view";
    },
    closePageSelectionDialog() {
      this.showPageSelectionDialog = false;
      this.selectedPages = [];
      this.currentMaterial = null;
    },

    // File Upload Methods
    handleFileChange(files) {
      console.log("File changed:", files);
      // The v-model should handle this automatically, but let's ensure it works
      if (files && files.length > 0) {
        console.log("File selected:", files[0].name);
        // Force reactivity update
        this.$nextTick(() => {
          console.log(
            "After nextTick - hasContent:",
            this.hasContent,
            "canProceed:",
            this.canProceed
          );
        });
      }
    },
    async uploadAndProcessFile() {
      if (!this.uploadedFiles) {
        this.showNotification("Nie wybrano pliku", "error");
        return;
      }

      const file = Array.isArray(this.uploadedFiles)
        ? this.uploadedFiles[0]
        : this.uploadedFiles;
      await this.uploadNewMaterial(file);
    },

    // Original Methods (updated to support new upload flow)
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

        if (this.selectedOption === "upload" && this.uploadedFiles) {
          const file = Array.isArray(this.uploadedFiles)
            ? this.uploadedFiles[0]
            : this.uploadedFiles;
          contentInfo = `Plik: ${file.name}`;

          // If no processing type selected, go to materials management
          if (!this.selectedProcessing) {
            await this.uploadNewMaterial(file);
            return; // Exit early, uploadNewMaterial handles UI transitions
          }

          // Handle quiz differently - extract text first then start interactive quiz
          if (this.selectedProcessing === "quiz") {
            // For now, we'll use the regular API to extract text, then start quiz
            // In a full implementation, you'd want a dedicated file text extraction endpoint
            result = await apiService.processFile(file, "summary");
            if (
              result &&
              result.success &&
              result.result &&
              result.result.data
            ) {
              // Extract the source text and start interactive quiz
              const sourceText = `${result.result.data.title}\n\n${result.result.data.summary}`;
              this.sourceText = sourceText; // Store for regeneration
              result = await apiService.startQuiz(sourceText);
            }
          } else {
            result = await apiService.processFile(
              file,
              this.selectedProcessing
            );
          }
        } else if (this.selectedOption === "paste") {
          contentInfo = `Tekst: ${this.pastedText.substring(0, 50)}...`;

          if (this.selectedProcessing === "quiz") {
            this.sourceText = this.pastedText; // Store for regeneration
            result = await apiService.startQuiz(this.pastedText);
          } else {
            result = await apiService.processText(
              this.pastedText,
              this.selectedProcessing
            );
          }
        }

        if (result && result.success) {
          // Handle interactive quiz differently
          if (this.selectedProcessing === "quiz") {
            this.startInteractiveQuiz(result, contentInfo);
          } else {
            this.processedResult = result;
            this.showResultDialog = true;
            this.closeMaterialDialog();

            const processingType = this.getProcessingLabel();
            this.showNotification(
              `Pomyślnie wygenerowano ${processingType} dla: ${contentInfo}`,
              "success"
            );
          }
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
    // Interactive Quiz Methods
    async startInteractiveQuiz(quizResult, contentInfo) {
      this.quizSession = quizResult;
      this.currentQuestion = quizResult.questions[0];
      this.currentQuestionIndex = 0;
      this.selectedAnswer = null;
      this.showFeedback = false;
      this.quizScore = 0;
      this.totalQuizAnswered = 0;
      this.quizCompleted = false;
      this.quizResults = null;
      this.quizMode = "active";
      this.reviewQuestionIndex = 0;

      this.showQuizDialog = true;
      this.closeMaterialDialog();

      this.showNotification(
        `Quiz rozpoczęty! Źródło: ${contentInfo}`,
        "success"
      );
    },
    selectQuizAnswer(answer) {
      if (this.showFeedback) return; // Prevent changing answer after feedback
      this.selectedAnswer = answer;
    },
    async submitQuizAnswer() {
      if (!this.selectedAnswer || this.showFeedback) return;

      try {
        const result = await apiService.submitAnswer(
          this.quizSession.sessionId,
          this.currentQuestionIndex,
          this.selectedAnswer
        );

        if (result.success) {
          this.showFeedback = true;
          this.quizScore = result.score;
          this.totalQuizAnswered = result.totalAnswered;

          // Show feedback for 2 seconds, then enable next button
          setTimeout(() => {
            // Auto-advance after feedback (optional)
          }, 2000);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
        this.showNotification("Błąd podczas sprawdzania odpowiedzi", "error");
      }
    },
    async nextQuestion() {
      if (!this.showFeedback) return;

      this.isLoadingNextQuestion = true;

      try {
        // Check if we have more questions in current session
        if (this.currentQuestionIndex + 1 < this.quizSession.questions.length) {
          // Use existing question
          this.currentQuestionIndex++;
          this.currentQuestion =
            this.quizSession.questions[this.currentQuestionIndex];
          this.resetQuestionState();
        } else {
          // Generate new question
          const result = await apiService.getNextQuestion(
            this.quizSession.sessionId
          );

          if (result.success && result.question) {
            this.currentQuestion = result.question;
            this.currentQuestionIndex++;
            this.resetQuestionState();
          } else {
            this.showNotification(
              "Nie udało się wygenerować nowego pytania",
              "warning"
            );
          }
        }
      } catch (error) {
        console.error("Error getting next question:", error);
        this.showNotification("Błąd podczas ładowania pytania", "error");
      } finally {
        this.isLoadingNextQuestion = false;
      }
    },
    resetQuestionState() {
      this.selectedAnswer = null;
      this.showFeedback = false;
    },
    async endQuiz() {
      try {
        const result = await apiService.endQuiz(this.quizSession.sessionId);

        if (result.success) {
          this.quizCompleted = true;
          this.quizResults = result.finalResults;
          this.quizMode = "completed";
          this.showNotification(
            `Quiz zakończony! Wynik: ${result.finalResults.score}/${result.finalResults.totalAnswered} (${result.finalResults.percentage}%)`,
            "success"
          );
        }
      } catch (error) {
        console.error("Error ending quiz:", error);
        this.showNotification("Błąd podczas kończenia quizu", "error");
      }
    },
    closeQuizDialog() {
      this.showQuizDialog = false;
      this.quizSession = null;
      this.currentQuestion = null;
      this.currentQuestionIndex = 0;
      this.resetQuestionState();
      this.quizScore = 0;
      this.totalQuizAnswered = 0;
      this.quizCompleted = false;
      this.quizResults = null;
      this.quizMode = "active";
      this.reviewQuestionIndex = 0;
      this.sourceText = "";
    },
    // Quiz Review Methods
    startQuizReview() {
      this.quizMode = "review";
      this.reviewQuestionIndex = 0;
    },
    goToReviewQuestion(index) {
      this.reviewQuestionIndex = index;
    },
    nextReviewQuestion() {
      if (this.reviewQuestionIndex < this.quizSession.questions.length - 1) {
        this.reviewQuestionIndex++;
      }
    },
    prevReviewQuestion() {
      if (this.reviewQuestionIndex > 0) {
        this.reviewQuestionIndex--;
      }
    },
    backToResults() {
      this.quizMode = "completed";
    },
    async regenerateQuiz() {
      if (!this.sourceText) {
        this.showNotification(
          "Brak materiału źródłowego do ponownego wygenerowania",
          "error"
        );
        return;
      }

      try {
        const result = await apiService.startQuiz(this.sourceText);
        if (result && result.success) {
          this.startInteractiveQuiz(result, "Ponownie wygenerowany quiz");
        }
      } catch (error) {
        console.error("Error regenerating quiz:", error);
        this.showNotification("Błąd podczas generowania nowego quizu", "error");
      }
    },
    returnToMaterials() {
      this.closeQuizDialog();
    },
    getOptionColor(optionKey) {
      if (!this.showFeedback) {
        return this.selectedAnswer === optionKey ? "primary" : "default";
      }

      // Show feedback colors
      if (optionKey === this.currentQuestion.correctAnswer) {
        return "success"; // Correct answer is always green
      }

      if (
        optionKey === this.selectedAnswer &&
        optionKey !== this.currentQuestion.correctAnswer
      ) {
        return "error"; // Selected wrong answer is red
      }

      return "default"; // Other options remain neutral
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

.bg-success-lighten-4 {
  background-color: rgba(76, 175, 80, 0.1) !important;
}
</style>
