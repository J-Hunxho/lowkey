if (window.location.hostname === "www.lowkey.luxury") {
  window.location.replace(
    "https://lowkey.luxury" + window.location.pathname + window.location.search,
  );
}

window.addEventListener("load", () => {
  "use strict";

  const flakesContainer = document.getElementById("flakes-container");
  if (flakesContainer) {
    const flakeCount = 50;
    for (let i = 0; i < flakeCount; i++) {
      const flake = document.createElement("div");
      flake.className = "flake";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.width = `${Math.random() * 3 + 1}px`;
      flake.style.height = flake.style.width;
      flake.style.animationDelay = `${Math.random() * 10}s`;
      flake.style.animationDuration = `${Math.random() * 10 + 8}s`;
      flakesContainer.appendChild(flake);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 },
  );
  document
    .querySelectorAll(".ghost-fade-in")
    .forEach((el) => observer.observe(el));

  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translate(0,0)";
    });
  });

  const cipherInput = document.getElementById("cipher-input");
  const cipherOutput = document.getElementById("cipher-output");
  const cipherKey = "lowkey";

  function lowkeyCipher(text, key, encode = true) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      result += String.fromCharCode(
        encode ? charCode + keyCode : charCode - keyCode,
      );
    }
    return encode ? btoa(result) : atob(result);
  }

  if (cipherInput) {
    cipherInput.addEventListener("input", (e) => {
      const text = e.target.value;
      if (text) {
        try {
          cipherOutput.value = lowkeyCipher(text, cipherKey, true);
        } catch (err) {
          cipherOutput.value = "Invalid character for encoding.";
        }
      } else {
        cipherOutput.value = "";
      }
    });
  }

  const signalFileInput = document.getElementById("signal-file-input");
  if (signalFileInput) {
    const signalCanvas = document.getElementById("signal-image-canvas");
    const signalCtx = signalCanvas.getContext("2d");
    const signalMessageInput = document.getElementById("signal-message");
    const encodeBtn = document.getElementById("signal-encode-btn");
    const decodeBtn = document.getElementById("signal-decode-btn");
    const signalOutput = document.getElementById("signal-output");
    const fileInputLabel = document.getElementById("file-input-label");

    signalFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            signalCanvas.width = img.width;
            signalCanvas.height = img.height;
            signalCtx.drawImage(img, 0, 0);
            signalCanvas.classList.remove("hidden");
            fileInputLabel.textContent = file.name;
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        signalOutput.textContent = "Error: Please select a valid PNG image.";
      }
    });

    encodeBtn.addEventListener("click", () => {
      const message = signalMessageInput.value;
      if (!signalCanvas.width || !message) {
        signalOutput.textContent =
          "Error: Image and message are required to encode.";
        return;
      }

      const imageData = signalCtx.getImageData(
        0,
        0,
        signalCanvas.width,
        signalCanvas.height,
      );
      const data = imageData.data;
      const binaryMessage =
        message
          .split("")
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join("") + "11111111";

      if (binaryMessage.length > data.length / 4) {
        signalOutput.textContent = "Error: Message is too long for this image.";
        return;
      }

      for (let i = 0; i < binaryMessage.length; i++) {
        data[i * 4] = (data[i * 4] & 0xfe) | parseInt(binaryMessage[i], 2);
      }

      signalCtx.putImageData(imageData, 0, 0);
      const dataUrl = signalCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "lowkey-signal.png";
      link.href = dataUrl;
      link.click();
      signalOutput.textContent = "Signal encoded and downloaded.";
    });

    decodeBtn.addEventListener("click", () => {
      if (!signalCanvas.width) {
        signalOutput.textContent = "Error: Load an image to decode.";
        return;
      }
      const imageData = signalCtx.getImageData(
        0,
        0,
        signalCanvas.width,
        signalCanvas.height,
      );
      const data = imageData.data;
      let binaryMessage = "";
      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1).toString();
      }

      const bytes = binaryMessage.match(/.{1,8}/g);
      let message = "";
      for (const byte of bytes) {
        if (byte === "11111111") break;
        message += String.fromCharCode(parseInt(byte, 2));
      }
      signalOutput.textContent = message
        ? `Decoded Signal: ${message}`
        : "No signal found.";
    });
  }

  const protocolSection = document.getElementById("protocol-section");
  const letterSection = document.getElementById("letter-section");
  const unlockedContent = document.getElementById("unlocked-content");
  const protocolForm = document.getElementById("protocol-form");

  if (protocolForm) {
    protocolForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("protocol-email").value;
      const submitButton = e.target.querySelector("button");
      if (!email) return;

      submitButton.disabled = true;
      submitButton.textContent = "Transmitting...";

      try {
        console.log("Telegram notification would be sent for:", email);

        protocolSection.style.transition = "opacity 0.5s ease-out";
        protocolSection.style.opacity = "0";
        setTimeout(() => {
          protocolSection.classList.add("hidden");
          letterSection.classList.remove("hidden");
          letterSection.classList.add("is-visible");
        }, 500);
      } catch (error) {
        console.error("Protocol Initiation Failed:", error);
        submitButton.textContent = "Transmission Failed";
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = "Initiate Protocol";
        }, 2000);
      }
    });
  }

  if (letterSection) {
    letterSection.addEventListener(
      "click",
      () => {
        letterSection.classList.add("open");
        setTimeout(() => {
          letterSection.style.transition = "opacity 0.5s ease-out";
          letterSection.style.opacity = "0";
          setTimeout(() => {
            letterSection.classList.add("hidden");
            unlockedContent.classList.remove("hidden");
            unlockedContent.classList.add("ghost-fade-in", "is-visible");
          }, 500);
        }, 800);
      },
      { once: true },
    );
  }

  const oracleForm = document.getElementById("oracle-form");
  if (oracleForm) {
    oracleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const question = document.getElementById("oracle-question").value.trim();
      const oracleLoader = document.getElementById("oracle-loader");
      const oracleResponseEl = document.getElementById("oracle-response");
      const oracleSubmitBtn = document.getElementById("oracle-submit");
      if (!question) return;

      oracleLoader.classList.remove("hidden");
      oracleResponseEl.textContent = "Consulting the stream...";
      oracleSubmitBtn.disabled = true;

      const systemPrompt =
        "You are a cryptic oracle. Respond to the user's question with a short, profound, philosophical insight of one or two sentences. Do not be conversational. Be mysterious and abstract.";
      const fullPrompt = `${systemPrompt}\n\nUser's question: "${question}"`;

      try {
        let chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyBK2R2tg5pifniF-8toXIp_KSCEs2XAMXw"; // Gemini API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0) {
          oracleResponseEl.textContent =
            result.candidates[0].content.parts[0].text;
        } else {
          throw new Error("Invalid response structure from API.");
        }
      } catch (error) {
        console.error("Oracle Error:", error);
        oracleResponseEl.textContent = "The signal is weak. Try again later.";
      } finally {
        oracleLoader.classList.add("hidden");
        oracleSubmitBtn.disabled = false;
      }
    });
  }
});
