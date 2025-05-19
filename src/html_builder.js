export function pending_bet(bet) {
  const king_thumbs_up = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_thumbs_up-lTZxcTu8hoNBns6MtnKBmPVQ0qfPZL.png";
  const king_cry = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png";
  const king_img = bet.win_lose ? king_thumbs_up : king_cry;
  const red_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red-yUO0bonTVRluBOSTwuHcDj45NPHfP9.png";
  const red_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red_outline-z7uto1UUrra0poesKhuWr2Dwg4ie5a.png";
  const blue_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/blue_crown-8xNyXRxniDC24t14B85nmqlKKBEB5A.png";
  const blue_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_blue_outline-DTdoXK6tHNg2IIosnhUt6rqJEWSG6U.png";
  let bet_crowns_taken = bet.crowns_taken_int;
  let bet_crowns_lost = bet.crowns_lost_int;
  let crowns_taken_img = [];
  let crowns_lost_img = [];
  for (let i = 3; i > 0; i--) {
      if (bet_crowns_taken > 0) {
          crowns_taken_img.push(`<img class="object-contain h-10" src="${red_crown}"/>`);
          bet_crowns_taken--;
      } else {
          crowns_taken_img.push(`<img class="object-contain h-10" src="${red_crown_outline}"/>`);
      }
  }
  for (let i = 3; i > 0; i--) {
      if (bet_crowns_lost > 0) {
          crowns_lost_img.push(`<img class="object-contain h-10" src="${blue_crown}"/>`);
          bet_crowns_lost--;
      } else {
          crowns_lost_img.push(`<img class="object-contain h-10" src="${blue_crown_outline}"/>`);
      }
  }
  let pending_bet_html = document.createElement("div");
  pending_bet_html.classList.add("bet-entry"); // FIXED: Use classList.add instead of class.add
  pending_bet_html.innerHTML = `
      <div class="grid grid-cols-3 grid-rows-1 border-2 rounded-2xl items-center mb-2 bg-gradient-to-b from-amber-100 to-amber-300 from-40%">
          <img src="${king_img}" class="col-span-1 row-span-2 flex w-28 object-contain">
          <div class="col-span-1 col-start-2 row-span-1 row-start-1 flex">
             ${crowns_taken_img.join("")}
          </div>
          <div class="col-span-1 col-start-2 row-span-1 row-start-2 flex">
              ${crowns_lost_img.join("")}
          </div>
          <div class="col-span-3 row-span-2 col-start-3 text-center">
              <h2 class="text-xl">Pending</h2>
              <p>Bet: ${bet.points_bet}</p>
              <p>Payout: ${bet.payout}</p>
          </div>
      </div>`;
  return pending_bet_html;
}

export function update_pending_bets() {
  const pendingBetsContainer = document.getElementById("pending_bets");
  const currentBets = pendingBetsContainer.querySelectorAll(".bet-entry");
  currentBets[0].remove();
}



export function resolved_bet(bet, battle_result){
    const king_thumbs_up = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_thumbs_up-lTZxcTu8hoNBns6MtnKBmPVQ0qfPZL.png"
    const king_cry = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png"
    let king_img = ""
    let king_img_div
    const win_lose = bet_analyzer(bet, battle_result)
    const green_background = "bg-radial rounded-xl from-amber-50 to-green-600"
    const red_background = "bg-radial rounded-xl from-amber-50 to-red-500"
    const background = win_lose? green_background: red_background
    let point_difference = win_lose? "+" + bet.payout : "-" + bet.points_bet
  
    if(bet.win_lose){
        king_img = king_thumbs_up
        king_img_div = `<img src="${king_img}" class="col-span-1 row-span-2 flex ${background}">`
    } else {
        king_img = king_cry
        king_img_div = `<img src="${king_img}" class="col-span-1 row-span-2 flex ${background}">`
    }
    const crowns_lost_img = resolved_crowns_img_builder("blue", battle_result.crowns_lost_int , bet.crowns_lost_int)
    const crowns_taken_img = resolved_crowns_img_builder("red", battle_result.crowns_taken_int, bet.crowns_taken_int)
    //Reslved bet must be a node.
    let resolved_bet_html = document.createElement("div");
  resolved_bet_html.innerHTML = `<div class="hidden md:grid grid-cols-4 grid-rows-2 border-2 rounded-2xl my-1 p-1 justify-center bg-gradient-to-b from-amber-100 to-amber-300 from-40%" id="past_bet_1">
        ${king_img_div}
        <div class="col-span-2 col-start-2 row-span-1 row-start-1 flex">
             ${crowns_taken_img}
        </div>
        <div class="col-span-2 col-start-2 row-span-1 row-start-2 flex">
            ${crowns_lost_img}
        </div>
        <p class="row-span-2 col-start-4 flex items-center text-sm md:text-xl lg:text-2xl pr-2">${point_difference}</p>
    </div>`
    return resolved_bet_html
}

export function resolved_crowns_img_builder(crown_color, result_crowns_int, crowns_predicted_int) {
    const red_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red-yUO0bonTVRluBOSTwuHcDj45NPHfP9.png"
    const red_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red_outline-z7uto1UUrra0poesKhuWr2Dwg4ie5a.png"
    const blue_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/blue_crown-8xNyXRxniDC24t14B85nmqlKKBEB5A.png"
    const blue_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_blue_outline-DTdoXK6tHNg2IIosnhUt6rqJEWSG6U.png"
    let result_crowns_count = result_crowns_int
    let crowns_predicted_count = crowns_predicted_int
    let crown = ""
    let crown_outline = ""
    if (crown_color=="red"){
        crown = red_crown
        crown_outline = red_crown_outline
    } else if (crown_color=="blue"){
        crown = blue_crown
        crown_outline = blue_crown_outline
    }
    const correct_crown =
      `<img class="object-contain inline bg-radial rounded-xl from-amber-50 to-green-600 h-6 mx-0.5" src="${crown}">`;
    const correct_crown_outline =
      `<img class="object-contain inline bg-radial rounded-xl from-amber-50 to-green-600 h-6 mx-0.5" src="${crown_outline}">`;
    const incorrect_crown =
      `<img class="object-contain inline bg-radial rounded-xl from-amber-50 to-red-500 h-6 mx-0.5" src="${crown}">`;
    const incorrect_crown_outline =
      `<img class="object-contain inline bg-radial rounded-xl from-amber-50 to-red-500 h-6 mx-0.5" src="${crown_outline}">`;
      let crowns_img = "";

    for (let i = 3; i > 0; i--) {
      if (result_crowns_count > 0 && crowns_predicted_count > 0) {
        crowns_img = crowns_img.concat(correct_crown);
        result_crowns_count = result_crowns_count - 1;
        crowns_predicted_count = crowns_predicted_count - 1;
      } else if (result_crowns_count == 0 && crowns_predicted_count > 0) {
        crowns_img = crowns_img.concat(incorrect_crown_outline);
        crowns_predicted_count = crowns_predicted_count - 1;
      } else if (result_crowns_count > 0 && crowns_predicted_count == 0) {
        crowns_img = crowns_img.concat(incorrect_crown);
        result_crowns_count = result_crowns_count - 1;
      } else if (result_crowns_count == 0 && crowns_predicted_count == 0){
        crowns_img = crowns_img.concat(correct_crown_outline);
      }
    }
    return crowns_img;
  }

  export function leaderboard_builder(leaderboard_list){
    let leaderboard_ul = ""
    if (leaderboard_list.length ==0){
        return "<p>This really shouldn't happen</p>"
    } else { 
        for (i=0; i > leaderboard_list.length; i++ ){
            color = "bg-amber-100"
            if (i%2 !=0){
                color = "bg-amber-50"
            }
            let rank = i + 1

            let leaderboard_entry = leaderboard_list[i]
            let entry = `<tr class="${color} text-center">
                <td class="p-2">${rank}</td>
                <td class="p-2">${leaderboard_entry.screen_name}</td>
                <td class="p-2">${leaderboard_entry.points}</td>
                </tr>`
            leaderboard_ul.concat(entry)
        }
    }
    return leaderboard_ul
  }

  export function bet_analyzer(bet, battle_result) {
    if (bet.win_lose != battle_result.win_lose) {
      return false;

    }
  
    if (bet.crowns_taken) {
      if (bet.crowns_taken_int != battle_result.crowns_taken_int) {
        return false;
      }
    }
  
    if (bet.crowns_lost) {
      if (bet.crowns_lost_int != battle_result.crowns_lost_int) {
        return false;
      }
    }
    
    let current_points = parseInt(document.getElementById("viewer_current_points").innerText)
    document.getElementById("viewer_current_points").innerText = current_points + bet.payout
    
    return true;
  }