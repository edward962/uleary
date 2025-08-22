# ULeary - Platforma do nauki

Aplikacja Vue.js umożliwiająca użytkownikom wgrywanie plików (PDF/DOCX/prezentacje) lub wklejanie tekstu, a następnie wybieranie typu przetwarzania materiału.

## Funkcjonalności

- 📁 **Wgrywanie plików** - Obsługa plików PDF, DOCX, PPTX
- 🎥 **Integracja z YouTube** - Możliwość wklejania linków do filmów
- 📝 **Wklejanie tekstu** - Bezpośrednie wprowadzanie notatek i materiałów
- 🔄 **Opcje przetwarzania**:
  - **Podsumowanie** - Generowanie streszczeń materiału
  - **Quiz** - Tworzenie pytań testowych
  - **Lektor** - Konwersja na format audio

## Instalacja i uruchomienie

1. **Zainstaluj zależności:**

   ```bash
   npm install
   ```

2. **Uruchom serwer deweloperski:**

   ```bash
   npm run dev
   ```

3. **Otwórz aplikację:**
   Aplikacja zostanie automatycznie otwarta w przeglądarce pod adresem `http://localhost:3000`

## Struktura projektu

```
├── src/
│   ├── App.vue          # Główny komponent aplikacji
│   ├── main.js          # Punkt wejścia aplikacji
│   └── style.css        # Style CSS
├── index.html           # Szablon HTML
├── package.json         # Konfiguracja npm
├── vite.config.js       # Konfiguracja Vite
└── README.md           # Dokumentacja
```

## Technologie

- **Vue.js 3** - Framework JavaScript
- **Vite** - Narzędzie do budowania i deweloperki
- **CSS3** - Stylowanie z nowoczesnymi właściwościami
- **HTML5** - Struktura aplikacji

## Użycie

1. **Stwórz zestaw do nauki** - Kliknij przycisk "Stwórz zestaw do nauki"
2. **Wybierz sposób dostarczenia materiału**:
   - Wgraj plik (PDF, DOCX, PPTX)
   - Wklej link do YouTube
   - Wklej tekst bezpośrednio
3. **Wybierz typ przetwarzania** - Podsumowanie, Quiz lub Lektor
4. **Przetwórz materiał** - Kliknij przycisk, aby rozpocząć przetwarzanie

## Planowane funkcjonalności

- Integracja z API do przetwarzania plików
- Obsługa dodatkowych formatów plików
- Zaawansowane opcje konfiguracji quizów
- Eksport wyników do różnych formatów
- System zarządzania materiałami

## Licencja

MIT
