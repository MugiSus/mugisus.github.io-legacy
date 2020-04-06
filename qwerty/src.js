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
let author, bpm, offset, pathes = {}, notes = [], drewId = {}, startedTime, nowTime;

let note = class {
    constructor(type, lane, path, endTime, speed, id){
        this.type = type;
        this.lane = lane;
        this.path = path;
        this.endTime = endTime;
        this.speed = speed;
        this.id = id || 0;
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
    let i = 0;
    for (i = 0; i < pos.length - 1; i++) if (pos[i + 1][0][0] > px) break;
    if (pos[i].length == 4) return getBezierYfromX(pos[i][0][0], pos[i][0][1], pos[i][1][0], pos[i][1][1], pos[i][2][0], pos[i][2][1], pos[i][3][0], pos[i][3][1], px);
    else return pos[i][0][1] + (pos[i][0][0] - px) / (pos[i][1][0] - pos[i][0][0]) * (pos[i][0][1] - pos[i][1][1]);
}

let drawqwerty =()=> {
    ctx.strokeStyle = "#ffffff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    "qwertyuiop".split("").forEach((x, y) => {
        ctx.save();
        ctx.translate((y - 4.5) * 250, 700);
        ctx.stroke(pathPreset.diamond);
        ctx.stroke(pathPreset[x]);
        ctx.restore();
    });
}

let drawEdge =()=> {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    "qwertyuiop".split("").forEach((x, y) => {
        ctx.save();
        ctx.translate((y - 4.5) * 250, 700);
        ctx.beginPath();
        ctx.moveTo(-120, 200);
        ctx.lineTo(-120, -1600);
        ctx.moveTo(120, 200);
        ctx.lineTo(120, -1600);
        ctx.stroke();
        ctx.restore();
    })
}

let drawNotes =()=> {
    ctx.lineWidth = 3;
    notes.some(x => {
        let time = (x.endTime - nowTime) / x.speed;
        if (time > 1) return true;
        else {
            let ypos = time > 0 ? getPathFromX(x.path, (1 - time) * 100) * 16 + -900 : 700 + (nowTime - x.endTime) / 1000 * 200;
            ctx.save();
            ctx.globalAlpha = Math.max((900 - Math.abs(ypos)) / 100, 0);
            ctx.translate((x.lane - 4.5) * 250, ypos);
            switch (x.type) {
                case 1: {
                    ctx.strokeStyle = "#88ffff";
                    ctx.fillStyle = "#88ffff44";
                    ctx.fill(pathPreset.diamond);
                    ctx.stroke(pathPreset.tapNote);
                } break;
                case 2: {
                    ctx.strokeStyle = "#ffff88";
                    ctx.fillStyle = "#ffff8844";
                    ctx.fill(pathPreset.diamond);
                    ctx.stroke(pathPreset.dragNote);
                } break;
                case 3: {
                    ctx.strokeStyle = "#88ffff";
                    ctx.fillStyle = "#88ffff44";
                    ctx.fill(pathPreset.diamond);
                    ctx.stroke(pathPreset.tapNote);
                } break;
                case 4: {
                    ctx.strokeStyle = "#ffff88";
                    ctx.fillStyle = "#ffff8844";
                    ctx.fill(pathPreset.diamond);
                    ctx.stroke(pathPreset.dragNote);
                } break;
            }
            if (x.id && !drewId[x.id]) drewId[x.id] = {start:-900, end:-900, lane:x.lane, color:ctx.fillStyle}
            if (x.id && x.type <= 2) drewId[x.id].start = time > 0 ? ypos : 700;
            else if (x.type >= 3) {
                drewId[x.id].end = ypos;
                if (time < 0) delete drewId[x.id];
            }
            if (time < 1 && time > 0) {
                let size = (1 - time) ** 3;
                ctx.globalAlpha *= size;
                ctx.scale(-size + 2, -size + 2);
                ctx.stroke(pathPreset.diamond);
            }
            ctx.restore();
        }
        return false;
    });
    Object.keys(drewId).forEach(x=>{
        ctx.save();
        ctx.translate((drewId[x].lane - 4.5) * 250, 0);
        ctx.beginPath();
        if (drewId[x].start < drewId[x].end) {
            ctx.moveTo(-75, drewId[x].start + 25);
            ctx.lineTo(0, drewId[x].start + 100);
            ctx.lineTo(75, drewId[x].start + 25);
            ctx.lineTo(75, drewId[x].end - 25);
            ctx.lineTo(0, drewId[x].end - 100);
            ctx.lineTo(-75, drewId[x].end - 25);
        } else {
            ctx.moveTo(-75, drewId[x].start - 25);
            ctx.lineTo(0, drewId[x].start - 100);
            ctx.lineTo(75, drewId[x].start - 25);
            ctx.lineTo(75, drewId[x].end + 25);
            ctx.lineTo(0, drewId[x].end + 100);
            ctx.lineTo(-75, drewId[x].end + 25);
        }
        ctx.closePath();
        let gradient = ctx.createLinearGradient(0, -900, 0, 900);
        gradient.addColorStop(100 / 1800, "#20202000");
        gradient.addColorStop(150 / 1800, drewId[x].color);
        ctx.fillStyle = gradient;
        ctx.fill("evenodd");
        ctx.restore();
    });
    notes = notes.filter(x => (x.endTime - nowTime) > -1000);
    ctx.globalAlpha = 1;
}

let generateScore =(scoreName)=> {
    author = scoreData[scoreName].match(/author:(.*?)\n/)[1];
    bpm = scoreData[scoreName].match(/bpm:(.*?)\n/)[1] * 1;
    offset = scoreData[scoreName].match(/offset:(.*?)\n/)[1] * 1;
    pathes = {};
    scoreData[scoreName].match(/path:((.|\n)*)score:/)[1].split("\n").filter(x=>x).forEach(x=>pathes[x.substr(0, x.indexOf(" "))] = getPosByPath(x.substr(x.indexOf(" ") + 1)));
    notes = [];
    scoreData[scoreName].match(/score:((.|\n)*)/)[1].split("\n").filter(x=>x).forEach(x=>{
        let arr = x.split(/, */).map(x => x*1 == x ? x*1 : x);
        arr[2] = pathes[arr[2]];
        arr[3] *= 60 / bpm * 1000;
        arr[4] *= 60 / bpm * 1000;
        notes.push(new note(...arr))
    });
    notes.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    nowTime = new Date().getTime() - startedTime;
    //if (nowTime / (60 / bpm * 1000)) 
    drawEdge();
    drawqwerty();
    drawNotes();
    requestAnimationFrame(main);
}

canvas.addEventListener("click", () => {
    generateScore("dead soul");

    let startTime = (60 / bpm * 1000) * -4;
    snd["snd/dead_soul_by_sound_souler.ogg"].currentTime = Math.max(startTime + offset, 0) / 1000;
    setTimeout(()=>snd["snd/dead_soul_by_sound_souler.ogg"].play(), (startTime + offset) * -1);

    startedTime = new Date().getTime() - startTime;
});

main();