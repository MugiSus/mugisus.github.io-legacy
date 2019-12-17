document.title = "Traffic Girls";

width = 10; height = 10;

let board = new Array(height).fill(0).map(()=>new Array(width).fill("empty"));

let drawBoard =(data, x, y, w, h)=> {
    let chipw = w / data[0].length;
    let chiph = h / data.length;
    ctx.fillStyle = "#404040";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] == "empty") ctx.fillRect(x + (j + 0.025) * chipw, y + (i + 0.025) * chiph, chipw * 0.95, chiph * 0.95);
            else ctx.image(img[data[i][j]], x + (j + 0.025) * chipw, y + (i + 0.025) * chiph, chipw * 0.95, chiph * 0.95, 0.5, 0.5, Math.PI * 0.5);
        }
    }
}

canvas.addEventListener("imageLoaded", ()=>main());

board[1][1] = "tg001green";
board[1][2] = "tg001yellow";
board[1][3] = "tg001red";
board[2][1] = "tg001arrow";

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawBoard(board, -900, -900, 1800, 1800);
    requestAnimationFrame(main);
}