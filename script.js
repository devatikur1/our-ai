// ======================= DOM Elements =======================

const header = document.querySelector(".header");
const chatMassengs = document.querySelector(".chatMassengs");
const promptForm = document.querySelector(".prompt_form");
const promptInput = document.querySelector(".prompt_input");
const promptBtn = document.querySelector(".prompt_btn");
const modelSelect = document.querySelector("#model_select");
const countSelect = document.querySelector("#count_select");
const generatebtn = document.querySelector(".generate_btn");

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

    // add full ai chat and loading
    chatMassengs.innerHTML += galleryHtml;
  }

  // Add ai message with image and handle error
  const replaceImages = (urls) => {
    const imageCards = document.querySelectorAll(".img_card.loading");
  
    imageCards.forEach((card, index) => {
  
      if (urls[index] === "error") {
        card.classList.remove("loading");
        card.classList.add("error");
        return;
      }
  
      // replace image with foreach loop and remove loading
      const img = card.querySelector(".result_img");
      img.src = urls[index];
      card.classList.remove("loading");

      // Add overlay with data-url
      const overlay = card.querySelector(".img_overlay");
      const imgUrl = urls[index];
      const parts = imgUrl.split(".");
      const imgFormat = parts[parts.length - 1].split("?")[0].toLowerCase();
  
      overlay.innerHTML = `
        <button class="img_download_btn" data-url="${imgUrl}" data-format="${imgFormat}">
          <i class="fa-solid fa-download"></i>
        </button>
      `;
  
      // add download img
      const downloadBtn = card.querySelector(".img_download_btn");
      downloadBtn.addEventListener("click", () => {
        const imgURL = downloadBtn.getAttribute("data-url");
        const imgFormat = downloadBtn.getAttribute("data-format");
        downloadImage(imgUrl, imgFormat)
      });

      const downloadImage = async (url, format) => {
        try {
          const downloadRes = await fetch(url);
          const file = await downloadRes.blob();
  
          const a = document.createElement("a");
          a.href = URL.createObjectURL(file);
          a.download = `our-ai-${Date.now()}.${format}`; // 👈 correct filename
          a.click();
        } catch (error) {
          console.error("Download error:", error);
        }
      }
    });
  };
  
  
  
  
// ======================= cat and dog ai image fetch =======================


// cat images fetch
const fetchRandomCatImages = (count) => {
  let images = [];
  for (let i = 0; i < count; i++) {
      try {
        let image = `https://cataas.com/cat?uninque=${Math.floor(Math.random() * 10000)}`;
        if (!image) {
          image.push("error")
      } else {
          images.push(image);
      }
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
      // console.log(data.message)
      if (!(data.message)) {
        images.push("error");
      } else {
        images.push(data.message);
      }

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

      // console.log(result);

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

// picsum  random image
const fetchRandomPicsumImages = async (count) => {
  let images = [];
  for (let i = 0; i < count; i++) {
    try {
      let image = await `https://picsum.photos/512/512?random=${Math.random()}`;
      if (!image) {
        image.push("error")
      } else {
        images.push(image);
      }
    } catch(error) {
      images.push("error");
    }
  }

  return images;
};


// AnonymousAiImage 
const fetchAnonymousAiImage = async (count, prompt, aspect) => {

  const images = [];
  for (let i = 0; i < count; i++) {
    try {
      let speed = Date.now();
      const imgURL = `https://api.a0.dev/assets/image?text=${encodeURIComponent(prompt)}&aspect=${aspect}&seed=${speed}`;
  
      const res = await fetch(imgURL, {
        method: "GET",
        redirect: "follow"
      });
  
      if (!res.ok) throw new Error("Image fetch failed");
  
      const finalImage = res.url;
      images.push(finalImage);
    } catch (error) {
      images.push("error");
    }
  };

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
    promptInput.value = "Picsum Random Image";
    promptInput.disabled = true;
    promptBtn.disabled = true;
  } else {
    promptInput.value = "";
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
  
  // call user massage funtion
  addUserMessage(promptText);
  
  if (selectedModel === "Random_Cat_Image") { // cat  random image
    addAiMessage(imageCount); // call user massage funtion with Loading
    setTimeout(async () => {
      const images = await fetchRandomCatImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  
  } else if (selectedModel === "Random_Dog_Image") { // dog  random image
    addAiMessage(imageCount); // call user massage funtion with Loading
    setTimeout(async () => {
      const images = await fetchRandomDogImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  
  } else if (selectedModel === "flux") { // fllux with text to prompt image
    promptInput.value = "";
    addAiMessage(imageCount); // call user massage funtion with Loading
    setTimeout(async () => {
      const images = await fetchRandomFluxImages(imageCount, promptText);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "picsum") {   // picsum  random image
    addAiMessage(imageCount); // call user massage funtion with Loading 


    setTimeout(async () => {
      const images = await fetchRandomPicsumImages(imageCount);
      replaceImages(images);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 2000);
  } else if (selectedModel === "AnonymousAiImage") {
    promptInput.value = "";
    addAiMessage(imageCount);
  
    setTimeout(async () => {
      const image = await fetchAnonymousAiImage(imageCount ,promptText, "1:1");
      // console.log(image);

      replaceImages(image);
      chatMassengs.scrollTo({
        top: chatMassengs.scrollHeight,
        behavior: "smooth"
      });
      generatebtn.classList.remove("disabled");
    }, 1000);
  }



  
  chatMassengs.scrollTop = chatMassengs.scrollHeight;

};


promptForm.addEventListener("submit", handleFormSubmit);


// call handal from with key
document.addEventListener('keydown', function(e) {
  
  if (e.key === "Control") {
    if(e.key === "enter") {
      handleFormSubmit();
    }
  }
});

// ================================= security set up =================================

// Right Click Disable
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Keyboard Shortcuts Block
document.addEventListener('keydown', function(e) {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }
  // Ctrl+Shift+I / J / C / U
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
    e.preventDefault();
  }
  // Ctrl+U (View source)
  if (e.ctrlKey && e.key === "u") {
    e.preventDefault();
  }
});



