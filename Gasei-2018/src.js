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

var audio = new Audio(`unicorn.mp3`);
var nowDate;
var played;
var debugTime;
var dateList;
var adjust =(yr,mon,day,hr,min,sec)=> {
    debugTime = new Date(yr,mon,day,hr,min,sec).getTime() - new Date().getTime();
}

//adjust(2018,12,31,23,59,10);

ctx.textAlign = "center";
ctx.font = `30px 'Hiragino Mincho Pro'`;
ctx.fillStyle = "#ffffff";
ctx.fillText("〈クリックして年越す〉", 0, -420);
ctx.font = `70px 'Hiragino Mincho Pro'`;
ctx.strokeStyle = "#888888";
ctx.lineWidth = 10;
ctx.strokeText("2 0 1 9 年 完 全 勝 利 U C", 0, 35);
ctx.fillText("2 0 1 9 年 完 全 勝 利 U C", 0, 35);

function draw() {
    ctx.textAlign = "center";
    nowDate = new Date();
    if (nowDate.getTime() + debugTime > 1548946758700 && !played) {
        document.title = "ん？";
        setTimeout(()=>document.title = "流れ変わったな", 10000)
        audio.currentTime = (nowDate.getTime() + debugTime - 1548946800000) / 1000 + 41.3;
        audio.play();
        played = true;
    }
    if (nowDate.getTime() + debugTime > 1548946800000) {
        document.title = "完　全　勝　利";
        ctx.globalAlpha = 1;
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
        ctx.fillText(`賀`, -500, 000);
        ctx.fillText(`正`, 500, 000);
        ctx.fillStyle = "#eebb00";
        ctx.strokeText(`賀`, -500, 000);
        ctx.strokeText(`正`, 500, 000);
        dateList = [nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds()].map(x => (x + "").length == 1 ? "0" + x : x);
        ctx.fillStyle = "#ffffff";
        ctx.font = `100px 'Hiragino Mincho Pro'`;
        ctx.fillText(`${dateList.join(" : ")}`, 0, 50);
        if (nowDate.getTime() + debugTime < 1548946807000) {
            ctx.globalAlpha = (1548946807000 - (nowDate.getTime() + debugTime)) / 7000;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        }
    } else {
        ctx.globalAlpha = 1;
        ctx.clearRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        dateList = [23 - nowDate.getHours(), 59 - nowDate.getMinutes(), 59 - nowDate.getSeconds()].map(x => (x + "").length == 1 ? "0" + x : x);
        ctx.fillStyle = "#ffffff";
        ctx.font = `100px 'Hiragino Mincho Pro'`;
        ctx.fillText(`${dateList.join(" : ")}`, 0, 50);
        if (nowDate.getTime() + debugTime > 1548946797000) {
            ctx.globalAlpha =  1 - (1548946799000 - (nowDate.getTime() + debugTime)) / 2000;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        }
    }
    requestAnimationFrame(draw);
}

document.onclick =()=> {
    draw();
    document.onclick = "";
}
