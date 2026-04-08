const container = document.getElementById("anime-container");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

let animeData = [];

// FETCH FUNCTION
async function fetchAnime(query = "naruto") {
  try {
    loader.style.display = "block";

    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);

    if (res.status === 429) {
      container.innerHTML = "<p>Wait a moment... API limit hit ⏳</p>";
      return;
    }

    const data = await res.json();

    animeData = data.data || [];
    renderAnime(animeData);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading data</p>";
  } finally {
    loader.style.display = "none";
  }
}

// RENDER FUNCTION (same design)
function renderAnime(list) {
  container.innerHTML = "";

  list.map(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}">
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Score: ${anime.score || "N/A"}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// 🔍 SEARCH (Debounced)
let timeout;
searchInput.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const value = searchInput.value.trim();
    if (value !== "") {
      fetchAnime(value);
    }
  }, 800);
});

// 🎯 FILTER (Array.filter)
filterSelect.addEventListener("change", () => {
  const filtered = animeData.filter(a =>
    filterSelect.value === "" ||
    a.type?.toLowerCase() === filterSelect.value
  );

  renderAnime(filtered);
});

// 🔽 SORT (Array.sort)
sortSelect.addEventListener("change", () => {
  const sorted = [...animeData].sort((a, b) => {
    return sortSelect.value === "asc"
      ? (a.score || 0) - (b.score || 0)
      : (b.score || 0) - (a.score || 0);
  });

  renderAnime(sorted);
});

// INITIAL LOAD
fetchAnime();
