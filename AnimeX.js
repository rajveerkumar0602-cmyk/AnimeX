const container = document.getElementById("anime-container");
const loader = document.getElementById("loader");

const API_URL = "https://api.jikan.moe/v4/anime?q=naruto";

async function fetchAnime() {
  try {
    loader.style.display = "block";

    // ⏳ Add delay to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    displayAnime(data.data);

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load anime 😢</p>";
  } finally {
    loader.style.display = "none";
  }
}

function displayAnime(animeList) {
  container.innerHTML = "";

  animeList.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" />
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Score: ${anime.score || "N/A"}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

fetchAnime();
