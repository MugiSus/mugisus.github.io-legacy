
const frequency = new Array(16).fill(0).map((_, i) => {
    if (i < 12)
        return 880 * 2 ** (i / 12);
    if (i < 36)
        return 1760 * 2 ** ((i - 12) / 24);
});

document.getElementById("text").value = localStorage["textToSound"] || "hello, world! ðøüþÿ";
document.getElementById("sec").value = localStorage["soundSec"] || 0.5;

document.getElementById("boxes").innerHTML = frequency.map((x, y) => `<div class="box" id="${y}"><span>${Math.round(x)}Hz</span></div>`).join(" ");

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

document.getElementById("call-button").addEventListener("click", function() {

    context = new AudioContext();
    
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sec").value;

    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    
    alert(`going to sound "${textToSound}" ${soundSec} sec per note`);

    if (confirm("ready?")) {
        let mainInterval;
        let i = 0;

        mainInterval = setInterval(function() {
            console.log(`attempting ${i}...`);
            frequency.forEach((f, index) => {
                if ((textToSound.codePointAt(i) >> index) & 1) beep(f, 0, soundSec * 0.8);
            });
            i++;
            if (i >= textToSound.length) clearInterval(mainInterval);
        }, soundSec * 1000);
    }
})

document.getElementById("rec-button").addEventListener("click", function() {
    alert("work in progress. sorry!");
    return;

    context = new AudioContext();
    
    const stream = navigator.mediaDevices.getUserMedia({audio: true}); //Failed to execute 'createMediaStreamSource' on 'AudioContext': parameter 1 is not of type 'MediaStream'.
    const input = context.createMediaStreamSource(stream);
    
    const analyzer = context.createAnalyser();
    
    input.connect(analyzer);
})