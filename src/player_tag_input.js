document.addEventListener("DOMContentLoaded", function () {
    sessionStorage.clear()
    const playerTagInput = document.getElementById("playerTagInput");
    const treasureChest = document.getElementById("treasureChest");
    const errorMessage = document.getElementById("error-message");

    playerTagInput.addEventListener("input", async function () {
        var playerTag = playerTagInput.value.trim();
        playerTag = playerTag.toUpperCase();

        // Only proceed if input length is greater than 6
        if (playerTag.length > 6) {
            try {
                const response = await fetch("/verify_player_tag", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ clash_id: playerTag, req_page: "player_tag_input" })
                });

                const responseData = await response.json();

                if (responseData.valid) { 
                    treasureChest.classList.remove("hidden"); 
                    errorMessage.classList.add("hidden"); 

                    // Save to sessionStorage
                    sessionStorage.setItem("playerTag", playerTag);
                    sessionStorage.setItem("clash_name", responseData.clash_name)
                    sessionStorage.setItem("session_id", Date.now()) 
                } else {
                    treasureChest.classList.add("hidden"); 
                    errorMessage.classList.remove("hidden"); 
                }
            } catch (error) {
                errorMessage.classList.remove("hidden");
            }
        } else {
            treasureChest.classList.add("hidden");
            errorMessage.classList.add("hidden"); 
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const screenNameInput = document.getElementById("screenNameInput");
    const screenNameError = document.getElementById("screenNameError");
    const playerTagInput = document.getElementById("playerTagInput");

   
    playerTagInput.disabled = true;

   
    screenNameInput.addEventListener("input", function () {
        const screenName = screenNameInput.value.trim();

        if (screenName.length > 0 && screenName.length <= 20) {
            screenNameError.classList.add("hidden");
            sessionStorage.setItem("screenName", screenName);
            playerTagInput.disabled = false; 
        } else {
            screenNameError.classList.remove("hidden");
            playerTagInput.disabled = true; 
        }
    });
});