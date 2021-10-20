const FFTsize = 4096;
const FirstFreuency = (44100 / FFTsize) * 80;
const BytesPerRound = 64;
const Frequencies = new Array(4 * BytesPerRound).fill(0).map((_, i) => {
    return FirstFreuency + (44100 / FFTsize * 3) * i;
});

const TuningString = "Tuning completed. It is time to telport.".slice(0, BytesPerRound);
const TuningBits = TuningString.split("").map(char => {
    let bits = char.charCodeAt(0);
    bits = (bits & 0x55) + (bits >> 1 & 0x55);
    bits = (bits & 0x33) + (bits >> 2 & 0x33);
    return bits = (bits & 0x0f) + (bits >> 4 & 0x0f);
}).reduce((previous, current) => previous + current);

const GainValues = [0, 0.005, 0.0075, 0.01]; // call

const AudioContext = window.AudioContext || window.webkitAudioContext; // both (listen, call)
let context; // both

const StartingSoundSpeed = 500; // both // milliseconds
let speed = 150; // both // milliseconds 

let requestAnimationFrameID; // listen
let intervalID; // call

let stream, input, analyser, heardUint8Array, heardBitCount, frequencyData, eachBitAmplitudes, nextConfirmTime, dataLength, bytesCount; // listen, both
let multibytePrefix, multibytePrefixLength, heardStringRound; // listen, string
let fullListenedByteData; // listen, file

let threshold = new Uint8Array(document.getElementById("listen-threshold-range-container").children.length); // listen

let visualise = false;
const CallVisualiserParent = document.getElementById("call-visualiser-container"); // visualise
const ListenVisualiserParent = document.getElementById("listen-visualiser-container"); // visualise
const VisualiserOpacities = [1, 0.6, 0.8, 1];

// both

function initialize() {
    clearInterval(intervalID);
    cancelAnimationFrame(requestAnimationFrameID);

    if (context) context.close();
    context = new AudioContext();

    const emptySource = context.createBufferSource();
    emptySource.start();
    emptySource.stop();
}


// call

function call_callOneRound(uint8array, speed) {
    uint8array.forEach((byte, index) => {
        if (byte) {
            for (let i = 0; i < 8; i += 2) {
                if ((byte >> i) & 3) {  
                    let gainNode = new GainNode(context);
                    gainNode.connect(context.destination);
                    gainNode.gain.value = GainValues[(byte >> i) & 3];
                    
                    let oscillatorNode = new OscillatorNode(context);
                    oscillatorNode.frequency.value = Frequencies[(index * 8 + i) / 2];
                    oscillatorNode.connect(gainNode);
                    oscillatorNode.start(context.currentTime);
                    oscillatorNode.stop(context.currentTime + speed * 0.0009);
                }

                if (visualise) {
                    CallVisualiserParent.children[index].children[i / 2].classList.toggle("ringing", (byte >> i) & 3);
                    CallVisualiserParent.children[index].children[i / 2].style.opacity = VisualiserOpacities[(byte >> i) & 3];
                }
            }
        }
    });
}

function call_callFullRounds(uint8array, speed) {
    let fullCalledByteData = Uint8Array.from([...new Uint8Array(4).fill(0xAA), ...new Uint8Array(4).map((_, index) => uint8array.length >> index * 8 & 0xFF)]);

    call_callOneRound(fullCalledByteData, StartingSoundSpeed);

    setTimeout(() => {
        call_callOneRound(uint8array.subarray(0, BytesPerRound), speed);
        let index = 0;
        
        intervalID = setInterval(function() {
            index++;
            call_callOneRound(uint8array.subarray(index * BytesPerRound, (index + 1) * BytesPerRound), speed);
            if (index * BytesPerRound > uint8array.length) {
                document.getElementById("call-button-send").parentElement.classList.remove("clicked");
                clearInterval(intervalID);
            }
        }, speed);
    }, StartingSoundSpeed);

    return Math.ceil(fullCalledByteData.length / BytesPerRound) * speed + StartingSoundSpeed; 
}

function call_callFile(file, index, speed) {

    if (!file) {
        call_callString("", speed);
        return;
    }

    initialize();
    let fileReader = new FileReader();
    
    fileReader.addEventListener("load", (event) => {
        const callingUint8Array = Uint8Array.from([index, ...new TextEncoder().encode(file.name), 0, ...new Uint8Array(event.target.result)]);
        console.log(callingUint8Array);
        
        call_callFullRounds(callingUint8Array, speed);
    });

    fileReader.readAsArrayBuffer(file);
}

function call_callString(string, speed) {
    initialize();
    const callingUint8Array = new TextEncoder().encode(string);

    call_callFullRounds(callingUint8Array, speed);
}


// listen

function listen_getHeardUint8Array() {
    analyser.getByteFrequencyData(frequencyData);

    let heardUint8Array = new Uint8Array(BytesPerRound);
    heardBitCount = 0;
    
    Frequencies.forEach((frequency, index) => {
        amplitude = frequencyData[Math.trunc(frequency / (context.sampleRate / analyser.fftSize))];
        let bits = amplitude >= threshold[0] + amplitude >= threshold[1] + amplitude >= threshold[2];

        if (bits) {
            heardUint8Array[Math.trunc(index / 4)] |= bits << index % 4 * 2;
            heardBitCount += bits >> 1 & 1 + bits & 1;
        }

        if (visualise) {
            ListenVisualiserParent.children[Math.trunc(index / 8)].children[index % 8].classList.toggle("ringing", amplitude >= threshold[0]);
            ListenVisualiserParent.children[Math.trunc(index / 8)].children[index % 8].style.opacity = VisualiserOpacities[bits];
        }

        eachBitAmplitudes[index] = amplitude;
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
    
    analyser.fftSize = FFTsize;
    analyser.maxDecibels = 40;
    analyser.minDecibels = -140;
    
    heardUint8Array = new Uint8Array(BytesPerRound);
    eachBitAmplitudes = new Uint8Array(BytesPerRound * 8);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    bytesCount = 0;
    
    nextConfirmTime = Infinity;
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

    fullListenedByteData = new Uint8Array();

    listen_listenFileLoop();
}

function listen_listenStringLoop() {
    heardUint8Array = listen_getHeardUint8Array();

    if (heardUint8Array.slice(0, 4).every(value => value == 0xAA)) {
        nextConfirmTime = new Date().getTime() + speed * 0.8;
        dataLength = heardUint8Array.slice(4, 8).reduce((previous, current, index) => previous | current << index * 8);
        console.info(`<Starting sound detected.>\nSize: ${dataLength} Bytes\nEstimated time: ${Math.ceil(dataLength / BytesPerRound) * speed} msec`);
        
        document.getElementById("listen-textarea").value = "";
        bytesCount = 0;
    }
    
    if (heardBitCount) {
        heardStringRound = new TextDecoder().decode(Uint8Array.from([...multibytePrefix, ...heardUint8Array])).replace(/\uFFFD|\u0000/g, "");
        document.getElementById("listen-text-heard-chars").innerText = `[${heardStringRound.slice(0, BytesPerRound / 2)}\n${heardStringRound.slice(BytesPerRound / 2, BytesPerRound)}]`;
    } else {
        heardStringRound = "";
        document.getElementById("listen-text-heard-chars").innerText = `[...Waiting for\nyour input...]`;
    }
    
    if (nextConfirmTime <= new Date().getTime()) {
        multibytePrefixLength = Math.max(
            0,
            heardUint8Array[heardUint8Array.length - 1] >= 0xC2,
            heardUint8Array[heardUint8Array.length - 2] >= 0xE0 && 2,
            heardUint8Array[heardUint8Array.length - 3] >= 0xF0 && 3,
        );
        multibytePrefix = multibytePrefixLength ? heardUint8Array.slice(-multibytePrefixLength) : new Uint8Array();
        
        if (heardBitCount) {
            document.getElementById("listen-textarea").value += heardStringRound;
            //document.getElementById("listen-textarea").scrollTop = document.getElementById("listen-textarea").scrollHeight;
        }

        nextConfirmTime += speed;
        bytesCount += BytesPerRound;

        if (bytesCount > dataLength) {
            nextConfirmTime = Infinity;

            // copying program goes here
        }
    }
    
    requestAnimationFrameID = requestAnimationFrame(listen_listenStringLoop);
}

function listen_listenFileLoop() {
    heardUint8Array = listen_getHeardUint8Array();

    if (heardUint8Array.slice(0, 4).every(value => value == 0xAA)) {
        nextConfirmTime = new Date().getTime() + speed * 0.8;
        dataLength = heardUint8Array.slice(4, 8).reduce((previous, current, index) => previous | current << index * 8);
        console.info(`<Starting sound detected.>\nSize: ${dataLength} Bytes\nEstimated time: ${Math.ceil(dataLength / BytesPerRound) * speed} msec`);

        fullListenedByteData = new Uint8Array(dataLength);
        bytesCount = 0;
    }

    if (nextConfirmTime <= new Date().getTime()) {
        for (let index = 0; index < BytesPerRound; index++) 
            fullListenedByteData[bytesCount + index] = heardUint8Array[index];

        nextConfirmTime += speed;
        bytesCount += BytesPerRound;

        if (bytesCount > dataLength) {
            let file = {
                index: fullListenedByteData[0],
                name: new TextDecoder().decode(fullListenedByteData.subarray(1, fullListenedByteData.indexOf(0, 1))),
                content: fullListenedByteData.subarray(fullListenedByteData.indexOf(0, 1) + 1),
            }
            
            console.log(file.name, file.index, file.content);

            let blob = new Blob([file.content], {type: "text/plain"});
            let targetDownloaderElement = document.getElementsByClassName("listen-file-downloader")[file.index];

            targetDownloaderElement.href = (window.URL || window.webkitURL).createObjectURL(blob);
            targetDownloaderElement.download = file.name;
            targetDownloaderElement.classList.add("exist");

            targetDownloaderElement.parentElement.getElementsByClassName("listen-file-text")[0].innerText = file.name;

            nextConfirmTime = Infinity;
        }
    }

    heardBytesString = [
        Array.from(heardUint8Array.slice(0, BytesPerRound * 0.25)),
        Array.from(heardUint8Array.slice(BytesPerRound * 0.25, BytesPerRound * 0.5)),
        Array.from(heardUint8Array.slice(BytesPerRound * 0.5, BytesPerRound * 0.75)),
        Array.from(heardUint8Array.slice(BytesPerRound * 0.75, BytesPerRound)),
    ].map(arr => arr.map(byte => "0123456789ABCDEF"[Math.trunc(byte / 16)] + "0123456789ABCDEF"[byte % 16]).join(":"));
    document.getElementById("listen-file-heard-bytes").innerText = `${heardBytesString.join("\n")}`;

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