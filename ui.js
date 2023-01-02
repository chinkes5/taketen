/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    document.getElementById("sidebarCell").style.width = "350px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    document.getElementById("sidebarCell").style.width = "0";
}

document.getElementsByClassName("closebtn").addEventListener('click', closeNav)
document.getElementsByClassName("closebtn").addEventListener('touchstart', closeNav)
document.getElementsByClassName("openbtn").addEventListener('click', openNav)
document.getElementsByClassName("openbtn").addEventListener('touchstart', openNav)
