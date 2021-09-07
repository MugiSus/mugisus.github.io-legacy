const height = 20, width = 20;
const container = document.getElementById("box-container");
let fullmap, result;
[...new Array(height * width).keys()].forEach(i => {
    container.appendChild(Object.assign(document.createElement("span"), {className: "box"}));
    if (i % width == width - 1) container.appendChild(document.createElement("br"));
});

const tetriminoFactor_I = [[-0.1, -0.4, -0.1], [-0.3, 2, -0.3], [-0.5, 2, -0.5], [-0.5, 2, -0.5], [-0.3, 2, -0.3], [-0.1, -0.4, -0.1]];
const tetriminoFactor_Z = [[0, -0.3, -0.3, -0.1, 0], [-0.5, 2, 2, -1, -0.1], [-0.1, -1, 2, 2, -0.5], [0, -0.1, -0.3, -0.3, 0]];

let evaluate =(index, factor)=> {
    let result = 0;
    factor.forEach((value, y) => value.forEach((value, x) => {
        result += value * (fullmap[index + x + y * width] ?? 0);
    }));
    return result;
}

function randomize() {
    fullmap = new Array(height * width).fill(0).map(_ => Math.random());
    fullmap.forEach((value, index) => container.getElementsByTagName("span")[index].style.backgroundColor = `hsl(0, 0%, ${10 + value * 80}%)`);
}

function color() {
    result = [...fullmap.keys()].map(i => evaluate(i + -1 + width * -1, tetriminoFactor_Z))
    fullmap.forEach((value, index) => container.getElementsByTagName("span")[index].style.backgroundColor = `hsl(120, ${(result[index] / 4) * 100}%, ${10 + value * 80}%)`);
}

randomize();