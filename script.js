var solutionX = 0
var solutionY = 0
var difX = 0
var difY = 0
var difficulty = "easy"
var canSelect = false
var totalScore = 0
var round = 0
const images = [{
    "image": "../img/loc0.png",
    "solutions": {
      "noob": { "x": 1, "y": 0 },
      "easy": { "x": 5, "y": 4 },
      "medium": { "x": 10, "y": 9 },
      "hard": { "x": 20, "y": 19 },
      "omega": { "x": 41, "y": 38 }
    }
  },
  {
    "image": "../img/loc1.png",
    "solutions": {
      "noob": { "x": 1, "y": 0 },
      "easy": { "x": 6, "y": 4 },
      "medium": { "x": 13, "y": 9 },
      "hard": { "x": 26, "y": 19 },
      "omega": { "x": 53, "y": 39 }
    }
  },
  {
    "image": "../img/loc2.png",
    "solutions": {
      "noob": { "x": 0, "y": 1 },
      "easy": { "x": 3, "y": 6 },
      "medium": { "x": 6, "y": 13 },
      "hard": { "x": 13, "y": 27 },
      "omega": { "x": 27, "y": 55 }
    }
  },
  {
    "image": "../img/loc3.png",
    "solutions": {
      "noob": { "x": 0, "y": 1 },
      "easy": { "x": 4, "y": 8 },
      "medium": { "x": 9, "y": 16 },
      "hard": { "x": 19, "y": 33 },
      "omega": { "x": 39, "y": 66 }
    }
  },
  {
    "image": "../img/loc4.png",
    "solutions": {
      "noob": { "x": 1, "y": 1 },
      "easy": { "x": 8, "y": 8 },
      "medium": { "x": 16, "y": 16 },
      "hard": { "x": 32, "y": 33 },
      "omega": { "x": 65, "y": 67 }
    }
  },
  {
    "image": "../img/loc5.png",
    "solutions": {
      "noob": { "x": 1, "y": 1 },
      "easy": { "x": 9, "y": 9 },
      "medium": { "x": 19, "y": 18 },
      "hard": { "x": 38, "y": 37 },
      "omega": { "x": 76, "y": 74 }
    }
  },
  {
    "image": "../img/loc6.png",
    "solutions": {
      "noob": { "x": 0, "y": 0 },
      "easy": { "x": 2, "y": 2 },
      "medium": { "x": 4, "y": 5 },
      "hard": { "x": 9, "y": 10 },
      "omega": { "x": 19, "y": 20 }
    }
  }]
var locations = []

window.onload = function () {
    init()

};

function init() {
    buildMap()
    document.getElementById("difficulty").addEventListener("change", function () {
        buildMap()
    })
    //fetchPictures()
}

function buildMap() {
    let cols = setDifficulity()
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

    return cols

    /* dropdown.addEventListener("change", function() {
        console.log(this.value);
        
    }) */
}

function startGame() {
    locations = [...images]
    
    round = 0
    totalScore = 0
    showResult()
    nextRound()
    document.getElementById("nextBtn").disabled = true
}

function nextRound() {
    canSelect = true
    buildMap()
    rollPicture()
    round++
    document.getElementById("round").innerHTML = `Round: ${round}/5`
    document.getElementById("difficulty").disabled = true
    document.getElementById("nextBtn").disabled = true
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
    if (round < 5) {
        document.getElementById("nextBtn").disabled = false

    } else {
        document.getElementById("difficulty").disabled = false
    }



}

function showResult() {
    document.getElementById("score").innerHTML = `Score: ${totalScore}`
}

function fetchPictures() {
    fetch("images.json")
        .then(res => res.json())
        .then(json => {
            json.forEach(entry => {
                images.push(entry); // vagy ha csak pl. a medium koordináták kellenek:
                // allData.push(entry.solutions.medium);
            });

            
        });

}

function rollPicture() {
    let index = Math.floor(Math.random() * locations.length);
    let solution = locations[index].solutions
    
    
        
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
    
    let route = locations[index].image
    
    document.getElementById("image").src = route
    locations.splice(index, 1)
    
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

    totalScore += score
    showResult()
}