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
let notes = [], startedTime, nowTime;

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
    let path = pathStr.split(" ").map(x => x.split(",").map(x => x == x * 1 ? x * 1 : x));

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
    notes.forEach(x => {
        let time = (x.endTime - nowTime) / x.speed;
        if (time <= 1) {
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
            }
            if (time < 1 && time > 0) {
                ctx.globalAlpha = (1 - time) / 1;
                ctx.scale(time + 1, time + 1);
                ctx.stroke(pathPreset.diamond);
            }
            ctx.restore();
        }
    });
    ctx.globalAlpha = 1;
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    nowTime = new Date().getTime() - startedTime;
    drawEdge();
    drawqwerty();
    drawNotes();
    requestAnimationFrame(main);
}

let SPB = 60 / 132 * 1000;

canvas.addEventListener("click", () => {
    notes = [];
    let path = [
        getPosByPath("m 0,100 c 0,-4.118231 5.3494703,-6.25 12.5,-6.25 0.188058,-9.718959 6.692877,-12.5 12.5,-12.5 0.08501,-9.676907 5.930856,-12.5 12.5,-12.5 0,-9.6526 6.252271,-12.5 12.5,-12.5 0,12.702818 6.186659,12.5 12.5,12.5 0,-10.154481 6.050625,-12.5 12.5,-12.5 0,-11.274716 6.096965,-12.5 12.5,-12.5 8.555433,0 12.5,27.033715 12.5,56.25"),
        getPosByPath("M 0,75 C 0,50 6.0381608,43.5 12.5,43.5 h 75 c 8.555433,0 12.5,27.03394 12.5,56.250225"),

        getPosByPath("m 0,100 c 0,-4.947665 6.0381608,-12.5 12.5,-12.5 h 25 c 0,-34.844659 4.968129,-43.75 12.5,-43.75 h 37.5 c 8.555433,0 12.5,26.78394 12.5,56.000225"),
        getPosByPath("M 0,100 H 12.5 C 12.5,66.179892 18.242479,43.75 25,43.75 25,75.988402 30.815781,75 37.5,75 37.626581,84.175971 43.181865,87.5 50,87.5 h 37.5 c 8.555433,0 12.5,7.554677 12.5,12.5"),
        getPosByPath("m 0,100 c 0,-3.18662 4.6744504,-6.25 12.5,-6.25 0,3.539743 5.742479,6.25 12.5,6.25 h 25 c 0,-36.249771 6.551761,-56.25 12.5,-56.25 0.0089,-7.400307 5.004169,-12.5 12.5,-12.5 0,6.47471 5.119544,12.5 12.5,12.5 8.555433,0 12.5,20.076039 12.5,56.25"),
    
        getPosByPath("M 0,100 C 0,62.682165 5.2623183,37.5 14.285714,37.5 h 71.428565 c 0,43.568652 7.142857,62.5 14.285721,62.5"),
        getPosByPath("M 0,100 C 0,62.682165 10.976606,37.5 20,37.5 h 60 c 0,43.568652 12.857136,62.5 20,62.5"),
        getPosByPath("M 0,100 C 0,72.066937 8.6141088,68.75 16.666666,68.75 h 16.666666 c 0,-27.630323 8.20602,-31.25 16.666666,-31.25 l 33.333332,0 c 0,43.568652 9.523806,62.5 16.66667,62.5"),
        getPosByPath("M 0,100 C 0,50 12.5,37.5 50,37.5 c 25,0 50,12.5 50,62.5"),
    
        getPosByPath("M 0,100 C 0,93.687732 4.6514801,87.5 12.5,87.5 12.5,94.720838 18.75,100 25,100 H 37.5 C 37.5,56.811789 43.022978,37.5 50,37.5 l 37.701294,0 C 95.865378,37.5 100,67.447952 100,100"),
        getPosByPath("M 0,100 C 0,95.305796 4.6514801,93.75 12.5,93.75 12.5,100 18.75,100 25,100 H 37.5 C 37.5,56.811789 43.022978,37.5 50,37.5 H 87.701294 C 95.865378,37.5 100,67.447952 100,100"),
        getPosByPath("M 0,100 C 0,50 5.3282349,31.25 14.318654,31.25 h 14.318655 c 0,5.030101 6.326529,6.25 14.318654,6.25 H 85.911926 C 95.263822,37.5 100,67.447952 100,100"),
        getPosByPath("M 0,0 0,16.666671 l 16.666662,0 0,16.666666 16.666668,0 0,16.666665 16.666669,0 0,16.666673 h 16.666676 l 0,16.666666 16.666668,0 L 83.333328,100 100,100"),
    ];

    notes.push(new note(1, 0, path[0], SPB * 8, SPB * 8));
    notes.push(new note(1, 2, path[0], SPB * 8, SPB * 8));
    notes.push(new note(1, 4, path[1], SPB * 8, SPB * 8));
    notes.push(new note(1, 5, path[1], SPB * 8, SPB * 8));
    notes.push(new note(1, 7, path[0], SPB * 8, SPB * 8));
    notes.push(new note(1, 9, path[0], SPB * 8, SPB * 8));


    notes.push(new note(1, 0, path[4], SPB * 16, SPB * 8));
    notes.push(new note(1, 2, path[3], SPB * 16, SPB * 8));
    notes.push(new note(1, 4, path[2], SPB * 16, SPB * 8));
    notes.push(new note(1, 5, path[2], SPB * 16, SPB * 8));
    notes.push(new note(1, 7, path[3], SPB * 16, SPB * 8));
    notes.push(new note(1, 9, path[4], SPB * 16, SPB * 8));


    notes.push(new note(1, 0, path[5], SPB * 23, SPB * 7));
    notes.push(new note(1, 2, path[6], SPB * 23, SPB * 5));
    notes.push(new note(1, 4, path[7], SPB * 23, SPB * 6));
    notes.push(new note(1, 5, path[7], SPB * 23, SPB * 6));
    notes.push(new note(1, 7, path[6], SPB * 23, SPB * 5));
    notes.push(new note(1, 9, path[5], SPB * 23, SPB * 7));

    notes.push(new note(2, 1, path[8], SPB * 24, SPB * 2));
    notes.push(new note(2, 3, path[8], SPB * 24, SPB * 2));
    notes.push(new note(2, 6, path[8], SPB * 24, SPB * 2));
    notes.push(new note(2, 8, path[8], SPB * 24, SPB * 2));


    notes.push(new note(1, 0, path[9], SPB * 32, SPB * 8));
    notes.push(new note(1, 2, path[10], SPB * 32, SPB * 8));
    notes.push(new note(1, 4, path[11], SPB * 32, SPB * 7));
    notes.push(new note(1, 5, path[11], SPB * 32, SPB * 7));
    notes.push(new note(1, 7, path[10], SPB * 32, SPB * 8));
    notes.push(new note(1, 9, path[9], SPB * 32, SPB * 8));

    notes.push(new note(2, 0, path[12], SPB * 31, SPB * 3));
    notes.push(new note(2, 2, path[12], SPB * 31, SPB * 3));
    notes.push(new note(2, 4, path[12], SPB * 31, SPB * 3));
    notes.push(new note(2, 5, path[12], SPB * 31, SPB * 3));
    notes.push(new note(2, 7, path[12], SPB * 31, SPB * 3));
    notes.push(new note(2, 9, path[12], SPB * 31, SPB * 3));

    snd["dead_soul_by_sound_souler.ogg"].currentTime = SPB * (92) / 1000;
    snd["dead_soul_by_sound_souler.ogg"].volume = 0;
    setInterval(()=>snd["dead_soul_by_sound_souler.ogg"].volume += 0.01, 10)
    snd["dead_soul_by_sound_souler.ogg"].play();

    startedTime = new Date().getTime() + SPB * 8;
});

main();