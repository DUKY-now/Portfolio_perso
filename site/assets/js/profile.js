console.log("profile.js chargé ✔");

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("save-steam");
    if (!btn) return;

    btn.addEventListener("click", async () => {

        const steam_id = document.getElementById("steam-id").value;

        const res = await fetch("http://media.local/api/auth.php?action=update_steam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ steam_id })
        });

        const data = await res.json();

        if (data.success) {
            alert("Steam ID sauvegardé ✔");
        } else {
            alert("Erreur");
        }
    });

});