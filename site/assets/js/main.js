console.log("main.js chargé ✔");

async function loadComponent(id, file) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

loadComponent("navbar", "components/navbar.html");
loadComponent("footer", "components/footer.html");

// charger games de façon simple et fiable
const script = document.createElement("script");
script.src = "./modules/games.js";
script.onload = () => console.log("games.js chargé ✔");
document.body.appendChild(script);