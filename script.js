var solutionX = 0
var solutionY = 0
var difX = 0
var difY = 0
var difficulty = "easy"
var canSelect = false
var totalScore = 0
var bestScore = 0
var round = 0
const locations = []
var locationsTemp = []

window.onload = function () {
    init()
};

function init() {
    /* buildMap()
    get("id", "difficulty").addEventListener("change", function () {
        buildMap()
    }) */
    fetchPictures()

}

function get(selector, name) {
    let value
    switch (selector) {
        case "id":
            value = document.getElementById(name)
            break;
        case "query":
            value = document.querySelector(name)
            break;
        case "queryAll":
            value = document.querySelectorAll(name)
            break;
        case "class":
            value = document.getElementsByClassName(name)
            break;
        default:
            value = document.getElementById(name)
            break;
    }

    return value

}

function buildMap() {
    let cols = setDifficulty()
    let grid = document.getElementById("grid")

    if (grid) {
        grid.innerHTML = ''

    }
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
            if (canSelect) {
                let x = this.dataset.x;
                let y = this.dataset.y;
                onCellSelected(x, y)
            }
        });
        grid.appendChild(cell)
    }
}

//returns cols
function setDifficulty() {
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

    return cols

    /* dropdown.addEventListener("change", function() {
        console.log(this.value);
        
    }) */
}

function startGame() {
    locationsTemp = [...locations]
    //buildMap()
    refreshScore()
    nextRound()
    toggleMenu()
    //toggleEndscreen()
    //get("id", "nextBtn").textContent = "Next Round"
}

function reset() {
    round = 0
    totalScore = 0
    bestScore = 0
    get("query", "body").classList.remove("menu-up")
    get("id", "nextBtn").textContent = "Next Round"
    toggleEndscreen()
    startGame()
}

function toggleMenu() {
    document.getElementById("main").style.display = "flex"
    document.getElementById("menu").style.display = "none"
}

function toggleEndscreen() {
    get("id", "results").style.display = "none"
    get("query", ".blur-black").style.display = "none"
}
function nextRound() {
    refreshScore()
    if (round < 5) {
        round++
        canSelect = true
        buildMap()
        rollPicture()
        document.getElementById("round").innerHTML = `Round: ${round}/5`
        document.getElementById("difficulty").disabled = true
        document.getElementById("nextBtn").disabled = true
        if (round >= 5) {
            get("id", "nextBtn").textContent = "Finish"
        }
    } else {
        gameOver()
    }


}

function exit(btn) {
    if (btn.dataset.confirm == "false") {
        btn.textContent = "Are you sure?"
        btn.dataset.confirm = "true"
        setTimeout(() => {
            btn.textContent = "Back to menu"
            btn.dataset.confirm = "false"
        }, 3000)
    } else {
        location.reload()
    }
}

function onCellSelected(x, y) {
    calcScore(x, y)
    let guess = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`)

    let solution = document.querySelector(`.cell[data-x='${solutionX}'][data-y='${solutionY}']`)

    guess.classList.add("highlighted")
    solution.classList.add("highlighted")


    if (x == solutionX && y == solutionY) {
        guess.style.backgroundColor = "rgba(0, 255, 0, 0.5)"
    } else {
        guess.style.backgroundColor = "rgba(255, 0, 0, 0.5)"
        solution.style.backgroundColor = "rgba(0, 0, 255, 0.5)"
    }

    canSelect = false

    /* 
    if (round <= 5) {
        document.getElementById("nextBtn").disabled = false
    } else {
        get("id", "nextBtn").textContent = "Finish"
    } */
    document.getElementById("nextBtn").disabled = false
    /* if (round >= 5) {
        gameOver()

    } */




}

function gameOver() {
    showResults()
    window.scrollTo({ top: 0, behavior: "smooth" });

}

function showResults() {
    get("id", "results").style.display = "flex"
    get("query", ".blur-black").style.display = "flex"
    get("query", "body").classList.add("menu-up")
    get("id", "result-score").textContent = `Total Score: ${totalScore}`
    get("id", "result-best").textContent = `Best Score: ${bestScore}`


}

function refreshScore(score = 0) {
    document.getElementById("score").textContent = `Score: ${score}`
}

function fetchPictures() {
    fetch("images.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(element => {
                locations.push(element)
            });
        })
        .catch((err) => console.log("hiba", err))


}

function rollPicture() {
    console.log(locationsTemp);
    let index = Math.floor(Math.random() * locationsTemp.length);
    let solution = locationsTemp[index].solutions



    solutionX = 0
    solutionY = 0
    switch (difficulty) {
        case "noob":
            solutionX = solution["noob"].x
            solutionY = solution["noob"].y
            break;
        case "easy":
            solutionX = solution["easy"].x
            solutionY = solution["easy"].y
            break;
        case "medium":
            solutionX = solution["medium"].x
            solutionY = solution["medium"].y
            break;
        case "hard":
            solutionX = solution["hard"].x
            solutionY = solution["hard"].y
            break;
        case "omega":
            solutionX = solution["omega"].x
            solutionY = solution["omega"].y
            break;
        default:
            solutionX = solution["easy"].x
            solutionY = solution["easy"].y
            break;
    }

    let route = locationsTemp[index].image

    document.getElementById("image").src = route
    locationsTemp.splice(index, 1)

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

    if (score > bestScore) {
        bestScore = score
    }

    totalScore += score
    refreshScore(score)
}