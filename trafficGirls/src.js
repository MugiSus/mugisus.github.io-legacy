document.title = "Traffic Girls";

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
let board = new Array(height).fill(0).map(()=>new Array(width).fill("empty"));
let erasables = [[1,1],[2,1],[3,1],[1,2]];

let drawBoard =(data, x, y, w, h)=> {
    let chipSize = Math.min(w / data[0].length, h / data.length);
    ctx.lineWidth = 25;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#343434";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            ctx.save();
            ctx.translate(x + (j + 0.5) * chipSize, y + (i + 0.5) * chipSize);
            if (data[i][j] == "empty") {
                ctx.beginPath();
                ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
                ctx.stroke(pathData.roundSquere);
            } else {
                let erasable = erasables.some(x => x[0] == j && x[1] == i);
                ctx.globalAlpha = erasable ? 1 : 0.4;
                ctx.image(data[i][j], -0.475 * chipSize, -0.475 * chipSize, chipSize * 0.95, chipSize * 0.95);
                if (erasable) {
                    ctx.strokeStyle = "#ffff44";
                    ctx.globalAlpha = Math.sin(new Date().getTime() % 1000 / 1000 * Math.PI * 2) * 0.4 + 0.4
                    ctx.scale(chipSize / 200 * 0.85, chipSize / 200 * 0.85);
                    ctx.stroke(pathData.roundSquere);
                    ctx.strokeStyle = "#343434";
                }
            }
            ctx.restore();
        }
    }
}

let process =()=>{ 
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            
        }
    }
}

board[1][1] = "tg001green";
board[1][2] = "tg001yellow";
board[1][3] = "tg001red";
board[2][1] = "tg001arrow";

board[5][5] = "tg001green";

board[5][7] = "tg001red";
board[6][5] = "tg001arrow";

board[10][4] = "tg001yellow";
board[10][5] = "tg001red";

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawBoard(board, -900, -900, 1800 * width / height, 1800);
    requestAnimationFrame(main);
}

canvas.addEventListener("imageLoaded", ()=>main());