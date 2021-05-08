
const frequency = new Array(17).fill(0).map((_, i) => {
    if (i < 6)
        return 440 * 2 ** (i / 6);
    if (i < 18)
        return 880 * 2 ** ((i - 6) / 12);
    if (i < 42)
        return 1760 * 2 ** ((i - 18) / 24);
});

document.getElementById("text").value = localStorage["textToSound"] || "hello, world! ðøüþÿ";
document.getElementById("sec").value = localStorage["soundSec"] || 0.5;
document.getElementById("fft-size").value = localStorage["fft-size"] || 12;
document.getElementById("threshold").value = localStorage["threshold"] || 128;

document.getElementById("boxes").innerHTML = frequency.map((x, y) => `<div class="box"><span>${Math.round(x)}Hz<br>2<sup>${y}</sup></span></div>${y % 8 == 7 ? "<br>" : ""}`).join(" ");
let boxesHTMLCollection = document.getElementsByClassName("box");
const boxColorsCollection = {
    yellow_mute : "#ffdd8820",
    red_mute : "#ff888820",
    red_sound : "#ff8888f0",
    green_mute : "#88ffa020",
    green_sound : "#88ffa0f0",
}

let context;

let soundText_intervalId;
let frequencyData, stream, input, analyser, threshold, listenTextLoop_reqId;

function beep(hertz, start, len) {
    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.1;
    
    let oscillatorNode = new OscillatorNode(context);
    oscillatorNode.type = "sine";
    oscillatorNode.frequency.value = hertz;
    oscillatorNode.connect(gainNode);
    oscillatorNode.start(context.currentTime + start);
    oscillatorNode.stop(context.currentTime + start + len);
}

function soundText(textToSound, soundSec) {
    let i = 0;

    soundText_intervalId = setInterval(function() {
        if (i >= textToSound.length) {
            [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.yellow_mute);
            clearInterval(soundText_intervalId);
            return;
        }
        console.log(`attempting ${i}...`);
        frequency.forEach((f, index) => {
            if ((textToSound.codePointAt(i) >> index) & 1) {
                beep(f, 0, soundSec * 0.8);
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_sound;
            }
            else 
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_mute;
        });
        i++;
    }, soundSec * 1000);
}

function listenTextLoop() {
    listenTextLoop_reqId = requestAnimationFrame(listenTextLoop);

    frequency.forEach((f, index) => {
        analyser.getByteFrequencyData(frequencyData);
        if (threshold <= frequencyData[Math.floor(f / (context.sampleRate / analyser.fftSize))])
            boxesHTMLCollection[index].style.background = boxColorsCollection.red_sound;
        else 
            boxesHTMLCollection[index].style.background = boxColorsCollection.red_mute;
    });
}

document.getElementById("call-button").addEventListener("click", function() {
    clearInterval(soundText_intervalId);
    cancelAnimationFrame(listenTextLoop_reqId);

    context = new AudioContext();
    
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sec").value;

    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    
    alert(`going to sound "${textToSound}" ${soundSec} sec per note`);
    
    if (confirm("ready?")) {
        soundText(textToSound, soundSec);
    }
})


document.getElementById("rec-button").addEventListener("click", async() => {
    clearInterval(soundText_intervalId);
    cancelAnimationFrame(listenTextLoop_reqId);

    if (!stream) {
        context = new AudioContext();
        stream = await navigator.mediaDevices.getUserMedia({audio: true});
        input = context.createMediaStreamSource(stream);
        analyser = context.createAnalyser();
        input.connect(analyser);
    }
    
    threshold = document.getElementById("threshold").value;
    localStorage["threshold"] = document.getElementById("threshold").value;
    analyser.fftSize = 2 ** document.getElementById("fft-size").value;
    localStorage["fft-size"] = document.getElementById("fft-size").value;
    
    alert(`>>>caution: work in progress<<<\n\nthreshold = ${threshold};\nanalyser.fftSize = ${analyser.fftSize};`);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.red_mute);
    listenTextLoop();
})