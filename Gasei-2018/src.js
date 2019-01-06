//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 1600, canvas.height / 900);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
var mouseState = {}; var keydown = {};
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

var audio = {"unicorn.mp3" : null, "tick.mp3" : null};
Object.keys(audio).forEach(x=>{audio[x] = new Audio(x)});
var nowDate;
var played;
var debugTime = 0;
var effect = 1, lastSec = -1;
var dateList;
var targetTime = new Date(new Date().getFullYear(),new Date().getMonth(),1,0,0,0); targetTime.setDate(new Date().getDate() + 1);
var adjust =(dateString)=> {debugTime = new Date(dateString).getTime() - new Date().getTime();}

ctx.textAlign = "center";
ctx.font = `30px 'Hiragino Mincho Pro'`;
ctx.fillStyle = "#ffffff";
ctx.fillText("〈クリックして年越す〉", 0, -420);
ctx.font = `70px 'Hiragino Mincho Pro'`;
ctx.strokeStyle = "#888888";
ctx.lineWidth = 10;
ctx.strokeText(`${targetTime.getMonth() + 1} 月 ${targetTime.getDate()} 日 完 全 勝 利 U C`, 0, 35);
ctx.fillText(`${targetTime.getMonth() + 1} 月 ${targetTime.getDate()} 日 完 全 勝 利 U C`, 0, 35);

document.title = `まだ${targetTime.getMonth() + 1}月${targetTime.getDate()}日`;

function draw() {
    nowDate = new Date();
    nowDate.setTime(nowDate.getTime() + debugTime);
    ctx.clearRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
    effect += 0 - effect / 20;
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = effect * 0.5;
    ctx.fillRect(-canvas.width / 2 / ratio, effect * -25, canvas.width / ratio, effect * 50);
    if (lastSec != nowDate.getSeconds()) {
        effect = lastSec != -1 ? 1 : 0; lastSec = nowDate.getSeconds();
        if (nowDate.getTime() < targetTime.getTime() - 41300) {audio["tick.mp3"].volume = 0.25; audio["tick.mp3"].currentTime = 0; audio["tick.mp3"].play();}
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 10;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#888888";
    if (nowDate.getTime() > targetTime.getTime() - 41300 && !played) {
        document.title = "ん？";
        setTimeout(()=>document.title = "流れ変わったな", 10000);
        audio["unicorn.mp3"].currentTime = (nowDate.getTime() - targetTime.getTime()) / 1000 + 41.3;
        audio["unicorn.mp3"].play();
        played = true;
    }
    if (nowDate.getTime() > targetTime.getTime()) {
        document.title = "完　全　勝　利";
        ctx.fillStyle = "#ee8800";
        ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        ctx.beginPath();
        ctx.arc(0,canvas.height/ratio/2,500,0,Math.PI*2,false);
        ctx.closePath();
        ctx.fillStyle = "#ee9900";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0,canvas.height/ratio/2,450,0,Math.PI*2,false);
        ctx.closePath();
        ctx.fillStyle = "#eeaa00";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0,canvas.height/ratio/2,400,0,Math.PI*2,false);
        ctx.closePath();
        ctx.fillStyle = "#eebb00";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `200px 'Hiragino Mincho Pro'`;
        ctx.strokeText(`賀`, -500, 000);
        ctx.strokeText(`正`, 500, 000);
        ctx.fillText(`賀`, -500, 000);
        ctx.fillText(`正`, 500, 000);
        ctx.fillStyle = "#eebb00";
        dateList = [nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds()].map(x => (x + "").length == 1 ? "0" + x : x);
        ctx.fillStyle = "#ffffff";
        ctx.font = `100px 'Hiragino Mincho Pro'`;
        ctx.strokeText(`${dateList.join(" : ")}`, 0, 40);
        ctx.fillText(`${dateList.join(" : ")}`, 0, 40);
        if (nowDate.getTime() < targetTime.getTime() + 7000) {
            ctx.globalAlpha = (targetTime.getTime() + 7000 - nowDate.getTime()) / 7000;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        }
    } else {
        ctx.globalAlpha = 1;
        dateList = [23 - nowDate.getHours(), 59 - nowDate.getMinutes(), 59 - nowDate.getSeconds()].map(x => (x + "").length == 1 ? "0" + x : x);
        ctx.fillStyle = "#ffffff";
        ctx.font = `100px 'Hiragino Mincho Pro'`;
        ctx.fillText(`${dateList.join(" : ")}`, 0, 40);
        if (nowDate.getTime() > targetTime.getTime() - 3000) {
            ctx.globalAlpha =  1 - (targetTime.getTime() - 1000 - nowDate.getTime()) / 2000;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        }
    }
    requestAnimationFrame(draw);
}

document.onclick =()=> {
    audio["tick.mp3"].currentTime = 0;
    audio["tick.mp3"].play();
    draw();
    document.onclick = "";
}