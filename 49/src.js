//init
const musicData = {
    "Evil's Talk":`
BGM:Evil's Talk.mp3
BPM:128
OFFSET:0

score:
3,3,0,34,1/0,0,0,2/6,0,4,2/0,6,4,2/6,6,4,2/1,1,4,2/5,1,4,2/1,5,4,2/5,5,4,2/
2,2,4,2/4,2,0,2/2,4,0,2/4,4,0,2/
1,1,4,2/5,1,0,2/1,5,0,2/5,5,0,2/3,3,0,2,1/
0,0,4,2/6,0,0,2/0,6,0,2/6,6,0,2/3,3,0,2,1/
0,0,4,2,1/0,1,0.5,1.50,1/0,2,0.25,1.25,1/0,3,0.25,1,1/0,4,0.25,0.75,1/0,5,0.25,0.5,1/
0,0,3,2/6,0,0,2/0,6,0,2/6,6,0,2/3,3,0,2,1/
1,1,4,2/5,1,0,2/1,5,0,2/5,5,0,2/3,3,0,2,1/
2,2,4,2/4,2,0,2/2,4,0,2/4,4,0,2/3,3,0,2,1/
2,3,4,2,1/4,2,0.5,1.50,1/4,6,0.25,1.25,1/0,5,0.25,1,1/6,4,0.25,0.75,1/2,5,0.25,0.5,1/
0,0,2.5,1/1,1,0.25,1/5,5,0.25,1/6,6,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
6,0,7.25,1/5,1,0.25,1/1,5,0.25,1/0,6,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
6,6,7.25,1/5,5,0.25,1/1,1,0.25,1/0,0,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
0,6,7.25,1/1,5,0.25,1/5,1,0.25,1/6,0,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
0,0,7.25,1/1,1,0.25,1/5,5,0.25,1/6,6,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
6,0,7.25,1/5,1,0.25,1/1,5,0.25,1/0,6,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
6,6,7.25,1/5,5,0.25,1/1,1,0.25,1/0,0,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
0,6,7.25,1/1,5,0.25,1/5,1,0.25,1/6,0,0.25,1/
-1,0,2.5,2,1/7,1,0.5,1.50,1/-1,2,0.25,1.25,1/7,4,0.25,1,1/-1,5,0.25,0.75,1/7,6,0.25,0.5,1/
0,0,2,2/1,0,2,2/2,0,2,2/3,0,2,2/6,6,2,2/5,6,2,2/4,6,2,2/3,6,2,2/
0,0,2,2/0,1,2,2/0,2,2,2/0,3,2,2/6,6,2,2/6,5,2,2/6,4,2,2/6,3,2,2/
3,3,4,6,4/1,1,2,4,4/5,5,2,2,4/6,0,1,2/2,4,1,2/0,4,1,2/2,6,1,2/
3,3,3,12,6/1,5,2,10,6/5,1,2,8,6/5,5,2,6,4/1,1,2,4,2/0,0,5,2/6,2,1,2/4,4,1,2/0,2,1,2/
6,0,3,1/5,1,0.25,1/1,5,0.25,1/0,6,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
0,0,7.25,1/1,1,0.25,1/5,5,0.25,1/6,6,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
6,6,7.25,1/5,5,0.25,1/1,1,0.25,1/0,0,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
6,6,7.25,1/5,5,0.25,1/1,1,0.25,1/0,0,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
0,0,7.25,1/1,1,0.25,1/5,5,0.25,1/6,6,0.25,1/2,2,0,2,4/3,3,0,2,4/4,4,0,2,4/
0,6,7.25,1/1,5,0.25,1/5,1,0.25,1/6,0,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
6,0,7.25,1/5,1,0.25,1/1,5,0.25,1/0,6,0.25,1/2,4,0,2,4/3,3,0,2,4/4,2,0,2,4/
0,6,7.25,1/1,5,0.25,1/5,1,0.25,1/6,0,0.25,1/
2,3,4,2,1/4,4,0.5,1.50,1/4,0,0.25,1.25,1/0,1,0.25,1,1/6,2,0.25,0.75,1/2,1,0.25,0.5,1/
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
var click;
var keydown = {};
var lasers = [];
var vibration = 0;
var BPM, startTime, Time, Score, beat, lastBeat;
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

var max =(x,y)=> {return x < y ? x : y;};
var min =(x,y)=> {return x > y ? x : y;};

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
        /*switch (~~(mouseDir / 90)){
            case 0: {
                ctx.moveTo((playerX + 0.3) * width/7, (playerY - 0.2) * height/7); ctx.lineTo((playerX + 0.7) * width/7, (playerY - 0.2) * height/7); ctx.lineTo((playerX + 0.5) * width/7, (playerY - 0.4) * height/7);
                if (click) {playerY = min(playerY-1,0); click = false}
                break;
            }
            case 1: {
                ctx.moveTo((playerX + 1.2) * width/7, (playerY + 0.3) * height/7); ctx.lineTo((playerX + 1.2) * width/7, (playerY + 0.7) * height/7); ctx.lineTo((playerX + 1.4) * width/7, (playerY + 0.5) * height/7);
                if (click) {playerX = max(playerX+1,7); click = false}
                break;
            }
            case 2: {
                ctx.moveTo((playerX + 0.3) * width/7, (playerY + 1.2) * height/7); ctx.lineTo((playerX + 0.7) * width/7, (playerY + 1.2) * height/7); ctx.lineTo((playerX + 0.5) * width/7, (playerY + 1.4) * height/7);
                if (click) {playerY = max(playerY+1,7); click = false}
                break;
            }
            case 3: {
                ctx.moveTo((playerX - 0.2) * width/7, (playerY + 0.3) * height/7); ctx.lineTo((playerX - 0.2) * width/7, (playerY + 0.7) * height/7); ctx.lineTo((playerX - 0.4) * width/7, (playerY + 0.5) * height/7); 
                if (click) {playerX = min(playerX-1,0); click = false}
                break;
            }
        }*/
        ctx.closePath();
        ctx.fill();
    }
    let deleteList = [];
    lasers.forEach((x,y)=>{
        ctx.fillStyle = "#666666";
        if ((beat - x[2]) / x[3] >= 1) {
            ctx.fillStyle = "#bbbbbb";
            if (min(x[4],0)) {ctx.strokeStyle = "#ff6600"; vibration += 0.5;}
            else {ctx.strokeStyle = "#ff0000"; if (x[4] != -1) {vibration += 10; x[4] = -1;}}
            ctx.globalAlpha = min((x[2] + x[3] + min(x[4],0) + 1 - beat) / 1, 0);
            ctx.lineWidth = width/28;
            ctx.line(-100, (x[1] + 0.5) * height/7, width + 100, (x[1] + 0.5) * height/7);
            ctx.line((x[0] + 0.5) * width/7, -100, (x[0] + 0.5) * width/7, height + 100);
            if (beat >= x[2] + x[3] + min(x[4],0) + 1) {
                deleteList.unshift(y);
            }
        }
        ctx.beginPath();
        ctx.moveTo((x[0] + 0.5) * width/7, (x[1] + 0.5) * height/7);
        ctx.arc((x[0] + 0.5) * width/7, (x[1] + 0.5) * height/7, max(width/14 * (beat - x[2]) / x[3], width/14), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
    deleteList.forEach(x=>lasers.splice(x,1));
    vibration = max(vibration, 10);
}

function board(){
    Time = (new Date().getTime() - startTime) / 1000;
    beat = Time / (60 / BPM);
    ctx.fillStyle = "rgba(20,20,20,0.5)"
    ctx.fillRect(-1000,-1000,2000,2000);
    ctx.save();
    vibration += (0 - vibration) / 5
    ctx.translate(vibration * Math.sin(Math.random()*Math.PI*2), vibration * Math.cos(Math.random()*Math.PI*2))
    ctx.globalAlpha = 1 + Time / 2.5;
    drawBoard();
    while (Score[0] && lastBeat + Score[0][2] <= beat) {
        lastBeat += Score[0][2];
        Score[0][2] = lastBeat
        lasers.push(Score[0]);
        Score.shift();
    }
    if (keydown.ArrowUp) {playerY = min(playerY-1,0); keydown.ArrowUp = false}
    if (keydown.ArrowRight) {playerX = max(playerX+1,6); keydown.ArrowRight = false}
    if (keydown.ArrowDown) {playerY = max(playerY+1,6); keydown.ArrowDown = false}
    if (keydown.ArrowLeft) {playerX = min(playerX-1,0); keydown.ArrowLeft = false}
    ctx.restore();
    requestAnimationFrame(board);
}

function start(soundTrack){
    BPM = musicData[soundTrack].match(/bpm:(.*)/i)[1] * 1;
    startTime = new Date().getTime() + 2500 + musicData[soundTrack].match(/offset:(.*)/i)[1] * 1;
    Score = (musicData[soundTrack].match(/score:\n?((.|\n)*)/i)[1].split("/")).map(x=>(x.split(",")).map(x=>x*1));
    var audio = new Audio(`musics/${musicData[soundTrack].match(/bgm:(.*)/i)[1]}`); audio.currentTime = 0; setTimeout(()=>audio.play(),2500)
    lastBeat = 0;
    board();
}

canvas.onclick=()=>{start("Evil's Talk"); canvas.onclick = ""}