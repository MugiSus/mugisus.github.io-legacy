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

const GainHighValue = 0.0075;

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context;
let speed = 200; // milliseconds

let intervalID;
let requestAnimationFrameID;

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
                if (byte & (1 << i)) {  
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

function call_callString(string, speed) {
    initialize();

    call_oneRound(Uint8Array.of(...string.slice(0, 40).split("").map(char => char.codePointAt(0) || 0)), speed);
    let index = 1;
    intervalID = setInterval(function() {
        if (index * BytesPerRound > string.length) clearInterval(intervalID);
        call_oneRound(Uint8Array.of(...string.slice(index * BytesPerRound, (index + 1) * BytesPerRound).split("").map(char => char.codePointAt(0) & 0xFF || 0)), speed);
        index++;
    }, speed);
}

function listen_StartlistenStringLoop() {
    initialize();
    listen_listenStringLoop();
}

function listen_listenStringLoop() {
    
    requestAnimationFrameID = requestAnimationFrame(listen_listenStringLoop);
}