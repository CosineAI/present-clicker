(function () {
  "use strict";

  var DURATION_SECONDS = 30;

  var prompts = [
    "Smooth is fast. Fast is smooth. Let your fingers find the rhythm of the keys.",
    "Typing is just thinking, made visible one character at a time.",
    "The quickest typists do not rush. They stay calm and trust their muscle memory.",
    "Errors are part of the process. Accuracy first, speed will always follow.",
    "Breathe in, breathe out, and let the words flow without interruption.",
    "Consistency beats bursts of speed. Set a pace you can maintain.",
    "You do not need to be perfect, only a little faster than you were yesterday.",
    "Relax your shoulders, soften your gaze, and focus on the next word only."
  ];

  var promptEl = document.getElementById("prompt");
  var inputEl = document.getElementById("typing-input");
  var timeEl = document.getElementById("time-remaining");
  var wpmEl = document.getElementById("wpm");
  var accuracyEl = document.getElementById("accuracy");
  var startBtn = document.getElementById("start-button");
  var resetBtn = document.getElementById("reset-button");
  var resultsEl = document.getElementById("results-text");

  if (!promptEl) {
    return;
  }

  var timerId = null;
  var remainingMs = DURATION_SECONDS * 1000;
  var started = false;
  var finished = false;
  var promptText = "";

  function renderPrompt() {
    promptEl.innerHTML = "";
    for (var i = 0; i < promptText.length; i++) {
      var span = document.createElement("span");
      span.textContent = promptText[i];
      span.className = "char char-untyped";
      promptEl.appendChild(span);
    }
  }

  function pickPrompt() {
    var index = Math.floor(Math.random() * prompts.length);
    promptText = prompts[index];
    renderPrompt();
  }

  function formatTime(ms) {
    var seconds = ms / 1000;
    return seconds.toFixed(1) + "s";
  }

  function computeStats() {
    var typed = inputEl.value || "";
    var correctChars = 0;
    var len = Math.min(typed.length, promptText.length);

    for (var i = 0; i < len; i++) {
      if (typed[i] === promptText[i]) {
        correctChars++;
      }
    }

    var totalChars = typed.length || 1;
    var accuracy = (correctChars / totalChars) * 100;
    if (accuracy < 0) accuracy = 0;

    var minutes = (DURATION_SECONDS - remainingMs / 1000) / 60;
    if (minutes <= 0) {
      return {
        wpm: 0,
        accuracy: 100
      };
    }

    var wordsTyped = correctChars / 5;
    var wpm = wordsTyped / minutes;

    return {
      wpm: Math.max(0, Math.round(wpm)),
      accuracy: Math.max(0, Math.min(100, Math.round(accuracy)))
    };
  }

  function updateOverlay() {
    var typed = inputEl.value || "";

    // Sanitize: single line, cap length to prompt length
    if (typed.indexOf("\n") !== -1) {
      typed = typed.replace(/\n/g, "");
      inputEl.value = typed;
    }
    if (typed.length > promptText.length) {
      typed = typed.slice(0, promptText.length);
      inputEl.value = typed;
    }

    var children = promptEl.childNodes;
    var total = children.length;

    for (var i = 0; i < total; i++) {
      var span = children[i];
      var className = "char";
      if (i < typed.length) {
        if (typed[i] === promptText[i]) {
          className += " char-correct";
        } else {
          className += " char-incorrect";
        }
      } else {
        className += " char-untyped";
      }
      span.className = className;
    }

    // Caret indicator at current position
    var caretIndex = typed.length;
    if (caretIndex >= total) {
      caretIndex = total - 1;
    }
    if (caretIndex >= 0) {
      var caretSpan = children[caretIndex];
      if (caretSpan) {
        caretSpan.className += " char-current";
      }
    }
  }

  function updateStatsDisplay() {
    var stats = computeStats();
    wpmEl.textContent = String(stats.wpm);
    accuracyEl.textContent = stats.accuracy + "%";
  }

  function updateTimeDisplay() {
    timeEl.textContent = formatTime(remainingMs);
  }

  function startTimer() {
    var last = performance.now();

    timerId = requestAnimationFrame(function tick(now) {
      if (!started || finished) {
        return;
      }

      var delta = now - last;
      last = now;

      remainingMs -= delta;
      if (remainingMs <= 0) {
        remainingMs = 0;
        finishRun();
        updateTimeDisplay();
        return;
      }

      updateTimeDisplay();
      timerId = requestAnimationFrame(tick);
    });
  }

  function beginRun() {
    if (finished) {
      resetGame();
    }

    // Prepare a new run; actual timer starts on first keystroke.
    started = false;
    finished = false;
    remainingMs = DURATION_SECONDS * 1000;
    inputEl.value = "";
    inputEl.removeAttribute("disabled");
    inputEl.focus();
    startBtn.disabled = true;
    pickPrompt();
    updateOverlay();
    updateTimeDisplay();
    updateStatsDisplay();
  }

  function finishRun() {
    if (finished) return;

    finished = true;
    started = false;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }

    inputEl.setAttribute("disabled", "true");

    var stats = computeStats();
    wpmEl.textContent = String(stats.wpm);
    accuracyEl.textContent = stats.accuracy + "%";

    resultsEl.textContent =
      "You reached " + stats.wpm + " WPM at " + stats.accuracy + "% accuracy.";

    startBtn.disabled = false;
  }

  function resetGame() {
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
    started = false;
    finished = false;
    remainingMs = DURATION_SECONDS * 1000;
    updateTimeDisplay();
    wpmEl.textContent = "0";
    accuracyEl.textContent = "100%";
    inputEl.value = "";
    inputEl.removeAttribute("disabled");
    startBtn.disabled = false;
    resultsEl.textContent = "No runs yet – press Start to play.";
    pickPrompt();
    updateOverlay();
  }

  function handleInput() {
    if (finished) {
      return;
    }

    // Start the timer on the very first keystroke.
    if (!started) {
      started = true;
      remainingMs = DURATION_SECONDS * 1000;
      updateTimeDisplay();
      startTimer();
    }

    updateOverlay();
    updateStatsDisplay();
  }

  startBtn.addEventListener("click", beginRun);
  resetBtn.addEventListener("click", resetGame);
  inputEl.addEventListener("input", handleInput);

  promptEl.addEventListener("click", function () {
    if (inputEl.disabled) return;
    inputEl.focus();
  });

  // Initial state
  pickPrompt();
  updateOverlay();
  updateTimeDisplay();
  updateStatsDisplay();
})();