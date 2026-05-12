import { checkSession } from "./session.js";

console.log("main.js chargé ✔");

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadComponent("navbar", "components/navbar.html");
    await loadComponent("footer", "components/footer.html");

    try {
        await checkSession();
    } catch (err) {
        console.error("Session error:", err);
    }
}

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

document.addEventListener("click", async (e) => {

    const btn = e.target.closest("#logout-btn");
    if (!btn) return;

    await fetch("http://media.local/api/auth.php?action=logout");

    window.location.href = "login.html";
});