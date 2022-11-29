/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    document.getElementById("sidebarCell").style.width = "350px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    document.getElementById("sidebarCell").style.width = "0";
} 

// document.getElementsByClassName("closebtn").addEventListener('click', closeNav)
// document.getElementsByClassName("openbtn").addEventListener('click', openNav)

interact('.openbtn').on('tap', function (event) {
    console.log(event.type, event.target)
    openNav()
  })
interact(".closebtn").on('tap', function (event) {
    console.log(event.type, event.target)
    closeNav()
  })