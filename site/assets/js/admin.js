console.log("games.js chargé ✔");

// ======================
// STATE GLOBAL
// ======================
let editingId = null;
let editingCard = null;
let allGames = [];

const form = document.getElementById("game-form");

// ======================
// API URL
// ======================
const API_URL = "http://localhost/media-tracker/api/games.php";

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
// RENDER GAMES
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

                    <div class="game-actions">

                        <button 
                            class="edit-btn"
                            data-id="${game.id}"
                        >
                            ✏ Modifier
                        </button>

                        <button 
                            class="delete-btn"
                            data-id="${game.id}"
                        >
                            🗑 Supprimer
                        </button>

                    </div>

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

// ======================
// CREATE / UPDATE
// ======================
form?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const game = {
        title: document.getElementById("title").value,
        status: document.getElementById("status").value,
        platform: document.getElementById("platform").value,
        image: document.getElementById("image").value,
        link: document.getElementById("link").value,
        rating: document.getElementById("rating").value,
        review: document.getElementById("review").value
    };

    try {

        // UPDATE
        if (editingId) {

            game.id = editingId;

            await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(game)
            });

            editingId = null;

        } 
        // CREATE
        else {

            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(game)
            });
        }

        resetForm();

        loadGames();

    } catch (err) {

        console.error("Erreur sauvegarde :", err);
    }
});

// ======================
// DELETE
// ======================
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) {
        return;
    }

    const id = e.target.dataset.id;

    const confirmDelete = confirm("Supprimer ce jeu ?");

    if (!confirmDelete) {
        return;
    }

    try {

        await fetch(API_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        loadGames();

    } catch (err) {

        console.error("Erreur suppression :", err);
    }
});

// ======================
// EDIT
// ======================
document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("edit-btn")) {
        return;
    }

    const id = e.target.dataset.id;

    const game = allGames.find(g => g.id == id);

    if (!game) {
        return;
    }

    document.getElementById("title").value = game.title;
    document.getElementById("status").value = game.status;
    document.getElementById("platform").value = game.platform;
    document.getElementById("image").value = game.image;
    document.getElementById("link").value = game.link;
    document.getElementById("rating").value = game.rating;
    document.getElementById("review").value = game.review;

    editingId = id;

    form.querySelector("button[type='submit']").textContent = "Modifier";

    if (editingCard) {
        editingCard.classList.remove("editing");
    }

    editingCard = e.target.closest(".card");

    editingCard?.classList.add("editing");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ======================
// CANCEL EDIT
// ======================
document
    .getElementById("cancel-edit")
    ?.addEventListener("click", resetForm);

// ======================
// RESET FORM
// ======================
function resetForm() {

    editingId = null;

    form.reset();

    form.querySelector("button[type='submit']").textContent = "Ajouter";

    if (editingCard) {

        editingCard.classList.remove("editing");

        editingCard = null;
    }
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