const firstFreuency = (44100 / 8192) * 200;
const bytes = 40;

const frequency = new Array(8 * bytes).fill(0).map((_, i) => {
    return firstFreuency + (44100 / 8192 * 4) * i;
});

let loadElementsValue =(elements)=> document.querySelectorAll(elements).forEach(x => x.value = localStorage[`telport-text-to-sound ${x.id}`] ?? {
    "text": "hello, world!",
    "sound-sec": 0.5,
    "sound-sec-number": 0.5,
    "visualize": true,
    "fft-size": 13,
    "threshold": 160,
    "threshold-number": 160
}[x.id]);

let saveElementsValue =(elements)=> document.querySelectorAll(elements).forEach(x => localStorage[`telport-text-to-sound ${x.id}`] = x.value ?? x.checked);

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

let visualize, soundSec;
let soundText_intervalId, textToSound;
let frequencyData, stream, input, analyser, threshold, fftSize, listenTextLoop_reqId, heardChars, nextConfirmTime;

function beep(hertz, start, len) {
    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.007;
    
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
                beep(f, 0, soundSec * 0.90);
            } else if (visualize) 
                boxesHTMLCollection[index].style.background = boxColorsCollection.green_mute;
        });

        document.getElementById("heard-letter").innerHTML = `[${textToSound.slice(i, i + bytes)}]`;
        i += bytes;

    }, soundSec * 1000);
}

function listenTextLoop() {
    listenTextLoop_reqId = requestAnimationFrame(listenTextLoop);
    //listenTextLoop_reqId = setTimeout(listenTextLoop, 1000 / 100);

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
    
    if (nextConfirmTime < new Date().getTime()) {
        nextConfirmTime += soundSec * 1000;
        document.getElementById("confirmed-letter").style.transitionDuration = "0s";
        document.getElementById("confirmed-letter").style.color = "#bbbb66";
        requestAnimationFrame(() => {
            document.getElementById("confirmed-letter").style.transitionDuration = "0.2s";
            document.getElementById("confirmed-letter").style.color = "#bbbb6644";
        })
        
        if (heardChars.some(x => Object.keys(x).length)) {
            let confirmedBytes = codePoints.map(x => x * 1 ? String.fromCodePoint(x) : "");
    
            document.getElementById("confirmed-letter").innerHTML = `[${confirmedBytes.join("")}]`;
            document.getElementById("received-text").value += confirmedBytes.join("");
    
            heardChars = new Array(bytes).fill(0).map(() => new Object());
        } else {
            document.getElementById("confirmed-letter").innerHTML = `[]`;
        }
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

    saveElementsValue("#text, #sound-sec, #sound-sec-number, #visualize");
    
    //alert(`going to sound "${textToSound.length > 50 ? textToSound.substring(0, 100) + "..." : textToSound}" ${soundSec} sec per note`);
    
    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.green_mute);
    soundText(textToSound, soundSec);
});

document.getElementById("rec-button").addEventListener("click", async() => {
    initallaize();

    stream = await navigator.mediaDevices.getUserMedia({audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
    }});
    input = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    input.connect(analyser);
    
    heardChars = new Array(bytes).fill(0).map(() => new Object());
    
    document.getElementById("received-text").value = "";
    
    soundSec = document.getElementById("sound-sec").value;
    threshold = document.getElementById("threshold").value;
    fftSize = document.getElementById("fft-size").value;
    visualize = document.getElementById("visualize").checked;

    saveElementsValue("#sound-sec, #sound-sec-number, #threshold, #fft-size, #visualize");
    
    analyser.fftSize = 2 ** fftSize;
    analyser.maxDecibels = 0;
    analyser.minDecibels = -100;
    
    //alert(`initalization succeded!\n>>>caution: work in progress<<<\n\nthreshold = ${threshold};\nanalyser.fftSize = ${analyser.fftSize};`);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeDomainData = new Uint8Array(analyser.fftSize);
    
    [...boxesHTMLCollection].forEach(x => x.style.background = boxColorsCollection.red_mute);

    nextConfirmTime = new Date().getTime() + soundSec * 1000;
    listenTextLoop();
});

document.getElementById("threshold").addEventListener("change", () => {
    document.getElementById("threshold-number").value = document.getElementById("threshold").value;
    threshold = document.getElementById("threshold").value;
    saveElementsValue("#threshold, #threshold-number");
});

document.getElementById("threshold-number").addEventListener("change", () => {
    document.getElementById("threshold").value = document.getElementById("threshold-number").value;
    threshold = document.getElementById("threshold").value;
    saveElementsValue("#threshold, #threshold-number");
});

document.getElementById("sound-sec").addEventListener("change", () => {
    document.getElementById("sound-sec-number").value = document.getElementById("sound-sec").value;
});

document.getElementById("sound-sec-number").addEventListener("change", () => {
    document.getElementById("sound-sec").value = document.getElementById("sound-sec-number").value;
});

loadElementsValue("#text, #sound-sec, #sound-sec-number, #visualize, #fft-size, #threshold, #threshold-number");