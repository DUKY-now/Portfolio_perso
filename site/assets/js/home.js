console.log("home.js chargé ✔");

let allGames = [];
let currentFilter = "all";

// ======================
// LOAD DATA
// ======================
async function loadGames() {

    const res = await fetch("http://media.local/api/games.php");
    allGames = await res.json();

    updateStats();
    renderGames();
}

// ======================
// STATS
// ======================
function updateStats() {

    document.getElementById("stat-wishlist").textContent =
        allGames.filter(g => g.status === "wishlist").length;

    document.getElementById("stat-playing").textContent =
        allGames.filter(g => g.status === "playing").length;

    document.getElementById("stat-completed").textContent =
        allGames.filter(g => g.status === "completed").length;
}

// ======================
// RENDER HOME GAMES
// ======================
function renderGames() {

    const container = document.getElementById("home-games");

    let filtered = allGames;

    if (currentFilter !== "all") {
        filtered = allGames.filter(g => g.status === currentFilter);
    }

    filtered = filtered
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    container.innerHTML = "";

    filtered.forEach(game => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.platform || ""}</p>
        `;

        container.appendChild(card);
    });

    // compteur dynamique
    const totalInFilter =
        currentFilter === "all"
            ? allGames.length
            : allGames.filter(g => g.status === currentFilter).length;

    document.getElementById("counter-info").textContent =
        `(${filtered.length} / ${totalInFilter})`;
}

// ======================
// FILTERS
// ======================
document.addEventListener("click", (e) => {

    if (e.target.dataset.filter) {

        currentFilter = e.target.dataset.filter;

        document.querySelectorAll(".filters button")
            .forEach(btn => btn.classList.remove("active"));

        e.target.classList.add("active");

        renderGames();
    }
});

// ======================
// INIT
// ======================
loadGames();