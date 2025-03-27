export function pending_bet(bet_order, bet) {
  const king_thumbs_up = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_thumbs_up-lTZxcTu8hoNBns6MtnKBmPVQ0qfPZL.png";
  const king_cry = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png";

  const king_img = bet.win_lose ? king_thumbs_up : king_cry;

  const awaiting_results = `<section class="col-span-6 col-start-1" id="Pending_bet_0">`;
  const next_bet = `<section class="col-span-6 col-start-7" id="Pending_bet_1">`;

  const position = bet_order === "awaiting_results" ? awaiting_results : next_bet;
  const h2 = bet_order === "awaiting_results" ? "Next Bet!" : "Pending!";

  const red_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red-yUO0bonTVRluBOSTwuHcDj45NPHfP9.png";
  const red_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_red_outline-z7uto1UUrra0poesKhuWr2Dwg4ie5a.png";
  const blue_crown = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/blue_crown-8xNyXRxniDC24t14B85nmqlKKBEB5A.png";
  const blue_crown_outline = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/crown_blue_outline-DTdoXK6tHNg2IIosnhUt6rqJEWSG6U.png";

  let bet_crowns_taken = bet.crowns_taken_int;
  let bet_crowns_lost = bet.crowns_lost_int;
  console.log(bet_crowns_taken)
  console.log(bet_crowns_lost)
  // Generate crown images
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

  // Create the wrapper element
  let pending_bet_html = document.createElement("div");
  pending_bet_html.innerHTML = `
      ${position}
          <div class="grid grid-cols-3 grid-rows-1 border-2 rounded-2xl items-center mb-2 bg-linear-to-b  from-amber-100 to-amber-300 from-40%">
              <img src="${king_img}" class="col-span-1 row-span-2 flex w-28 object-contain">
              <div class="col-span-1 col-start-2 row-span-1 row-start-1 flex">
                 ${crowns_taken_img.join("")}
              </div>
              <div class="col-span-1 col-start-2 row-span-1 row-start-2 flex">
                  ${crowns_lost_img.join("")}
              </div>
              <div class="col-span-3 row-span-2 col-start-3 text-center">
                  <h2 class="text-2xl">${h2}</h2>
                  <p>Bet: ${bet.points_bet}</p>
                  <p>Payout: ${bet.payout}</p>
              </div>
          </div>
      </section>`;

  // Return the first child, which is the actual section element
  return pending_bet_html.firstElementChild;
}

export function resolved_bet(bet, battle_result){
    const king_thumbs_up = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_thumbs_up-lTZxcTu8hoNBns6MtnKBmPVQ0qfPZL.png"
    const king_cry = "https://xtt6g4okcdjizwxr.public.blob.vercel-storage.com/emote_king_cry-e3JZiU0CBMgOvmBI0bh7rCJD0aEo30.png"
    let king_img = ""
    const win_lose = bet_analyzer(bet, battle_result)
    const point_difference = ""
    if(win_lose){
        king_img = king_thumbs_up
        point_difference = "+" + bet.payout
    } else {
        king_img = king_cry
        point_difference = "-" + bet.points_bet
    }
    const crowns_lost_img = resolved_crowns_img_builder("blue", battle_result.crowns_lost_int , bet.crowns_lost_int)
    const crowns_taken_img = resolved_crowns_img_builder("red", battle_result.crowns_taken_int, bet.crown_taken_int)

    const resolved_bet_html = `<div class="grid grid-cols-4 grid-rows-2 border-2 rounded-2xl my-1" id="past_bet_1">
        <img src="${king_img}" class="col-span-1 row-span-2 flex"></img>
        <div class="col-span-2 col-start-2 row-span-1 row-start-1 flex">
             ${crowns_taken_img}
        </div>
        <div class="col-span-2 col-start-2 row-span-1 row-start-2 flex">
            ${crowns_lost_img}
        </div>
        <p class="row-span-2 col-start-4 flex items-center ">${point_difference}</p>
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
        const crown = red_crown
        const crown_outline = red_crown_outline
    } else if (crown_color=="blue"){
        const crown = blue_crown
        const crown_outline = blue_crown_outline
    }
    const correct_crown =
      `<img class="object-contain inline bg-green-600 rounded-full h-8" src="${crown}"`;
    const correct_crown_outline =
      `<img class="object-contain inline bg-green-600 rounded-full h-8" src="${crown_outline}">`;
    const incorrect_crown =
      `<img class="object-contain inline bg-red-600 rounded-full h-8" src="${crown}">`;
    const incorrect_crown_outline =
      `<img class="object-contain inline bg-red-600 rounded-full h-8" src="${crown_outline}">`;
      let crowns_img = "";
    for (let i = 3; i > 0; i--) {
      if (result_crowns_count > 0 && crowns_predicted_count > 0) {
        crowns_taken_img = crowns_taken_img.concat(correct_crown);
        result_crowns_count = result_crowns_count - 1;
        crowns_predicted_count = crowns_predicted_count - 1;
      } else if (result_crowns_count == 0 && crowns_predicted_count > 0) {
        crowns_taken_img = crowns_taken_img.concat(incorrect_crown_outline);
        crowns_predicted_count = crowns_predicted_count - 1;
      } else if (result_crowns_count > 0 && crowns_predicted_count == 0) {
        crowns_taken_img = crowns_taken_img.concat(incorrect_crown);
        result_crowns_count = result_crowns_count - 1;
      } else if (result_crowns_count == 0 && crowns_predicted_count == 0) {
        crowns_taken_img = crowns_taken_img.concat(correct_crown_outline);
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
      if (bet.crowns_taken != battle_result.crowns_taken) {
        return false;
      }
    }
  
    if (bet.crowns_lost) {
      if (bet.crowns_lost != battle_result.crowns_lost) {
        return false;
      }
    }
    //add_points(prediction.potential_points);
    return true;
  }