const container = document.getElementById("anime-container");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");


const themeToggle = document.getElementById("theme-toggle");


let animeData = [];


async function fetchAnime(query = "naruto") {
  try {
    loader.style.display = "block";

    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);

    if (res.status === 429) {
      container.innerHTML = "<p>Please wait... API limit reached ⏳</p>";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    animeData = data.data || [];

    renderAnime(animeData);

  } catch (error) {
    container.innerHTML = "<p>Error loading anime 😢</p>";
  } finally {
    loader.style.display = "none";
  }
}


function renderAnime(list) {
  container.innerHTML = "";

  list.map(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Score: ${anime.score || "N/A"}</p>
      </div>
    `;

    container.appendChild(card);
  });
}


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


filterSelect.addEventListener("change", () => {
  const filtered = animeData.filter(a =>
    filterSelect.value === "" ||
    a.type?.toLowerCase() === filterSelect.value
  );

  renderAnime(filtered);
});


sortSelect.addEventListener("change", () => {
  const sorted = [...animeData].sort((a, b) => {
    return sortSelect.value === "asc"
      ? (a.score || 0) - (b.score || 0)
      : (b.score || 0) - (a.score || 0);
  });

  renderAnime(sorted);
});

fetchAnime();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeToggle.textContent = "🌞";
    localStorage.setItem("theme", "light");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
});


if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌞";
}

  renderAnime(sorted);
});

// INITIAL LOAD
fetchAnime();
