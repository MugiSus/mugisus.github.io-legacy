const FFTsize = 4096;
const FirstFreuency = (44100 / FFTsize) * 80;
const BytesPerRound = 20;
const Frequencies = new Array(8 * BytesPerRound).fill(0).map((_, i) => {
    return FirstFreuency + (44100 / FFTsize * 5) * i;
});

/*
const TuningString = "Tuning completed. It is time to telport.".slice(0, BytesPerRound);
const TuningBits = TuningString.split("").map(char => {
    let bits = char.charCodeAt(0);
    bits = (bits & 0x55) + (bits >> 1 & 0x55);
    bits = (bits & 0x33) + (bits >> 2 & 0x33);
    return bits = (bits & 0x0f) + (bits >> 4 & 0x0f);
}).reduce((previous, current) => previous + current);
*/

const GainHighValue = 0.0075; // call

const AudioContext = window.AudioContext || window.webkitAudioContext; // both (listen, call)
let context; // both

const StartingSoundSpeed = 500; // both // milliseconds
let speed = 120; // both // milliseconds 

let requestAnimationFrameID, lastCallbackTime; // listen
let intervalID; // call

let stream, input, analyser, heardUint8Array, heardBitCount, frequencyData, eachBitAmplitudes, nextConfirmTime, dataLength, bytesCount; // listen, both
let multibytePrefix, multibytePrefixLength, heardStringRound; // listen, string
let fullListenedByteData; // listen, file

let threshold = new Uint8Array(Frequencies.length / 4); // listen
let thresholdAve = 0;

let visualise = true;
const CallVisualiserParent = document.getElementById("call-visualiser-container") // visualise
const ListenVisualiserParent = document.getElementById("listen-visualiser-container") // visualise

document.getElementById("test-identifier").innerText = `${BytesPerRound * 8}-${speed}-${FFTsize}`;

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

                if (visualise)
                    CallVisualiserParent.children[index].children[i].classList.toggle("ringing", (byte >> i) & 1);
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
        eachBitAmplitudes[index] = frequencyData[Math.trunc(frequency / (context.sampleRate / analyser.fftSize))];

        if (eachBitAmplitudes[index] >= threshold[Math.trunc(index / 4)]) {
            heardUint8Array[Math.trunc(index / 8)] |= 1 << index % 8;
            heardBitCount++;
        }

        if (visualise)
            ListenVisualiserParent.children[Math.trunc(index / 8)].children[index % 8].classList.toggle("ringing", eachBitAmplitudes[index] >= threshold[0]);
    });

    let deltaTime = new Date().getTime() - lastCallbackTime;
    document.getElementById("listen-text-callbackspeed").innerText = `${deltaTime}ms ${Math.trunc(1000 / deltaTime)}FPS`;
    lastCallbackTime = new Date().getTime();

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
                index: fullListenedByteData[0] || 0,
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
    /*
    let allThresholdTestsResult = [...new Array(256).keys()].map(tempThreshold => eachBitAmplitudes.reduce((currentBitCount, amplitudes) => currentBitCount + (amplitudes >= tempThreshold), 0));

    let lowestThreshold = allThresholdTestsResult.indexOf(TuningBits);
    let highestThreshold = allThresholdTestsResult.lastIndexOf(TuningBits);

    threshold[0] = lowestThreshold + (highestThreshold - lowestThreshold) * 0.8;

    [...document.getElementsByClassName("threshold-range")].forEach((element, index) => element.value = threshold[index]);

    console.log(eachBitAmplitudes.join("\t"));
    console.log(allThresholdTestsResult.join("\t"));
    */

    console.log(eachBitAmplitudes);
    threshold = threshold.map((_, index) => {
        let thresholdLow = (eachBitAmplitudes[index * 4] + eachBitAmplitudes[index * 4 + 1]) / 2;
        let thresholdHigh = (eachBitAmplitudes[index * 4 + 2] + eachBitAmplitudes[index * 4 + 3]) / 2;
        console.log(eachBitAmplitudes.slice(index * 4, index * 4 + 4));
        return thresholdLow + (thresholdHigh - thresholdLow) * 0.82;
    })

    thresholdAve = threshold.reduce((previous, current) => previous + current) / threshold.length;

    document.getElementsByClassName("threshold-range")[0].value = thresholdAve;
}