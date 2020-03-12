var soundon = true;

function changeSound() {
    if(soundon == true) {
        document.getElementById("snd").innerHTML = "OFF";
        soundon = false;
    } else {
        document.getElementById("snd").innerHTML = "ON";
        soundon = true;
    }
    
}