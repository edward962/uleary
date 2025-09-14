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
        <!-- <v-card
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
        </v-card> -->
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
                @click="triggerFileUpload"
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
                accept=".pdf,.docx,.doc,.dotx,.docm,.dotm,.pptx,.ppt,.ppsx,.potx,.pptm,.ppsm"
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

            <!-- Audio Player (Always show for lectures) -->
            <v-card
              variant="outlined"
              class="mb-4"
              :color="
                processedResult.result.audioAvailable ? 'primary' : 'orange'
              "
            >
              <v-card-title class="d-flex align-center">
                <v-icon
                  class="mr-2"
                  :color="
                    processedResult.result.audioAvailable ? 'primary' : 'orange'
                  "
                >
                  {{
                    processedResult.result.audioAvailable
                      ? "mdi-volume-high"
                      : "mdi-volume-off"
                  }}
                </v-icon>
                Odtwarzacz Lektora
                <v-spacer></v-spacer>
                <v-chip
                  size="small"
                  :color="
                    processedResult.result.audioAvailable
                      ? 'success'
                      : 'warning'
                  "
                  variant="tonal"
                >
                  {{
                    processedResult.result.audioAvailable
                      ? "Audio dostępne"
                      : "Audio niedostępne"
                  }}
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div class="audio-player-container">
                  <audio
                    v-if="lectureAudioUrl"
                    controls
                    preload="metadata"
                    style="width: 100%"
                    class="mb-3"
                  >
                    <source :src="lectureAudioUrl" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>

                  <!-- No Audio Loaded Yet -->
                  <div v-if="!lectureAudioUrl" class="text-center py-3">
                    <v-alert
                      v-if="
                        !processedResult.result.audioAvailable &&
                        processedResult.result.error
                      "
                      type="warning"
                      variant="tonal"
                      class="mb-3"
                    >
                      <strong>Błąd generacji audio:</strong>
                      {{ processedResult.result.error }}
                    </v-alert>

                    <v-btn
                      v-if="processedResult.result.audioAvailable"
                      @click="loadLectureAudio"
                      :loading="loadingAudio"
                      color="primary"
                      prepend-icon="mdi-play"
                    >
                      Załaduj Audio
                    </v-btn>

                    <v-btn
                      v-else
                      @click="regenerateAudio"
                      :loading="regeneratingAudio"
                      color="orange"
                      prepend-icon="mdi-refresh"
                    >
                      Wygeneruj Audio
                    </v-btn>
                  </div>

                  <div class="d-flex gap-2 mt-2">
                    <v-btn
                      v-if="lectureAudioUrl"
                      :href="lectureAudioUrl"
                      download="lecture.mp3"
                      color="success"
                      variant="outlined"
                      prepend-icon="mdi-download"
                      size="small"
                    >
                      Pobierz Audio
                    </v-btn>

                    <v-btn
                      @click="regenerateAudio"
                      color="orange"
                      variant="outlined"
                      prepend-icon="mdi-refresh"
                      size="small"
                      :loading="regeneratingAudio"
                    >
                      Regeneruj Audio
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Lecture Text Content -->
            <v-card
              v-for="(section, index) in processedResult.result.data.sections"
              :key="index"
              variant="outlined"
              class="mb-4"
            >
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-text-box-outline</v-icon>
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

          <!-- <v-btn
            color="primary"
            variant="flat"
            @click="downloadResult"
            prepend-icon="mdi-download"
          >
            Pobierz
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Hidden file input for direct upload -->
    <input
      ref="hiddenFileInput"
      type="file"
      accept=".pdf,.docx,.doc,.dotx,.docm,.dotm,.pptx,.ppt,.ppsx,.potx,.pptm,.ppsm"
      style="display: none"
      @change="handleDirectFileUpload"
    />

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
                  Pytanie {{ currentQuestionIndex + 1 }} z
                  {{ quizSession.maxQuestions || 10 }}
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
              :color="
                quizSession.questionsGenerated >= quizSession.maxQuestions
                  ? 'orange'
                  : 'primary'
              "
              variant="flat"
              @click="nextQuestion"
              :loading="isLoadingNextQuestion"
              :disabled="
                quizSession.questionsGenerated >= quizSession.maxQuestions
              "
              :append-icon="
                quizSession.questionsGenerated >= quizSession.maxQuestions
                  ? 'mdi-stop'
                  : 'mdi-arrow-right'
              "
            >
              {{
                quizSession.questionsGenerated >= quizSession.maxQuestions
                  ? "Limit pytań osiągnięty"
                  : "Następne pytanie"
              }}
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
            <!-- <v-card variant="outlined">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Przegląd pytań
              </v-card-title>
              <v-divider></v-divider>
              <v-list>
                <v-list-item
                  v-for="(question, index) in quizSession.questions"
                  :key="index"
                  @click="goToReviewQuestion(index)"
                  class="cursor-pointer"
                  hover
                >
                  <template #prepend>
                    <v-avatar
                      :color="getQuestionResultColor(index)"
                      size="32"
                    >
                      <v-icon size="18">
                        {{ getQuestionResultIcon(index) }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Pytanie {{ index + 1 }}
                    <v-chip 
                      v-if="index >= quizResults.totalAnswered"
                      size="x-small"
                      color="grey"
                      variant="tonal"
                      class="ml-2"
                    >
                      Nie odpowiedziano
                    </v-chip>
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
            </v-card> -->
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

            <!-- <v-btn
              color="primary"
              variant="outlined"
              @click="regenerateQuiz"
              prepend-icon="mdi-refresh"
              class="mr-2"
            >
              Wygeneruj quiz ponownie
            </v-btn> -->

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
                  {{ quizSession.questions.length }}
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
            <v-card
              :color="
                reviewQuestionIndex >= quizResults.totalAnswered
                  ? 'orange'
                  : 'info'
              "
              variant="tonal"
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">
                    {{
                      reviewQuestionIndex >= quizResults.totalAnswered
                        ? "mdi-help-circle"
                        : "mdi-lightbulb"
                    }}
                  </v-icon>
                  <strong>
                    {{
                      reviewQuestionIndex >= quizResults.totalAnswered
                        ? "Pytanie bez odpowiedzi"
                        : "Wyjaśnienie"
                    }}
                  </strong>
                </div>
                <div class="text-body-1">
                  <span v-if="reviewQuestionIndex >= quizResults.totalAnswered">
                    To pytanie nie zostało jeszcze zadane w quizie. Quiz został
                    zakończony przed dotarciem do tego pytania.
                  </span>
                  <span v-else>
                    {{ quizSession.questions[reviewQuestionIndex].explanation }}
                  </span>
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
              {{ reviewQuestionIndex + 1 }} / {{ quizSession.questions.length }}
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              variant="outlined"
              @click="nextReviewQuestion"
              :disabled="
                reviewQuestionIndex === quizSession.questions.length - 1
              "
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

    <!-- ElevenLabs Debug FAB -->
    <v-fab
      location="bottom right"
      color="orange"
      icon="mdi-microphone-settings"
      @click="showElevenLabsTest = !showElevenLabsTest"
      style="margin-bottom: 80px"
    ></v-fab>

    <!-- ElevenLabs Testing Dialog -->
    <v-dialog v-model="showElevenLabsTest" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="me-2">mdi-microphone-settings</v-icon>
          ElevenLabs Testing Playground
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <!-- API Status Test -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-h6">
              <v-icon class="me-2">mdi-api</v-icon>
              API Status Test
            </v-card-title>
            <v-card-text>
              <div class="d-flex gap-3 mb-3">
                <v-btn
                  @click="testElevenLabs"
                  color="primary"
                  prepend-icon="mdi-play"
                  size="small"
                >
                  Test API Connection
                </v-btn>

                <v-btn
                  @click="diagnosElevenLabs"
                  color="info"
                  prepend-icon="mdi-medical-bag"
                  size="small"
                >
                  Diagnose Account
                </v-btn>
              </div>

              <div v-if="elevenLabsDiagnosis" class="mt-3 mb-3">
                <v-alert type="info" variant="tonal">
                  <div class="text-subtitle-2 mb-2">🔍 Account Diagnosis:</div>
                  <div v-if="elevenLabsDiagnosis.account">
                    <strong>Account Status:</strong>
                    {{ elevenLabsDiagnosis.account.status }}<br />
                    <strong>Subscription:</strong>
                    {{ elevenLabsDiagnosis.account.subscription || "Unknown"
                    }}<br />
                    <span v-if="elevenLabsDiagnosis.account.characterLimit">
                      <strong>Character Limit:</strong>
                      {{ elevenLabsDiagnosis.account.characterLimit }}<br />
                      <strong>Characters Used:</strong>
                      {{ elevenLabsDiagnosis.account.charactersUsed }}<br />
                    </span>
                    <span v-if="elevenLabsDiagnosis.account.error">
                      <strong>Error:</strong>
                      {{ elevenLabsDiagnosis.account.error }}
                    </span>
                  </div>
                  <div v-if="elevenLabsDiagnosis.apiKey">
                    <strong>API Key:</strong>
                    {{
                      elevenLabsDiagnosis.apiKey.present
                        ? "✅ Present"
                        : "❌ Missing"
                    }}
                    ({{ elevenLabsDiagnosis.apiKey.length }} chars)
                  </div>
                </v-alert>
              </div>

              <div v-if="elevenLabsTestResult" class="mt-3">
                <v-alert
                  :type="elevenLabsTestResult.success ? 'success' : 'error'"
                  variant="tonal"
                >
                  <pre>{{ JSON.stringify(elevenLabsTestResult, null, 2) }}</pre>
                </v-alert>
              </div>
            </v-card-text>
          </v-card>

          <!-- Audio Generation Test -->
          <v-card variant="outlined">
            <v-card-title class="text-h6">
              <v-icon class="me-2">mdi-volume-high</v-icon>
              Audio Generation Test
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="testText"
                label="Test Text (English recommended for free accounts)"
                placeholder="Enter text to generate audio..."
                rows="3"
                variant="outlined"
                class="mb-3"
              ></v-textarea>

              <v-btn
                @click="testElevenLabsAudio"
                :loading="testingAudio"
                color="secondary"
                prepend-icon="mdi-microphone"
                class="mb-3"
              >
                Generate Audio
              </v-btn>

              <!-- Audio Player -->
              <div v-if="audioUrl" class="mt-4">
                <v-alert type="success" variant="tonal" class="mb-3">
                  ✅ Audio generated successfully!
                </v-alert>

                <audio
                  :src="audioUrl"
                  controls
                  style="width: 100%"
                  class="mb-3"
                ></audio>

                <v-btn
                  :href="audioUrl"
                  download="test-audio.mp3"
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-download"
                  size="small"
                >
                  Download Audio
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn @click="showElevenLabsTest = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Quiz Page Selection Dialog -->
    <v-dialog
      v-model="showQuizPageSelectionDialog"
      max-width="1200"
      persistent
      scrollable
    >
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-6">
          <v-icon size="32" color="primary" class="mr-3"
            >mdi-help-circle</v-icon
          >
          <div>
            <span class="text-h5 font-weight-bold"
              >Wybierz strony dla quizu</span
            >
            <div class="text-caption text-grey-600">
              {{ currentQuizFile ? currentQuizFile.name : "" }} ({{
                quizFilePageCount
              }}
              stron)
            </div>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert type="info" variant="tonal" class="mb-4">
            <v-icon class="mr-2">mdi-information</v-icon>
            Wybierz od 1 do 5 stron z dokumentu. Quiz zostanie wygenerowany na
            podstawie treści z wybranych stron.
          </v-alert>

          <div class="text-subtitle-2 mb-3">
            Wybrane strony: {{ quizSelectedPages.length }}/5
          </div>

          <v-row>
            <!-- Page Selection Column -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col
                  v-for="pageNum in quizFilePageCount"
                  :key="pageNum"
                  cols="6"
                  sm="4"
                  md="6"
                >
                  <v-card
                    :color="
                      quizSelectedPages.includes(pageNum)
                        ? 'primary'
                        : previewedPage === pageNum
                        ? 'blue-grey-100'
                        : 'default'
                    "
                    :variant="
                      quizSelectedPages.includes(pageNum) ? 'flat' : 'outlined'
                    "
                    class="text-center cursor-pointer"
                    @click="toggleQuizPageSelection(pageNum)"
                    @mouseenter="loadPagePreview(pageNum)"
                    hover
                  >
                    <v-card-text class="pa-3">
                      <v-icon
                        v-if="quizSelectedPages.includes(pageNum)"
                        color="white"
                        class="mb-1"
                      >
                        mdi-check-circle
                      </v-icon>
                      <v-icon v-else class="mb-1">
                        mdi-file-document-outline
                      </v-icon>
                      <div class="text-body-2 font-weight-medium">
                        Strona {{ pageNum }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-alert
                v-if="quizSelectedPages.length === 0"
                type="warning"
                variant="tonal"
                class="mt-4"
              >
                Wybierz przynajmniej jedną stronę aby kontynuować.
              </v-alert>
            </v-col>

            <!-- Page Preview Column -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="d-flex align-center pa-4">
                  <v-icon class="mr-2">mdi-eye</v-icon>
                  Podgląd strony
                  <v-spacer></v-spacer>
                  <v-chip
                    v-if="previewedPage"
                    size="small"
                    variant="tonal"
                    color="primary"
                  >
                    Strona {{ previewedPage }}
                  </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="pa-4"
                  style="min-height: 400px; max-height: 500px; overflow-y: auto"
                >
                  <!-- Loading State -->
                  <div v-if="loadingPagePreview" class="text-center py-8">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      class="mb-3"
                    ></v-progress-circular>
                    <div class="text-body-2">Ładowanie podglądu...</div>
                  </div>

                  <!-- Preview Content -->
                  <div v-else-if="pagePreviewContent" class="preview-content">
                    <v-chip
                      size="small"
                      variant="tonal"
                      color="info"
                      class="mb-3"
                    >
                      {{ pagePreviewContent.wordCount }} słów,
                      {{ pagePreviewContent.charCount }} znaków
                    </v-chip>
                    <div
                      class="text-body-2 preview-text"
                      style="line-height: 1.6; white-space: pre-wrap"
                    >
                      {{ pagePreviewContent.content }}
                    </div>
                  </div>

                  <!-- No Preview State -->
                  <div v-else class="text-center py-8 text-grey-500">
                    <v-icon size="48" class="mb-3">mdi-cursor-default</v-icon>
                    <div class="text-body-2">
                      Najedź na stronę aby zobaczyć podgląd
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-btn
            variant="outlined"
            @click="closeQuizPageSelectionDialog"
            :disabled="isProcessing"
          >
            Anuluj
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            variant="flat"
            @click="generateQuizFromSelectedPages"
            :disabled="quizSelectedPages.length === 0"
            :loading="isProcessing"
            prepend-icon="mdi-help-circle"
          >
            Wygeneruj quiz ({{ quizSelectedPages.length }} stron)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

      // Quiz page selection system
      showQuizPageSelectionDialog: false,
      quizSelectedPages: [],
      currentQuizFile: null,
      quizFilePageCount: 0,

      // Page preview system
      previewedPage: null,
      pagePreviewContent: null,
      loadingPagePreview: false,
      pagePreviewCache: new Map(), // Cache previews to avoid repeated API calls

      // ElevenLabs Testing
      showElevenLabsTest: false,
      elevenLabsTestResult: null,
      elevenLabsDiagnosis: null,
      testText: "Hello world",
      testingAudio: false,
      audioUrl: null,

      // Lecture Audio Player
      lectureAudioUrl: null,
      loadingAudio: false,
      regeneratingAudio: false,
      currentAudioSessionId: null,

      // Processing Results
      showResultDialog: false,
      processedResult: null,
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
  beforeUnmount() {
    this.cleanupAudioUrl();
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

    // Quiz Page Selection Methods
    showQuizPageSelection(file, pageCount) {
      this.currentQuizFile = file;
      this.quizFilePageCount = pageCount;
      this.quizSelectedPages = [];
      this.showQuizPageSelectionDialog = true;

      // Auto-load preview for first page
      if (pageCount > 0) {
        this.$nextTick(() => {
          this.loadPagePreview(1);
        });
      }
    },
    toggleQuizPageSelection(pageNumber) {
      const index = this.quizSelectedPages.indexOf(pageNumber);
      if (index === -1) {
        if (this.quizSelectedPages.length < 5) {
          this.quizSelectedPages.push(pageNumber);
        } else {
          this.showNotification(
            "Możesz wybrać maksymalnie 5 stron dla quizu",
            "warning"
          );
        }
      } else {
        this.quizSelectedPages.splice(index, 1);
      }
    },
    async generateQuizFromSelectedPages() {
      if (this.quizSelectedPages.length === 0) {
        this.showNotification("Wybierz przynajmniej jedną stronę", "warning");
        return;
      }

      console.log(
        "🎯 Starting quiz generation from selected pages:",
        this.quizSelectedPages
      );
      this.isProcessing = true;
      this.showQuizPageSelectionDialog = false;

      try {
        console.log("📁 Sending file to API:", this.currentQuizFile.name);
        console.log("📄 Selected pages:", this.quizSelectedPages);

        const result = await apiService.processFileForQuiz(
          this.currentQuizFile,
          this.quizSelectedPages
        );

        console.log("✅ API response received:", result);

        if (result && result.success) {
          console.log("🎮 Starting interactive quiz...");
          // Start interactive quiz with the generated questions
          const contentInfo = `Plik: ${
            this.currentQuizFile.name
          } (strony: ${this.quizSelectedPages.join(", ")})`;
          await this.startInteractiveQuiz(result, contentInfo);

          console.log("🎉 Quiz started successfully");
          this.showNotification(
            `Quiz rozpoczęty z materiału: ${this.currentQuizFile.name}`,
            "success"
          );
        } else {
          console.error("❌ API returned unsuccessful result:", result);
          this.showNotification(
            "Błąd: Nie udało się wygenerować quizu",
            "error"
          );
        }
      } catch (error) {
        console.error("💥 Error generating quiz from pages:", error);
        this.showNotification(
          `Błąd podczas generowania quizu: ${error.message}`,
          "error"
        );
      } finally {
        console.log("🧹 Cleaning up quiz generation state");
        this.isProcessing = false;
        this.currentQuizFile = null;
        this.quizFilePageCount = 0;
        this.quizSelectedPages = [];
      }
    },
    closeQuizPageSelectionDialog() {
      this.showQuizPageSelectionDialog = false;
      this.quizSelectedPages = [];
      this.currentQuizFile = null;
      this.quizFilePageCount = 0;
      // Clear preview data
      this.previewedPage = null;
      this.pagePreviewContent = null;
      this.loadingPagePreview = false;
      this.pagePreviewCache.clear();
    },

    // Page Preview Methods
    async loadPagePreview(pageNumber) {
      if (this.previewedPage === pageNumber) {
        return; // Already showing this page
      }

      this.previewedPage = pageNumber;

      // Check cache first
      const cacheKey = `${this.currentQuizFile?.name}-${pageNumber}`;
      if (this.pagePreviewCache.has(cacheKey)) {
        this.pagePreviewContent = this.pagePreviewCache.get(cacheKey);
        return;
      }

      if (!this.currentQuizFile) {
        return;
      }

      this.loadingPagePreview = true;
      this.pagePreviewContent = null;

      try {
        const response = await apiService.getPagePreview(
          this.currentQuizFile,
          pageNumber
        );
        if (response.success) {
          const previewData = response.preview;
          this.pagePreviewContent = previewData;
          // Cache the preview
          this.pagePreviewCache.set(cacheKey, previewData);
        }
      } catch (error) {
        console.error("Error loading page preview:", error);
        this.pagePreviewContent = {
          content: "Błąd podczas ładowania podglądu strony.",
          wordCount: 0,
          charCount: 0,
        };
      } finally {
        this.loadingPagePreview = false;
      }
    },

    // File Upload Methods
    triggerFileUpload() {
      // Programmatically click the hidden file input
      this.$refs.hiddenFileInput.click();
    },
    handleDirectFileUpload(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        console.log("Direct file upload:", file.name);

        // Set the selected option to upload and assign the file
        this.selectedOption = "upload";
        this.uploadedFiles = file;

        // Automatically proceed with the upload
        this.uploadAndProcessFile();

        // Reset the file input for future uploads
        event.target.value = "";
      }
    },
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

    // ElevenLabs Testing Methods
    async testElevenLabs() {
      try {
        this.elevenLabsTestResult = await apiService.testElevenLabs();
        console.log("ElevenLabs test result:", this.elevenLabsTestResult);
      } catch (error) {
        console.error("ElevenLabs test failed:", error);
        this.elevenLabsTestResult = {
          success: false,
          error: error.message,
        };
      }
    },

    async diagnosElevenLabs() {
      try {
        this.elevenLabsDiagnosis = await apiService.diagnosElevenLabs();
        console.log("ElevenLabs diagnosis:", this.elevenLabsDiagnosis);
      } catch (error) {
        console.error("ElevenLabs diagnosis failed:", error);
        this.elevenLabsDiagnosis = {
          error: error.message,
        };
      }
    },

    async testElevenLabsAudio() {
      if (!this.testText.trim()) {
        this.showNotification("Wpisz tekst do testu", "warning");
        return;
      }

      this.testingAudio = true;
      try {
        console.log("Testing ElevenLabs audio with text:", this.testText);

        const response = await apiService.testElevenLabsSpeech(this.testText);

        if (response.data) {
          // Create blob URL for audio playback
          const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
          if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
          }
          this.audioUrl = URL.createObjectURL(audioBlob);

          console.log("✅ Audio generated successfully!");
          this.showNotification(
            "Sukces! Audio zostało wygenerowane.",
            "success"
          );
        }
      } catch (error) {
        console.error("ElevenLabs audio test failed:", error);
        this.showNotification(`Błąd: ${error.message}`, "error");
      } finally {
        this.testingAudio = false;
      }
    },

    // Lecture Audio Player Methods
    async loadLectureAudio() {
      if (!this.processedResult || !this.processedResult.sessionId) {
        this.showNotification("Brak identyfikatora sesji", "error");
        return;
      }

      this.loadingAudio = true;
      try {
        console.log(
          "Loading lecture audio for session:",
          this.processedResult.sessionId
        );

        const response = await apiService.api.get(
          `/api/download-audio/${this.processedResult.sessionId}`,
          {
            responseType: "blob",
            timeout: 120000, // 2 minutes timeout for large audio files
          }
        );

        if (response.data) {
          // Create blob URL for audio playback
          const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
          if (this.lectureAudioUrl) {
            URL.revokeObjectURL(this.lectureAudioUrl);
          }
          this.lectureAudioUrl = URL.createObjectURL(audioBlob);
          this.currentAudioSessionId = this.processedResult.sessionId;

          console.log("✅ Lecture audio loaded successfully!");
          this.showNotification(
            "Audio zostało załadowane pomyślnie!",
            "success"
          );
        }
      } catch (error) {
        console.error("Failed to load lecture audio:", error);
        this.showNotification(
          `Błąd ładowania audio: ${error.message}`,
          "error"
        );
      } finally {
        this.loadingAudio = false;
      }
    },

    async regenerateAudio() {
      if (!this.processedResult || !this.processedResult.result.data) {
        this.showNotification("Brak danych lektora do regeneracji", "error");
        return;
      }

      this.regeneratingAudio = true;
      try {
        console.log("Regenerating lecture audio...");

        // Get the full lecture script
        let fullScript = this.processedResult.result.data.script;
        if (!fullScript && this.processedResult.result.data.sections) {
          fullScript = this.processedResult.result.data.sections
            .map((section) => section.content)
            .join("\n\n");
        }

        if (!fullScript) {
          throw new Error("Brak tekstu lektora do wygenerowania");
        }

        const response = await apiService.testElevenLabsSpeech(fullScript);

        if (response.data) {
          // Create blob URL for audio playback
          const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
          if (this.lectureAudioUrl) {
            URL.revokeObjectURL(this.lectureAudioUrl);
          }
          this.lectureAudioUrl = URL.createObjectURL(audioBlob);

          console.log("✅ Lecture audio regenerated successfully!");
          this.showNotification(
            "Audio zostało zregenerowane pomyślnie!",
            "success"
          );

          // Update the processedResult to mark audio as available
          if (this.processedResult && this.processedResult.result) {
            this.processedResult.result.audioAvailable = true;
            this.processedResult.result.error = null;
          }
        }
      } catch (error) {
        console.error("Failed to regenerate lecture audio:", error);
        this.showNotification(
          `Błąd regeneracji audio: ${error.message}`,
          "error"
        );
      } finally {
        this.regeneratingAudio = false;
      }
    },

    // Cleanup audio URL when component is destroyed
    cleanupAudioUrl() {
      if (this.lectureAudioUrl) {
        URL.revokeObjectURL(this.lectureAudioUrl);
        this.lectureAudioUrl = null;
      }
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl);
        this.audioUrl = null;
      }
    },

    // Results Dialog Methods
    getResultTitle() {
      if (!this.processedResult) return "";

      const labels = {
        summary: "Podsumowanie",
        quiz: "Quiz",
        lecture: "Lektor",
      };

      return labels[this.processedResult.processingType] || "Wyniki";
    },

    async downloadResult() {
      if (!this.processedResult) return;

      try {
        if (
          this.processedResult.processingType === "lecture" &&
          this.lectureAudioUrl
        ) {
          // Download audio file
          const link = document.createElement("a");
          link.href = this.lectureAudioUrl;
          link.download = "lecture.mp3";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Download text content
          const content = JSON.stringify(
            this.processedResult.result.data,
            null,
            2
          );
          const blob = new Blob([content], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${this.processedResult.processingType}-result.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
        }

        this.showNotification("Plik został pobrany!", "success");
      } catch (error) {
        console.error("Download failed:", error);
        this.showNotification("Błąd podczas pobierania", "error");
      }
    },

    // Original Methods (updated to support new upload flow)
    selectOption(option) {
      this.selectedOption = option;

      // Only clear content when switching between different content types
      if (option === "upload") {
        this.pastedText = ""; // Clear text when switching to upload
      } else if (option === "paste") {
        this.uploadedFiles = null; // Clear files when switching to paste
      }

      // Always reset processing type to allow new selection
      this.selectedProcessing = null;
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

          // Handle quiz differently - check file size and show page selection if needed
          if (this.selectedProcessing === "quiz") {
            // First, upload the file to get page count
            const uploadResult = await apiService.uploadMaterial(file);
            if (uploadResult.success) {
              const material = uploadResult.material;

              if (material.pageCount > 5) {
                // Show page selection for large documents
                this.showQuizPageSelection(file, material.pageCount);
                return; // Exit early, page selection will handle quiz generation
              } else {
                // Small document - generate quiz from all pages
                result = await apiService.processFileForQuiz(file, []);

                if (result && result.success) {
                  // Start interactive quiz with the generated questions
                  const contentInfo = `Plik: ${file.name} (wszystkie strony)`;
                  await this.startInteractiveQuiz(result, contentInfo);
                  return; // Exit early, quiz started
                }
              }
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
            this.processedResult.processingType = this.selectedProcessing; // Ensure processing type is set
            this.showResultDialog = true;
            this.closeMaterialDialog();

            const processingType = this.getProcessingLabel();
            this.showNotification(
              `Pomyślnie wygenerowano ${processingType} dla: ${contentInfo}`,
              "success"
            );

            // For lecture, always show the results (audio player will handle loading state)
            // No auto-loading - user will manually trigger audio generation
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

            // Update session limits
            if (result.questionsGenerated) {
              this.quizSession.questionsGenerated = result.questionsGenerated;
              this.quizSession.maxQuestions = result.maxQuestions;
              this.quizSession.hasMore = result.hasMore;
            }
          } else {
            // Check if we've reached the maximum
            if (result.questionsGenerated >= result.maxQuestions) {
              this.showNotification(
                `Osiągnięto maksymalną liczbę pytań (${result.maxQuestions}). Kliknij "Zakończ Quiz" aby zobaczyć wyniki.`,
                "info"
              );
            } else {
              this.showNotification(
                "Nie udało się wygenerować nowego pytania",
                "warning"
              );
            }
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
    getQuestionResultColor(index) {
      if (index >= this.quizResults.totalAnswered) {
        return "grey"; // Not answered
      }
      // For answered questions, use simple logic: first N questions correct, rest incorrect
      // This is a simplified approach - in a real implementation you'd store individual answers
      return index < this.quizResults.score ? "success" : "error";
    },
    getQuestionResultIcon(index) {
      if (index >= this.quizResults.totalAnswered) {
        return "mdi-help"; // Not answered
      }
      // For answered questions, use simple logic: first N questions correct, rest incorrect
      return index < this.quizResults.score ? "mdi-check" : "mdi-close";
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

.audio-player-container {
  padding: 8px;
}

.audio-player-container audio {
  border-radius: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.audio-player-container audio:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.preview-content {
  height: 100%;
}

.preview-text {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-family: "Roboto", sans-serif;
  text-align: justify;
  hyphens: auto;
  word-break: break-word;
}

/* Custom scrollbar for the preview card content */
.v-card-text::-webkit-scrollbar {
  width: 6px;
}

.v-card-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
