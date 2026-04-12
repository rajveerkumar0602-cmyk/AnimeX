# 🎌 Anime Explorer

A sleek anime discovery web app powered by the Jikan API (MyAnimeList data). Browse top anime, search titles, filter by genre, toggle between grid and list views, and save your favourites — all with a beautiful dark/light mode UI.

---

## 📌 Project Purpose

Anime Explorer lets users discover and explore anime titles from the world's largest anime database. Users can search by name, filter by genre, sort by score or popularity, switch between grid and list views, and like/save their favourite anime with localStorage persistence.

---

## 🔗 API Used

**Jikan API v4** (Unofficial MyAnimeList API)
- **Base URL:** `https://api.jikan.moe/v4`
- **Docs:** https://docs.api.jikan.moe
- **Auth:** None required — completely free and public
- **Key Endpoints:**
  - `GET /top/anime` — Top anime list
  - `GET /anime?q={query}` — Search anime by name
  - `GET /anime?genres={id}` — Filter by genre

---

## ✨ Features

### Core Features
- 🔍 **Search** — Real-time search with debouncing using `filter()`
- 🗂️ **Filter** — Filter by genre using `filter()`
- 📊 **Sort** — Sort by score, popularity, or title using `sort()`
- ❤️ **Favourites** — Like/save anime, persisted with `localStorage`
- 🌙 **Dark / Light Mode** — Theme toggle saved in `localStorage`

### UI Features
- 📐 **Grid / List View Toggle** — Switch between card grid and list view
- 🔄 **Loading Indicator** — Spinner during API fetch
- 📄 **Pagination** — Browse results page by page
- ⏱️ **Debounced Search** — Avoids excessive re-renders

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling, dark mode, responsive layout |
| JavaScript (Vanilla) | Logic, API calls, HOFs, DOM |
| Jikan API v4 | Anime data |
| localStorage | Favourites + theme persistence |

---

## 📁 Project Structure

```
anime-explorer/
├── index.html      # Main HTML
├── style.css       # Styles + dark mode + responsive
├── script.js       # API fetch, search, filter, sort, favourites
└── README.md       # Documentation
```

---

## 🚀 How to Run

```bash
git clone https://github.com/your-username/anime-explorer.git
cd anime-explorer
# Open index.html in any browser — no server needed
```

---

## 📅 Milestones

| Milestone | Description | Status |
|---|---|---|
| 1 | Project setup, README, idea | ✅ Completed |
| 2 | API integration, responsive UI | ✅ Completed |
| 3 | Search, filter, sort, favourites (HOFs) | ✅ Completed |
| 4 | Cleanup, deployment | ✅ Completed |

---

## ⚙️ Notes

- All search, filtering and sorting use JavaScript Array HOFs (`filter`, `sort`, `map`) — no `for`/`while` loops.
- Debouncing applied to search input.
- localStorage persists favourites and dark mode preference.

---

## 👤 Author

**Your Name** — [@Rajveer Kumar](https://github.com/rajveerkumar0602-cmyk))

> Built as part of a JavaScript & API Integration course project.
