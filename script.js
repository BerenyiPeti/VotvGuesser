var solutionX = 0
var solutionY = 0
var difX = 0
var difY = 0
var difficulty = "easy"

window.onload = function () {
    init(10)

};

function init(cols) {
    buildMap(cols)

}

function buildMap(cols) {
    let grid = document.getElementById("grid")
    grid.innerHTML = ''
    grid.style.setProperty('--cols', cols)

    for (let index = 0; index < cols * cols; index++) {
        let x = index % cols
        let y = Math.floor(index / cols)

        let cell = document.createElement("div")
        cell.className = "cell";
        cell.id = `c${index}`
        cell.dataset.x = x
        cell.dataset.y = y
        
        cell.addEventListener("click", function () {
            let x = this.dataset.x;
            let y = this.dataset.y;
            onCellSelected(x, y)
        });
        grid.appendChild(cell)
    }
}

function cellClick(cell) {
    console.log(cell.id)
}

function setDifficulity() {
    let dropdown = document.getElementById("difficulty")
    difficulty = dropdown.value
    let cols = 10
    switch (difficulty) {
        case "noob":
            cols = 2
            break;
        case "easy":
            cols = 10
            break;
        case "medium":
            cols = 20
            break;
        case "hard":
            cols = 40
            break;
        case "omega":
            cols = 80
            break;
        default:
            cols = 10
            break;
    }

    buildMap(cols)
    /* dropdown.addEventListener("change", function() {
        console.log(this.value);
        
    }) */
}

function startGame() {
    setDifficulity()
    rollPicture()
}

function onCellSelected(x, y) {
    calcScore(x, y)
    let guess = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`)

    let solution = document.querySelector(`.cell[data-x='${solutionX}'][data-y='${solutionY}']`)

    if (x == solutionX && y == solutionY) {
        guess.style.backgroundColor = "rgba(0, 255, 0, 0.5)"
    } else {
        guess.style.backgroundColor = "rgba(255, 0, 0, 0.5)"
        solution.style.backgroundColor = "rgba(0, 0, 255, 0.5)"
    }
}

function showResult() {

}

function rollPicture() {
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    document.getElementById("find").innerHTML = `Find: X:${x} Y:${y}`
    solutionX = x
    solutionY = y
}

function calcScore(x, y) {
    difX = Math.abs(solutionX - x)
    difY = Math.abs(solutionY - y)
    let distance = difX + difY
    if (difX == 1 && difY == 1) {
        distance = 1
    }

    let mult = 10

    switch (difficulty) {
        case "noob":
            mult = 100
            break;
        case "easy":
            mult = 12
            break;
        case "medium":
            mult = 8
            break;
        case "hard":
            mult = 6
            break;
        case "omega":
            mult = 4
            break;
        default:
            break;
    }
    let score = Math.max(0, 100 - distance * mult) 


    document.getElementById("score").innerHTML = `Score: ${score}`


}