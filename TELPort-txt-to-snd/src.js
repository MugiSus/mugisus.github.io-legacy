
const frequency = new Array(16).fill(0).map((_, i) => {
    return i < 6 ? 440 * 2 ** (i / 6) :
           i < 18 ? 880 * 2 ** ((i - 6) / 12) :
           i < 42 ? 1760 * 2 ** ((i - 18) / 24) :
           0;
});

document.getElementById("text").value = localStorage["textToSound"] || "hello, world! ðøüþÿ";
document.getElementById("sec").value = localStorage["soundSec"] || 0.5;

document.getElementById("dispatcher").addEventListener("click", function() {
    let textToSound = document.getElementById("text").value;
    let soundSec = document.getElementById("sec").value * 1000;
    
    localStorage["textToSound"] = textToSound;
    localStorage["soundSec"] = soundSec;
    
    alert(`going to sound "${textToSound}" ${soundSec} sec per note`);
    
    if (confirm("ready?")) {
        let context = new AudioContext();

        let beeps = new Array(frequency.length).fill(0).map(() => {
            let gainNode = new GainNode(context);
            gainNode.connect(context.destination);
            gainNode.gain.value = 0.25;
            
            let oscillatorNode = new OscillatorNode(context);
            oscillatorNode.frequency.value = 0;
            oscillatorNode.type = "sine";
            oscillatorNode.connect(gainNode);

            oscillatorNode.start();

            return oscillatorNode;
        });

        console.log(beeps);

        let mainInterval, index = 0;

        mainInterval = setInterval(() => {
            frequency.forEach((hertz, bits) => {
                if ((textToSound.codePointAt(index) >> bits) & 1) {
                    beeps[bits].frequency.value = hertz;
                    setTimeout(() => {beeps[bits].frequency.value = 0;}, soundSec * 0.8);
                }
            })

            index++;
            if (index > textToSound.length) clearInterval(mainInterval);
        }, soundSec);
    }
})