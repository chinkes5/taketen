function makePlayerName(){
    let playerName = animals[Math.floor(Math.random()*animals.length)].value + verbs[Math.floor(Math.random()*verbs.length)].value + Math.floor(Math.random() * 99);
    document.getElementById("player").innerHTML = playerName + "<span class=\"material-symbols-outlined\" onclick=\"updatePlayer()\">edit</span>"
}

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

function getTopTen(){
    //load top ten highest scores from Cloudflare edge cache and display
    document.getElementById("results").innerHTML = "Top Scores:<ol><li>JEMC - 560</li><li>JEMC - 550</li><li>JEMC - 548</li><li>JEMC - 542</li><li>JEMC - 538</li></ol>"
}

//run this to set a random name on load, must load two data files before running this!
makePlayerName()
getTopTen()
