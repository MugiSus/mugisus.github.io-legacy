function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    nowTime = new Date().getTime() - startedTime;
    
    judgeNotes();
    drawInfos();
    readMetaData();
    moveLanes();
    drawqwerty();
    drawNotes();
    deleteNotes();
    drawEffects();
    
    requestAnimationFrame(main);
}

document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        
        let params = new URLSearchParams(location.search);

        generateScore(params.get("title") || "dead_soul");
    
        let startTime = (60 / bpm * 1000) * ((params.get("time") * 1 || 0) - 4);
        let judgeOffset = localStorage.getItem("offset") * 1 || 0;
    
        snd[bgm].pause();
        snd[bgm].volume = bgmvol;
        snd[bgm].currentTime = (startTime + offset + judgeOffset) / 1000;
        setTimeout(()=>snd[bgm].play(), (startTime + offset + judgeOffset) * -1);
    
        startedTime = new Date().getTime() - startTime;
    }
});

laneStates = {};
for (let i = 0; i < 10; i++) laneStates[i] = new lane(-1125 + 250 * i, 700, 0, 1, i);

let keyInterval =()=> setInterval(()=>{getKeyInput()}, 10);

getKeyInput();
setTimeout(keyInterval, 100);
setTimeout(keyInterval, 102);
setTimeout(keyInterval, 104);
setTimeout(keyInterval, 106);
setTimeout(keyInterval, 108);

main();