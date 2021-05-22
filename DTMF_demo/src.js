document.body.oncontextmenu =()=> {return false;};

let context = new AudioContext();

function beep(hertz) {

    let gainNode = new GainNode(context);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.2;
    
    let oscillatorNode = new OscillatorNode(context);
    oscillatorNode.type = "sine";
    oscillatorNode.frequency.value = hertz;
    oscillatorNode.connect(gainNode);
    oscillatorNode.start();

    return oscillatorNode;
}

const frequency = [[697, 770, 852, 941], [1209, 1336, 1477, 1633]];
let note1, note2;

[...document.getElementsByClassName("box")].forEach((x, y) => {
    x.addEventListener("mousedown", () => {
        document.getElementsByClassName("hz")[0].innerHTML = frequency[0][Math.floor(y / 3)] + "<sub>Hz</sub>";
        document.getElementsByClassName("hz")[1].innerHTML = frequency[1][y % 3] + "<sub>Hz</sub>";
        note1 = beep(frequency[0][Math.floor(y / 3)]);
        note2 = beep(frequency[1][y % 3]);
    });
})

document.body.addEventListener("mouseup", () => {
    if (!note1 || !note2) return;
    note1.stop();
    note2.stop();
});