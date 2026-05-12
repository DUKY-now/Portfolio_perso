console.log("session.js chargé ✔");

const API = "http://media.local/api/auth.php?action=me";

export let currentUser = null;

export async function checkSession() {

    try {

        const res = await fetch(API, {
            credentials: "include"
        });

        const data = await res.json();

        if (!data.logged) {

            currentUser = null;

            if (location.pathname.includes("games")) {
                window.location.href = "login.html";
            }

            return false;
        }

        currentUser = data.user;

        renderUser(currentUser);

        return true;

    } catch (err) {

        console.error("Session error :", err);
        return false;
    }
}

export function renderUser(user) {

    const el = document.getElementById("user-info");
    if (!el) return;

    if (!user) {
        el.innerHTML = "";
        return;
    }

    el.innerHTML = `👋 Bienvenue ${user.username}`;
}