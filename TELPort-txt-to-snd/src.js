
const frequency = [440, 528, 633, 760, 912, 1095, 1314, 1577];

let context;

window.addEventListener("load", () => {
    context = new AudioContext();
})

function beep(hertz, start, len) {
    
    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.25;
    
    let oscillatorNode = new OscillatorNode(context);
    oscillatorNode.frequency.value = hertz;
    oscillatorNode.connect(gainNode);
    oscillatorNode.start(context.currentTime + start);
    oscillatorNode.stop(context.currentTime + start + len);
}

document.getElementById("dispatcher").addEventListener("click", function() {
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sec").value;
    
    alert(`going to sound '${textToSound}' ${soundSec} sec per note`);
    if (confirm("ready?")) {
        for (let i = 0; i < textToSound.length; i++) {
            console.log(`attempting ${i}...`);
            frequency.forEach((f, index) => {
                if ((textToSound.codePointAt(i) >> index) & 1) beep(f, i * soundSec, soundSec * 0.9);
            });
        }
    }
})