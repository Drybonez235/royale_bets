import { bet_que, create_bet_result_object, current_session } from "./bet_interface";
import { resolved_bet } from "./html_builder";

const battleResultsArray = [{
    "streamer_clash_tag": "#PLAYER123",
    "battle_time": 1711377015,
    "crowns_taken_int": 1,
    "crowns_lost_int": 2,
    "win_lose": false
},
{
    "streamer_clash_tag": "#PLAYER456",
    "battle_time": 1711378810,
    "crowns_taken_int": 2,
    "crowns_lost_int": 1,
    "win_lose": true
},
{
    "streamer_clash_tag": "#PLAYER789",
    "battle_time": 1711382730,
    "crowns_taken_int": 3,
    "crowns_lost_int": 2,
    "win_lose": true
},
{
    "streamer_clash_tag": "#PLAYER999",
    "battle_time": 1711384845,
    "crowns_taken_int": 0,
    "crowns_lost_int": 1,
    "win_lose": false
}]; 


//bet_que is the bet array.

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

        //The API will return pending if there are no new bets resolved.
        if (data === "Pending") {
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
            //Here  we need to call a function that then takes all the bets in the resolved bet array, and then resolves the bets in the bets array.
            reconcile_bet_array()
        } else {
            console.warn("Unexpected API response format:", data);
        }
    } catch (error) {
        console.error("Error fetching resolved bets:", error);
    }
}

export function reconcile_bet_array(){
    if(battleResultsArray.length > 0){
        const battle_result = battleResultsArray.shift();
        //This needs to be change back to a while loop.
        if (bet_que.length > 0){
            const bet = bet_que.shift()
            //Needs to be changed back to battle_result.battle_time - bet.bet_time >= 1
            if (battle_result.battle_time > 1){
                const resolved_bet_element = resolved_bet(bet, battle_result);
                create_bet_result_object(resolved_bet_element);
                update_pending_bets()
            }
        }
        //battleResultsArray.shift()
    }
}

export function update_pending_bets() {
    const pendingBetsContainer = document.getElementById("pending_bets");
    const pendingBetsContainerChildren = pendingBetsContainer.children
    pendingBetsContainerChildren[0].remove();
}


// Call the function immediately
//checkResolvedBets(current_session);
//document.addEventListener("DOMContentLoaded" ,reconcile_bet_array())

// Set an interval to call the function every 2 minutes and 30 seconds
//const intervalId = setInterval(checkResolvedBets, 150000);
const intervalId = setInterval(reconcile_bet_array, 10000);