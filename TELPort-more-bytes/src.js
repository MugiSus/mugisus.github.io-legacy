const firstFreuency = 1000;
const bytes = 40;

const frequency = new Array(8 * bytes).fill(0).map((_, i) => {
    return firstFreuency + 20 * i;
});

document.getElementById("text").value = localStorage["textToSound"] ?? "hello, world! ðøüþÿ";
document.getElementById("sound-sec").value = localStorage["soundSec"] ?? 0.5;
document.getElementById("visualize").checked = (localStorage["visualize"] ?? "true") == "true";
document.getElementById("fft-size").value = localStorage["fft-size"] ?? 13;
document.getElementById("threshold").value = localStorage["threshold"] ?? 160;

document.getElementById("sound-sec-number").value = localStorage["soundSec"] ?? 0.5;
document.getElementById("threshold-number").value = localStorage["threshold"] ?? 160;

document.getElementById("boxes").innerHTML = frequency.map((x, y) => `<div class="box"><span>${Math.round(x)}Hz<br>2<sup>${y}</sup></span></div>${(y + 1) % 16 ? "" : "<br>"}`).join(" ");
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

let visualize;
let soundText_intervalId, textToSound, soundSec;
let frequencyData, stream, input, analyser, threshold, fftSize, listenTextLoop_reqId, heardChars;

function beep(hertz, start, len) {
    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.005;
    
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
                if (visualize)
                    boxesHTMLCollection[index].style.background = boxColorsCollection.green_sound;
                beep(f, 0, soundSec * 0.4);
            } else if (visualize) 
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_mute;
        });

        document.getElementById("heard-letter").innerHTML = `[${textToSound.slice(i, i + bytes)}]`;
        i += bytes;

    }, soundSec * 1000);
}

function listenTextLoop() {
    listenTextLoop_reqId = requestAnimationFrame(listenTextLoop);
    //listenTextLoop_reqId = setTimeout(listenTextLoop, 1000 / 120);

    let codePoints = new Array(bytes).fill(0);
    let isMute = true;
    analyser.getByteFrequencyData(frequencyData);
    // analyser.getByteTimeDomainData(timeDomainData);
    
    frequency.forEach((f, index) => {
        if (threshold <= frequencyData[Math.floor(f / (context.sampleRate / analyser.fftSize))]) {
            if (visualize)
                boxesHTMLCollection[index].style.background = boxColorsCollection.red_sound;
            codePoints[Math.floor(index / 8)] += 2 ** (index % 8);
            isMute = false;
        } else if (visualize)
            boxesHTMLCollection[index].style.background = boxColorsCollection.red_mute;
    });
    
    if (isMute && heardChars.some(x => Object.keys(x).length)) {
        let confirmedBytes = heardChars.map(x => Object.keys(x).reduce((p, c) => x[p] > x[c] ? p : c)).map(x => x * 1 ? String.fromCodePoint(x) : "");

        document.getElementById("confirmed-letter").innerHTML = `[${confirmedBytes.join("")}]`;
        document.getElementById("received-text").value += confirmedBytes.join("");

        heardChars = new Array(bytes).fill(0).map(() => new Object());
    } else if (!isMute) {
        codePoints.forEach((x, i) => {
            if (x && !heardChars[i][x]) heardChars[i][x] = 0;
            else heardChars[i][x]++;
        })
    }
    
    document.getElementById("heard-letter").innerHTML = `[${codePoints.map(x => x ? String.fromCodePoint(x) : "").join("")}]`;
}

function initallaize(){
    clearInterval(soundText_intervalId);
    //clearTimeout(listenTextLoop_reqId);
    cancelAnimationFrame(listenTextLoop_reqId);

    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.yellow_mute);

    context = new AudioContext();

    const emptySource = context.createBufferSource();
    emptySource.start();
    emptySource.stop();
}

document.getElementById("call-button").addEventListener("click", function() {
    initallaize();
    
    textToSound = document.getElementById("text").value;
    soundSec = document.getElementById("sound-sec").value;
    visualize = document.getElementById("visualize").checked;

    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    localStorage["visualize"] = visualize;
    
    alert(`going to sound "${textToSound.length > 50 ? textToSound.substring(0, 100) + "..." : textToSound}" ${soundSec} sec per note`);
    
    if (confirm("ready?")) {
        [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.green_mute);
        soundText(textToSound, soundSec);
    }
});

document.getElementById("rec-button").addEventListener("click", async() => {
    initallaize();

    stream = await navigator.mediaDevices.getUserMedia({audio: true});
    input = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    input.connect(analyser);
    
    heardChars = new Array(bytes).fill(0).map(() => new Object());
    
    document.getElementById("received-text").value = "";

    threshold = document.getElementById("threshold").value;
    fftSize = document.getElementById("fft-size").value;
    visualize = document.getElementById("visualize").checked;

    localStorage["fft-size"] = fftSize;
    localStorage["visualize"] = visualize;

    analyser.fftSize = 2 ** fftSize;
    
    alert(`initalization succeded!\n>>>caution: work in progress<<<\n\nthreshold = ${threshold};\nanalyser.fftSize = ${analyser.fftSize};`);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeDomainData = new Uint8Array(analyser.fftSize);

    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.red_mute);
    listenTextLoop();
});

document.getElementById("threshold").addEventListener("change", () => {
    document.getElementById("threshold-number").value = document.getElementById("threshold").value;
    threshold = document.getElementById("threshold").value;
    localStorage["threshold"] = threshold;
});

document.getElementById("threshold-number").addEventListener("change", () => {
    document.getElementById("threshold").value = document.getElementById("threshold-number").value;
    threshold = document.getElementById("threshold").value;
    localStorage["threshold"] = threshold;
});

document.getElementById("sound-sec").addEventListener("change", () => {
    document.getElementById("sound-sec-number").value = document.getElementById("sound-sec").value;
});

document.getElementById("sound-sec-number").addEventListener("change", () => {
    document.getElementById("sound-sec").value = document.getElementById("sound-sec-number").value;
});

