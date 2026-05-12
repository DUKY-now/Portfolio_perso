import { checkSession } from "./session.js";

console.log("games.js chargé ✔");

let editingId = null;
let editingCard = null;
let allGames = [];

const API = "http://localhost/media-tracker/api/games.php";

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", init);

async function init() {

    const form = document.getElementById("game-form");
    if (!form) return;

    const logged = await checkSession();

    if (!logged) {
        form.style.display = "none";
        return;
    }

    form.style.display = "block";

    bindEvents();
    loadGames();
}

// ======================
// EVENTS
// ======================
function bindEvents() {

    const form = document.getElementById("game-form");

    form.onsubmit = onSubmit;

    document.addEventListener("click", onGlobalClick);

    document.getElementById("cancel-edit")?.addEventListener("click", resetForm);
}

// ======================
// SUBMIT
// ======================
async function onSubmit(e) {

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

    const options = {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingId ? { ...game, id: editingId } : game)
    };

    await fetch(API, options);
    resetForm();
    loadGames();
}

// ======================
// LOAD
// ======================
async function loadGames() {

    const res = await fetch(API, {
        credentials: "include"
    });

    if (!res.ok) {
        console.error("API error");
        return;
    }

    allGames = await res.json();

    renderGames(allGames);
}

// ======================
// RENDER
// ======================
function renderGames(games) {

    const container = document.getElementById("games-container");
    if (!container) return;

    container.innerHTML = "";

    games.forEach(game => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="game-card">

                <img src="${game.image || 'https://via.placeholder.com/300x150'}" class="game-img">

                <h3>${game.title}</h3>

                <p>${game.platform || ""}</p>

                <p class="status">${game.status}</p>

                ${game.link ? `<a href="${game.link}" target="_blank">Voir</a>` : ""}

                <div class="game-actions">

                    <button class="edit-btn" data-id="${game.id}">✏</button>
                    <button class="delete-btn" data-id="${game.id}">🗑</button>

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

// ======================
// GLOBAL CLICK
// ======================
function onGlobalClick(e) {

    if (e.target.classList.contains("delete-btn")) {
        deleteGame(e.target.dataset.id);
    }

    if (e.target.classList.contains("edit-btn")) {
        startEdit(e.target.dataset.id);
    }

    if (e.target.dataset.filter) {
        applyFilter(e.target.dataset.filter);
    }
}

// ======================
// DELETE
// ======================
async function deleteGame(id) {

    await fetch(API, {
        
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
    });

    loadGames();
}

// ======================
// EDIT
// ======================
function startEdit(id) {

    const game = allGames.find(g => g.id == id);
    if (!game) return;

    document.getElementById("title").value = game.title;
    document.getElementById("status").value = game.status;
    document.getElementById("platform").value = game.platform;
    document.getElementById("rating").value = game.rating;
    document.getElementById("review").value = game.review;
    document.getElementById("link").value = game.link;
    document.getElementById("image").value = game.image;

    editingId = id;

    document.querySelector("#game-form button").textContent = "Modifier";

    if (editingCard) editingCard.classList.remove("editing");
}

// ======================
// RESET
// ======================
function resetForm() {

    editingId = null;

    const form = document.getElementById("game-form");
    form.reset();

    form.querySelector("button").textContent = "Ajouter";

    if (editingCard) {
        editingCard.classList.remove("editing");
        editingCard = null;
    }
}

// ======================
// FILTER
// ======================
function applyFilter(filter) {

    const filtered = filter === "all"
        ? allGames
        : allGames.filter(g => g.status === filter);

    renderGames(filtered);
}