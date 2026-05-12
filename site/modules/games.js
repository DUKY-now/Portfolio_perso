console.log("games.js chargé ✔");

// ======================
// STATE GLOBAL
// ======================
let editingId = null;
let editingCard = null;
let allGames = [];

const form = document.getElementById("game-form");

// ======================
// SUBMIT (CREATE / UPDATE)
// ======================
form.onsubmit = async (e) => {

    e.preventDefault();

const game = {
    title: document.getElementById("title").value,
    status: document.getElementById("status").value,
    platform: document.getElementById("platform").value,
    rating: document.getElementById("rating").value,
    review: document.getElementById("review").value,
    image: document.getElementById("image").value,
    link: document.getElementById("link").value
};

    if (editingId) {

        game.id = editingId;

        await fetch("http://localhost/media-tracker/api/games.php", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(game)
        });

        editingId = null;

    } else {

        await fetch("http://localhost/media-tracker/api/games.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(game)
        });
    }

    form.reset();
    loadGames();

    form.querySelector("button").textContent = "Ajouter";

    if (editingCard) {
        editingCard.classList.remove("editing");
        editingCard = null;
    }
};

// ======================
// LOAD
// ======================
async function loadGames() {

    const res = await fetch("http://localhost/media-tracker/api/games.php");
    allGames = await res.json();

    renderGames(allGames);
}

// ======================
// RENDER
// ======================
function renderGames(games) {

    const container = document.getElementById("games-container");

    container.innerHTML = "";

    games.forEach(game => {

        const card = document.createElement("div");
        card.className = "card";

card.innerHTML = `
    <div class="game-card">

        <img 
            src="${game.image || 'https://via.placeholder.com/300x150'}" 
            class="game-img"
        >

        <h3>${game.title}</h3>

        <p>${game.platform || "Plateforme inconnue"}</p>

        <p class="status">${game.status}</p>

        ${game.link ? `
            <a 
                href="${game.link}" 
                target="_blank" 
                class="game-link"
            >
                Voir le jeu
            </a>
        ` : ""}

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
`;

        container.appendChild(card);
    });
}

// ======================
// DELETE
// ======================
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("delete-btn")) {

        const id = e.target.dataset.id;

        await fetch("http://localhost/media-tracker/api/games.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        loadGames();
    }
});

// ======================
// EDIT
// ======================
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("edit-btn")) {

        const id = e.target.dataset.id;

        const game = allGames.find(g => g.id == id);

        document.getElementById("title").value = game.title;
        document.getElementById("status").value = game.status;
        document.getElementById("platform").value = game.platform;
        document.getElementById("rating").value = game.rating;
        document.getElementById("review").value = game.review;
        document.getElementById("link").value = game.link;
        document.getElementById("image").value = game.image;

        editingId = id;

        form.querySelector("button").textContent = "Modifier";

        if (editingCard) {
            editingCard.classList.remove("editing");
        }

        editingCard = e.target.closest(".card");
        editingCard.classList.add("editing");
    }
});

// ======================
// CANCEL EDIT
// ======================
document.getElementById("cancel-edit")?.addEventListener("click", () => {

    editingId = null;

    form.reset();
    form.querySelector("button").textContent = "Ajouter";

    if (editingCard) {
        editingCard.classList.remove("editing");
        editingCard = null;
    }
});

// ======================
// FILTERS
// ======================
document.addEventListener("click", (e) => {

    if (e.target.dataset.filter) {

        const filter = e.target.dataset.filter;

        const filtered = filter === "all"
            ? allGames
            : allGames.filter(g => g.status === filter);

        renderGames(filtered);
    }
});

// INIT
loadGames();