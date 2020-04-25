let pathPreset = {
    diamond: (()=>{
        let p = new Path2D();
        p.moveTo(0, -100);
        p.lineTo(100, 0);
        p.lineTo(0, 100);
        p.lineTo(-100, 0);
        p.closePath();
        return p;
    })(),
    q: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(50, -50)
        p.lineTo(50, 50);
        p.lineTo(-50, 50)
        p.closePath();
        p.moveTo(10, 40);
        p.lineTo(40, 10);
        return p;
    })(),
    w: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(-50, 50)
        p.lineTo(50, 50);
        p.lineTo(50, -50)
        p.moveTo(0, 20);
        p.lineTo(0, -50);
        return p;
    })(),
    e: (()=>{
        let p = new Path2D();
        p.moveTo(50, -50);
        p.lineTo(-50, -50)
        p.lineTo(-50, 50);
        p.lineTo(50, 50)
        p.moveTo(-20, 0);
        p.lineTo(50, 0);
        return p;
    })(),
    r: (()=>{
        let p = new Path2D();
        p.moveTo(-50, 50);
        p.lineTo(-50, -50);
        p.lineTo(50, -50);
        p.lineTo(50, 0);
        p.lineTo(0, 0);
        p.lineTo(50, 50);
        return p;
    })(),
    t: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(-50, 50); 
        p.lineTo(50, 50);
        p.moveTo(-20, -15);
        p.lineTo(50, -15);
        return p;
    })(),
    y: (()=>{
        let p = new Path2D();
        p.moveTo(50, -50);
        p.lineTo(50, 50); 
        p.lineTo(-50, 50);
        p.moveTo(20, 0);
        p.lineTo(-50, 0);
        p.lineTo(-50, -50);
        return p;
    })(),
    u: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(-50, 50)
        p.lineTo(50, 50);
        p.lineTo(50, -50);
        return p;
    })(),
    i: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(0, -50)
        p.lineTo(0, 50);
        p.lineTo(50, 50);
        p.moveTo(25, -50);
        p.lineTo(50, -50);
        p.moveTo(-25, 50);
        p.lineTo(-50, 50);
        return p;
    })(),
    o: (()=>{
        let p = new Path2D();
        p.moveTo(-50, -50);
        p.lineTo(50, -50)
        p.lineTo(50, 50);
        p.lineTo(-50, 50)
        p.closePath();
        return p;
    })(),
    p: (()=>{
        let p = new Path2D();
        p.moveTo(-50, 50);
        p.lineTo(-50, -50);
        p.lineTo(50, -50);
        p.lineTo(50, 0);
        p.lineTo(-20, 0);
        return p;
    })(),
    tapNote: (()=>{
        let p = new Path2D();
        p.moveTo(0, -100);
        p.lineTo(100, 0);
        p.lineTo(0, 100);
        p.lineTo(-100, 0);
        p.closePath();
        p.moveTo(0, -50);
        p.lineTo(0, 50);
        p.moveTo(-50, 0);
        p.lineTo(50, 0);
        return p;
    })(),
    dragNote: (()=>{
        let p = new Path2D();
        p.moveTo(0, -100);
        p.lineTo(100, 0);
        p.lineTo(0, 100);
        p.lineTo(-100, 0);
        p.closePath();
        p.moveTo(-50, 0);
        p.lineTo(50, 0);
        return p;
    })(),
};
let author, bgm, bgmvol, bpm, offset, pathes = {}, judgeYPos = [], judgeXPos = [], judgeDir = [], notes = [], laneMoves = [], effects = [], drewId = {}, startedTime, nowTime, pressedTime = new Array(10).fill(-Infinity), pressed = [], newPressed = new Array(10).fill(false);
const judgeRate = {far:250, good:150, perfect:50};
const diagLeng = (3200 ** 2 + 1800 ** 2) ** 0.5;

let note = class {
    constructor(type, lane, path, endTime, speed, id, reversed){
        this.type = type;
        this.lane = lane;
        this.path = path;
        this.endTime = endTime;
        this.speed = speed;
        this.id = id || 0;
        this.reversed = reversed ? -1 : 1;
        this.judge = false;
    }
}

let laneMove = class {
    constructor(type, lane, path, endTime, speed, min, max){
        this.type = type;
        this.lane = lane;
        this.path = path;
        this.endTime = endTime;
        this.speed = speed;
        this.min = min;
        this.max = max;
    }
}

let effect = class {
    constructor(lane, state){
        this.lane = lane
        this.state = state;
        this.time = new Date().getTime();
        this.particle = new Array(5).fill(0).map(() => {return {rad: Math.random() * Math.PI * 2, size: 0.1 + Math.random() * 0.3}});
        this.sound = state == "good" || state == "perfect";
    }
}

let getBezier =(x1, y1, x2, y2, x3, y3, x4, y4, t)=> [
    (1 - t) ** 3 * x1 + 3 * (1 - t) ** 2 * t * x2 + 3 * (1 - t) * t ** 2 * x3 + t ** 3 * x4,
    (1 - t) ** 3 * y1 + 3 * (1 - t) ** 2 * t * y2 + 3 * (1 - t) * t ** 2 * y3 + t ** 3 * y4
];

let getBezierYfromX =(x1, y1, x2, y2, x3, y3, x4, y4, px, trails = 16)=> {
    let t = 0.5;
    
    for (let i = 0; i < trails; i++) {
        let bezierX = (1 - t) ** 3 * x1 + 3 * (1 - t) ** 2 * t * x2 + 3 * (1 - t) * t ** 2 * x3 + t ** 3 * x4;
        if (bezierX < px) t += 0.5 ** (i + 2);
        else if (bezierX > px) t -= 0.5 ** (i + 2);
        else break;
    }

    return (1 - t) ** 3 * y1 + 3 * (1 - t) ** 2 * t * y2 + 3 * (1 - t) * t ** 2 * y3 + t ** 3 * y4;
}

let getPosByPath =(pathStr)=> {
    let pos = [], lastPath = [], command = "";
    let path = pathStr.split(" ").filter(x=>x).map(x => x.split(",").map(x => x == x * 1 ? x * 1 : x));

    for (let i = 0; i < path.length; i++) {
        if (path[i][0] * 1 != path[i][0]) command = path[i][0];
        else {
            if (lastPath.length) {
                switch (command) {
                    case "M": case "L": pos.push([lastPath, path[i]]); break;
                    case "m": case "l": pos.push([lastPath, [lastPath[0] + path[i][0], lastPath[1] + path[i][1]]]); break;

                    case "H": pos.push([lastPath, [path[i][0], lastPath[1]]]); break;
                    case "h": pos.push([lastPath, [path[i][0] + lastPath[0], lastPath[1]]]); break;

                    case "V": pos.push([lastPath, [lastPath[0], path[i][0]]]); break;
                    case "v": pos.push([lastPath, [lastPath[0], path[i][0] + lastPath[1]]]); break;

                    case "C": pos.push([lastPath, path[i], path[i+1], path[i+2]]); i += 2; break;
                    case "c": pos.push([lastPath, [lastPath[0] + path[i][0], lastPath[1] + path[i][1]], [lastPath[0] + path[i+1][0], lastPath[1] + path[i+1][1]], [lastPath[0] + path[i+2][0], lastPath[1] + path[i+2][1]]]); i += 2; break;
                }
            }
            if (pos.length) lastPath = pos.slice(-1)[0].slice(-1)[0];
            else lastPath = path[i];
        }
    }

    return pos;
}

let getPathFromX =(pos, px)=> {
    if (px <= 0) return pos[0][0][1];
    if (px >= 100) return pos[pos.length - 1][pos[pos.length - 1].length - 1][1];
    let i = 0;
    for (i = 0; i < pos.length - 1; i++) if (pos[i + 1][0][0] > px) break;
    if (pos[i].length == 4) return getBezierYfromX(pos[i][0][0], pos[i][0][1], pos[i][1][0], pos[i][1][1], pos[i][2][0], pos[i][2][1], pos[i][3][0], pos[i][3][1], px);
    else return pos[i][0][1] + (pos[i][0][0] - px) / (pos[i][1][0] - pos[i][0][0]) * (pos[i][0][1] - pos[i][1][1]);
}

let drawqwerty =()=> {
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;
    "qwertyuiop".split("").forEach((x, y) => {
        ctx.save();
        ctx.translate(judgeXPos[y], judgeYPos[y]);
        ctx.rotate(judgeDir[y] * Math.PI * 2);
        ctx.stroke(pathPreset.diamond);
        ctx.stroke(pathPreset[x]);
        ctx.beginPath();
        ctx.moveTo(-120, diagLeng);
        ctx.lineTo(-120, -diagLeng);
        ctx.moveTo(120, diagLeng);
        ctx.lineTo(120, -diagLeng);
        ctx.stroke();
        ctx.globalAlpha = 0.05 + pressed[y] * 0.05 + Math.max(1 - (nowTime - pressedTime[y]) / 200 || 0, 0) * 0.2;
        ctx.fillRect(-120, -diagLeng, 240, diagLeng * 2);
        ctx.restore();
    });
}

let drawNotes =()=> {
    ctx.lineWidth = 3;

    laneMoves.some(x => {
        if (x.endTime - x.speed > nowTime) return true;

        let time = (x.endTime - nowTime) / x.speed;

        switch (x.type) {
            case 7: judgeDir[x.lane] = getPathFromX(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min; break;
            case 8: judgeXPos[x.lane] = getPathFromX(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min; break;
            case 9: judgeYPos[x.lane] = getPathFromX(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min; break;
        }
    });

    notes.some(x => {

        if (x.endTime - x.speed > nowTime) return true;

        let time = (x.endTime - nowTime) / x.speed;
    
        let ypos = time > 0 ? -1600 + getPathFromX(x.path, (1 - time) * 100) * 16 : (x.id ? 0 : (nowTime - x.endTime) / 1000 * 200 * x.reversed);

        ctx.save();
        //ctx.globalAlpha = x.type >= 3 ? 1 : (x.id ? 1 : (time > 0 ? Math.max((900 - Math.abs(ypos)) / 100, 0) : 1 - Math.min((nowTime - x.endTime) / 1000, 1)));
        ctx.translate(judgeXPos[x.lane], judgeYPos[x.lane]);
        ctx.rotate(judgeDir[x.lane] * Math.PI * 2);
        ctx.translate(0, ypos);

        switch (x.type) {
            case 1: {
                ctx.strokeStyle = "#88ffff";
                ctx.fillStyle = "#88ffff44";
                ctx.fill(pathPreset.diamond);
                ctx.stroke(pathPreset.diamond);
                ctx.stroke(pathPreset["qwertyuiop".charAt(x.lane)]);
            } break;
            case 2: {
                ctx.strokeStyle = "#ffff88";
                ctx.fillStyle = "#ffff8844";
                ctx.fill(pathPreset.diamond);
                ctx.stroke(pathPreset.diamond);
                ctx.stroke(pathPreset["qwertyuiop".charAt(x.lane)]);
            } break;
            case 3: {
                ctx.strokeStyle = "#88ffff";
                ctx.fillStyle = "#88ffff44";
            } break;
            case 4: {
                ctx.strokeStyle = "#ffff88";
                ctx.fillStyle = "#ffff8844";
            } break;
        }

        if (x.id && !drewId[x.id]) drewId[x.id] = {start: -diagLeng * x.reversed, end: -diagLeng * x.reversed, lane: x.lane, color: ctx.fillStyle}

        if (x.id && x.type <= 2) {
            drewId[x.id].endTime = x.endTime;
            drewId[x.id].start = time > 0 ? ypos : 0;
        } else if (x.type >= 3) {
            drewId[x.id].end = ypos;
            if (time < 0) delete drewId[x.id];
            else time = (x.endTime - nowTime) / (x.endTime - drewId[x.id].endTime);
            ctx.translate(0, -ypos + judgeYPos[x.lane]);
        }

        if (time < 1 && time > 0 && x.judge != "effected") {
            let size = (1 - time) ** 3;
            ctx.globalAlpha *= size;
            ctx.scale(-size + 2, -size + 2);
            ctx.stroke(pathPreset.diamond);
        }

        ctx.restore();
        
        return false;

    });

    Object.keys(drewId).forEach(x=>{
        ctx.save();
        ctx.fillStyle = drewId[x].color;
        ctx.translate(judgeXPos[drewId[x].lane], judgeYPos[drewId[x].lane]);
        ctx.beginPath();
        if (drewId[x].start < drewId[x].end) {
            ctx.moveTo(-75, drewId[x].start + 25);
            ctx.lineTo(0, drewId[x].start + 100);
            ctx.lineTo(75, drewId[x].start + 25);
            ctx.lineTo(75, drewId[x].end + 25);
            ctx.lineTo(0, drewId[x].end + 100);
            ctx.lineTo(-75, drewId[x].end + 25);
        } else {
            ctx.moveTo(-75, drewId[x].start - 25);
            ctx.lineTo(0, drewId[x].start - 100);
            ctx.lineTo(75, drewId[x].start - 25);
            ctx.lineTo(75, drewId[x].end - 25);
            ctx.lineTo(0, drewId[x].end - 100);
            ctx.lineTo(-75, drewId[x].end - 25);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    });
    ctx.globalAlpha = 1;
}

let judgeNotes =()=> {
    let nearestTapnote = new Array(10).fill({endTime: Infinity});

    notes.some(x => {

        if (x.endTime - x.speed > nowTime) return true;

        switch (x.type) {
            case 1: {
                if (Math.abs(nearestTapnote[x.lane].endTime - nowTime) > Math.abs(x.endTime - nowTime)) {
                    nearestTapnote[x.lane] = x;
                }
            } break;
            case 2: {
                if (x.judge != "effected" && pressed[x.lane] && Math.abs(x.endTime - nowTime) < judgeRate.far) {
                    if (Math.abs(x.endTime - nowTime) < judgeRate.far) x.judge = "far";
                    if (Math.abs(x.endTime - nowTime) < judgeRate.good) x.judge = "good";
                    if (Math.abs(x.endTime - nowTime) < judgeRate.perfect) x.judge = "perfect";
                }
            } break;
        }

        if (x.type == 2 && x.judge && x.judge != "effected" && x.endTime - nowTime <= 0) {
            effects.push(new effect(x.lane, x.judge));
            x.judge = "effected";
        }
        
        return false;
    });

    nearestTapnote.forEach(x => {
        if (newPressed[x.lane] && Math.abs(pressedTime[x.lane] - x.endTime) < judgeRate.far) {
            let judge = "far"
            if (Math.abs(pressedTime[x.lane] - x.endTime) < judgeRate.good) judge = "good";
            if (Math.abs(pressedTime[x.lane] - x.endTime) < judgeRate.perfect) judge = "perfect";
            effects.push(new effect(x.lane, judge));
            x.judge = "effected";
        }
    });

    newPressed = new Array(10).fill(false);
}

let drawEffects =()=> {
    effects.forEach(x=>{
        let size = ((new Date().getTime() - x.time) / 1000 - 1) ** 3 + 1;
        switch (x.state) {
            case "far": {
                ctx.strokeStyle = "#ff8888";
                ctx.fillStyle = "#ff8888";
            } break;
            case "good": {
                ctx.strokeStyle = "#88ffff";
                ctx.fillStyle = "#88ffff";
            } break;
            case "perfect": {
                ctx.strokeStyle = "#ffff88";
                ctx.fillStyle = "#ffff88";
            } break;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(1 - ((new Date().getTime() - x.time) / 1000), 0);
        ctx.translate(judgeXPos[x.lane], judgeYPos[x.lane]);
        ctx.rotate(judgeDir[x.lane] * Math.PI * 2);
        switch (x.state) {
            case "far": {
                ctx.scale(size * 0.5 + 1, size * 0.5 + 1);
                ctx.stroke(pathPreset.diamond);
                ctx.globalAlpha *= 0.25;
                ctx.fill(pathPreset.diamond);
            } break;
            case "good": {
                ctx.scale(size * 1.5 + 1, size * 1.5 + 1);
                ctx.stroke(pathPreset.diamond);
            } break;
            case "perfect": {
                ctx.scale(size * 2.5 + 1, size * 2.5 + 1);
                ctx.stroke(pathPreset.diamond);
                ctx.globalAlpha *= 0.5;
                ctx.scale(0.8, 0.8);
                ctx.stroke(pathPreset.diamond);
            } break;
        }
        ctx.restore();
        if (x.state != "far") {
            x.particle.forEach(i=>{
                ctx.save();
                ctx.translate(judgeXPos[x.lane] + Math.sin(i.rad) * 100, judgeYPos[x.lane] + Math.cos(i.rad) * 100);
                ctx.scale(i.size, i.size);
                ctx.translate(Math.sin(i.rad) * size * 1000, Math.cos(i.rad) * size * 1000);
                ctx.globalAlpha = Math.max(1 - size, 0);
                ctx.fill(pathPreset.diamond);
                ctx.restore();
            })
        }
        if (x.sound) {
            snd["se/note.ogg"].currentTime = 0.025;
            snd["se/note.ogg"].play();
            x.sound = false;
        }
    });
    effects = effects.filter(x => new Date().getTime() - x.time < 1000);
}

let deleteNotes =()=> {
    laneMoves = laneMoves.filter(x => x.endTime - nowTime > 0);
    notes = notes.filter(x => x.judge != "effected" && x.endTime - nowTime > (x.type >= 8 ? 0 : -1000) || drewId[x.id]);
}

let getKeyInput =()=> {
    "asdfghjkl;".split("").forEach((x, y)=>{
        if (keydown[x] && !pressed[y]) {
            pressed[y] = true;
            pressedTime[y] = nowTime;
            newPressed[y] = true;
        } else if (!keydown[x]) pressed[y] = false;
    })
}

let generateScore =(scoreName)=> {
    drewId = {};
    pressedTime = new Array(10).fill(-Infinity)
    judgeDir = new Array(10).fill(0);
    judgeXPos = new Array(10).fill(0).map((x,y) => (y - 4.5) * 250);
    judgeYPos = new Array(10).fill(700);
    author = scoreData[scoreName].match(/author:(.*?)\n/)[1];
    bgm = "snd/" + scoreData[scoreName].match(/bgm:(.*?)\n/)[1];
    bgmvol = (scoreData[scoreName].match(/bgmvol:(.*?)\n/) || [0,1])[1] * 1;
    bpm = scoreData[scoreName].match(/bpm:(.*?)\n/)[1] * 1;
    offset = (scoreData[scoreName].match(/offset:(.*?)\n/) || [0,0])[1] * 1;
    pathes = {};
    scoreData[scoreName].match(/path:((.|\n)*)score:/)[1].split("\n").filter(x=>x).forEach(x=>pathes[x.substr(0, x.indexOf(" "))] = getPosByPath(x.substr(x.indexOf(" ") + 1)));
    notes = [];
    laneMoves = [];
    scoreData[scoreName].match(/score:((.|\n)*)/)[1].split("\n").filter(x=>x).forEach(x=>{
        let arr = x.split(/ +/);
        let reversed = arr[2].charAt(0) == "-";
        arr[0] *= 1;
        arr[2] = reversed ? pathes[arr[2].substr(1)].map(x=>x.map(x => x.map((x, y) => y >= 1 ? x * -1 + 200 : x))) : pathes[arr[2]];
        arr[3] *= 60 / bpm * 1000;
        arr[4] *= 60 / bpm * 1000;
        if (arr[0] <= 4) arr[1].split("").forEach(x => notes.push(new note(arr[0], x * 1, arr[2], arr[3], arr[4], arr[5] ? arr[5] + x : 0, reversed)));
        else arr[1].split("").forEach(x => laneMoves.push(new laneMove(arr[0], x * 1, arr[2], arr[3], arr[4], arr[5] * 1, arr[6] * 1)));
    });
    notes.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
    laneMoves.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    nowTime = new Date().getTime() - startedTime;

    drawqwerty();
    drawNotes();
    judgeNotes();
    deleteNotes();
    drawEffects();
    
    requestAnimationFrame(main);
}

document.addEventListener("keydown", (event) => {
    if (event.key != " ") return;

    generateScore("dead soul");

    let startTime = (60 / bpm * 1000) * ((/time=(.*?)(&|$)/i.exec(location.search) || [0,0])[1] * 1 - 4);
    let judgeOffset = (/offset=(.*?)(&|$)/i.exec(location.search) || [0,0])[1] * 1;

    snd[bgm].volume = bgmvol;
    snd[bgm].currentTime = (startTime + offset + judgeOffset) / 1000;
    setTimeout(()=>snd[bgm].play(), (startTime + offset + judgeOffset) * -1);

    startedTime = new Date().getTime() - startTime;
});

judgeYPos = new Array(10).fill(700);
judgeXPos = new Array(10).fill(0).map((x,y) => (y - 4.5) * 250);

let keyInterval =()=> setInterval(()=>{getKeyInput()}, 10);

setTimeout(keyInterval, 100);
setTimeout(keyInterval, 103.33);
setTimeout(keyInterval, 106.66);

getKeyInput();

main();