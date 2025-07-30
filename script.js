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
            <img src="" class="result_img">
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
                a.download = `our-ai${new Date().getHours()}.jpg`
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
        let image = `https://cataas.com/cat?uninque=${Math.floor(Math.random() * 10000)}`;
        images.push(image);
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


// flux ai image
const fetchRandomFluxImages = async (imageCount, prompt) => {
  let images = [];

  for (let i = 0; i < imageCount; i++) {
    const url = 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php';

    const options = {
      method: 'POST',
      headers: {
        // 'x-rapidapi-key': 'c5642c1451msh4c0d46f26ef5789p14fd90jsn6b2f6fca0cc8', 
        'x-rapidapi-key': 'be5bb09bc7mshe969a797fb59043p17e973jsn430f672eb2e3', 
        'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        style_id: 4,
        size: '1-1'
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json(); 

      console.log(result);

      if (result.final_result && Array.isArray(result.final_result)) {
        result.final_result.forEach(item => {
          images.push(item.origin);
        });
      } else {
        images.push("error");
      }

    } catch (error) {
      images.push("error");
    }
  }

  return images;
}

// picsum

const fetchRandomPicsumImages = async (count) => {
  let images = [];
  for (let i = 0; i < count; i++) {
    try {
      let image = await `https://picsum.photos/512/512?random=${Math.random()}`;
      images.push(image);
    } catch(error) {
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
  } else if (selectedValue === "picsum") {
    promptInput.value = "picsum Random Image";
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
  
  if (selectedModel === "Random_Cat_Image") {
    addAiMessage(imageCount); // AI Loading
    setTimeout(async () => {
      const images = await fetchRandomCatImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  
  } else if (selectedModel === "Random_Dog_Image") {
    addAiMessage(imageCount); // AI Loading
    setTimeout(async () => {
      const images = await fetchRandomDogImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  
  } else if (selectedModel === "flux") {
    promptInput.value = "";
    addAiMessage(imageCount); // AI Loading with prompt
    setTimeout(async () => {
      const images = await fetchRandomFluxImages(imageCount, promptText);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "picsum") {
    addAiMessage(imageCount); // AI Loading with prompt
    setTimeout(async () => {
      const images = await fetchRandomPicsumImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  }
  
  chatMassengs.scrollTop = chatMassengs.scrollHeight;

};


promptForm.addEventListener("submit", handleFormSubmit);