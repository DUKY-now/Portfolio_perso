console.log("games.js chargé ✔");

// ======================
// STATE
// ======================
let allGames = [];

// ======================
// API BASE
// ======================
const API = "http://media.local/api";

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", init);

async function init() {

    await importSteam(); // optionnel (tu peux enlever si tu veux manuel)

    await loadGames();

    initFilters();
    initSearch();
}

// ======================
// IMPORT STEAM
// ======================
async function importSteam() {

    try {

        await fetch(`${API}/import-steam.php`, {
            credentials: "include"
        });

    } catch (err) {
        console.warn("Steam import error:", err);
    }
}

// ======================
// LOAD GAMES
// ======================
async function loadGames() {

    try {

        const res = await fetch(`${API}/games.php`, {
            credentials: "include"
        });

        const data = await res.json();

        console.log("GAMES:", data);

        allGames = Array.isArray(data) ? data : [];

        renderGames(allGames);

    } catch (err) {
        console.error("Load games error:", err);
    }
}

// ======================
// RENDER
// ======================
function renderGames(games) {

    const container = document.getElementById("games-container");

    if (!container) {
        console.error("games-container introuvable");
        return;
    }

    container.innerHTML = "";

    games.forEach(game => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="game-card">

                <img src="${game.image || 'https://via.placeholder.com/300x150'}">

                <h3>${game.title ?? "Sans titre"}</h3>

                <p>${game.platform ?? ""}</p>

                <p>${game.status ?? ""}</p>

                ${game.link ? `<a href="${game.link}" target="_blank">Voir</a>` : ""}

            </div>
        `;

        container.appendChild(card);
    });
}

// ======================
// SEARCH
// ======================
function initSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    search.addEventListener("input", (e) => {

        const value = e.target.value.toLowerCase();

        const filtered = allGames.filter(game =>
            (game.title || "").toLowerCase().includes(value)
        );

        renderGames(filtered);
    });
}

// ======================
// FILTERS
// ======================
function initFilters() {

    document.addEventListener("click", (e) => {

        if (!e.target.dataset.filter) return;

        const filter = e.target.dataset.filter;

        const filtered =
            filter === "all"
                ? allGames
                : allGames.filter(g => g.status === filter);

        renderGames(filtered);
    });
}