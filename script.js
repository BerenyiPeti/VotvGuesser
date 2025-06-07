const gameState = {
    solutionX: 0,
    solutionY: 0,
    difficulty: "medium",
    canSelect: false,
    totalScore: 0,
    bestScore: 0,
    round: 0,
}

const DOM = {
    //cells: Array.from(document.getElementsByClassName("cell")),
    difficulty: document.getElementById("difficulty"),
    score: document.getElementById("score"),
    nextBtn: document.getElementById("nextBtn"),
    grid: document.getElementById("grid"),
    main: document.getElementById("main"),
    menu: document.getElementById("menu"),
    results: document.getElementById("results"),
}

const locations = []
let locationsTemp = []

window.onload = function () {
    init()
};

function init() {
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
            if (gameState.canSelect) {
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
    let difficulty = DOM.difficulty.value
    gameState.difficulty = difficulty
    
    
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
}

function startGame() {
    locationsTemp = [...locations]
    buildMap()
    nextRound()
    closeMenu()
}

function reset() {
    gameState.round = 0
    gameState.totalScore = 0
    gameState.bestScore = 0
    get("query", "body").classList.remove("menu-up")
    gameState.nextBtn.textContent = "Next Round"
    closeEndscreen()
    startGame()
}

function closeMenu() {
    DOM.main.style.display = "flex"
    DOM.menu.style.display = "none"
}

function closeEndscreen() {
    get("id", "results").style.display = "none"
    get("query", ".blur-black").style.display = "none"
}
function nextRound() {
    refreshScore()
    let cells = Array.from(document.getElementsByClassName("cell"))
    let round = gameState.round
    
    if (round > 0) {
        cells.forEach(cell => {
            if (cell.classList.contains("highlighted")) {
                cell.classList.remove("highlighted")
                cell.classList.remove("guessRight")
                cell.classList.remove("guessWrong")
                cell.classList.remove("solution")
            }
        });
    }
    if (round < 5) {
        gameState.round++
        gameState.canSelect = true
        rollPicture()
        document.getElementById("round").innerHTML = `Round: ${round}/5`
        DOM.nextBtn.disabled = true
        if (round >= 5) {
            DOM.nextBtn.textContent = "Finish"
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

    let solution = document.querySelector(`.cell[data-x='${gameState.solutionX}'][data-y='${gameState.solutionY}']`)
    
    guess.classList.add("highlighted")
    solution.classList.add("highlighted")


    if (x == gameState.solutionX && y == gameState.solutionY) {
        guess.classList.add("guessRight")
    } else {
        guess.classList.add("guessWrong")
        solution.classList.add("solution")
    }

    gameState.canSelect = false
    DOM.nextBtn.disabled = false




}

function gameOver() {
    showResults()
    window.scrollTo({ top: 0, behavior: "smooth" });

}

function showResults() {
    DOM.results.style.display = "flex"
    get("query", ".blur-black").style.display = "flex"
    get("query", "body").classList.add("menu-up")
    get("id", "result-score").textContent = `Total Score: ${gameState.totalScore}`
    get("id", "result-best").textContent = `Best Score: ${gameState.bestScore}`


}

function refreshScore(score = 0) {
    DOM.score.textContent = `Score: ${score}`
}

function fetchPictures() {
    fetch("images.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(element => {
                locations.push(element)
            });
        })
        .catch((err) => console.log("error", err))


}

function rollPicture() {
    let index = Math.floor(Math.random() * locationsTemp.length);
    let solution = locationsTemp[index].solutions
    
    gameState.solutionX = 0
    gameState.solutionY = 0
    
    switch (gameState.difficulty) {
        case "noob":
            gameState.solutionX = solution["noob"].x
            gameState.solutionY = solution["noob"].y
            break;
        case "easy":
            gameState.solutionX = solution["easy"].x
            gameState.solutionY = solution["easy"].y
            break;
        case "medium":
            gameState.solutionX = solution["medium"].x
            gameState.solutionY = solution["medium"].y
            break;
        case "hard":
            gameState.solutionX = solution["hard"].x
            gameState.solutionY = solution["hard"].y
            break;
        case "omega":
            gameState.solutionX = solution["omega"].x
            gameState.solutionY = solution["omega"].y
            break;
        default:
            gameState.solutionX = solution["easy"].x
            gameState.solutionY = solution["easy"].y
            break;
    }

    
    let route = locationsTemp[index].image

    document.getElementById("image").src = route
    locationsTemp.splice(index, 1)

}

function calcScore(x, y) {
    
    let dX = Math.abs(gameState.solutionX - x)
    let dY = Math.abs(gameState.solutionY - y)
    let distance = dX + dY
    if (dX == 1 && dY == 1) {
        distance = 1
    }

    const mults = {
        noob: 100,
        easy: 12,
        medium: 8,
        hard: 6,
        omega: 4
    }

    /* switch (difficulty) {
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
    } */

    let score = Math.max(0, 100 - distance * mults[gameState.difficulty])

    if (score > gameState.bestScore) {
        gameState.bestScore = score
    }

    gameState.totalScore += score
    refreshScore(score)
}