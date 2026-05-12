console.log("games.js chargé ✔");

function init() {

    const form = document.getElementById("game-form");

    console.log("FORM:", form);

    if (!form) return;

    // 🔥 supprime anciens listeners implicites
    form.onsubmit = null;

    form.onsubmit = async (e) => {

        e.preventDefault();

        console.log("SUBMIT OK");

        const game = {
            title: document.getElementById("title").value,
            status: document.getElementById("status").value,
            platform: document.getElementById("platform").value,
            rating: document.getElementById("rating").value,
            review: document.getElementById("review").value
        };

        await fetch("http://localhost/media-tracker/api/games.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(game)
        });

        form.reset();
        loadGames();
    };
}

async function loadGames() {

    const res = await fetch("http://localhost/media-tracker/api/games.php");
    const games = await res.json();

    const container = document.getElementById("games-container");

    container.innerHTML = "";

    if (!games.length) {
        container.innerHTML = "<p>Aucun jeu enregistré.</p>";
        return;
    }

    games.forEach(game => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.status}</p>
            <p>${game.platform}</p>
            <p>${game.rating}</p>

        <button class="delete-btn" data-id="${game.id}">
            🗑 Supprimer
        </button>
        `;

        container.appendChild(card);
    });
}

// 🔥 important : exécution unique
init();
loadGames();

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