let width = 10; height = 18;
let panels = [];
let erasables = [];
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
let panel = class {
    constructor (name, x, y){
        this.name = name;
        this.x = x;
        this.y = y;
        this.vel = 0;
    }
}
let table = class {
    constructor(name, x, y, required){
        this.name = name;
        this.x = x;
        this.y = y;
        this.required = required;
    }
}

let process =(w, h)=>{
    let allMap = new Array(h).fill(0).map(()=>new Array(10).fill("empty"));
    let moving = false;
    allMap.push(new Array(w).fill("floor"));
    panels.forEach(i => allMap[Math.ceil(i.y)][i.x] = i.name);
    panels.forEach(i => {
        let j = i.y;
        while (allMap[Math.ceil(j)][i.x] != "floor" && allMap[Math.ceil(j)][i.x] != "empty") j++;
        if (allMap[Math.ceil(j)][i.x] == "empty" || i.y + i.vel + 0.02 < Math.ceil(i.y)) {
            moving = true;
            i.y += i.vel += 0.02;
        } else {
            i.vel = 0;
            i.y = Math.ceil(i.y);
        }
    });
    if (!moving) {
        erasables = [];
        panels.forEach(i => {
            if (checkTable[0].name == i.name) {
                let check = [[i.x, i.y]];
                let isEstablished = true;
                checkTable.slice(1).forEach(j => {
                    if (allMap[i.y + j.y][i.x + j.x] == j.name) check.push([i.x + j.x, i.y + j.y]);
                    else if (j.required) isEstablished = false;
                });
                if (isEstablished) erasables.push(...check);
            }
        })
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
        let erasable = erasables.some(x=>x[0] == i.x && x[1] == i.y);
        ctx.save();
        ctx.translate(x + (i.x + 0.5) * chipSize, y + (i.y + 0.5) * chipSize);
        ctx.globalAlpha = erasable ? 1 : 0.6;
        ctx.image(i.name, -0.475 * chipSize, -0.475 * chipSize, chipSize * 0.95, chipSize * 0.95);
        ctx.restore();
        if (erasable) {
            ctx.save();
            ctx.translate(x + (i.x + 0.5) * chipSize, y + (i.y + 0.5) * chipSize);
            ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
            ctx.strokeStyle = "#ffff44";
            ctx.globalAlpha = Math.sin(new Date().getTime() % 1000 / 1000 * Math.PI * 2) * 0.3 + 0.7
            ctx.stroke(pathData.roundSquere);
            ctx.strokeStyle = "#343434";
            ctx.restore();
        }
    });
}

let erase =()=> {
    panels.forEach((i,j) => {
        if (erasables.some(x=>x[0] == i.x && x[1] == i.y)) {
            delete panels[j];
        }
    });
    erasables = [];
}

let checkTable = [
    new table("tg001green", 0, 0, true),
    new table("tg001yellow", 1, 0, true),
    new table("tg001red", 2, 0, true),
    new table("tg001arrow", 0, 1, false)
];

panels.push(new panel("tg001arrow", 3, 3));
panels.push(new panel("tg001yellow", 4, 5));
panels.push(new panel("tg001red", 5, 8));
panels.push(new panel("tg001green", 3, 4));

panels.push(new panel("tg001green", 1, 0));
panels.push(new panel("tg001yellow", 2, 0));
panels.push(new panel("tg001red", 3, 0));
panels.push(new panel("tg001arrow", 1, 1));

panels.push(new panel("tg001green", 0, 6));
panels.push(new panel("tg001yellow", 1, 6));
panels.push(new panel("tg001red", 2, 6));
panels.push(new panel("tg001arrow", 0, 7));

panels.push(new panel("tg001green", 7, 2));
panels.push(new panel("tg001yellow", 8, 4));
panels.push(new panel("tg001red", 9, 6));
panels.push(new panel("tg001arrow", 7, 7));

panels.push(new panel("tg001yellow", 8, 11));
panels.push(new panel("tg001red", 9, 8));

panels.push(new panel("tg001green", 7, 0));

panels.push(new panel("tg001yellow", 2, 13));

/*
for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        if (Math.random()*5 < 4) panels.push(new panel(checkTable[Math.floor(Math.random()*4)].name, j, i));
    }
}
*/

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    process(width, height);
    drawBoard(-900, -900, 1800 * width / height, 1800);
    requestAnimationFrame(main);
}

canvas.addEventListener("imageLoaded", ()=>main());