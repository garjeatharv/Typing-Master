var dictionary = ["coffee", "car", "music", "book", "friend", "family", "work", "school", "home", "food", "water", "money", "love", "time", "dream", "sleep", "smile", "laugh", "cry", "happy", "sad", "angry", "busy", "tired", "hunger", "thirst", "watch", "clock", "key", "door", "window", "table", "chair", "bed", "shower", "toilet", "mirror", "clothes", "shoes", "hat", "bag", "wallet", "paper", "pen", "pencil", "notebook", "letter", "email", "message", "photo", "video", "game", "sport", "exercise", "yoga", "walk", "run", "bike", "swim", "sun", "moon", "star", "sky", "cloud", "rain", "snow", "wind", "tree", "flower", "grass", "ocean", "river", "lake", "mountain", "forest", "beach", "road", "carpet", "painting", "sculpture", "poem", "dance", "movie", "party", "birthday", "holiday", "vacation", "journey", "adventure", "pet", "bird", "dog", "cat", "rabbit", "fish", "sunset", "sunrise", "bookstore", "restaurant", "library"];

let words = [];
let wordIndex = 0;
let spanWords = [];
let startTime = Date.now();
let radiovalue;


const quoteElement = document.getElementById("quote");
const spans = quoteElement.getElementsByTagName("span");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const speedElement = document.getElementById("speed");
var noWords = document.getElementById("detlss");
var hideHigh = document.getElementsByClassName("hideHigh");
const toggleSwitch = document.getElementById("toggleSwitch");


function highlightCurrentWord() {
  for (let i = 0; i < wordIndex; i++) {
    spans[i].className = "cg";
  }
  for (let i = wordIndex+1; i < spans.length; i++) {
    spans[i].className = "cw";
  }
  spans[wordIndex].className = "highlight";
}

document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener to the switch
  const toggleSwitch = document.getElementById("toggleSwitch");
  if (toggleSwitch) {
    toggleSwitch.addEventListener("change", function () {
      // Check the state of the switch (ON or OFF)
      if (toggleSwitch.checked) {
        dictionary = dictionary.map((word) => word.toLowerCase());
        // console.log(dictionary)
      }
    });
  }
});

document.getElementById("start").addEventListener("click", function () {
  while (quoteElement.firstChild) {
    quoteElement.removeChild(quoteElement.firstChild);
  }
  // Get the selected radio button value
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  );

  if (selectedCategory !== null) {
    radiovalue = selectedCategory.value;
    if (radiovalue === "Coding") {
      let programmerDictionary = [
        "API",
        "Angular",
        "Async",
        "await",
        "axios",
        "branch",
        "break",
        "bug",
        "callback",
        "case",
        "catch",
        "class",
        "clone",
        "component",
        "concat",
        "console",
        "continue",
        "constructor",
        "CSS",
        "Date",
        "Debugging",
        "develop",
        "DOM",
        "else",
        "Error",
        "ES6",
        "Event",
        "Exception",
        "export",
        "Express",
        "feature",
        "fetch",
        "finally",
        "filter",
        "finally",
        "forEach",
        "fork",
        "forEach",
        "function",
        "Git",
        "GitHub",
        "HTML",
        "if",
        "import",
        "includes",
        "indexOf",
        "instance",
        "interface",
        "issue",
        "JavaScript",
        "Jest",
        "join",
        "JSON",
        "JQuery",
        "JSDoc",
        "JSHint",
        "JSX",
        "localStorage",
        "log",
        "loop",
        "map",
        "master",
        "method",
        "module",
        "MongoDB",
        "MySQL",
        "Node.js",
        "npm",
        "object",
        "package",
        "parameter",
        "pop",
        "promise",
        "pull",
        "push",
        "React",
        "reduce",
        "render",
        "REST",
        "return",
        "slice",
        "sessionStorage",
        "shift",
        "sort",
        "split",
        "state",
        "setTimeout",
        "splice",
        "Testing",
        "throw",
        "TypeScript",
        "unshift",
        "useEffect",
        "useState",
        "version",
        "Vue",
        "variable",
        "Webpack",
        "while",
        "yarn",
      ];
      // console.log("The program length is :", programmerDictionary.length);
      for (let t = 0; t < 100; t++) {
        dictionary[t] = programmerDictionary[t];
      }
    }
    if (radiovalue === "Animals") {
      const animalDictionary = [
        "albatross",
        "alligator",
        "alpaca",
        "ant",
        "antelope",
        "armadillo",
        "baboon",
        "barracuda",
        "bat",
        "bear",
        "beaver",
        "bee",
        "bird",
        "bison",
        "bluebird",
        "boar",
        "bonobo",
        "butterfly",
        "bactrian camel",
        "cat",
        "cheetah",
        "chicken",
        "chameleon",
        "clam",
        "clownfish",
        "cougar",
        "cow",
        "crab",
        "crane",
        "crow",
        "deer",
        "dolphin",
        "duck",
        "eagle",
        "echidna",
        "elephant",
        "emu",
        "flamingo",
        "frog",
        "giraffe",
        "gnu",
        "goose",
        "guanaco",
        "hawk",
        "heron",
        "hippo",
        "horse",
        "jaguar",
        "jellyfish",
        "kangaroo",
        "kiwi",
        "koala",
        "lion",
        "lynx",
        "magpie",
        "mantis",
        "monkey",
        "okapi",
        "opossum",
        "ostrich",
        "otter",
        "oyster",
        "panda",
        "parrot",
        "penguin",
        "polar bear",
        "peacock",
        "pig",
        "platypus",
        "rabbit",
        "raccoon",
        "raven",
        "robin",
        "seahorse",
        "seal",
        "sheep",
        "shark",
        "sheep",
        "shark",
        "snail",
        "snake",
        "snow leopard",
        "sparrow",
        "spider",
        "starfish",
        "stingray",
        "squirrel",
        "tiger",
        "tortoise",
        "turtle",
        "vicuna",
        "vulture",
        "wallaby",
        "warthog",
        "whale",
        "wildcat",
        "wolf",
        "wombat",
        "yak",
        "zebra",
      ]
        .sort()
        .slice(0, 100);
      // console.log("The animals length is :", animalDictionary.length);
      for (let t = 0; t < 100; t++) {
        dictionary[t] = animalDictionary[t];
      }
    }
    if (radiovalue === "Things") {
      let commonThingsDictionary = [
        "air",
        "water",
        "fire",
        "earth",
        "sun",
        "moon",
        "star",
        "cloud",
        "wind",
        "rain",
        "snow",
        "tree",
        "flower",
        "grass",
        "mountain",
        "ocean",
        "beach",
        "island",
        "desert",
        "forest",
        "bridge",
        "house",
        "tower",
        "city",
        "farm",
        "school",
        "library",
        "park",
        "market",
        "store",
        "cafe",
        "bar",
        "hotel",
        "beach",
        "picnic",
        "festival",
        "concert",
        "party",
        "wedding",
        "birthday",
        "holiday",
        "vacation",
        "journey",
        "adventure",
        "dream",
        "love",
        "friendship",
        "family",
        "child",
        "parent",
        "sibling",
        "grandparent",
        "pet",
        "book",
        "movie",
        "music",
        "art",
        "painting",
        "sculpture",
        "poem",
        "dance",
        "sport",
        "game",
        "puzzle",
        "toy",
        "computer",
        "phone",
        "camera",
        "watch",
        "clock",
        "key",
        "map",
        "compass",
        "glasses",
        "mirror",
        "pen",
        "pencil",
        "notebook",
        "letter",
        "envelope",
        "postcard",
        "money",
        "wallet",
        "bag",
        "shoe",
        "hat",
        "scarf",
        "glove",
        "umbrella",
        "jacket",
        "shirt",
        "dress",
        "skirt",
        "jeans",
        "socks",
        "shovel",
        "hammer",
        "screwdriver",
        "knife",
        "scissors",
      ];

      for (let t = 0; t < 100; t++) {
        dictionary[t] = commonThingsDictionary[t];
      }
    }
    if (radiovalue === "Places") {
      let placesDictionary = [
        "Africa",
        "Alaska",
        "Alberta",
        "Amazon",
        "Antarctica",
        "Argentina",
        "Arizona",
        "Arkansas",
        "Asia",
        "Australia",
        "Buenos Aires",
        "California",
        "Cairo",
        "Canada",
        "Central Park",
        "Chennai",
        "Chicago",
        "China",
        "City",
        "Countryside",
        "Delhi",
        "Desert",
        "Dubai",
        "Egypt",
        "Eiffel Tower",
        "Florida",
        "Forest",
        "France",
        "Germany",
        "Grand Canyon",
        "Great Barrier Reef",
        "Hawaii",
        "Hawaii Volcanoes National Park",
        "Himalayas",
        "Hollywood",
        "Hawaii",
        "Istanbul",
        "India",
        "Indonesia",
        "Island",
        "Italy",
        "Jakarta",
        "Japan",
        "Jerusalem",
        "Kolkata",
        "Lake",
        "Las Vegas",
        "London",
        "Los Angeles",
        "Madrid",
        "Manhattan",
        "Mexico",
        "Mumbai",
        "Mount Everest",
        "Mountain",
        "National Park",
        "New York",
        "Niagara Falls",
        "Nigeria",
        "Oceania",
        "Ocean",
        "Pacific Ocean",
        "Pakistan",
        "Paris",
        "Park",
        "Peru",
        "Pyramids of Giza",
        "River",
        "Russia",
        "San Francisco",
        "Saudi Arabia",
        "Sahara Desert",
        "Santiago",
        "São Paulo",
        "Seoul",
        "Shanghai",
        "Singapore",
        "South Africa",
        "South Korea",
        "Spain",
        "Stonehenge",
        "Sydney",
        "Taj Mahal",
        "Texas",
        "Thailand",
        "The Louvre",
        "The Vatican",
        "Tokyo",
        "Toronto",
        "Turkey",
        "United Kingdom",
        "United States",
        "Venice",
        "Vienna",
        "Vietnam",
        "Village",
        "Washington D.C.",
        "Yosemite National Park",
        "Zion National Park",
        "Zurich",
      ];
      console.log("The animals length is :", placesDictionary.length);
      for (let t = 0; t < 100; t++) {
        dictionary[t] = placesDictionary[t];
      }
    }
  } else {
    console.log("No category selected");
  }

  const instructionsElement = document.querySelector("div.instructions");
  instructionsElement.classList.add("hide");
  let wordCount = Math.floor(Math.random() * 5) + 3;
  if (noWords.value >= 3 && noWords.value <= 100) {
    wordCount = noWords.value;
  }
  words = [];
  for (let i = 0; i < wordCount; i++) {
    toggleSwitch.addEventListener("change", function () {
      if (toggleSwitch.checked) {
        dictionary = dictionary.map((word) => word.toLowerCase());
      }else{
        dictionary = dictionary.map((word) => word.toLocaleUpperCase());
      }
    });
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    words.push(dictionary[randomIndex].toLowerCase());
  }
  wordIndex = 0;

  for (let i = 0; i < words.length; i++) {
    spanWords.push(`${words[i]} `);
  }
  quoteElement.innerHTML = ""; // Clear the existing content

  // Create spans with words for each word in the array
  spanWords = words.map((word) => `<span>${word} </span>`);
  quoteElement.innerHTML = spanWords.join("");

  highlightCurrentWord(); // Highlight the first word

  quoteElement.childNodes[0].className = "highlight";
  messageElement.innerText = "";

  typedValueElement.value = "";
  typedValueElement.focus();

  startTime = new Date().getTime();
});

typedValueElement.addEventListener("input", (e) => {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord) {
    quoteElement.childNodes[wordIndex].style.color = "green";
  } else {
      highlightCurrentWord();
  }
  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    const typingSpeed = Math.round((words.length / (elapsedTime / 1000)) * 60);
    const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds. Your typing speed is ${typingSpeed}WPM.`;
    messageElement.innerText = message;
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    typedValueElement.value = "";
    wordIndex++;

    highlightCurrentWord();

    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = "";
    }
    for (let i = 0; i < wordIndex; i++) {
      quoteElement.childNodes[i].style.color = "grey";
    }
    quoteElement.childNodes[wordIndex].className = "highlight";
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = "";
  } else {
    typedValueElement.className = "error";
  }
});