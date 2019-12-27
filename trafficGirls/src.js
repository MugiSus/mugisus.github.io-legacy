let pathData = {
    roundSquere : (()=>{
        let path = new Path2D();
        path.moveTo(-100, -100);
        path.lineTo(-100, 100);
        path.lineTo(100, 100);
        path.lineTo(100, -100);
        path.lineTo(-100, -100);
        return path;
    })()
}

let width = 10; height = 18;
let erasables = [[1,1],[2,1],[3,1],[1,2]];
let panels = [];

let panel = class {
    constructor (name, xpos, ypos){
        this.x = xpos;
        this.y = ypos;
        this.name = name;
        this.vel = 0;
    }
}

let drawBoard =(x, y, w, h)=> {
    let chipSize = Math.min(w / 10, h / 18);
    ctx.lineWidth = chipSize * 0.25;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#343434";
    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 10; j++) {
            ctx.save();
            ctx.translate(x + (j + 0.5) * chipSize, y + (i + 0.5) * chipSize);
            
            ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
            ctx.stroke(pathData.roundSquere);
        
            ctx.restore();
        }
    }

    panels.forEach(i => {
        ctx.save();
        ctx.translate(x + (i.x + 0.5) * chipSize, y + (i.y + 0.5) * chipSize);
        ctx.image(i.name, -0.475 * chipSize, -0.475 * chipSize, chipSize * 0.95, chipSize * 0.95);
        ctx.restore();
    });
}

/*
let erasable = erasables.some(x => x[0] == j && x[1] == i);
ctx.globalAlpha = erasable ? 1 : 0.4;
ctx.image(data[i][j], -0.475 * chipSize, -0.475 * chipSize, chipSize * 0.95, chipSize * 0.95);
if (erasable) {
    ctx.strokeStyle = "#ffff44";
    ctx.globalAlpha = Math.sin(new Date().getTime() % 1000 / 1000 * Math.PI * 2) * 0.4 + 0.4
    ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
    ctx.stroke(pathData.roundSquere);
    ctx.strokeStyle = "#343434";
}*/

panels.push(new panel("tg001green", 3, 3));
panels.push(new panel("tg001yellow", 4, 3));
panels.push(new panel("tg001red", 5, 3));
panels.push(new panel("tg001arrow", 3, 4));

panels.push(new panel("tg001green", 2, 0));
panels.push(new panel("tg001yellow", 3, 0));
panels.push(new panel("tg001red", 4, 0));
panels.push(new panel("tg001arrow", 2, 1));

panels.push(new panel("tg001green", 0, 6));
panels.push(new panel("tg001yellow", 1, 6));
panels.push(new panel("tg001red", 2, 6));
panels.push(new panel("tg001arrow", 0, 7));

panels.push(new panel("tg001green", 7, 2));
panels.push(new panel("tg001yellow", 8, 2));
panels.push(new panel("tg001red", 9, 2));
panels.push(new panel("tg001arrow", 7, 3));

panels.push(new panel("tg001red", 8, 6));
panels.push(new panel("tg001yellow", 9, 8));

panels.push(new panel("tg001green", 4, 10));

let checkTable = [
    ["tg001green", 0, 0],
    ["tg001yellow", 1, 0],
    ["tg001red", 2, 0],
    ["tg001arrow", 0, 1],
]

let process =(w, h)=>{
    let allMap = new Array(h).fill(0).map(()=>new Array(10).fill("empty"));
    allMap.push(new Array(w).fill("floor"));
    panels.forEach(i => allMap[Math.ceil(i.y)][i.x] = i.name);
    panels.forEach(i => {
        let j = i.y + 1;
        while (allMap[Math.ceil(j)][i.x] != "floor") {
            if (allMap[Math.ceil(j)][i.x] == "empty") break;
            j++;
        }
        if (allMap[Math.ceil(j)][i.x] == "empty") i.y += i.vel += 0.03;
        else i.y = Math.ceil(i.y);
    });
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    process(width, height);
    drawBoard(-900, -900, 1800 * width / height, 1800);
    requestAnimationFrame(main);
}

canvas.addEventListener("imageLoaded", ()=>main());