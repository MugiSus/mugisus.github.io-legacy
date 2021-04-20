
const frequency = new Array(16).fill(0).map((_, i) => {
    if (i < 12)
        return 880 * 2 ** (i / 12);
    if (i < 36)
        return 1760 * 2 ** ((i - 12) / 24);
});

document.getElementById("text").value = localStorage["textToSound"] || "hello, world! ðøüþÿ";
document.getElementById("sec").value = localStorage["soundSec"] || 0.5;

let context;

function beep(hertz, start, len) {
    
    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.25;
    
    let oscillatorNode = new OscillatorNode(context);
    oscillatorNode.type = "sine";
    oscillatorNode.frequency.value = hertz;
    oscillatorNode.connect(gainNode);
    oscillatorNode.start(context.currentTime + start);
    oscillatorNode.stop(context.currentTime + start + len);
}

document.getElementById("dispatcher").addEventListener("click", function() {

    context = new AudioContext();
    
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sec").value;

    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    
    alert(`going to sound "${textToSound}" ${soundSec} sec per note`);
    if (confirm("ready?")) {
        for (let i = 0; i < textToSound.length; i++) {
            console.log(`attempting ${i}...`);
            frequency.forEach((f, index) => {
                if ((textToSound.codePointAt(i) >> index) & 1) beep(f, i * soundSec, soundSec * 0.8);
            });
        }
    }
})