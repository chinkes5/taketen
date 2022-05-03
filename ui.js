function makePlayerName(){
    let playerName = animals[Math.floor(Math.random()*animals.length)].value + verbs[Math.floor(Math.random()*verbs.length)].value + Math.floor(Math.random() * 99);
    document.getElementById("player").innerHTML = playerName + "<span class=\"material-symbols-outlined\" onclick=\"updatePlayer()\">edit</span>"
}

//run this to set a random name on load-
makePlayerName()

function updatePlayer(){
    //update the display to a form field to enter a new name
    //save the name and update the page with new name
    let player = document.getElementById("player").innerHTML.split("<")[0];
    document.getElementById("player").innerHTML = "<input type=\"text\" id=\"playername\" name=\"playername\" value=\"" 
        + player + "\"><br/><input type=\"button\" onclick=\"savePlayer()\" value=\"Save\">";
};

function savePlayer(){
    //once the player updates the form field, this will save the new name
    let playerName = document.getElementById("playername").value
    document.getElementById("player").innerHTML = playerName + "<span class=\"material-symbols-outlined\" onclick=\"updatePlayer()\">edit</span>"
}

function saveScore(){
    //hit the cloudflare worker with score and player name (but subtract the edit button)
    let player = document.getElementById("player").innerHTML.split("<")[0];
};