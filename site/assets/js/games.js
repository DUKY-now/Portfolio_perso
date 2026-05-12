console.log("games.js chargé ✔");

// ======================
// STATE
// ======================
let allGames = [];

// ======================
// API
// ======================
const API_URL = "http://media.local/api/games.php";

// ======================
// LOAD GAMES
// ======================
async function loadGames() {

    try {

        const res = await fetch(API_URL);

        allGames = await res.json();

        renderGames(allGames);

    } catch (err) {

        console.error("Erreur chargement jeux :", err);
    }
}

// ======================
// RENDER
// ======================
function renderGames(games) {

    const container = document.getElementById("games-container");

    container.innerHTML = "";

    if (!games.length) {

        container.innerHTML = `
            <p class="empty">
                Aucun jeu trouvé.
            </p>
        `;

        return;
    }

    games.forEach(game => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="game-card">

                <img 
                    src="${game.image || 'https://via.placeholder.com/300x150'}"
                    alt="${game.title}"
                    class="game-img"
                >

                <div class="game-content">

                    <h3>${game.title}</h3>

                    <p class="status">
                        ${game.status}
                    </p>

                    <p>
                        ${game.platform || "Plateforme inconnue"}
                    </p>

                    ${
                        game.rating
                        ? `<p>⭐ ${game.rating}/5</p>`
                        : ""
                    }

                    ${
                        game.review
                        ? `<p>${game.review}</p>`
                        : ""
                    }

                    ${
                        game.link
                        ? `
                            <a 
                                href="${game.link}" 
                                target="_blank"
                                class="game-link"
                            >
                                Voir le jeu
                            </a>
                        `
                        : ""
                    }

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

// ======================
// SEARCH
// ======================
document
    .getElementById("search")
    ?.addEventListener("input", (e) => {

        const value = e.target.value.toLowerCase();

        const filtered = allGames.filter(game =>
            game.title.toLowerCase().includes(value)
        );

        renderGames(filtered);
    });

// ======================
// FILTERS
// ======================
document.addEventListener("click", (e) => {

    if (!e.target.dataset.filter) {
        return;
    }

    const filter = e.target.dataset.filter;

    document
        .querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    const filtered =
        filter === "all"
            ? allGames
            : allGames.filter(g => g.status === filter);

    renderGames(filtered);
});

// ======================
// INIT
// ======================
loadGames();