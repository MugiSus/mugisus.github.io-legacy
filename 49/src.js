//init
const musicData = {
    "Evil's Talk":`
        BGM:Evil's Talk.mp3
        BPM:128
        OFFSET:0

    `
};

const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
const height = canvas.height * 0.8;
const width = height;
var playerX = playerY = 3;
var mouseX, mouseY
var mouseState = {};
var keydown = {};
var timers = [];
var BPM, startTime, Time;
//sensing
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
canvas.addEventListener("mouseover", ()=>{pause = false;});
canvas.addEventListener("mouseout", ()=>{pause = true;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = event.clientX - (canvas.width - width) / 2; mouseY = event.clientY - (canvas.height - height) / 2;});

ctx.translate((canvas.width - width) / 2, (canvas.height - height) / 2)

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
};

var drawBoard =()=> {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#888888";
    for (let i = 0; i < 8; i++) {ctx.line(0,height/7*i,width,height/7*i); ctx.line(width/7*i,0,width/7*i,height);}
    ctx.fillStyle = "#ff8800";
    ctx.beginPath();
    ctx.arc((playerX + 0.5) * width/7, (playerY + 0.5) * height/7, width/7 * 0.4, 0, Math.PI*2, false);
    ctx.fill();
    ctx.fillStyle = "#ffbb00";
    ctx.beginPath();
    ctx.arc((playerX + 0.35) * width/7, (playerY + 0.35) * height/7, width/7 * 0.15, 0, Math.PI*2, false);
    ctx.fill();
    if (Math.abs(mouseX - (playerX + 0.5) * width/7) > width/14 || Math.abs((playerY + 0.5) * height/7 - mouseY) > height/14) {
        let mouseDir = (Math.atan2(mouseX - (playerX + 0.5) * width/7, (playerY + 0.5) * height/7 - mouseY) * 180/Math.PI + 405) % 360;
        ctx.beginPath();
        switch (~~(mouseDir / 90)){
            case 0: {
                ctx.moveTo((playerX + 0.3) * width/7, (playerY - 0.2) * height/7); ctx.lineTo((playerX + 0.7) * width/7, (playerY - 0.2) * height/7); ctx.lineTo((playerX + 0.5) * width/7, (playerY - 0.4) * height/7);

                break;
            }
            case 1: {
                ctx.moveTo((playerX + 1.2) * width/7, (playerY + 0.3) * height/7); ctx.lineTo((playerX + 1.2) * width/7, (playerY + 0.7) * height/7); ctx.lineTo((playerX + 1.4) * width/7, (playerY + 0.5) * height/7);
                break;
            }
            case 2: {
                ctx.moveTo((playerX + 0.3) * width/7, (playerY + 1.2) * height/7); ctx.lineTo((playerX + 0.7) * width/7, (playerY + 1.2) * height/7); ctx.lineTo((playerX + 0.5) * width/7, (playerY + 1.4) * height/7);
                break;
            }
            case 3: {
                ctx.moveTo((playerX - 0.2) * width/7, (playerY + 0.3) * height/7); ctx.lineTo((playerX - 0.2) * width/7, (playerY + 0.7) * height/7); ctx.lineTo((playerX - 0.4) * width/7, (playerY + 0.5) * height/7); 
                break;
            }
        }
        ctx.closePath();
        ctx.fill();
    }
}

function board(){
    Time = new Date().getTime() - startTime;
    ctx.clearRect(-1,-1,width+2,height+2);
    if (Time < 0) {ctx.globalAlpha = 1 + Time / 2500;}
    drawBoard();
    requestAnimationFrame(board);
}

function start(soundTrack){
    BPM = musicData[soundTrack].match(/bpm:(.*)/i)[1];
    startTime = new Date().getTime() + 2500 + ~~musicData[soundTrack].match(/offset:(.*)/i)[1];
    var audio = new Audio(`musics/${musicData[soundTrack].match(/bgm:(.*)/i)[1]}`); audio.currentTime = 0; setTimeout(()=>audio.play(),2500)
    board();
}

canvas.onclick=()=>{start("Evil's Talk"); canvas.onclick = "";}