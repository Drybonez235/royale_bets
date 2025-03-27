import { current_session } from "./bet_interface";

const battleResultsArray = []; // Store resolved battle results

async function checkResolvedBets(currentSession) {

    try {
        const response = await fetch("http://localhost:3000/resolve_bet", {
            method: "POST", // Ensure API expects POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: currentSession.session_id,
                viewer_name: currentSession.viewer_name,
                streamer_name: currentSession.streamer_name,
                streamer_clash_tag: currentSession.streamer_clash_tag,
                last_refresh_time: currentSession.last_refresh_time,
                points: currentSession.points
            })
        });

        const data = await response.json();

        if (data === "Pending") {
            console.log("No resolved bets yet.");
            return;
        }

        if (Array.isArray(data)) {
            data.forEach(bet => {
                const newBattle = new battle_result(
                    bet.streamer_clash_tag,
                    bet.battle_time,
                    bet.crowns_taken_int,
                    bet.crowns_lost_int
                );
                battleResultsArray.push(newBattle);
            });
            console.log("Resolved battles:", battleResultsArray);
        } else {
            console.warn("Unexpected API response format:", data);
        }
    } catch (error) {
        console.error("Error fetching resolved bets:", error);
    }
}

// Call the function immediately
checkResolvedBets(current_session);

// Set an interval to call the function every 2 minutes and 30 seconds
const intervalId = setInterval(checkResolvedBets, 150000);