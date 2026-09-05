let words = [];
let wordIndex = 0;
let spanWords = [];
let startTime = Date.now();

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const noWords = document.getElementById("detlss");
const toggleSwitch = document.getElementById("toggleSwitch");

function highlightCurrentWord() {
  const spans = quoteElement.getElementsByTagName("span");
  for (let i = 0; i < wordIndex; i++) {
    spans[i].className = "cg";
    spans[i].style.color = "grey";
  }
  for (let i = wordIndex + 1; i < spans.length; i++) {
    spans[i].className = "cw";
    spans[i].style.color = "";
  }
  if (spans[wordIndex]) {
    spans[wordIndex].className = "highlight";
    spans[wordIndex].style.color = "";
  }
}

document.getElementById("start").addEventListener("click", async function () {
  // Clear any existing message or content
  while (quoteElement.firstChild) {
    quoteElement.removeChild(quoteElement.firstChild);
  }
  messageElement.innerText = "Loading words from backend...";

  // 1. Get selected category
  const selectedCategory = document.querySelector('input[name="category"]:checked');
  const category = selectedCategory ? selectedCategory.value : "Coding"; // Default to Coding

  // 2. Get requested word count
  let wordCount = 20; // default count
  const enteredVal = parseInt(noWords.value, 10);
  if (enteredVal >= 3 && enteredVal <= 100) {
    wordCount = enteredVal;
  } else {
    noWords.value = wordCount; // Show the default count in input
  }

  try {
    // 3. Fetch words dynamically from Express REST API
    const response = await fetch(`/api/words?category=${category}&count=${wordCount}`);
    const resData = await response.json();

    if (!resData.success) {
      messageElement.innerText = `Error: ${resData.message || "Failed to load words"}`;
      return;
    }

    let fetchedWords = resData.data;
    if (!fetchedWords || fetchedWords.length === 0) {
      messageElement.innerText = "No words found in database for this category.";
      return;
    }

    // 4. Clean instructions & reset variables
    const instructionsElement = document.querySelector("div.instructions");
    if (instructionsElement) {
      instructionsElement.classList.add("hide");
    }

    // Apply Capitalization toggle state to the fetched words
    if (toggleSwitch && toggleSwitch.checked) {
      words = fetchedWords.map(word => word.toLowerCase());
    } else {
      // Default to exact word database representation or capitalize first letter
      words = fetchedWords;
    }

    wordIndex = 0;
    messageElement.innerText = "";
    typedValueElement.value = "";
    typedValueElement.className = "";
    typedValueElement.disabled = false;
    typedValueElement.focus();

    // 5. Render spans
    spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join("");

    // Highlight first word
    highlightCurrentWord();
    startTime = Date.now();

  } catch (err) {
    console.error("Failed to load words:", err);
    messageElement.innerText = "Network error while fetching words. Please try again.";
  }
});

typedValueElement.addEventListener("input", () => {
  if (words.length === 0) return;

  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  // Real-time capitalization switch handler (updates active words dynamically if toggled mid-game)
  const isLowercase = toggleSwitch && toggleSwitch.checked;
  const processedCurrentWord = isLowercase ? currentWord.toLowerCase() : currentWord;

  if (typedValue === processedCurrentWord && wordIndex === words.length - 1) {
    // Game completed!
    const elapsedTime = Date.now() - startTime;
    const elapsedSeconds = elapsedTime / 1000;
    const typingSpeed = Math.round((words.length / elapsedSeconds) * 60);

    messageElement.innerHTML = `🏁 <strong>CONGRATULATIONS!</strong> You finished in <strong>${elapsedSeconds.toFixed(2)}</strong> seconds.<br>⚡ Speed: <strong>${typingSpeed} WPM</strong>.`;
    
    // Highlight the final word as green
    const spans = quoteElement.getElementsByTagName("span");
    if (spans[wordIndex]) {
      spans[wordIndex].className = "cg";
      spans[wordIndex].style.color = "green";
    }
    typedValueElement.value = "";
    typedValueElement.disabled = true;

  } else if (typedValue.endsWith(" ") && typedValue.trim() === processedCurrentWord) {
    // Word completed, advance to next word
    typedValueElement.value = "";
    wordIndex++;
    highlightCurrentWord();
    
    // Update colors: make completed words grey
    const spans = quoteElement.getElementsByTagName("span");
    for (let i = 0; i < wordIndex; i++) {
      spans[i].style.color = "grey";
      spans[i].className = "";
    }
  } else if (processedCurrentWord.startsWith(typedValue)) {
    // Current input is correct so far
    typedValueElement.className = "";
    const spans = quoteElement.getElementsByTagName("span");
    if (spans[wordIndex]) {
      spans[wordIndex].className = "highlight";
    }
  } else {
    // Input mismatch (typing error)
    typedValueElement.className = "error";
    const spans = quoteElement.getElementsByTagName("span");
    if (spans[wordIndex]) {
      spans[wordIndex].className = "highlight error-highlight";
    }
  }
});
