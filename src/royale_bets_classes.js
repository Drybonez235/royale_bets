export class session{
    constructor(){
        this.session_id = sessionStorage.getItem("timestampUTC");
        this.viewer_name = sessionStorage.getItem("screenName");
        this.streamer_name = sessionStorage.getItem("clash_name");
        this.streamer_clash_tag = sessionStorage.getItem("playerTag")
        this.last_refresh_time = sessionStorage.getItem("timestampUTC");
        this.points = document.getElementById("viewer_current_points").value
    }


}

export class bet {
    constructor(viewer_name, session_id, streamer_clash_tag){
    this.viewer_name = viewer_name
    this.session_id = session_id
    this.streamer_clash_tag = streamer_clash_tag
    this.bet_time = utc_time_value()
    this.points_bet = parseInt(document.getElementById("points_bet_input").value)
    this.payout = parseInt(document.getElementById("bet_potential_payout_int").innerText)
    this.win_lose = document.getElementById("win_lose_toggle").checked ? true: false;
    this.crowns_taken = document.getElementById("crowns_taken_toggle").checked ? true: false;
    this.crowns_lost = document.getElementById("crowns_lost_toggle").checked ? true: false;
    this.crowns_taken_int = parseInt(document.getElementById("red_crowns_checked_int").value)
    this.crowns_lost_int = parseInt(document.getElementById("blue_crowns_checked_int").value)
    }
}

export class battle_result{
    constructor(streamer_clash_tag, battle_time, crowns_taken_int, crowns_lost_int){
        this.streamer_clash_tag = streamer_clash_tag
        this.battle_time = battle_time
        this.crowns_taken_int = crowns_taken_int
        this.crowns_lost_int = crowns_lost_int
        this.win_lose = win_lose(crowns_taken_int, crowns_lost_int)
    }

    win_lose(crowns_taken_int, crowns_lost_int) {
        if(crowns_taken_int > crowns_lost_int){
            return true
        } else if(crowns_taken_int < crowns_lost_int){
            return false
        } else {
            return false
        }
    }
}

export class streamer_stats{
    constructor(streamer_name, streamer_clash_tag, stream_start_time, wins, losses, win_pct){
        this.streamer_name = streamer_name
        this.streamer_clash_tag = streamer_clash_tag
        this.stream_start_time = stream_start_time
        this.wins = wins
        this.losses = losses
        this.win_pct = win_pct
    }

    //method to calculate stream start
}

export class leaderboard_entry{
    constructor(rank, screen_name, points){
        this.rank = rank
        this.screen_name = screen_name
        this.points = points
    }
}

export class leaderboard{
    constructor(leaderboard_entries_list){
        this.leaderboard_entries_list = leaderboard_entries_list
    }

    //Method to construct the leaderboard html
}

export function utc_time_value() {
    let date = new Date();
    let UTC_string = date.toISOString();
    let UTC_milli = Date.UTC(
      UTC_string.slice(0, 4),
      UTC_string.slice(5, 7) - 1,
      UTC_string.slice(8, 10),
      UTC_string.slice(11, 13),
      UTC_string.slice(14, 16),
      UTC_string.slice(17, 19),
      UTC_string.slice(20, 23),
    );
    return UTC_milli;
  }