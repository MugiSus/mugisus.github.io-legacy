let width = 10; height = 18;
const chipSize = pixelh / height;
let moving = false;
let comboLength = [0, 0];
let comboAlpha = 0;
let panels = [];
let erasables = [];
let erased = [];
let markers = [];
let comboes = 0;
let suggests = [];
let drugging = -1;
let druggingAt = 0;
let drugOffset = [0, 0];
let pressed = {m_right: false};
let erasing = false;
let initClock = 150;
let eraseClock = 0;
let suggestTimer = 0;
let clickLeng = 0;
let boardAlpha = new Array(height).fill(1);
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
const suggest = class {
    constructor (){
        this.name = [...arguments].slice(0,-1);
        this.positions = [...arguments].slice(-1)[0];
        this.ypos = -1000;
        let wMaxMin = [0, 0], hMaxMin = [0, 0];
        this.positions.forEach(x=>{
            wMaxMin = [Math.min(x[0], wMaxMin[0]), Math.max(x[0], wMaxMin[1])];
            hMaxMin = [Math.min(x[1], hMaxMin[0]), Math.max(x[1], hMaxMin[1])];
        });
        this.wid = Math.abs(wMaxMin[0] - wMaxMin[1]);
        this.hei = Math.abs(hMaxMin[0] - hMaxMin[1]);
        this.xpos = -750 + width * chipSize - (this.wid / 2) * chipSize;
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
    let comboLev = Object.keys(markerPos)[Object.keys(markerPos).findIndex(x => x * 1 > erased.length + (comboes + 1) * comboes / 2) - 1];
    if (!comboLev) comboLev = Object.keys(markerPos).slice(-1)[0];
    markers = [];
    erased.forEach(i => {
        markerPos[comboLev].forEach(j => {
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

let drawBoard =(x, y, chipS)=> {
    ctx.lineWidth = chipS * 0.25;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    if (erasables.length && drugging == -1 && !erasing && mouseState.x > x && mouseState.y > y && mouseState.x < x + width * chipS && mouseState.x < y + height * chipS) {
        if (mouseState.left) {
            clickLeng += 1 / 3;
            if (clickLeng >= height) erasing = true;
            else boardAlpha[height - Math.floor(clickLeng)] = 0.3;
        } else {
            boardAlpha = boardAlpha.map(x=>x + (0.1 - x) / 5);
            clickLeng = 0;
        }
    } else {
        clickLeng = 0;
        boardAlpha = boardAlpha.map(x=>x + (0.05 - x) / 10);
    }
    for (let i = 0; i < height; i++) {
        ctx.globalAlpha = boardAlpha[i];
        for (let j = 0; j < width; j++) {
            ctx.save();
            ctx.translate(x + (j + 0.5) * chipS, y + (i + 0.5) * chipS);
            
            if (drugging != -1 && (j - suggests[drugging].positions[druggingAt][0] == Math.floor((mouseState.x + drugOffset[0] + 900) / chipS) || i - suggests[drugging].positions[druggingAt][1] == Math.floor((mouseState.y + drugOffset[1] + 900) / chipS))) ctx.fillRect(-42.5, -42.5, 85, 85);

            ctx.scale(chipS / 200 * 0.85, chipS / 200 * 0.85);
            ctx.stroke(pathData.roundSquere);

            ctx.restore();
        }
    }

    panels.forEach(i => {
        let erasable = erasables.some(x=>x[0] == i.x && x[1] == i.y);
        ctx.save();
        ctx.translate(x + (i.x + 0.5) * chipS, y + (i.y + 0.5) * chipS);
        ctx.globalAlpha = erasable ? 1 : 0.4;
        ctx.image(i.name, -0.475 * chipS, -0.475 * chipS, chipS * 0.95, chipS * 0.95);
        ctx.restore();
    });

    ctx.strokeStyle = "#ffff44";
    erasables.forEach(i => {
        ctx.save();
        ctx.translate(x + (i[0] + 0.5) * chipS, y + (i[1] + 0.5) * chipS);
        ctx.scale(chipS / 200 * 0.85, chipS / 200 * 0.85);
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
        ctx.translate(x + (i[0] + 0.5) * chipS, y + (i[1] + 0.5) * chipS);
        ctx.scale(chipS / 200 * 0.85, chipS / 200 * 0.85);
        ctx.fillRect(-112.5, -112.5, 225, 225);
        ctx.restore();
    });
}

let drawComboLev =(xpos)=> {
    targetLength = [(comboes + 1) * comboes / 2, (comboes + 1) * comboes / 2 + erased.length].map(x => Math.min(1, x / (Object.keys(markerPos).slice(-1)[0] * 1 + 3)) * -1600);
    comboLength = comboLength.map((x,y) => x + (targetLength[y] - x) / 10);
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(xpos, -800);
    ctx.lineTo(xpos, 800);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 50;
    ctx.stroke();
    
    ctx.lineCap = "butt";
    ctx.globalAlpha = (comboAlpha += ((erased.length > 0) - comboAlpha) / 10) * (Math.sin(new Date().getTime() / 1000 * Math.PI * 2) * 0.25 + 0.75);
    ctx.strokeStyle = "#ffaa44";
    ctx.fillStyle = "#ffaa44";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(xpos, comboLength[0] + 800);
    ctx.lineTo(xpos, 800);
    ctx.stroke();

    ctx.strokeStyle = "#ffff44";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(xpos, comboLength[0] + 800);
    ctx.lineTo(xpos, comboLength[1] + 800);
    ctx.stroke();

    ctx.fillStyle = comboes ? "#ffaa44" : "#ffff44";
    ctx.beginPath();
    ctx.arc(xpos, 800, 15, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = "#ffff44";
    ctx.beginPath();
    ctx.arc(xpos, comboLength[1] + 800, 15, 0, Math.PI, true);
    ctx.fill();

    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 7.5
    ctx.beginPath();
    ctx.moveTo(xpos - 5, 802.5);
    ctx.lineTo(xpos - 5, comboLength[1] + 797.5);
    ctx.stroke();

    ctx.globalAlpha = 1;
    Object.keys(markerPos).forEach((x, y, z) => {
        if (x * 1 <= (comboes + 1) * comboes / 2 + erased.length) ctx.fillStyle = "#ffffdd";
        else ctx.fillStyle = "#666666";
        ctx.fillRect(xpos - 25, x * 1 / (z.slice(-1)[0] * 1 + 1) * -1600 + 797.5, 50, 5);
    });

    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff33";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(xpos - 12.5, 805);
    ctx.lineTo(xpos - 12.5, -805);
    ctx.stroke();
};

let drawsuggests =(suggestsX, chipS)=> {
    let stack = 0;
    let grab = false;

    suggests.forEach((x,y)=>{
        let focused = 0;
        if (!erasing) x.name.some((w,z) => focused = (Math.abs(x.xpos + x.positions[z][0] * chipS - mouseState.x) < chipS / 2 && Math.abs(x.ypos + x.positions[z][1] * chipS - mouseState.y) < chipS / 2) * (z + 1));
        if (focused) grab = true;

        if (!erasing && focused && mouseState.left && drugging == -1 || drugging == y) {
            if (mouseState.left) {
                if (drugging != y) {
                    drugging = y;
                    druggingAt = focused - 1;
                    drugOffset = [x.xpos - mouseState.x, x.ypos - mouseState.y];
                }
                if (mouseState.right && !pressed.m_right) {
                    suggests[y].positions = x.positions.map(w => {return [w[1] - x.positions[druggingAt][1] + x.positions[druggingAt][0], -(w[0] - x.positions[druggingAt][0]) + x.positions[druggingAt][1]]});
                    pressed.m_right = true;
                } else if (!mouseState.right) pressed.m_right = false;
                x.xpos = mouseState.x + drugOffset[0];
                x.ypos = mouseState.y + drugOffset[1];
            } else {
                drugging = -1;
                let pos = {x: Math.floor((x.xpos + 900) / chipS), y: Math.floor((x.ypos + 900) / chipS)};
                if (!x.name.some((u, v) => panels.some(w => w.x == pos.x + x.positions[v][0] && w.y == pos.y + x.positions[v][1]) || !(pos.x + x.positions[v][0] >= 0 && pos.x + x.positions[v][0] < width && pos.y + x.positions[v][1] >= 0 && pos.y + x.positions[v][1] < height))) {
                    x.name.forEach((w, z)=>panels.push(new panel(w, pos.x + x.positions[z][0], pos.y + x.positions[z][1])));
                    suggests = suggests.filter((x,i)=>i!=y);
                }
            }
        } else {
            x.xpos += (suggestsX - chipS * (x.wid / 2) - x.xpos) / 10;
            x.ypos += (800 + chipS * (-stack - x.hei) - x.ypos) / 10;
        }

        ctx.globalAlpha = drugging == y || (drugging == -1 && focused) ? 1 : 0.5;

        x.name.forEach((w,z)=>{
            ctx.save();
            ctx.translate(x.xpos + x.positions[z][0] * chipS, x.ypos + x.positions[z][1] * chipS + Math.sin(new Date().getTime() / 500 + y * 50) * chipS / 10);
            ctx.image(w, -0.475 * chipS, -0.475 * chipS, chipS * 0.95, chipS * 0.95);
            ctx.restore();
        });

        stack += x.hei + 1.5;
    });

    if (drugging != -1) canvas.style.cursor = "grabbing";
    else if (grab) canvas.style.cursor = "grab";
    else canvas.style.cursor = "default";
};

let manageEraser =()=> {
    if (erasing) {
        eraseClock++;
        if (eraseClock <= 0) boardAlpha[eraseClock + height - 1] = 1;
        if (eraseClock % 60 == 0) {
            if (erasables.length) markup();
            else {
                erase();
                erasing = false;
            }
        }
    } else eraseClock = -height;
}

let manageSuggest =()=> {
    if (initClock) {
        initClock--;
        if (initClock % 3 == 0) {
            panels.push(new panel(checkTable[Math.floor(Math.random()*checkTable.length)].name, (width - 1) - ((initClock / 3) % width), 0));
        }
    } else {
        if (!erasing && incleaseSec[suggests.length]) suggestTimer += (1 / 60) / incleaseSec[suggests.length];
        if (suggestTimer > 1) {
            if (Math.random() > 0.66) suggests.push(new suggest(checkTable[Math.floor(Math.random()*checkTable.length)].name, checkTable[Math.floor(Math.random()*checkTable.length)].name, checkTable[Math.floor(Math.random()*checkTable.length)].name, [[0,0],[0,1],[1,0]]));
            else suggests.push(new suggest(checkTable[Math.floor(Math.random()*checkTable.length)].name, checkTable[Math.floor(Math.random()*checkTable.length)].name, [[0,0],[0,1]]));
            suggestTimer -= 1;
        }
    }
}

let drawGirl =(girlName, realName)=> {
    let sizes = [
        1600,
        img[girlName].width * (1600 / img[girlName].height),
        img[realName].height * (img[girlName].width * (1600 / img[girlName].height) / img[realName].width)
    ]
    ctx.globalAlpha = 1;
    ctx.image(girlName, 500, -750 + Math.cos(new Date().getTime() / 500) * -15, sizes[1], sizes[0]);
    ctx.globalAlpha = 0.8 + Math.sin(new Date().getTime() / 500) * 0.2;
    ctx.image(realName, 500, 350 + Math.sin(new Date().getTime() / 500) * -25, sizes[1], sizes[2]);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#dddddd";
    ctx.strokeRect(500, 350 + Math.sin(new Date().getTime() / 500) * -25, sizes[1], sizes[2])
    ctx.moveTo(500 + sizes[1] / 2, 350 + sizes[2] / 2 + Math.sin(new Date().getTime() / 500) * -25, Math.min(sizes[1], sizes[2]) / 2);
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.15;
    ctx.arc(500 + sizes[1] / 2, 350 + sizes[2] / 2 + Math.sin(new Date().getTime() / 500) * -25, Math.min(sizes[1], sizes[2]) / 2, Math.PI / -2, Math.PI * (2 * suggestTimer - 0.5));
    ctx.closePath();
    ctx.fill();
}

//for (let i = 0; i < 7; i++) suggests.push(new suggest(checkTable[Math.floor(Math.random()*checkTable.length)].name, checkTable[Math.floor(Math.random()*checkTable.length)].name, checkTable[Math.floor(Math.random()*checkTable.length)].name, [[0,0],[0,1],[1,0]]));

// main

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    manageEraser();
    manageSuggest();
    drawComboLev(-1000);
    processer(width, height);
    drawBoard(-900, -900, chipSize);
    drawsuggests(-750 + width * chipSize, chipSize);
    drawGirl(stageData.girl, stageData.real);
    requestAnimationFrame(main);
}
/*
canvas.addEventListener("mousedown", (event)=>{
    if (!moving) {
        if (event.button == 2) {
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (Math.random() * checkTable.length > 1 && !panels.some(x=> x.x == j && x.y == i)) panels.push(new panel(checkTable[Math.floor(Math.random()*checkTable.length)].name, j, i));
                }
            }
        } else if (erasables.length) markup();
        else erase();
    }
})
*/
canvas.addEventListener("imageLoaded", ()=>main());