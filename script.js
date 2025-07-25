const outputDiv = document.getElementById("output");
    const userInput = document.getElementById("userInput");

    function typeText(role, text, delay = 40) {
      const msg = document.createElement("div");
      msg.innerHTML = `<strong>${role}:</strong> <span></span>`;
      outputDiv.appendChild(msg);
      outputDiv.scrollTop = outputDiv.scrollHeight;

      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          msg.querySelector("span").textContent += text.charAt(i);
          i++;
          outputDiv.scrollTop = outputDiv.scrollHeight;
        } else {
          clearInterval(interval);
        }
      }, delay);
    }

    function appendMessage(role, message) {
      const msg = document.createElement("div");
      msg.innerHTML = `<strong>${role}:</strong> ${message}`;
      outputDiv.appendChild(msg);
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    function sendMessage() {
      const input = userInput.value.trim();
      if (!input) return;

      appendMessage("You", input);
      userInput.value = "";

      const lowerInput = input.toLowerCase();

      // --- Timer Handler FIRST to avoid 'time' interference ---
      if (lowerInput.startsWith("set timer for")) {
        const timeStr = lowerInput.replace("set timer for", "").trim();
        const parts = timeStr.split(" ");
        const value = parseInt(parts[0]);
        const unit = parts[1];

        if (isNaN(value) || !["sec", "min", "hour"].includes(unit)) {
          const msg = "Please type like: 'set timer for 10 sec', '2 min', or '1 hour'";
          typeText("Jarvis", msg);
          speak(msg);
          return;
        }

        let milliseconds = 0;
        if (unit === "sec") milliseconds = value * 1000;
        if (unit === "min") milliseconds = value * 60 * 1000;
        if (unit === "hour") milliseconds = value * 60 * 60 * 1000;

        const reply = `Timer set for ${value} ${unit}`;
        typeText("Jarvis", reply);
        speak(reply);

        setTimeout(() => {
          const doneMsg = `Time's up! Your ${value} ${unit} timer ended.`;
          typeText("Jarvis", doneMsg);
          speak(doneMsg);
        }, milliseconds);
        return;
      }

      // --- Other Command Handlers ---
      if (lowerInput === "what can you do?") {
        const reply = "I can tell you time, date, open any websites in the world, search online, set timers, and more.";
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }

      if (lowerInput === "bye") {
        const reply = "बाई सर, आपसे मिलकर अच्छा लगा, मीट यू नेक्स्ट टाइम.";
        typeText("Jarvis", reply);
        speak(reply, "hi-IN");
        return;
      }

      if (lowerInput === "give command list") {
        const reply = "1. hi , 2. bye , 3. who are you , 4. time , 5. date , 6. set timer (example: set timer for 5 sec) , 7. open website (example: open amazon) , 8. search for anything (example: search iron man).";
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }

      if (lowerInput.startsWith("say ")){
        const reply = lowerInput.replace("say ", "").replaceAll(" ", "").replaceAll("/", "");
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }


      if (lowerInput === "who are you") {
        const reply = "I am Jarvis, a powerful AI made by Kshitiz Saxena.";
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }

      if (lowerInput === "hi") {
        const reply = "नमस्ते, मैं जार्विस हूं";
        typeText("Jarvis", reply);
        speak(reply, "hi-IN");
        return;
      }

      if (lowerInput === "open yourself") {
        window.open("https://kshitiz289.github.io/jarvis/", "_blank");
        return;
      }

      if (lowerInput.startsWith("open ")) {
        const site = lowerInput.replace("open ", "").replaceAll(" ", "").replaceAll("/", "");
        const url = `https://${site}.com`;
        speak("Opening " + site);
        window.open(url, "_blank");
        typeText("Jarvis", `Opening ${url}...`);
        return;
      }

      if (lowerInput.includes("time")) {
        const now = new Date().toLocaleTimeString();
        const reply = `The time is ${now}`;
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }

      if (lowerInput.includes("date")) {
        const today = new Date();
        const dateString = today.toLocaleDateString("en-IN", {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const reply = `Today is ${dateString}`;
        typeText("Jarvis", reply);
        speak(reply);
        return;
      }

      if (lowerInput.startsWith("search ")) {
        const query = lowerInput.replace("search ", "").trim();
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        typeText("Jarvis", `Searching for "${query}"...`);
        speak(`Searching for ${query}`);
        window.open(searchUrl, "_blank");
        return;
      }

      const fallback = "Sorry, I didn't understand that.";
      typeText("Jarvis", fallback);
      speak(fallback);
    }

    function speak(text, lang = "en-GB") {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.voice = speechSynthesis.getVoices().find(v => v.lang === lang) || null;
      utter.rate = 1;
      speechSynthesis.speak(utter);
    }

    function startListening() {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-IN";
      recognition.start();

      recognition.onresult = (event) => {
        const voiceInput = event.results[0][0].transcript;
        userInput.value = voiceInput;
        sendMessage();
      };

      recognition.onerror = () => {
        typeText("Jarvis", "Could not understand. Please try again.");
      };
    }

    function toggleTheme() {
      document.body.classList.toggle("dark-mode");
    }

    window.onload = () => {
      setTimeout(() => speechSynthesis.getVoices(), 100);
    };
