let w = 9 * 3, h = 16 * 3, sum, checkPos = [], _checkPos = [], readed = [], all = [], _all = [], bright = [], mouseDown = false, mouseMode = 0, choosen = 0, time = 0;

all = new Array(h).fill(0).map(()=>new Array(w).fill(0));
bright = new Array(h).fill(0).map(()=>new Array(w).fill(0.1));

size = Math.min(pixelw / w, pixelh / h);

let process =()=> {
    _checkPos = checkPos.slice(0,checkPos.length);
    _all = new Array(h).fill(0).map((x,y)=>all[y].slice(0,w));
    all = new Array(h).fill(0).map(()=>new Array(w).fill(0));
    checkPos = [];
    read = [];
    _checkPos.forEach((x)=>{
        if (read.indexOf(`${x[0]}, ${x[1]}`) > -1) return;
        read.push(`${x[0]}, ${x[1]}`);
        let p = [[x[0]-1, x[1]-1], [x[0], x[1]-1], [x[0]+1, x[1]-1], [x[0]-1, x[1]], [x[0], x[1]], [x[0]+1, x[1]], [x[0]-1, x[1]+1], [x[0], x[1]+1], [x[0]+1, x[1]+1]].map(x=>[x[0] < 0 ? x[0] + w : x[0] >= w ? x[0] - w : x[0], x[1] < 0 ? x[1] + h : x[1] >= h ? x[1] - h : x[1]]);
        sum = _all[p[0][1]][p[0][0]] + _all[p[1][1]][p[1][0]] + _all[p[2][1]][p[2][0]] + _all[p[3][1]][p[3][0]] + _all[p[5][1]][p[5][0]]+ _all[p[6][1]][p[6][0]] + _all[p[7][1]][p[7][0]] + _all[p[8][1]][p[8][0]];
        if (_all[p[4][1]][p[4][0]]) edit(p[4][0], p[4][1], (sum == 2 || sum == 3) * 1);
        else if (!_all[p[4][1]][p[4][0]] && sum == 3) edit(p[4][0], p[4][1], 1);
    });
}


let edit =(x,y,i)=> {
    all[y][x] = i;
    checkPos.push([x-1,y-1]);
    checkPos.push([x,y-1]);
    checkPos.push([x+1,y-1]);
    checkPos.push([x-1,y]);
    checkPos.push([x,y]);
    checkPos.push([x+1,y]);
    checkPos.push([x-1,y+1]);
    checkPos.push([x,y+1]);
    checkPos.push([x+1,y+1]);
}

let draw =()=> {
    //ctx.fillStyle = "#ffffff"
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            ctx.fillStyle = `hsl(${(i+j)/(w+h)*360}, 100%, 80%)`
            bright[i][j] += ((all[i][j] ? 0.9 : 0.1) - bright[i][j]) / 5;
            ctx.globalAlpha = bright[i][j];
            if (Math.abs(((-w + 1) / 2 + j) * size - mouseState.x) < size / 2 && Math.abs(((-h + 1) / 2 + i) * size - mouseState.y) < size / 2) {
                ctx.globalAlpha += 0.1;
                choosen = all[i][j];
                if (mouseState.left) edit(j, i, mouseMode);
            }
            ctx.fillRect(((-w + 1) / 2 + j) * size - size * 0.4, ((-h + 1) / 2 + i) * size - size * 0.4, size * 0.8, size * 0.8);
            if (all[i][j]) ctx.fillRect(((-w + 1) / 2 + j) * size - size * 0.25, ((-h + 1) / 2 + i) * size - size * 0.25, size * 0.3, size * 0.3);
        }
    }
}

edit(10,2,1);
edit(11,3,1);
edit(11,4,1);
edit(10,4,1);
edit(9,4,1);

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    draw();
    if (!mouseDown && mouseState.left) {
        mouseMode = 1 - choosen;
        mouseDown = true;
    } else if (mouseDown && !mouseState.left) mouseDown = false;
    if (!keydown.p) time++
    if (time == 6) {process(); time = 0}
    requestAnimationFrame(main);
}

main();