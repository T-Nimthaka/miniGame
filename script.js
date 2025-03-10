let jumpSound = new Audio("jump.mp3");
let deadSound = new Audio("dead.mp3");
let runSound = new Audio("run.mp3");

var score = 0;
var runImage = 1;
var runworker = 0;
var jumpImage = 1;
var jumpWorker = 0;
var deadImage = 1;
var deadWorker = 0;

function controller(event) {
    if (event.key === "Enter") {
        if (runworker === 0) {
            run();
            createObstacle(); // Start obstacles only when game starts
        }
    }
    if (event.code === "Space") {
        if (jumpWorker === 0 && deadWorker === 0) {
            clearInterval(runworker);
            runworker = 0;
            jump();
        }
    }
}

function run() {
    runSound.play();
    runworker = setInterval(() => {
        runSound.play();
        runImage++;
        if (runImage === 9) {
            runImage = 1;
        }
        document.getElementById("boy").src = "run" + runImage + ".png";
        checkCollision();
    }, 150);
}

function jump() {
    jumpSound.play();
    jumpWorker = setInterval(() => {
        jumpImage++;
        document.getElementById("boy").style.marginTop = "250px"; // Jump Up
        if (jumpImage > 6) {
            document.getElementById("boy").style.marginTop = "357px"; // Come Down
        }
        if (jumpImage === 13) {
            jumpImage = 1;
            clearInterval(jumpWorker);
            jumpWorker = 0;
            run();
        }
        document.getElementById("boy").src = "jump" + jumpImage + ".png";
        checkCollision();
    }, 150);
}

function dead() {
    deadSound.play();
    deadWorker = setInterval(() => {
        deadImage++;
        if (deadImage === 11) {
            clearInterval(deadWorker);
            deadWorker = 0;
            alert("Game Over! Score: " + score);
            location.reload();
        }
        document.getElementById("boy").src = "dead" + deadImage + ".png";
    }, 150);
}

function createObstacle() {
    setInterval(() => {
        let obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        document.getElementById("background").appendChild(obstacle);

        let obstacleInterval = setInterval(() => {
            let obstacleRect = obstacle.getBoundingClientRect();

            if (obstacleRect.left < 0) {
                clearInterval(obstacleInterval);
                obstacle.remove();
            }
        }, 50);
    }, 3000);
}

function checkCollision() {
    let boy = document.getElementById("boy");
    let obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach(obstacle => {
        let boyRect = boy.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();

        if (
            boyRect.x + boyRect.width > obstacleRect.x &&
            boyRect.x < obstacleRect.x + obstacleRect.width &&
            boyRect.y + boyRect.height > obstacleRect.y &&
            boyRect.y < obstacleRect.y + obstacleRect.height
        ) {
            if (jumpWorker === 0) {
                clearInterval(runworker);
                clearInterval(jumpWorker);
                runworker = 0;
                jumpWorker = 0;
                dead();
            }
            else {
                score++ ; // Only increase when obstacle passes the player
                document.getElementById("score").innerHTML = score;
                obstacle.dataset.passed = "true";
            }
        }
    });
}
