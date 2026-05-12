async function register() {

    const data = {
        username: "test",
        email: "test@test.com",
        password: "1234"
    };

    const res = await fetch("http://localhost/media-tracker/api/auth.php?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    console.log(await res.json());
}