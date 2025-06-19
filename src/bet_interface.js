import { pending_bet } from "./html_builder";
import { bet } from "./royale_bets_classes"
import {session} from "./royale_bets_classes"
export const bet_que = []

export const current_session = make_session()

export function create_bet_object(){
  const playerTag = sessionStorage.getItem("playerTag");
  const viewer_name = sessionStorage.getItem("username");
  const timestamp = sessionStorage.getItem("timestampUTC");
  
  if(bet_que.length >= 2){
    window.alert("Sorry, you can only have 2 pending bets at a time. Wait for the current bet to be resolved.")
  } else {
    let new_bet = new bet(viewer_name, timestamp, playerTag)
    bet_que.push(new_bet)
    let points = parseInt(document.getElementById("viewer_current_points").innerText)

    document.getElementById("viewer_current_points").innerText = points - new_bet.points_bet
    const pending_bet_html = pending_bet(new_bet)
    let child1 = document.getElementById("pending_bets")
    document.getElementById("pending_bets").appendChild(pending_bet_html, child1)
    reset_bet()
    checkAndEnableBetting();
    console.log("We reached the end of bet create_bet_object.")
  }
}

export function create_bet_result_object(bet_result_html){
  const resolved_bet_history = document.getElementById("resolved_bet_history")//This is the space all the bets go.
  if (resolved_bet_history.children.length <= 3){
    resolved_bet_history.appendChild(bet_result_html)
  } else {
    resolved_bet_history.removeChild(resolved_bet_history.children[0])
    resolved_bet_history.appendChild(bet_result_html)
  }
}

document.getElementById("place_bet_button").addEventListener("click", ()=>{
  const bool = validate_bet_amount() 
  if(bool){
    create_bet_object();
  }

});

export function reset_bet(){
  const win_lose_toggle = document.getElementById("win_lose_toggle")
  const crowns_taken_toggle = document.getElementById("crowns_taken_toggle")
  const crowns_lost_toggle = document.getElementById("crowns_lost_toggle")
  const red_crowns_checked_int = document.getElementById("red_crowns_checked_int")
  const blue_crowns_checked_int = document.getElementById("blue_crowns_checked_int")
  const points_bet_input = document.getElementById("points_bet_input")
  const bet_win_lose_img = document.getElementById("bet_win_lose_img")
  const bet_win_lose_toggle_text = document.getElementById("bet_win_lose_toggle_text")
  const bet_potential_payout_int = document.getElementById("bet_potential_payout_int")
  
  win_lose_toggle.checked = false
  for (let i=1; i<4; i++){
    let red_crown_id = "rc"+i
    let crown = document.getElementById(red_crown_id)
    crown.src = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red_outline-z7uto1UUrra0poesKhuWr2Dwg4ie5a.png"
    crown.alt = "Red Crown Outline"
  }
  red_crowns_checked_int.value = 0
  crowns_taken_toggle.checked = false

  for(let i=1;i<4;i++){
    let blue_crown_id = "bc"+i
    let crown = document.getElementById(blue_crown_id)
    crown.src = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_blue_outline-DTdoXK6tHNg2IIosnhUt6rqJEWSG6U.png"
    crown.alt = "Blue Crown Outline"
  } 
  blue_crowns_checked_int.value = 0
  crowns_lost_toggle.checked = false

  bet_win_lose_img.src = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png"
  bet_win_lose_toggle_text.innerText = "Lose"

  points_bet_input.value = 0
  payout_calculator()
  //bet_potential_payout_int.innerHTML = 0

 }

 document.getElementById("reset_bet_button").addEventListener("click", () => {
  reset_bet()
 })
 
export function flip_win_lose_image(){
  const bet_win_lose_img = document.getElementById("bet_win_lose_img")
  const win_lose_toggle = document.getElementById("win_lose_toggle")
  const bet_win_lose_toggle_text = document.getElementById("bet_win_lose_toggle_text")

  if (win_lose_toggle.checked){
    bet_win_lose_img.src = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_thumbs_up-lTZxcTu8hoNBns6MtnKBmPVQ0qfPZL.png"
    bet_win_lose_toggle_text.innerText = "Win"
  } else {
    bet_win_lose_img.src = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png"
    bet_win_lose_toggle_text.innerText = "Lose"
  }
}
document.getElementById("win_lose_toggle").addEventListener("click", ()=> {
   flip_win_lose_image()
});

export function flip_crown(tag_id) {
    const red_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red-yUO0bonTVRluBOSTwuHcDj45NPHfP9.png"
    const red_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red_outline-z7uto1UUrra0poesKhuWr2Dwg4ie5a.png"
    const blue_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/blue_crown-8xNyXRxniDC24t14B85nmqlKKBEB5A.png"
    const blue_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_blue_outline-DTdoXK6tHNg2IIosnhUt6rqJEWSG6U.png"
    
    const current_crown = document.getElementById(tag_id);
    const crown_alt = current_crown.alt
  
    let red_crown_count = document.getElementById("red_crowns_checked_int");
    let blue_crown_count = document.getElementById("blue_crowns_checked_int");

    let red_crowns_count_value = parseInt(red_crown_count.value);
    let blue_crowns_count_value = parseInt(blue_crown_count.value);
  
   switch (crown_alt) {
    case "Red Crown Outline":
        red_crown_count.value = red_crowns_count_value + 1;
        current_crown.src = red_crown;
        current_crown.alt = "Red Crown";
        break;
    case "Red Crown":
        red_crown_count.value = red_crowns_count_value - 1;
        current_crown.src = red_crown_outline;
        current_crown.alt = "Red Crown Outline";
        break;
    case "Blue Crown Outline":
        blue_crown_count.value = blue_crowns_count_value + 1;
        current_crown.src = blue_crown;
        current_crown.alt = "Blue Crown";
        break;
    case "Blue Crown":
        blue_crown_count.value = blue_crowns_count_value - 1;
        current_crown.src = blue_crown_outline;
        current_crown.alt = "Blue Crown Outline";
        break;
}
  }
  document.getElementById("rc1").addEventListener("click", () => {
    flip_crown("rc1");
  });
  document.getElementById("rc2").addEventListener("click", () => {
    flip_crown("rc2");
  });
  document.getElementById("rc3").addEventListener("click", () => {
    flip_crown("rc3");
  });
  document.getElementById("bc1").addEventListener("click", () => {
    flip_crown("bc1");
  });
  document.getElementById("bc2").addEventListener("click", () => {
    flip_crown("bc2");
  });
  document.getElementById("bc3").addEventListener("click", () => {
    flip_crown("bc3");
  });

  export function payout_calculator(){
  let bet_value = parseInt(document.getElementById("points_bet_input").value);
  if (isNaN(bet_value)) bet_value = 0;

  let games_win_int = parseInt(document.getElementById("games_win_int").innerText);
  if (isNaN(games_win_int)) games_win_int = 0;

  let games_lost_int = parseInt(document.getElementById("games_lost_int").innerText);
  if (isNaN(games_lost_int)) games_lost_int = 0;


    const win_pct = streamer_win_pct(games_win_int, games_lost_int)
    const win_lose_toggle = document.getElementById("win_lose_toggle").checked? 1:0
    const crowns_taken_toggle = document.getElementById("crowns_taken_toggle").checked? 1 : 0;
    const crowns_lost_toggle = document.getElementById("crowns_lost_toggle").checked? 1 : 0;

    let win_rate_multiplier = 0.0;

    if (win_pct == null){
      win_pct = 0
    }

   if (win_lose_toggle == 1) {
      win_rate_multiplier = 2 - win_pct;
    } else {
      win_rate_multiplier = 1 + win_pct;
    }
    document.getElementById("bet_potential_payout_int").innerText = Math.round(bet_value * win_rate_multiplier * (crowns_lost_toggle + crowns_taken_toggle + 1))
  }

  document.getElementById("betting_interface_box").addEventListener("change", () =>{
    payout_calculator()
  });

  export function streamer_win_pct(wins, losses){
    const totalGames = wins + losses;
    if (totalGames === 0) return .5;
    let pct = (wins / (wins + losses))
    return pct
  }

  export function validate_bet_amount(){
    let viewer_current_points = parseInt(document.getElementById("viewer_current_points").innerText)
    let bet_value = document.getElementById("points_bet_input")
    let bet_value_int = parseInt(document.getElementById("points_bet_input").value)

    if(bet_value_int > viewer_current_points){
      window.alert("Sorry, not enough points")
      bet_value.value = viewer_current_points
      return false
    } else if (bet_value_int <= 0) {
       window.alert("Sorry, your bet must be greater than 0!")
       bet_value.value = 0
       return false
    } else if (!Number.isInteger(bet_value_int)){
      window.alert("Sorry, bet amount must be an integer")
      bet_value.value = 0
      return false
    }
    return true
  }

  document.getElementById("points_bet_input").addEventListener("change", () =>{
    let bet_value = document.getElementById("points_bet_input")
    let bet_value_int = parseInt(document.getElementById("points_bet_input").value)
    if (bet_value_int === 0){
      return
    }
    validate_bet_amount();
    });

export function make_session(){
  let current_session = new session()

  const streamer_name = document.getElementById("streamer_name")
  streamer_name.innerText = current_session.streamer_name

  const streamer_clash_tag = document.getElementById("streamer_tag")
  streamer_clash_tag.innerText = current_session.streamer_player_tag

  const viewer_username = document.getElementById("viewer_screen_name")
  viewer_username.innerText = current_session.viewer_name 

  return current_session
}

const betCooldownDuration = 5 * 60 * 1000 // 5 minutes in milliseconds
const betCountdownDisplay = document.getElementById("bet_countdown_display")

function updateCountdownDisplay(milliseconds) {
  console.log("Updated countdown display fired")
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)

  const formattedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  console.log(`${formattedMinutes}:${formattedSeconds}`)
  betCountdownDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`


}

let countdownTimeout = null;

function startCountdown(endTime) {
  console.log("Top of Start countdown fired")
  // Clear any existing timeout
  if (countdownTimeout !== null) {
    console.log("Cleated Timeout")
    clearTimeout(countdownTimeout);
  }

  function loop() {
    const now = Date.now();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      // Optionally do something when countdown ends
        document.getElementById('bet_countdown_label').textContent = "Awaiting Battle Results..."; // Reset label if changed
        betCountdownDisplay.textContent = "" 
      return;
    } else {
      updateCountdownDisplay(timeRemaining);

      // Schedule the next execution only after the current one completes
      countdownTimeout = setTimeout(loop, 1000);
    }
  }
  console.log("Countdown Started")
  loop(); // Start the countdown
}

export function checkAndEnableBetting() {
  if (bet_que.length > 0) {
    console.log("The bet que is greater than 0")
      // Assuming the latest bet's timestamp determines the cooldown
      const lastBetTime = bet_que[0].bet_time; // Adjust this to get the correct timestamp
      const cooldownEndTime = lastBetTime + betCooldownDuration;

      if (Date.now() >= cooldownEndTime) {
        console.log("CooldownEndTime: "+ cooldownEndTime)
        console.log("now is greater than cooldownend time.")
           // There's a bet, and the cooldown has passed
          document.getElementById('bet_countdown_label').textContent = "Awaiting Battle Results..."; // Reset label if changed
         betCountdownDisplay.textContent.textContent = ""
           
      } else {
        console.log("CooldownENdTime: "+ cooldownEndTime) 
        console.log("Start Count down fired: ")
        document.getElementById('bet_countdown_label').textContent = "Bet valid in: "; 
        startCountdown(cooldownEndTime);
      }
  } else {
    console.log("Bet Que was empty?")
      // No bets in the array, betting should be allowed (or perhaps not depending on your logic)
      //betCountdownDisplay.textContent = "";
       // placeBetButton.disabled = false; // Example
      document.getElementById('bet_countdown_label').textContent = "Place your next Bet!"; // Reset label if changed
  }
}