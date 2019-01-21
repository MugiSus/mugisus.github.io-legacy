//init
const musicData = {
    "infetterence":`
AUTHOR:Shrill Otter/jacknjellify
BGM:infetterence.mp3
BPM:177
MEASURE:4/4
OFFSET:0

score:
0,0,0,0,
011027,012026,013025,0000141400000024611a00,0a15000230,016022,017021,0000313100000047000,
032046,033045,034044,0000353500000043511a00,0a36000420,037041,37041037041036042035433444,110022001400260017000,
0,0,0,0,
111200002726,252400003132,33340000410,0000434400,41000001716,151400002122,23240000370,0000003635,
111200002726,252400003132,33343536,0000434400,41000001716,151400002122,2324000014-240,0,
017210001127,0262524,232200,0161514,021170002711,0262524,23222322,0161412,
11121314,15164142,43444546,27262524,2322373635343332,1112131415164142,43444546272625242322373635343332,14-24-34-440014-24-34-440014-24-34-4400011-21-17-2700011-21-17-270,
512a-567a0a-1112270260,25024023612b-667b0b,512c-567c0c-212217016612d-667d,0d-1402411-21-17-27011-21-17-270,512e-567e0e-3132470460,45-511f044577f430f0,611g-677gg,511h-577h0000000522h566h533h555h0h0,
544i012-2611-2712-26013-250,12-26011-27012-26644a-i000,635a0a-31-4732-46031-47544c-a,0c-33-45033-4511-23-15-27021-13-25-170,644d000d-11-27017-21011-2700013152523,566e00522e00e0,613f,646f0f0677g666g655g644g,
g01201411016,11016121731-43-35-4700,0017131101215,11014022025272102402600,001401613012,1501411161400,3701517-3612016-3513,15-34111213-3312-32-421716-32-4214,
11221324,15261727,27162514,23122111,1121122213231424,1727162615251424,37363534474645443534333245444342,21-23-25-270022-24-260021-23-25-270627a0000000,
a
`
};

//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 1100, canvas.height / 1100);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
var mouseState = {}; var keydown = {};
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
var updatePos =()=> {mouseX = (event.changedTouches[0].pageX - canvas.width / 2) / ratio - 200 / ratio; mouseY = (event.changedTouches[0].pageY - canvas.height / 2) / ratio - 200 / ratio;};
document.addEventListener("touchstart", (event)=>{mouseState["left"] = true; updatePos()});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive : false});
document.addEventListener("touchend", (event)=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

document.title = "49"

//initalize
var vibration = 0;
var playerX = playerY = targetPlayerX = targetPlayerY = 0;
var life = 1;
var beat = startBeat = 0; //222
var timer = 0;
var nowHazward = 0;
var lastBeat = -1;
var lineAlpha = 0;
var damageEffect = 0;
var vibration = 0;
var title;
var score = [];
var hazwards = [];
var hazwardList = [];
var bullet = [];
var bgm, bpm;
var musicEnd = false;
var point = damage = rank = 0;
var tags = {};

var audio = {};
Object.values(musicData).forEach(x=>{audio[x.match(/bgm:(.*)/i)[1]] = new Audio(`musics/${x.match(/bgm:(.*)/i)[1]}`)});

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
};

var drawLines =()=> {
    if (beat >= 0 && Math.floor(beat) != lastBeat) {lineAlpha = 5; lastBeat = Math.floor(beat);}
    lineAlpha += (0.5 - lineAlpha) / 5;
    ctx.globalAlpha = lineAlpha;
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 4;
    for (let i = -4; i < 4; i++) {ctx.line(i*100+50,-350,i*100+50,350); ctx.line(-350,i*100+50,350,i*100+50);}
    ctx.font = "30px 'Hiragino Mincho Pro'";
    ctx.fillText(Math.floor(beat*1000)/1000,-400,-400);
    ctx.textAlign = "right";
    ctx.fillText(`♫${title}`,400,425);
}

var drawHazards =()=> {
    ctx.fillStyle = "#ff8800";
    ctx.strokeStyle = "#ff8800";
    ctx.lineWidth = 3;
    while (hazwards[nowHazward] && hazwards[nowHazward][hazwards[nowHazward].length-1] < beat) {
        hazwards[nowHazward][hazwards[nowHazward].length-1] += 4;
        if (beat >= startBeat - 4) {
            if (["1","2","3","4"].indexOf(hazwards[nowHazward][0]) > -1) hazwardList.push(hazwards[nowHazward]);
            else if (["5","6"].indexOf(hazwards[nowHazward][0]) > -1) {
                tags[hazwards[nowHazward][hazwards[nowHazward].length-2]] = Infinity;
                hazwardList.push(hazwards[nowHazward]);
            }
            else tags[hazwards[nowHazward][0]] = beat;
        }
        nowHazward++;
    }
    let delList = [];
    let addVib = 0;
    hazwardList.forEach((x,y)=>{
        if (["1","2","3","4"].indexOf(x[0]) > -1) {
            ctx.globalAlpha = Math.max(0, 1 - (x[2] - beat) / 2)
            ctx.beginPath();
            let pos;
            switch (x[0]) {
                case "1": pos = [-400+x[1]*100,-400+(x[2]-beat)*-100]; ctx.line(-400+x[1]*100,-350,-400+x[1]*100,350); break;
                case "2": pos = [-400+x[1]*100,400+(x[2]-beat)*100]; ctx.line(-400+x[1]*100,-350,-400+x[1]*100,350); break;
                case "3": pos = [-400+(x[2]-beat)*-100,-400+x[1]*100]; ctx.line(-350,-400+x[1]*100,350,-400+x[1]*100); break;
                case "4": pos = [400+(x[2]-beat)*100,-400+x[1]*100]; ctx.line(-350,-400+x[1]*100,350,-400+x[1]*100); break;
            }
            ctx.arc(...pos,40,0,Math.PI*2,false);
            ctx.closePath();
            ctx.fill();
            if (beat >= x[2]) {
                delList.unshift(y);
                bullet.push([...pos,0,0,0,1]); bullet.push([...pos,0,0,0,-1]); bullet.push([...pos,0,0,1,0]); bullet.push([...pos,0,0,-1,0]);
                addVib += 16;
            }
        } if (["5","6"].indexOf(x[0]) > -1) {
            if (beat >= x[4]) {
                ctx.globalAlpha = 1;
                if (hazwardList[y][4] > 0) {addVib += 25; hazwardList[y][4] = -1;}
                if ((Math.round(playerX) >= x[1] && Math.round(playerX) <= x[2] && x[0] == "5") || (Math.round(playerY) >= x[1] && Math.round(playerY) <= x[2] && x[0] == "6")) {
                    life -= 0.025;
                    damage += 0.025;
                    addVib += 9;
                    damageEffect += 0.05;
                }
            }
            else ctx.globalAlpha = 0.25 + Math.cos((x[4]+beat)*Math.PI*2) * 0.2;
            switch (x[0]) {
                case "5": ctx.fillRect(-450+x[1]*100,-350,(x[2]-x[1])*100+100,700); break;
                case "6": ctx.fillRect(-350,-450+x[1]*100,700,(x[2]-x[1])*100+100); break;
            }
            if (beat >= tags[x[3]]) {addVib += 4; delList.unshift(y);}
        }
    });
    delList.forEach(x=>hazwardList.splice(x,1));
    delList = [];
    ctx.globalAlpha = 1;
    bullet.forEach((x,y)=>{
        ctx.beginPath();
        ctx.arc(x[0],x[1],10,0,Math.PI*2,false);
        ctx.closePath();
        ctx.fill();
        bullet[y][0] += bullet[y][2] += bullet[y][4];
        bullet[y][1] += bullet[y][3] += bullet[y][5];
        if (((-400+playerX*100 - bullet[y][0])**2+(-400+playerY*100 - bullet[y][1])**2)**0.5 < 35) {
            life -= 0.3;
            damage += 0.3;
            addVib += 100;
            damageEffect += 0.5;
            delList.unshift(y);
        }
        if (Math.abs(x[2]) > 120 || Math.abs(x[3]) > 120) delList.unshift(y);
    });
    delList.forEach(x=>bullet.splice(x,1));
    damageEffect = Math.min(damageEffect, 0.75);
    vibration += addVib ** 0.5;
}

var drawPlayer =()=> {
    life = Math.max(Math.min(life + 0.0005, 1), 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#dd8800";
    ctx.beginPath();
    targetPlayerX = Math.min(Math.max(Math.round((mouseX + 400) / 100),1),7);
    targetPlayerY = Math.min(Math.max(Math.round((mouseY + 400) / 100),1),7);
    playerX += (targetPlayerX - playerX) / 2;
    playerY += (targetPlayerY - playerY) / 2;
    ctx.arc(-400+playerX*100,-400+playerY*100,35,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ddbb00";
    ctx.beginPath();
    ctx.moveTo(-400+playerX*100,-400+playerY*100);
    ctx.arc(-400+playerX*100,-400+playerY*100,25,Math.PI/-2+Math.PI*2*life,Math.PI/-2,true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = damageEffect;
    ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
    damageEffect += (0 - damageEffect) / 10;
}

var drawResults =()=> {
    if (musicEnd || life <= 0 || hazwards[hazwards.length-1][hazwards[hazwards.length-1].length-1] + 4 < beat) {
        if (!musicEnd) {
            musicEnd = true;
            point = [Math.floor(beat*1000)/1000, Math.floor(damage*1000)/1000, hazwards[hazwards.length-1][hazwards[hazwards.length-1].length-1] + 4];
            if (point[2] < point[0]) {
                if (point[1] == 0) rank = "SSS";
                else if (point[1] < 0.5) rank = "SS";
                else if (point[1] < 1) rank = "S";
                else rank = "A";
            } else {
                if (point[0] > point[2] * 0.8) rank = "B";
                else if (point[0] > point[2] * 0.5) rank = "C";
                else if (point[0] > point[2] * 0.2) rank = "D";
                else rank = "E";
            }
        }
        audio[bgm].volume = Math.max(audio[bgm].volume - 0.0025, 0);
        ctx.fillStyle = "#202020";
        ctx.globalAlpha = 1 - audio[bgm].volume;
        ctx.fillRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
        ctx.fillStyle = "#ffffff"
        ctx.font = "140px 'Hiragino Mincho Pro'";
        ctx.textAlign = "center"
        ctx.fillText("Results", 0, -200);
        ctx.font = "70px 'Hiragino Mincho Pro'";
        ctx.fillText(`final score: ${point[0]}`, 0, 0);
        ctx.fillText(`damages you got: ${point[1]}`, 0, 100);
        ctx.font = "100px 'Hiragino Mincho Pro'";
        ctx.fillText(`RANK: ${rank}`, 0, 250)
    }
}

function board() {
    ctx.globalAlpha = 1;
    ctx.clearRect(-canvas.width / 2 / ratio, -canvas.height / 2 / ratio, canvas.width / ratio, canvas.height / ratio);
    ctx.save();
    let rand = Math.random() * Math.PI * 2;
    ctx.translate(vibration * Math.sin(rand), vibration * Math.cos(rand));
    timer = (new Date().getTime() - startTime) / 1000;
    beat = timer / (60 / bpm);
    drawHazards();
    drawLines();
    drawPlayer();
    ctx.restore();
    drawResults();
    vibration += (0 - vibration) / 5;
    requestAnimationFrame(board);
}

function start(soundTrack) {
    bpm = musicData[soundTrack].match(/bpm:(.*)/i)[1] * 1;
    startTime = new Date().getTime() + 2500 + musicData[soundTrack].match(/offset:(.*)/i)[1] * 1 - (beat * (60 / bpm)) * 1000;
    measure = musicData[soundTrack].match(/measure:(.*)\/(.*)/i).slice(1,3);
    score = (musicData[soundTrack].match(/score:\n?((.|\n)*)/i)[1].split(",")).map(x=>x.match(/-?(0|[a-z]|[1-4][1-7]|[5-6][1-7]{2}[a-z])/g));
    title = `${soundTrack} by ${musicData[soundTrack].match(/author:(.*)/i)[1]}`;
    if (score[score.length-1] == null) score.splice(score.length-1,1);
    score.forEach((x,j)=>{
        for (let i = score[j].length - 1; i > 0; i--) {
            if (score[j][i].charAt(0) == "-") {
                score[j][i-1] += score[j][i];
                score[j].splice(i,1);
            }
        }
        score[j] = score[j].map(x=>x.split("-"));
    })
    score.forEach((x,j)=>{
        x.forEach((x,i)=>{
            x.forEach(x=>{
                if (x != "0") hazwards.push([...x.split(""), measure[0] / score[j].length * i + measure[0] * (4 / measure[1]) * j - (["1","2","3","4","5","6"].indexOf(x.charAt(0)) > -1) * 4]);
            });
        });
    });
    hazwards.sort((x,y)=>{return x[x.length-1] > y[y.length-1] ? 1 : x[x.length-1] < y[y.length-1] ? -1 : 0});
    bgm = musicData[soundTrack].match(/bgm:(.*)/i)[1];
    audio[bgm].currentTime = beat * (60 / bpm);
    setTimeout(()=>audio[bgm].play(),2500);
    board();
}

ctx.fillStyle = "#ffffff"
ctx.font = "30px 'Hiragino Mincho Pro'";
ctx.textAlign = "right"
ctx.fillText(`~click to start~`,400,425);

canvas.onclick=()=>{
  Object.keys(audio).forEach(x=>{audio[x].play(); audio[x].pause();});
  start("infetterence");
  canvas.onclick = "";
}
