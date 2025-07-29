// ======================= DOM Elements =======================

const header = document.querySelector(".header");
const chatMassengs = document.querySelector(".chatMassengs");
const promptForm = document.querySelector(".prompt_form");
const promptInput = document.querySelector(".prompt_input");
const promptBtn = document.querySelector(".prompt_btn");
const modelSelect = document.querySelector("#model_select");
const countSelect = document.querySelector("#count_select");
const generatebtn = document.querySelector(".generate_btn");

// ======================= Example Prompts =======================

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

// ======================= Random Prompt Fill =======================

promptBtn.addEventListener("click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

// ======================= Add Messages =======================

// add user messages
const addUserMessage = (promptText) => {
  console.log(promptText);
  chatMassengs.innerHTML += `
        <div class="userChat">
                <span>ME</span>
                <p>${promptText}</p>
        </div>`;
}

// add ai messages with loading class and without (ai image and error)
const addAiMessage = (count) => {
  let galleryHtml = `
      <div class="aiChat">
        <span>OUR AI</span>
        <section class="gallery_grid">
  `;
  for (let i = 0; i < count; i++) {
    galleryHtml += `
        <div class="img_card loading">
            <div class="status_container">
                <div class="spinner"></div>
                <i class="fa-solid fa-triangle-exclamation" id="errorIcon"></i>
                <p class="status_text">Generating...</p>
            </div>
            <img src="test.png" class="result_img">
            <div class="img_overlay">
                <button class="img_download_btn">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
         </div>
    `;
  }

    galleryHtml += `
        </section>
        </div>
    `;

    chatMassengs.innerHTML += galleryHtml;
  }

  // add ai message with image and handle error
  const replaceImages = (urls) => {
    // add ai ai image
    if (urls[0] !== "error") {
        const imageCards = document.querySelectorAll(".img_card.loading");
        imageCards.forEach((card, index) => {
            const img = card.querySelector(".result_img");
            img.src = urls[index];
            card.classList.remove("loading");
      
            const overly = card.querySelector(".img_overlay");
            overly.innerHTML = `
              <button class="img_download_btn" data-url="${urls[index]}">
                  <i class="fa-solid fa-download"></i>
              </button>
            `;
            });
      
            // Download button functionality
            document.querySelectorAll(".img_download_btn").forEach((btn) => {
              btn.addEventListener("click", async () => {
                const imageURL = btn.getAttribute("data-url");
      
                console.log(imageURL);
            
              try {
                const downloadCat = await fetch(imageURL);
                const file = await downloadCat.blob();
                const  a = document.createElement("a");
                a.href = URL.createObjectURL(file);
                a.download = `cat${new Date().getSeconds()}.jpg`
                a.click();
              } catch (error) {
                console.log(error in download)
              }
            });
        });

    } else {
      // handle error
      const imageCards = document.querySelectorAll(".img_card.loading");
      imageCards.forEach((card, index) => {
        card.classList.remove("loading");
        card.classList.add("error");
      });
    }
  };


// ======================= cat and dog ai image fetch =======================

// cat images fetch
const fetchRandomCatImages = (count) => {
  let images = [];
  for (let i = 0; i < count; i++) {
      try {
        images.push(`https://cataas.com/cat?uninque=${Math.random()}`);
      } catch (error) {
        images.push("error");
      }
    }

  return images;
}

// dog images fetch
const fetchRandomDogImages = async (count) => {
  let images = [];
  for (let i = 0; i < count; i++) {
    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      images.push(data.message)
    } catch (error) {
      // console.log(`${error} ⚠️`);
      images.push("error")
    }
  }
  return images;
}

// Lexica_Art fetch
const fetchRandomLexicaArtImages = async (count, userPrompt) => {
  let images = [];
  try {
    const url = `https://lexica.art/api/v1/search?q=${encodeURIComponent(userPrompt)}`
    const res = await fetch(url);
    const dataImage = await res.json();

    if (!dataImage.images || dataImage.images.length === 0) {
      console.log("No images found for this prompt.");
      return images;
    }
    
    const shuffled = dataImage.images.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    selected.forEach(img => {
      images.push(img.srcSmall || img.src);
    });

  } catch (error) {
    console.log(`${error} : error`);
  }
  return images;
}

// DeepAi image
const fetchRandomDeepAiImages = async (count, userPrompt) => {
  let images = [];
  for (let i = 0; i < count; i++) {
    try {
      const deepAiUrl = "https://api.deepai.org/api/text2img";
      const res = await fetch(deepAiUrl, {
        method: "POST",
        headers: {
          "Api-Key": "4d834e61-1766-403a-9bb7-665bd2084b12",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `text=${encodeURIComponent(userPrompt)}`
      });

      const data = await res.json();
      console.log(data);

      // Push just the image URL
      if (data.output_url) {
        images.push(data.output_url);
      } else {
        images.push("error");
      }

    } catch (error) {
      console.error("Error:", error);
      images.push("error");
    }
  }

  return images;
};




// ======================= cat and dog extra js code =======================

modelSelect.addEventListener("change", () => {
  const selectedValue = modelSelect.value;

  if (selectedValue === "Random_Cat_Image") {
    promptInput.value = "Random Cat Image";
    promptInput.disabled = true;
    promptBtn.disabled = true;
  } else if (selectedValue === "Random_Dog_Image") {
    promptInput.value = "Random Dog Image";
    promptInput.disabled = true;
    promptBtn.disabled = true;
  } else {
    promptInput.disabled = false;
    promptBtn.disabled = false;
  }
});

// ======================= Main Form Handler =======================

const handleFormSubmit = async (e) => {
  e.preventDefault();
  generatebtn.classList.add("disabled");
  chatMassengs.classList.remove("hide");
  header.classList.add("hide");
  
  const promptText = promptInput.value.trim();
  const selectedModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value) || 1;
  
  if (!promptText || !selectedModel) return;
  
  addUserMessage(promptText);
  // promptInput.value = "";
  
  if (selectedModel === "Random_Cat_Image") {
    // ADD AI MESSGE AND LODING
    addAiMessage(imageCount)
    // WAIT FOR IMAGE
    setTimeout(async () => {
      let images = await fetchRandomCatImages(imageCount);
      replaceImages(images);
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "Random_Dog_Image") {
    // ADD AI MESSGE AND LODING
    addAiMessage(imageCount)
    // WAIT FOR IMAGE
    setTimeout(async () => {
      let images = await fetchRandomDogImages(imageCount);
      replaceImages(images);
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "Lexica_Art") {
    promptInput.value = "";
    // ADD AI MESSGE AND LODING
    addAiMessage(imageCount, promptText);
    // WAIT FOR IMAGE
    setTimeout(async () => {
      let images = await fetchRandomLexicaArtImages(imageCount, promptText);
      replaceImages(images);
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "DeepAi") {
    // ADD AI MESSGE AND LODING
    promptInput.value = "";
    addAiMessage(imageCount, promptText);
    // WAIT FOR IMAGE
    setTimeout(async () => {
      let images = await fetchRandomDeepAiImages(imageCount, promptText);
      replaceImages(images);
      generatebtn.classList.remove("disabled");
    }, 2000);
  }
};

promptForm.addEventListener("submit", handleFormSubmit);