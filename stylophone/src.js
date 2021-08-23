
let context, gainNode, osciNode;

//let downEvent = new PointerEvent("pointerdown");

document.addEventListener("pointerdown", (event)=>{

    if (!context) {
        context = new AudioContext();

        gainNode = new GainNode(context);
        gainNode.connect(context.destination);
        gainNode.gain.value = 0.2;

        osciNode = new OscillatorNode(context);
        osciNode.type = "sine";
        osciNode.frequency.value = 0;
        osciNode.connect(gainNode);
        osciNode.start();
    }

    osciNode.frequency.value = 440 + (event.pressure - 0.5) * 100;
});

document.addEventListener("pointerup", ()=>{
    osciNode.frequency.value = 0
});