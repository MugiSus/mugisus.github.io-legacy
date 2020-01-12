let width = 10; height = 18;
let moving = false;
let length = [0, 0];
let panels = [];
let erasables = [];
let erased = [];
let markers = [];
let comboes = 0;
let comboLev = 5;
let pathData = {
    roundSquere : (()=>{
        let path = new Path2D();
        path.moveTo(-100, -100);
        path.lineTo(-100, 100);
        path.lineTo(100, 100);
        path.lineTo(100, -100);
        path.closePath();
        return path;
    })()
}
const panel = class {
    constructor (name, x, y){
        this.name = name;
        this.x = x;
        this.y = y;
        this.vel = 0;
    }
}

let processer =(w, h)=>{
    let allMap = new Array(h).fill(0).map(()=>new Array(10).fill("empty"));
    let checkMap = new Array(h).fill(0).map(()=>new Array(10).fill("empty"));
    moving = false;
    allMap.push(new Array(w).fill("floor"));
    panels.forEach(i => allMap[Math.ceil(i.y)][i.x] = i.name);
    panels.forEach(i => {
        let j = i.y;
        while (allMap[Math.ceil(j)][i.x] != "floor" && allMap[Math.ceil(j)][i.x] != "empty") j++;
        if (allMap[Math.ceil(j)][i.x] == "empty" || i.y + i.vel + 0.02 < Math.ceil(i.y)) {
            moving = true;
            i.y += i.vel += 0.02;
        } else {
            checkMap[Math.ceil(i.y)][i.x] = i.name
            i.vel = 0;
            i.y = Math.ceil(i.y);
        }
    });
    
    erasables = [];
    panels.forEach(i => {
        if (checkTable[0].name == i.name) {
            let check = [[i.x, i.y]];
            if (!checkTable.slice(1).some((j, k) => {
                if ((checkMap[i.y + j.y] || [])[i.x + j.x] == j.name && (j.required == -1 || check[j.required])) check[k + 1] = [i.x + j.x, i.y + j.y];
                else return j.required == -1;
            })) erasables.push(...(check.filter(x=>x)));
        }
    })

    return moving;
}

let markup =()=> {
    if (erased.length) comboes++;
    erased.push(...erasables);
    comboLev = markerPos.findIndex(x => x[0] > erased.length + (comboes + 1) * comboes / 2) - 1;
    if (comboLev < 0) comboLev = markerPos.length - 1
    markers = [];
    erased.forEach(i => {
        markerPos[comboLev].slice(1).forEach(j => {
            if (!markers.some(x => x[0] == i[0] + j[0] && x[1] == i[1] + j[1]) && i[0] + j[0] < width && i[0] + j[0] >= 0 && i[1] + j[1] < height && i[1] + j[1] >= 0) markers.push([i[0] + j[0], i[1] + j[1], 1]);
        })
    })
    panels = panels.filter(i => !erasables.some(x=>x[0] == i.x && x[1] == i.y));
    erasables = [];
}

let erase =()=> {
    panels = panels.filter(i => !markers.some(x=>x[0] == i.x && x[1] == i.y));
    comboes = 0;
    erased = [];
    markers = [];
}

let drawBoard =(x, y, w, h)=> {
    let chipSize = Math.min(w / 10, h / 18);
    ctx.globalAlpha = 1;
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
    });

    ctx.strokeStyle = "#ffff44";
    erasables.forEach(i => {
        ctx.save();
        ctx.translate(x + (i[0] + 0.5) * chipSize, y + (i[1] + 0.5) * chipSize);
        ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
        ctx.globalAlpha = Math.sin(new Date().getTime() / 1000 * Math.PI * 2) * 0.3 + 0.7;
        ctx.stroke(pathData.roundSquere);
        ctx.restore();
    });
    
    markers.forEach(i => {
        i[2] += (0 - i[2]) / 10;
        if (erased.some(x => x[0] == i[0] && x[1] == i[1])) {
            ctx.globalAlpha = Math.min(Math.sin(new Date().getTime() / 1000 * Math.PI * 2) * 0.2 + 0.3 + i[2], 1);
            ctx.fillStyle = "#ff6644";
        } else {
            ctx.globalAlpha = Math.min(Math.sin(new Date().getTime() / 1000 * Math.PI * 2) * 0.1 + 0.2 + i[2], 1);
            ctx.fillStyle = "#ffaa44";
        }
        ctx.save();
        ctx.translate(x + (i[0] + 0.5) * chipSize, y + (i[1] + 0.5) * chipSize);
        ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
        ctx.fillRect(-112.5, -112.5, 225, 225);
        ctx.restore();
    });
}

let drawComboLev =(xpos)=> {
    targetLength = [(comboes + 1) * comboes / 2, (comboes + 1) * comboes / 2 + erased.length].map(x => Math.min(1, x / (markerPos[markerPos.length - 1][0] + 3)) * -1600);
    length = length.map((x,y) => x + (targetLength[y] - x) / 10);
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(xpos, -800);
    ctx.lineTo(xpos, 800);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 50;
    ctx.stroke();
    
    ctx.strokeStyle = "#ffaa44";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(xpos, length[0] + 800);
    ctx.lineTo(xpos, 800);
    ctx.stroke();
    ctx.lineCap = "butt";

    ctx.strokeStyle = "#ffff44";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(xpos, length[0] + 800);
    ctx.lineTo(xpos, length[1] + 800);
    ctx.stroke();
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(xpos, length[1] + 800);
    ctx.lineTo(xpos, length[1] + 800);
    ctx.stroke();

    markerPos.forEach((x, y, z) => {
        if (x[0] <= (comboes + 1) * comboes / 2 + erased.length) ctx.fillStyle = "#ffffdd"
        else ctx.fillStyle = "#666666"
        ctx.fillRect(xpos - 25, (x[0] / (z[z.length - 1][0] + 3)) * -1600 + 795, 50, 10)
    })
}

/*
let checkTable = [
    new table("tg009yu-arrow", 0, 0, -1),
    new table("tg009yellow", 1, 0, -1),
    new table("tg009red", 2, 0, -1),
    new table("tg009yl-arrow", 0, 1, 0),
    new table("tg009gl-arrow", 1, 1, 1),
    new table("tg009gr-arrow", 2, 1, 2),
];
*/

let checkTable = [
    new table("tg001green", 0, 0, -1),
    new table("tg001yellow", 1, 0, -1),
    new table("tg001red", 2, 0, -1),
    new table("tg001arrow", 0, 1, 0),
];

panels.push(new panel("tg001arrow", 3, 3));
panels.push(new panel("tg001yellow", 4, 5));
panels.push(new panel("tg001red", 5, 8));
panels.push(new panel("tg001green", 3, 4));

panels.push(new panel("tg001green", 1, 3));
panels.push(new panel("tg001yellow", 2, 0));
panels.push(new panel("tg001red", 3, 0));
panels.push(new panel("tg001arrow", 1, 4));

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

panels.push(new panel("tg001red", 2, 13));
panels.push(new panel("tg001yellow", 1, 1));
panels.push(new panel("tg001green", 0, 2));

/*
for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        if (Math.random() * checkTable.length > 1) panels.push(new panel(checkTable[Math.floor(Math.random()*checkTable.length)].name, j, i));
    }
}
*/

// main

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawComboLev(-1000);
    processer(width, height);
    drawBoard(-900, -900, 1800 * width / height, 1800);
    requestAnimationFrame(main);
}

canvas.addEventListener("click", ()=>{
    if (erasables.length && !moving) markup();
    else if (!moving) erase();
})

canvas.addEventListener("imageLoaded", ()=>main());