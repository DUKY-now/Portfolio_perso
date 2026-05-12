import { checkSession } from "./session.js";

console.log("main.js chargé ✔");

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadComponent("navbar", "components/navbar.html");
    await loadComponent("footer", "components/footer.html");

    try {
        await checkSession();
    } catch (err) {
        console.error("Session error:", err);
    }

    await loadPreviewGames(); // 👈 AJOUT IMPORTANT
}

// ======================
// LOAD COMPONENTS
// ======================
async function loadComponent(id, file) {

    const el = document.getElementById(id);
    if (!el) return;

    try {
        const res = await fetch(file);
        const html = await res.text();
        el.innerHTML = html;
    } catch (e) {
        console.error("Component load error:", file);
    }
}

// ======================
// LOGOUT
// ======================
document.addEventListener("click", async (e) => {

    const btn = e.target.closest("#logout-btn");
    if (!btn) return;

    await fetch("http://media.local/api/auth.php?action=logout");

    window.location.href = "login.html";
});

// ======================
// GAME PREVIEW (INDEX)
// ======================
async function loadPreviewGames() {

    const container = document.getElementById("home-games");
    if (!container) return;

    try {

        const res = await fetch("http://media.local/api/games.php", {
            credentials: "include"
        });

        const data = await res.json();

        const preview = data.slice(0, 3); // 👈 3 jeux

        container.innerHTML = "";

        preview.forEach(game => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <div class="game-card">

                    <img src="${game.image || 'https://via.placeholder.com/300x150'}">

                    <h3>${game.title}</h3>

                    <p>${game.status}</p>

                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Preview games error:", err);
    }
}