document.addEventListener("DOMContentLoaded", function () {
    const playerTagInput = document.getElementById("playerTagInput");
    const treasureChest = document.getElementById("treasureChest");
    const errorMessage = document.getElementById("error-message");

    playerTagInput.addEventListener("input", async function () {
        const playerTag = playerTagInput.value.trim();

        // Only proceed if input length is greater than 6
        if (playerTag.length > 6) {
            try {
                const response = await fetch("http://localhost:3000/verify_player_tag", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ clash_id: playerTag, req_page: "player_tag_input" })
                });

                const responseData = await response.json();

                if (responseData.valid) { // Assuming API returns { valid: true, username: "PlayerName" }
                    treasureChest.classList.remove("hidden"); // Show chest
                    errorMessage.classList.add("hidden"); // Hide error

                    // Save to sessionStorage
                    sessionStorage.setItem("playerTag", playerTag);
                    sessionStorage.setItem("clash_name", responseData.clash_name)
                    sessionStorage.setItem("timestampUTC", 0) //Date.now());
                } else {
                    treasureChest.classList.add("hidden"); // Hide chest
                    errorMessage.classList.remove("hidden"); // Show error message
                }
            } catch (error) {
                console.error("Error verifying player tag:", error);
                errorMessage.classList.remove("hidden"); // Show error on request failure
            }
        } else {
            treasureChest.classList.add("hidden");
            errorMessage.classList.add("hidden"); // Hide error for short input
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const screenNameInput = document.getElementById("screenNameInput");
    const screenNameError = document.getElementById("screenNameError");
    const playerTagInput = document.getElementById("playerTagInput");

    // Disable player tag input by default
    playerTagInput.disabled = true;

    // Validate screen name
    screenNameInput.addEventListener("input", function () {
        const screenName = screenNameInput.value.trim();

        if (screenName.length > 0 && screenName.length <= 20) {
            screenNameError.classList.add("hidden");
            sessionStorage.setItem("screenName", screenName);
            playerTagInput.disabled = false; // Enable player tag input
        } else {
            screenNameError.classList.remove("hidden");
            playerTagInput.disabled = true; // Keep player tag input disabled
        }
    });
});