document.title = "Traffic Girls";

width = 10; height = 18;

let board = new Array(height).fill(0).map(()=>new Array(width).fill("empty"));

let drawBoard =(data, x, y, w, h)=> {
    let chipSize = Math.min(w / data[0].length, h / data.length);
    ctx.fillStyle = "#ffffff10";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] == "empty") ctx.fillRect(x + (j + 0.025) * chipSize, y + (i + 0.025) * chipSize, chipSize * 0.95, chipSize * 0.95);
            else ctx.image(data[i][j], x + (j + 0.025) * chipSize, y + (i + 0.025) * chipSize, chipSize * 0.95, chipSize * 0.95);
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

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawBoard(board, -900, -900, 1800 * width / height, 1800);
    requestAnimationFrame(main);
}

canvas.addEventListener("imageLoaded", ()=>main());