
const firstFreuency = 440;
const bytes = 6;

const frequency = new Array(48).fill(0).map((_, i) => {
    if (i < 6)
        return firstFreuency * 2 ** (i / 6);
    if (i < 18)
        return firstFreuency * 2 ** (1 + (i - 6) / 12);
    if (i < 42)
        return firstFreuency * 2 ** (2 + (i - 18) / 24);
    if (i < 90)
        return firstFreuency * 2 ** (3 + (i - 42) / 48);
});

document.getElementById("text").value = localStorage["textToSound"] || "hello, world! ðøüþÿ";
document.getElementById("sound-sec").value = localStorage["soundSec"] || 0.5;
document.getElementById("fft-size").value = localStorage["fft-size"] || 13;
document.getElementById("threshold").value = localStorage["threshold"] || 160;

document.getElementById("boxes").innerHTML = frequency.map((x, y) => `<div class="box"><span>${Math.round(x)}Hz<br>2<sup>${y}</sup></span></div>${y % 8 == 7 ? "<br>" : ""}`).join(" ");
let boxesHTMLCollection = document.getElementsByClassName("box");

const boxColorsCollection = {
    yellow_mute : "#ffdd8818",
    red_mute : "#ff888818",
    red_sound : "#ff8888b0",
    green_mute : "#88ffa018",
    green_sound : "#88ffa0b0",
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context;

let soundText_intervalId;
let frequencyData, stream, input, analyser, threshold, fftSize, listenTextLoop_reqId, heardChars;
let frameCounter = 0;

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

function getSingleHertzComponent(timeDomainData, targetHertz, sampleLeng) {
    let sumsin = 0, sumcos = 0;

    timeDomainData.slice(0, sampleLeng).map(x => x - 127).forEach((x, y) => {
        sumsin += x * Math.sin((y / (context.sampleRate / targetHertz)) * Math.PI * 2);
        sumcos += x * Math.cos((y / (context.sampleRate / targetHertz)) * Math.PI * 2);
    });

    return ((sumsin / sampleLeng) ** 2 + (sumcos / sampleLeng) ** 2) ** 0.5;
}

function soundText(textToSound, soundSec) {
    let i = 0;

    soundText_intervalId = setInterval(function() {
        if (i >= textToSound.length) {
            [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.yellow_mute);
            document.getElementById("heard-letter").innerHTML = `[]`;
            clearInterval(soundText_intervalId);
            return;
        }

        console.log(`attempting ${i} ~ ${i + bytes}...`);

        frequency.forEach((f, index) => {
            if ((textToSound.codePointAt(i + Math.floor(index / 8)) >> (index % 8)) & 1) {
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_sound;
                beep(f, 0, soundSec * 0.4);
            } else 
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_mute;
        });

        document.getElementById("heard-letter").innerHTML = `[${textToSound.slice(i, i + bytes)}]`;
        i += bytes;

    }, soundSec * 1000);
}

function listenTextLoop() {
    listenTextLoop_reqId = requestAnimationFrame(listenTextLoop);

    let codePoint = 0;
    analyser.getByteFrequencyData(frequencyData);
    // analyser.getByteTimeDomainData(timeDomainData);
    
    frequency.forEach((f, index) => {
        if (threshold <= frequencyData[Math.floor(f / (context.sampleRate / analyser.fftSize))]) {
            boxesHTMLCollection[index].style.background = boxColorsCollection.red_sound;
            codePoint += 2 ** index;
        } else 
            boxesHTMLCollection[index].style.background = boxColorsCollection.red_mute;
    });
    
    if (codePoint == 0 && Object.keys(heardChars).length > 0) {
        let confirmedCodePoint = Object.keys(heardChars).reduce((x, y) => heardChars[x] > heardChars[y] ? x : y, 0);

        let confirmed4bytes = new Array(bytes).fill(0).map((_, i) => {
            let byte = (confirmedCodePoint / 2 ** (i * 8)) & 0xFF;
            return byte ? String.fromCodePoint(byte) : "";
        });

        document.getElementById("confirmed-letter").innerHTML = `[${confirmed4bytes.join("")}]`;
        document.getElementById("received-text").value += confirmed4bytes.join("");

        heardChars = {};
    }

    let heardLetters = new Array(bytes).fill(0).map((_, i) => {
        let byte = (codePoint / 2 ** (i * 8)) & 0xFF;
        return byte ? String.fromCodePoint(byte) : "";
    });
    
    document.getElementById("heard-letter").innerHTML = `[${heardLetters.join("")}]`;

    if (codePoint) {
        if (!heardChars[codePoint]) heardChars[codePoint] = 0;
        heardChars[codePoint]++;
    }
}

function initallaize(){
    clearInterval(soundText_intervalId);
    cancelAnimationFrame(listenTextLoop_reqId);
    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.yellow_mute);

    context = new AudioContext();

    const emptySource = context.createBufferSource();
    emptySource.start();
    emptySource.stop();
}

document.getElementById("call-button").addEventListener("click", function() {
    initallaize();
    
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sound-sec").value;

    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    
    alert(`going to sound "${textToSound.length > 50 ? textToSound.substring(0, 100) + "..." : textToSound}" ${soundSec} sec per note`);
    
    if (confirm("ready?")) {
        [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.green_mute);
        soundText(textToSound, soundSec);
    }
})


document.getElementById("rec-button").addEventListener("click", async() => {
    initallaize();

    stream = await navigator.mediaDevices.getUserMedia({audio: true});
    input = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    input.connect(analyser);
    
    confirmedCodePoints = new Array(bytes).fill(0);
    heardChars = [];
    document.getElementById("received-text").value = "";
    
    threshold = document.getElementById("threshold").value;
    fftSize = document.getElementById("fft-size").value;

    localStorage["threshold"] = threshold;
    localStorage["fft-size"] = fftSize;
    analyser.fftSize = 2 ** fftSize;
    
    alert(`initalization succeded!\n>>>caution: work in progress<<<\n\nthreshold = ${threshold};\nanalyser.fftSize = ${analyser.fftSize};`);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeDomainData = new Uint8Array(analyser.fftSize);
    
    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.red_mute);

    listenTextLoop();
})