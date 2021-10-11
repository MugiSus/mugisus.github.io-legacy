const TuningString = "Tuning completed. It is time to telport.";
const TuningBits = TuningString.split("").map(char => {
    let bits = char.charCodeAt(0);
    bits = (bits & 0x55) + (bits >> 1 & 0x55);
    bits = (bits & 0x33) + (bits >> 2 & 0x33);
    return bits = (bits & 0x0f) + (bits >> 4 & 0x0f);
}).reduce((previous, current) => previous + current);

const FirstFreuency = (44100 / 8192) * 200;
const BytesPerRound = 40;
const Frequencies = new Array(8 * BytesPerRound).fill(0).map((_, i) => {
    return FirstFreuency + (44100 / 8192 * 4) * i;
});

const GainHighValue = 0.0075; // call

const AudioContext = window.AudioContext || window.webkitAudioContext; // both (listen, call)
let context; // both

let speed = 200; // both // milliseconds 

let requestAnimationFrameID; // liten
let intervalID; // call

let threshold, stream, input, analyser, heardUint8Array, heardBitCount, frequencyData, eachBitAmplitudes, nextConfirmTime; // listen
let multibytePrefix, multibytePrefixLength, heardStringRound // listen, string
threshold = new Uint8Array(document.getElementById("listen-threshold-range-container").children.length);

function initialize() {
    clearInterval(intervalID);
    cancelAnimationFrame(requestAnimationFrameID);

    if (context) context.close();
    context = new AudioContext();

    const emptySource = context.createBufferSource();
    emptySource.start();
    emptySource.stop();
}

function call_oneRound(uint8array, speed) {
    uint8array.forEach((byte, index) => {
        if (byte) {
            for (let i = 0; i < 8; i++) {
                if ((byte >> i) & 1) {  
                    let gainNode = new GainNode(context);
                    gainNode.connect(context.destination);
                    gainNode.gain.value = GainHighValue;
                    
                    let oscillatorNode = new OscillatorNode(context);
                    oscillatorNode.frequency.value = Frequencies[index * 8 + i];
                    oscillatorNode.connect(gainNode);
                    oscillatorNode.start(context.currentTime);
                    oscillatorNode.stop(context.currentTime + speed * 0.0009);
                }
            }
        }
    });
}

function call_callFile(file, speed) {
    initialize();

    if (!file) {
        call_callString("", speed);
        return;
    }

    let fileReader = new FileReader();
    
    fileReader.addEventListener("load", (event) => {
        const callingUint8Array = new Uint8Array(event.target.result);
        console.log(callingUint8Array);

        call_oneRound(callingUint8Array.subarray(0, BytesPerRound), speed);
        let index = 0;
        
        intervalID = setInterval(function() {
            index++;
            call_oneRound(callingUint8Array.subarray(index * BytesPerRound, (index + 1) * BytesPerRound), speed);
            if (index * BytesPerRound > callingUint8Array.length) {
                document.getElementById("call-button-send").parentElement.classList.remove("clicked");
                clearInterval(intervalID);
            }
        }, speed);
    })

    fileReader.readAsArrayBuffer(file);
}

function call_callString(string, speed) {
    initialize();

    const callingUint8Array = new TextEncoder().encode(string);

    call_oneRound(callingUint8Array.subarray(0, BytesPerRound), speed);
    let index = 0;

    intervalID = setInterval(function() {
        index++;
        call_oneRound(callingUint8Array.subarray(index * BytesPerRound, (index + 1) * BytesPerRound), speed);
        if (index * BytesPerRound > callingUint8Array.length) {
            document.getElementById("call-button-send").parentElement.classList.remove("clicked");
            clearInterval(intervalID);
        }
    }, speed);
}

function listen_getHeardUint8Array() {
    analyser.getByteFrequencyData(frequencyData);

    let heardUint8Array = new Uint8Array(BytesPerRound);
    heardBitCount = 0;
    
    Frequencies.forEach((frequency, index) => {
        eachBitAmplitudes[index] = frequencyData[Math.trunc(frequency / (context.sampleRate / analyser.fftSize))];
        if (eachBitAmplitudes[index] >= threshold[0]) {
            heardUint8Array[Math.trunc(index / 8)] |= 1 << index % 8;
            heardBitCount++;
        }
    });

    return heardUint8Array;
}

async function listen_setup() {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
        }
    });

    input = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    input.connect(analyser);
    
    analyser.fftSize = 8192;
    analyser.maxDecibels = 20;
    analyser.minDecibels = -140;
    
    heardUint8Array = new Uint8Array(BytesPerRound);
    eachBitAmplitudes = new Uint8Array(BytesPerRound * 8);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    nextConfirmTime = new Date().getTime() + speed;
}

async function listen_startListenStringLoop() {
    initialize();
    await listen_setup();

    multibytePrefixLength = 0;
    multibytePrefix = new Uint8Array();

    listen_listenStringLoop();
}

async function listen_startListenFileLoop() {
    initialize();
    await listen_setup();

    listen_listenFileLoop();
}

function listen_listenStringLoop() {
    heardUint8Array = listen_getHeardUint8Array();

    heardStringRound = new TextDecoder().decode(Uint8Array.from([...multibytePrefix, ...heardUint8Array])).replace(/\uFFFD|\u0000/g, "");
    
    if (nextConfirmTime <= new Date().getTime()) {
        nextConfirmTime += speed;
        
        multibytePrefixLength = Math.max(
            0,
            heardUint8Array[heardUint8Array.length - 1] >= 0xC2,
            heardUint8Array[heardUint8Array.length - 2] >= 0xE0 && 2,
            heardUint8Array[heardUint8Array.length - 3] >= 0xF0 && 3,
        );
        multibytePrefix = multibytePrefixLength ? heardUint8Array.slice(-multibytePrefixLength) : new Uint8Array();
        
        if (heardBitCount) {
            document.getElementById("listen-textarea").value += heardStringRound;
            document.getElementById("listen-textarea").scrollTop = document.getElementById("listen-textarea").scrollHeight;
        }
    }
    
    if (heardBitCount) {
        document.getElementById("listen-text-heard-chars").classList.add("heard");
        document.getElementById("listen-text-heard-chars").innerText = `[${heardStringRound.slice(0, BytesPerRound / 2)}\n${heardStringRound.slice(BytesPerRound / 2, BytesPerRound)}]`
    } else {
        document.getElementById("listen-text-heard-chars").classList.remove("heard");
        document.getElementById("listen-text-heard-chars").innerText = `[...Waiting for\nyour input...]`
    }
    
    requestAnimationFrameID = requestAnimationFrame(listen_listenStringLoop);
}

function listen_listenFileLoop() {
    
    requestAnimationFrameID = requestAnimationFrame(listen_listenFileLoop);
}

function listen_tuning() {
    let allThresholdTestsResult = [...new Array(256).keys()].map(tempThreshold => eachBitAmplitudes.reduce((currentBitCount, amplitudes) => currentBitCount + (amplitudes >= tempThreshold), 0));

    let lowestThreshold = allThresholdTestsResult.indexOf(TuningBits);
    let highestThreshold = allThresholdTestsResult.lastIndexOf(TuningBits);

    threshold[0] = lowestThreshold + (highestThreshold - lowestThreshold) * 0.8;

    [...document.getElementsByClassName("threshold-range")].forEach((element, index) => element.value = threshold[index]);

    console.log(allThresholdTestsResult.join("\t"));
    console.log(eachBitAmplitudes.join("\t"));
}