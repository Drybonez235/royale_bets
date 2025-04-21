import { bet_que, create_bet_result_object, current_session } from "./bet_interface";
import { resolved_bet } from "./html_builder";
import { battle_result } from "./royale_bets_classes";

const battleResultsArray = [] 
// const battleResultsArray = [{
//     "streamer_clash_tag": "#PLAYER123",
//     "battle_time": 1711377015,
//     "crowns_taken_int": 1,
//     "crowns_lost_int": 2,
//     "win_lose": false
// },
// {
//     "streamer_clash_tag": "#PLAYER456",
//     "battle_time": 1711378810,
//     "crowns_taken_int": 2,
//     "crowns_lost_int": 1,
//     "win_lose": true
// },
// {
//     "streamer_clash_tag": "#PLAYER789",
//     "battle_time": 1711382730,
//     "crowns_taken_int": 3,
//     "crowns_lost_int": 2,
//     "win_lose": true
// },
// {
//     "streamer_clash_tag": "#PLAYER999",
//     "battle_time": 1711384845,
//     "crowns_taken_int": 0,
//     "crowns_lost_int": 1,
//     "win_lose": false
// }]; 


//bet_que is the bet array.

async function checkResolvedBets(currentSession) {

    console.log(currentSession)

    try {
        const response = await fetch("http://localhost:3000/update_royale_bets", {
            method: "POST", // Ensure API expects POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: currentSession.session_id,
                Screen_name: currentSession.viewer_name,
                streamer_clash_tag: currentSession.streamer_clash_tag,
                last_refresh_time: currentSession.last_refresh_time,
                total_points: currentSession.points
            })
        });

        const data = await response.json();

        //The API will return pending if there are no new bets resolved.
        if (data === "Pending") {
            return;
        }

        const streamer_info = data["streamer_info"]
        const leaderboard = data["leaderboard"] 
        const battle_results = data["battle_results"] 

        push_battle_results(battle_results)
        update_leaderboard(leaderboard)
        update_streamer_info(streamer_info)

    
    } catch (error) {
        console.error("Error fetching resolved bets:", error);
    }
}

async function first_call(currentSession) {
    console.log(currentSession)
    try {
        const response = await fetch("http://localhost:3000/start_royale_bets", {
            method: "POST", // Ensure API expects POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: currentSession.session_id,
                screen_name: currentSession.viewer_name,
                streamer_clash_tag: currentSession.streamer_clash_tag,
                last_refresh_time: currentSession.last_refresh_time,
                total_points: currentSession.points
            })
        });

        const data = await response.json();

        //The API will return pending if there are no new bets resolved.
        // if (data === "Pending") {
        //     return;
        // }
        console.log(data)
        const streamer_info = data["streamer_info"]
        const leaderboard = data["leaderboard"] 
        const battle_results = data["battle_results"] 

        push_battle_results(battle_results)
        update_leaderboard(leaderboard)
        update_streamer_info(streamer_info)

    
    } catch (error) {
        //console.log(data)
        console.error("Error fetching resolved bets:", error);
    }
}


export function push_battle_results(battle_results){
    if (Array.isArray(battle_results)) {
        battle_results.forEach(bet => {
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
        console.warn("Unexpected API response format:", battle_results);
    } 
}

export function update_leaderboard(leaderboard){
    if (Array.isArray(leaderboard)){
        const array_length = leaderboard.length
        //Filles the leaderboard with entries.
        for (let i=0; i < array_length - 1; i++){
            const id = "leader_board_entry_" + i
            const dom_entry = document.getElementById(id)
            const entry = leaderboard[i]
            const string = `
                <td class="p-2">${entry["rank"]}</td>
                <td class="p-2">${entry["screen_name"]}</td>
                <td class="p-2">${entry["total_points"]}</td>
            `
            dom_entry.innerHTML = string
        }
        //Fills the rest of the leaderboard with dummy values.
        for (let i=array_length - 1; i < 10; i++){
            const id = "leader_board_entry_" + i
            const dom_entry = document.getElementById(id)
            const string = `
                <td class="p-2">${i+1}</td>
                <td class="p-2">-</td>
                <td class="p-2">-</td>
            `
            dom_entry.innerHTML = string
        }

        //This part works
        const viewer_rank = document.getElementById("viewer_rank")
        viewer_rank.innerText = leaderboard[array_length - 1]["rank"]

        const viewer_points = document.getElementById("viewer_current_points")
        viewer_points.innerText = leaderboard[array_length - 1]["total_points"]

    } else {
        console.warn("Unexpected API response format:", battle_result);
    }
}

export function update_streamer_info(streamer_info){
    const streamer_wins = document.getElementById("games_win_int")
    streamer_wins.innerText = streamer_info["wins"]

    const streamer_losses = document.getElementById("games_lost_int")
    streamer_losses.innerText = streamer_info["losses"]

    sessionStorage.setItem("timestampUTC", streamer_info["streamer_last_refresh_time"])
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
document.addEventListener("DOMContentLoaded", function () {
    first_call(current_session);

})
//document.addEventListener("DOMContentLoaded" ,reconcile_bet_array())

// Set an interval to call the function every 2 minutes and 30 seconds
//const intervalId = setInterval(checkResolvedBets, 150000);
//const intervalId = setInterval(reconcile_bet_array, 10000);