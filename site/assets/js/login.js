document.getElementById("login-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res = await fetch("http://media.local/api/auth.php?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
});

    const result = await res.json();

    console.log(result);

    if (result.success) {
        alert("Connecté !");
        window.location.href = "games.html";
    } else {
        alert(result.error);
    }
});