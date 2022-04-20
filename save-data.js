//// Save Data ////
const form = document.getElementById('form');
function logSubmit(event) {
    var original = document.getElementById('OG').value;
    var translation = document.getElementById('TR').value;

    console.log(original + "; " + translation);
    chrome.runtime.sendMessage({method: "recieveNew", original, translation});
}
form.addEventListener('submit', logSubmit);
function clear()
{
    console.log("hi");
    chrome.runtime.sendMessage({method: "clear"});
}
const button = document.getElementById('clear');
button.addEventListener('click', clear);
