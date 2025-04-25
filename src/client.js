import { bet_que, create_bet_result_object, current_session } from "./bet_interface";
import { resolved_bet } from "./html_builder";
import { battle_result, utc_time_value } from "./royale_bets_classes";

const battleResultsArray = [] 

async function checkResolvedBets(currentSession) {
    console.log("Check Resolved Bets Fired")
    const last_refresh_time = parseInt(sessionStorage.getItem("streamer_last_refresh_time"))
    const points = parseInt(document.getElementById("viewer_current_points").innerHTML)

    try {
        const response = await fetch("http://localhost:3000/update_royale_bets", {
            method: "POST", // Ensure API expects POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: currentSession.session_id,
                screen_name: currentSession.viewer_name,
                streamer_player_tag: currentSession.streamer_player_tag,
                last_refresh_time: last_refresh_time,
                total_points: points
            })
        });

        const data = await response.json();
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
    console.log("First Call Fired")
    try {
        const response = await fetch("http://localhost:3000/start_royale_bets", {
            method: "POST", // Ensure API expects POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: currentSession.session_id,
                screen_name: currentSession.viewer_name,
                streamer_player_tag: currentSession.streamer_player_tag,
                last_refresh_time: currentSession.last_refresh_time,
                total_points: currentSession.points
            })
        });

        const data = await response.json();

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

export function push_battle_results(battle_results){
    if (Array.isArray(battle_results)) {
       for (let i = 0; i < battle_results.length; i++){
            const br = battle_results[i]
            const newBattle = new battle_result(
                br.streamer_player_tag,
                br.battle_time,
                br.crowns_taken_int,
                br.crowns_lost_int
            );
        console.log(newBattle, " This is the newBattle")
        battleResultsArray.push(newBattle)
        }
        //Here  we need to call a function that then takes all the bets in the resolved bet array, and then resolves the bets in the bets array.
        reconcile_bet_array()
    } else {
        console.warn("Unexpected API response format:", battle_results);
    } 
}

export function update_leaderboard(leaderboard){
    if (Array.isArray(leaderboard)){
        const array_length = leaderboard.length
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
        const viewer_rank = document.getElementById("viewer_rank")
        viewer_rank.innerText = leaderboard[array_length - 1]["rank"]
    } else {
        console.warn("Unexpected API response format:", battle_result);
    }
}

export function update_streamer_info(streamer_info){
    console.log(streamer_info, " This is the streamer info")

    console.log(streamer_info)
    const streamer_wins = document.getElementById("games_win_int")
    streamer_wins.innerText = streamer_info["wins"]

    const streamer_losses = document.getElementById("games_lost_int")
    streamer_losses.innerText = streamer_info["losses"]

    const win_pct_div = document.getElementById("win_loss_percentage_int")

    if (streamer_info["wins"] + streamer_info["losses"] > 0){
    let win_pct_float = Math.ceil(100 * (streamer_info["wins"] / (streamer_info["wins"] + streamer_info["losses"])));
    win_pct_div.innerText = win_pct_float 
    } else {
        win_pct_div.innerText = 50 
    }
    let now = utc_time_value()
    sessionStorage.setItem("streamer_last_refresh_time", now)
    sessionStorage.setItem("stream_start_time", streamer_info["stream_start_time"])
}

export function reconcile_bet_array(){
    console.log("reconcile bet array fired")
    while(battleResultsArray.length > 0){
        console.log("While loop fired")
        const battle_result = battleResultsArray.shift();
        //This needs to be change back to a while loop.
        if (bet_que.length > 0){
            const bet = bet_que[0]
            console.log(bet, " This was the bet")
            console.log(battle_result, " This was the battle result")
            if ((battle_result.battle_time - bet.bet_time) >= 1){
                const resolved_bet_element = resolved_bet(bet, battle_result);
                create_bet_result_object(resolved_bet_element);
                update_pending_bets()
                bet_que.shift()
                console.log("Bet Que shifted")
            }
        }
    }
}

export function update_pending_bets() {
    const pendingBetsContainer = document.getElementById("pending_bets");
    const pendingBetsContainerChildren = pendingBetsContainer.children
    pendingBetsContainerChildren[0].remove();
}


// Call the function immediately
document.addEventListener("DOMContentLoaded", function () {
    // Call first_call immediately when DOM is loaded (only once)
    first_call(current_session);
    
    // Set up interval to call only checkResolvedBets every minute
    setInterval(() => {
        checkResolvedBets(current_session);
    }, 60000); // 60000 milliseconds = 1 minute
    
    // If you want to use 2 minutes and 30 seconds instead:
    // }, 150000); // 150000 milliseconds = 2 minutes and 30 seconds
});
