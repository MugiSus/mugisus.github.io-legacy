let w = 9 * 3, h = 16 * 3, sum, checkPos = [], _checkPos = [], added = [], all = [], _all = [], bright = [], pressed = {n:-1}, mouseMode = 0, choosen = 0, time = 0, paused = true, chars = {}, light = [];

all = new Array(h).fill(0).map(()=>new Array(w).fill(0));
bright = new Array(h).fill(0).map(()=>new Array(w).fill(0.1));

size = Math.min(pixelw / w, pixelh / h);

let process =()=> {
    added = [];
    _checkPos = checkPos.slice(0,checkPos.length);
    _all = new Array(h).fill(0).map((x,y)=>all[y].slice(0,w));
    all = new Array(h).fill(0).map(()=>new Array(w).fill(0));
    checkPos = [];
    _checkPos.forEach((x)=>{
        let p = [[x[0]-1, x[1]-1], [x[0], x[1]-1], [x[0]+1, x[1]-1], [x[0]-1, x[1]], [x[0], x[1]], [x[0]+1, x[1]], [x[0]-1, x[1]+1], [x[0], x[1]+1], [x[0]+1, x[1]+1]].map(x=>[x[0] < 0 ? x[0] + w : x[0] >= w ? x[0] - w : x[0], x[1] < 0 ? x[1] + h : x[1] >= h ? x[1] - h : x[1]]);
        sum = _all[p[0][1]][p[0][0]] + _all[p[1][1]][p[1][0]] + _all[p[2][1]][p[2][0]] + _all[p[3][1]][p[3][0]] + _all[p[5][1]][p[5][0]]+ _all[p[6][1]][p[6][0]] + _all[p[7][1]][p[7][0]] + _all[p[8][1]][p[8][0]];
        if (_all[p[4][1]][p[4][0]]) edit(p[4][0], p[4][1], (sum == 2 || sum == 3) * 1);
        else if (!_all[p[4][1]][p[4][0]] && sum == 3) edit(p[4][0], p[4][1], 1);
    });
}

let edit =(x,y,i)=> {
    all[y][x] = i;
    if (added.indexOf(`${x-1},${y-1}`) < 0) checkPos.push([x-1,y-1]);
    if (added.indexOf(`${x},${y-1}`) < 0) checkPos.push([x,y-1]);
    if (added.indexOf(`${x+1},${y-1}`) < 0) checkPos.push([x+1,y-1]);
    if (added.indexOf(`${x-1},${y}`) < 0) checkPos.push([x-1,y]);
    if (added.indexOf(`${x},${y}`) < 0) checkPos.push([x,y]);
    if (added.indexOf(`${x+1},${y}`) < 0) checkPos.push([x+1,y]);
    if (added.indexOf(`${x-1},${y+1}`) < 0) checkPos.push([x-1,y+1]);
    if (added.indexOf(`${x},${y+1}`) < 0) checkPos.push([x,y+1]);
    if (added.indexOf(`${x+1},${y+1}`) < 0) checkPos.push([x+1,y+1]);
    added.push(`${x-1},${y-1}`, `${x},${y-1}`, `${x+1},${y-1}`, `${x-1},${y}`, `${x},${y}`, `${x+1},${y}`, `${x-1},${y+1}`, `${x},${y+1}`, `${x+1},${y+1}`);
}

let draw =()=> {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            bright[i][j] += ((all[i][j] ? 0.9 : 0.1) - bright[i][j]) / 5;
            ctx.globalAlpha = bright[i][j];
            if (Math.abs(((-w + 1) / 2 + j) * size - mouseState.x) < size / 2 && Math.abs(((-h + 1) / 2 + i) * size - mouseState.y) < size / 2) {
                ctx.globalAlpha += 0.1;
                choosen = all[i][j];
                if (mouseState.left && all[i][j] != mouseMode) edit(j, i, mouseMode);
            }
            if (light.indexOf(`${j},${i}`) > -1) ctx.globalAlpha += 0.05;
            let pos = {x:((-w + 1) / 2 + j) * size, y:((-h + 1) / 2 + i) * size};
            if (all[i][j]) {
                ctx.fillStyle = `hsl(${(i+j)/(w+h)*360}, 100%, 80%)`;
                ctx.fillRect(pos.x - size * 0.325, pos.y - size * 0.325, size * 0.65, size * 0.65);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(pos.x - size * 0.225, pos.y - size * 0.225, size * 0.225, size * 0.225);
            } else {
                ctx.fillStyle = `hsl(${(i+j)/(w+h)*360}, 100%, 80%)`;
                ctx.fillRect(pos.x - size * 0.45, pos.y - size * 0.45, size * 0.9, size * 0.9);
            }
        }
    }
    light = [];
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    if (!pressed.left && mouseState.left) {
        mouseMode = 1 - choosen;
        pressed.left = true;
    } else if (pressed.left && !mouseState.left) pressed.left = false;
    if (!pressed.p && keydown.p) {
        paused = !paused;
        pressed.p = true;
    } if (pressed.p && !keydown.p) pressed.p = false;
    if (paused) {
        if (keydown.n) {
            if (pressed.n == -1) {pressed.n = 30; process();}
            if (pressed.n-- == 0) {pressed.n = 1; process();}
            charLightUp(w - 6, 1, "frame");
        } else {
            pressed.n = -1;
            charLightUp(w - 6, 1, "pause");
        }
    } else charLightUp(w - 6, 1, "play");
    if (!paused && time++ == 6) {process(); time = 0}
    getFPS();
    //console.log(fps_fps)
    charLightUp(1, 1, Math.floor(fps_fps/10));
    charLightUp(5, 1, fps_fps%10);
    draw();
    requestAnimationFrame(main);
}

chars = {
    0: "111/101/101/101/111",
    1: "010/010/010/010/010",
    2: "111/001/111/100/111",
    3: "111/001/111/001/111",
    4: "101/101/111/001/001",
    5: "111/100/111/001/111",
    6: "111/100/111/101/111",
    7: "111/001/001/001/001",
    8: "111/101/111/101/111",
    9: "111/101/111/001/111",
    play: "01000/01100/01110/01100/01000/",
    pause: "11011/11011/11011/11011/11011/",
    frame: "10100/10110/10111/10110/10100/"
};

Object.keys(chars).forEach(y=>{
    let n = [];
    chars[y] = chars[y].split("/").map((x,i)=>x.split("").forEach((x,j)=>{if(x==1)n.push([j,i]);}))
    chars[y] = n;
});

let charLightUp =(x, y, name)=> chars[name].forEach(z=>light.push(`${z[0]+x},${z[1]+y}`));

//=========================
`









G G G   A A   M   M  E E E

G      A   A  MM MM  E

G   G  AA AA  M M M  E EE

G   G  A   A  M   M  E

G G G  A   A  M   M  E E E

       
                ff
              f

        oo o  f ff

        o  o  f

        oo o  f


L      I I I  F F F  E E E

L        I    F      E

L        I    F FF   E EE

L        I    F      E

L L L  I I I  F      E E E









`.split("\n").slice(1).forEach((x,i)=>x.split("").forEach((x,j)=>{if(x!=" ")edit(j,i,1)}));

main();

setTimeout(()=>paused=false, 1000);