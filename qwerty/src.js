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
let author, bgm, bgmvol, bpm, offset, pathes = {}, judgeYPos = [], judgeXPos = [], notes = [], effects = [], drewId = {}, startedTime, nowTime, pressedTime = new Array(10).fill(0), pressed = [];
let judgeOffset = 20;

let note = class {
    constructor(type, lane, path, endTime, speed, id){
        this.type = type;
        this.lane = lane;
        this.path = path.charAt(0) == "-" ? pathes[path.substr(1)].map(x=>x.map(x => x.map((x, y) => y ? x * -1 + 200 : x))) : pathes[path];
        this.reversed = path.charAt(0) == "-" ? -1 : 1;
        this.endTime = endTime;
        this.speed = speed;
        this.id = id || 0;
        this.done = false;
    }
}

let effect = class {
    constructor(lane, state){
        this.lane = lane
        this.state = state;
        this.time = new Date().getTime();
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
    "qwertyuiop".split("").forEach((x, y) => {
        ctx.save();
        ctx.translate(judgeXPos[y], judgeYPos[y]);
        ctx.stroke(pathPreset.diamond);
        ctx.stroke(pathPreset[x]);
        ctx.restore();
        ctx.save();
        ctx.translate(judgeXPos[y], 700);
        ctx.beginPath();
        ctx.moveTo(-120, 200);
        ctx.lineTo(-120, -1600);
        ctx.moveTo(120, 200);
        ctx.lineTo(120, -1600);
        ctx.stroke();
        ctx.globalAlpha = 0.05 + pressed[y] * 0.05 + Math.max((200 - (new Date().getTime() - pressedTime[y])) / 1000, 0)
        ctx.fillRect(-120, -1600, 240, 1800);
        ctx.restore();
    });
}

let drawNotes =()=> {
    ctx.lineWidth = 3;
    let judgeTime = new Date().getTime() + judgeOffset;
    notes.some(x => {
        let time = (x.endTime - nowTime) / x.speed;
        if (time > 1) return true;
        else {
            if (x.type >= 5) {
                switch (x.type) {
                    case 8: judgeYPos[x.lane] = getPathFromX(x.path, (1 - time) * 100) * 14 + -700; break;
                    case 9: judgeXPos[x.lane] = getPathFromX(x.path, (1 - time) * 100) / 0.9 * 22.5 - 1125; break;
                }
            } else {
                let ypos = judgeYPos[x.lane] + (time > 0 ? -1600 + getPathFromX(x.path, (1 - time) * 100) * 16 : (nowTime - x.endTime) / 1000 * 200 * x.reversed);

                ctx.save();
                ctx.globalAlpha = x.type >= 3 ? 1 : (time > 0 ? Math.max((900 - Math.abs(ypos)) / 100, 0) : 1 - Math.min((nowTime - x.endTime) / 1000, 1));
                ctx.translate(judgeXPos[x.lane], ypos);

                switch (x.type) {
                    case 1: {
                        ctx.strokeStyle = "#88ffff";
                        ctx.fillStyle = "#88ffff44";
                        if (x.done != "effected") {
                            ctx.fill(pathPreset.diamond);
                            ctx.stroke(pathPreset.diamond);
                            ctx.stroke(pathPreset["qwertyuiop".charAt(x.lane)]);
                        }
                    } break;
                    case 2: {
                        ctx.strokeStyle = "#ffff88";
                        ctx.fillStyle = "#ffff8844";
                        if (x.done != "effected") {
                            ctx.fill(pathPreset.diamond);
                            ctx.stroke(pathPreset.diamond);
                            ctx.stroke(pathPreset["qwertyuiop".charAt(x.lane)]);
                        }
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

                if (x.id && !drewId[x.id]) drewId[x.id] = {start:-1000 * x.reversed, end:-1000 * x.reversed, lane:x.lane, color:ctx.fillStyle}
                if (x.id && x.type <= 2) {
                    drewId[x.id].endTime = x.endTime;
                    drewId[x.id].start = time > 0 ? ypos : judgeYPos[x.lane];
                } else if (x.type >= 3) {
                    drewId[x.id].end = ypos;
                    if (time < 0) delete drewId[x.id];
                    else time = (x.endTime - nowTime) / (x.endTime - drewId[x.id].endTime);
                    ctx.translate(0, -ypos + judgeYPos[x.lane]);
                }
                if (time < 1 && time > 0 && !x.done) {
                    let size = (1 - time) ** 3;
                    ctx.globalAlpha *= size;
                    ctx.scale(-size + 2, -size + 2);
                    ctx.stroke(pathPreset.diamond);
                }
                ctx.restore();

                if (Math.abs(x.endTime - nowTime) < 150 && x.done != "effected") {
                    switch (x.type) {
                        case 1: {
                            if (Math.abs(pressedTime[x.lane] - judgeTime) < 150) {
                                if (Math.abs(pressedTime[x.lane] - judgeTime) < 50) effects.push(new effect(x.lane, "perfect"));
                                else effects.push(new effect(x.lane, "good"));
                                x.done = "effected";
                                snd["se/note.ogg"].currentTime = 0.025;
                                snd["se/note.ogg"].play();
                            }
                        } break;
                        case 2: {
                            if (pressed[x.lane]) {
                                if (Math.abs(x.endTime - nowTime) < 150) x.done = "good";
                                if (Math.abs(x.endTime - nowTime) < 50) x.done = "perfect";
                            }
                        } break;
                    }
                }

                if (x.type == 2 && x.done && x.done != "effected" && x.endTime - nowTime <= 0) {
                    effects.push(new effect(x.lane, x.done));
                    x.done = "effected";
                    snd["se/note.ogg"].currentTime = 0.025;
                    snd["se/note.ogg"].play();
                }
            }
        }
        return false;
    });
    Object.keys(drewId).forEach(x=>{
        ctx.save();
        ctx.fillStyle = drewId[x].color;
        ctx.translate(judgeXPos[drewId[x].lane], 0);
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
    notes = notes.filter(x => (x.endTime - nowTime) > (x.type >= 8 ? 0 : -1000) || drewId[x.id]);
    ctx.globalAlpha = 1;
}

let getKeyInput =()=> {
    "asdfghjkl;".split("").forEach((x, y)=>{
        if (keydown[x] && !pressed[y]) {
            pressed[y] = true;
            pressedTime[y] = new Date().getTime();
        } else if (!keydown[x]) pressed[y] = false;
    })
}

let drawEffects =()=> {
    effects.forEach(x=>{
        let size = ((new Date().getTime() - x.time) / 1000 - 1) ** 3 + 1;
        ctx.save();
        ctx.translate(judgeXPos[x.lane], judgeYPos[x.lane]);
        ctx.scale(size * 2 + 1, size * 2 + 1);
        ctx.globalAlpha = Math.max(1 - ((new Date().getTime() - x.time) / 1000), 0);
        switch (x.state) {
            case "good": {
                ctx.strokeStyle = "#88ffff";
                ctx.stroke(pathPreset.diamond);
            } break;
            case "perfect": {
                ctx.strokeStyle = "#ffff88";
                ctx.stroke(pathPreset.diamond);
            } break;
        }
        ctx.restore();
    });
    effects = effects.filter(x => new Date().getTime() - x.time < 1000);
}

let generateScore =(scoreName)=> {
    drewId = {};
    judgeYPos = new Array(10).fill(700);
    judgeXPos = new Array(10).fill(0).map((x,y) => (y - 4.5) * 250);
    author = scoreData[scoreName].match(/author:(.*?)\n/)[1];
    bgm = "snd/" + scoreData[scoreName].match(/bgm:(.*?)\n/)[1];
    bgmvol = (scoreData[scoreName].match(/bgmvol:(.*?)\n/) || [0,1])[1] * 1;
    bpm = scoreData[scoreName].match(/bpm:(.*?)\n/)[1] * 1;
    offset = (scoreData[scoreName].match(/offset:(.*?)\n/) || [0,0])[1] * 1;
    pathes = {};
    scoreData[scoreName].match(/path:((.|\n)*)score:/)[1].split("\n").filter(x=>x).forEach(x=>pathes[x.substr(0, x.indexOf(" "))] = getPosByPath(x.substr(x.indexOf(" ") + 1)));
    notes = [];
    scoreData[scoreName].match(/score:((.|\n)*)/)[1].split("\n").filter(x=>x).forEach(x=>{
        let arr = x.split(/ +/);
        arr[0] *= 1;
        arr[3] *= 60 / bpm * 1000;
        arr[4] *= 60 / bpm * 1000;
        arr[1].split("").forEach(x => notes.push(new note(arr[0], x * 1, arr[2], arr[3], arr[4], arr[5] ? arr[5] + x : 0)))
    });
    notes.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    nowTime = new Date().getTime() - startedTime;

    getKeyInput();

    drawqwerty();
    drawNotes();
    drawEffects();
    
    requestAnimationFrame(main);
}

canvas.addEventListener("click", () => {
    generateScore("dead soul");

    let startTime = (60 / bpm * 1000) * ((/time=(.*?)(&|$)/i.exec(location.search) || [0,0])[1] * 1 - 4);
    snd[bgm].volume = bgmvol;
    snd[bgm].currentTime = Math.max(startTime + offset, 0) / 1000;
    setTimeout(()=>snd[bgm].play(), (startTime + offset) * -1);

    startedTime = new Date().getTime() - startTime;
});

judgeYPos = new Array(10).fill(700);
judgeXPos = new Array(10).fill(0).map((x,y) => (y - 4.5) * 250);

main();