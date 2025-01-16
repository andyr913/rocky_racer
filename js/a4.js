// Author: Andres Rosas Ortiz, 000800390
// July 15th, 2024
// JavaScript for dynamic creation and removal of svg elements, animation, and overall logic of asteroid game

// spaceship shape 1 (outer shape)
const spaceship1 = document.getElementById("spaceship1");
// spaceship shape 2 (inner shape)
const spaceship2 = document.getElementById("spaceship2");

// default spaceship starting x position
let spaceshipX = 350;

const canvasWidth = 700;
const canvasHeight = 750;

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("svg");

// default asteroid starting y position
let asteroidY = -30;
let asteroidArray = [];
let asteroidID = 0;

let starID = 0;
let starArray = [];

let explosionCount = 0;

// declaring timer objects to set function call intervals
let shipMovementTimer = null;

let asteroidCreationTimer = null;
let asteroidMovementTimer = null;

let starCreationTimer = null;
let starMovementTimer = null;

// initial game states
let gameStarted = false;
let gameNotOver = true;

// game difficulty buttons
const easyBtn = document.getElementById("easy");
const normalBtn = document.getElementById("normal");
const hardBtn = document.getElementById("hard");

let currentDifficulty = "";

let score = 0;
let scoreObject = null;

/**
 * Starts the game, removes text.
 */
function startGame() {
    // removing starting messages from document
    let messages = document.getElementById("messages");
    svg.removeChild(messages);

    // displaying score
    scoreObject = document.getElementById("scorecontainer");
    scoreObject.innerHTML = "<p id = 'score'><strong>Score: " + score + "</strong></p>";
    
    // event listener for left and right keys to move spaceship
    window.addEventListener("keydown", moveShip);
}

/**
 * Moves spaceship from left to right with left and right arrow keys.
 */
function moveShip() {
    // default speed for easy and normal difficulties
    let moveSpeed = 10;

    // speed for hard difficulty
    if (currentDifficulty === "hard") {
        moveSpeed = 25;
    }

    // left arrow event condition
    if (event.key === "ArrowLeft" && spaceshipX >= 40) {
        // updating x coordinate and adjusting spaceship points based on spaceshipX
        spaceshipX -= moveSpeed;
        spaceship1.setAttribute("points", `${spaceshipX},650 ${spaceshipX - 20},670 ${spaceshipX - 20},710 ${spaceshipX},690 ${spaceshipX + 20},710 ${spaceshipX + 20},670`);
        spaceship2.setAttribute("points", `${spaceshipX},660 ${spaceshipX - 10},670 ${spaceshipX + 10},670`);
    }
    // right arrow event condition
    else if (event.key === "ArrowRight" && spaceshipX <= 660) {
        // updating x coordinate and adjusting points based on x
        spaceshipX += moveSpeed;
        spaceship1.setAttribute("points", `${spaceshipX},650 ${spaceshipX - 20},670 ${spaceshipX - 20},710 ${spaceshipX},690 ${spaceshipX + 20},710 ${spaceshipX + 20},670`);
        spaceship2.setAttribute("points", `${spaceshipX},660 ${spaceshipX - 10},670 ${spaceshipX + 10},670`);
    }
}

/**
 * Creates a new asteroid with SVG path element.
 */
function createAsteroid() {
    // d values for 6 asteroid shapes, retrieved from https://www.softr.io/tools/svg-shape-generator
    let dValueArray = ['M21.1,-24.3C29.2,-18.4,38.8,-13.5,42.7,-5.4C46.6,2.6,44.9,13.8,39.6,22.8C34.3,31.8,25.4,38.7,15.5,41.9C5.6,45.2,-5.3,44.9,-12.8,40C-20.3,35.2,-24.4,25.8,-29,17.1C-33.5,8.4,-38.6,0.3,-37.4,-6.6C-36.1,-13.5,-28.5,-19.2,-21.3,-25.2C-14,-31.2,-7,-37.3,-0.2,-37.1C6.5,-36.8,13.1,-30.1,21.1,-24.3Z', 'M16.9,-21.1C23.7,-14.5,32.2,-10.8,33.1,-5.8C34,-0.9,27.2,5.5,22.2,11.6C17.2,17.8,14,23.7,8.9,26.5C3.7,29.3,-3.3,29,-11.8,27.8C-20.2,26.7,-30,24.8,-29.8,19.8C-29.7,14.7,-19.7,6.5,-18.4,-3.6C-17,-13.8,-24.4,-25.8,-22.8,-33.3C-21.2,-40.9,-10.6,-43.9,-2.8,-40.6C5.1,-37.3,10.1,-27.7,16.9,-21.1Z', 'M23.5,-28.2C27.6,-24.5,26.2,-14.4,28.3,-4.7C30.4,5,35.9,14.5,33,18.8C30.2,23.1,19,22.2,9.5,25.4C0,28.6,-7.8,35.8,-15.5,35.9C-23.1,36,-30.6,29,-31.8,21.2C-33,13.3,-27.9,4.7,-26.5,-4.9C-25.1,-14.4,-27.3,-24.8,-23.5,-28.6C-19.7,-32.4,-9.9,-29.5,-0.1,-29.4C9.7,-29.3,19.3,-31.9,23.5,-28.2Z', 'M26.3,-19.6C28.6,-18,21.4,-7.4,15.7,-2C10,3.3,5.9,3.5,1,8.1C-3.8,12.7,-9.4,21.9,-11,21.6C-12.6,21.3,-10.2,11.5,-10.7,4C-11.3,-3.6,-14.7,-9,-13.3,-10.4C-12,-11.8,-6,-9.2,3,-11.6C12,-13.9,23.9,-21.3,26.3,-19.6Z', 'M12.1,-20.2C18.3,-14.8,27.8,-15.9,28.8,-13.3C29.8,-10.7,22.3,-4.3,21.8,3.5C21.3,11.3,27.8,20.5,26,22.5C24.2,24.4,14.1,19,6.8,19.4C-0.5,19.7,-5,25.9,-11.9,29.1C-18.7,32.2,-28.1,32.3,-29,27.3C-29.9,22.3,-22.5,12.2,-16.3,6.8C-10.1,1.4,-5.1,0.7,-6.9,-6.4C-8.7,-13.5,-17.3,-26.9,-17.3,-35.1C-17.2,-43.3,-8.6,-46.3,-2.8,-41.9C2.9,-37.4,5.9,-25.6,12.1,-20.2Z', 'M12.6,-18C16.6,-19.5,20.4,-16.7,22.9,-13C25.4,-9.3,26.6,-4.6,28.5,1.1C30.4,6.8,32.9,13.6,30.6,17.7C28.3,21.8,21.3,23.3,15.4,23.6C9.5,23.9,4.8,23,1.9,19.7C-1,16.5,-1.9,10.7,-9,11.1C-16.2,11.5,-29.4,18.1,-35.5,17.3C-41.5,16.4,-40.2,8.2,-35.1,3C-29.9,-2.3,-20.8,-4.5,-18.3,-11.4C-15.8,-18.4,-19.9,-29.9,-17.9,-29.6C-16,-29.3,-8,-17.2,-1.8,-14C4.3,-10.8,8.6,-16.6,12.6,-18Z'];

    // random array index from 0 to 5
    let randIndex = Math.floor(Math.random() * 6);

    // random x position from 50 to 650
    let randX = Math.floor(Math.random() * 600 + 50);

    // creating new asteroid namespace
    let newAsteroid = document.createElementNS(svgNS, "path");

    // setting asteroid attributes
    newAsteroid.setAttribute("id", "asteroid" + asteroidID);
    newAsteroid.setAttribute("transform", "translate(" + randX + " " + asteroidY + ")");
    newAsteroid.setAttribute("class", "asteroid");
    newAsteroid.setAttribute("xmlns", svgNS);

    // setting random d value for asteroid (random shape)
    newAsteroid.setAttribute("d", dValueArray[randIndex]);

    // attaching asteroid to svg
    svg.appendChild(newAsteroid);

    // adding asteroid to asteroid array
    asteroidArray.push(newAsteroid);
  
    // calling asteroid movement function, increasing id number
    asteroidMoveInterval();
    asteroidID ++;
}

/**
 * Moves asteroids from top to bottom the canvas. Removes asteroids once they are out of view.
 */
function moveAsteroid() {
    // iterates through asteroid array to update y positions of all asteroids
    asteroidArray.forEach((asteroid, index) => {

        // splitting transform attribute to isolate xy values 
        let translateArray = asteroid.getAttribute("transform", ).split("(");

        // splitting substring to further isolate xy values
        let xyArray = translateArray[1].split(" ");

        // retrieving xy values
        let x = parseFloat(xyArray[0]);
        let y = parseFloat(xyArray[1]);

        // increasing y value to move asteroid down
        y += 5;

        // asteroid bounding box
        let asteroidBox = asteroid.getBBox();
        
        // updating transform attribute
        asteroid.setAttribute("transform", "translate(" + x + " " + y +")");
        
        // spaceship left side x value
        let spaceX1 = parseFloat(spaceshipX - 20);

        // spaceship right side x value
        let spaceX2 = spaceX1 + 40;

        // calling explosion if spaceship coordinates collide with asteroid coordinates
        if ((y + (asteroidBox.height / 2) >= 650 && y + (asteroidBox.height / 2) <= 710) || (y - (asteroidBox.height / 2) >= 650 && y - (asteroidBox.height / 2) <= 710)) {
            if ((spaceX1 >= x - (asteroidBox.width / 2) && spaceX1 <= x + (asteroidBox.width / 2)) || (spaceX2 >= x - (asteroidBox.width / 2) && spaceX2 <= x + (asteroidBox.width / 2))) {
                // clearing movement interval before explosion happens
                clearInterval(asteroidMovementTimer);

                // calling asteroid explosion function
                explosion(asteroid, x, y);

                // removing asteroid from asteroid array
                asteroidArray.splice(index, 1);

                // if no asteroids are left stop the timer, otherwise restart timer interval
                if (asteroidArray.length === 0) {
                    clearInterval(asteroidMovementTimer);
                } else {
                    asteroidMoveInterval();
                }

                // changing spaceship color to red for 750ms if it gets hit
                spaceship1.setAttribute("fill", "crimson");
                setTimeout(resetColor, 750);

                // subtracting 10 from score every time an asteroid hits the ship
                score -= 10;
                scoreObject.innerHTML ="<p id = 'score'><strong>Score: " + score + "</strong></p>";

                explosionCount ++;

                // 3 hits total before game ends
                if (explosionCount === 3) {
                    stopGame();
                }
            }
        } 
        // removing asteroid if it makes it to bottom of screen
        else if (y >= 850) {
            // clearing movement interval of asteroid
            clearInterval(asteroidMovementTimer);

            // removing asteroid from document
            svg.removeChild(asteroid);

            // removing asteroid from array
            asteroidArray.splice(index, 1);

            // if no asteroids are left stop the timer, otherwise restart timer interval
            if (asteroidArray.length === 0) {
                clearInterval(asteroidMovementTimer);
            } else {
                asteroidMoveInterval();
            }

            // adding 1 to score every time an asteroid makes it to bottom of screen
            score ++;
            scoreObject.innerHTML ="<p id = 'score'><strong>Score: " + score + "</strong></p>";
        }
    });
}

/**
 * Sets speed at which asteroids move, based on game difficulty.
 */
function asteroidMoveInterval() {
    // clearing timer for every function call so that speed does not accumulate
    clearInterval(asteroidMovementTimer);

    if (currentDifficulty === "easy") {
        asteroidMovementTimer = setInterval(moveAsteroid, 20);
    } else if (currentDifficulty === "normal") {
        asteroidMovementTimer = setInterval(moveAsteroid, 10);
    } else {
        asteroidMovementTimer = setInterval(moveAsteroid, 10);
    }
    
}

/**
 * Displays an explosion animation before removing asteroid from document.
 * @param {Asteroid} asteroid 
 * @param {x coordinate of asteroid} x 
 * @param {y coordinate of asteroid} y 
 */
function explosion(asteroid, x, y) {
    // creating namespace for explosion polygon
    let newExplosion = document.createElementNS(svgNS, "polygon");

    // getting width and height of asteroid
    let asteroidBox = asteroid.getBBox();

    let asteroidCenterX = x - (asteroidBox.width / 2);
    let asteroidCenterY = y - (asteroidBox.height / 2);

    // updating explosion points to display animation at correct location
    let explosionPoints = [
    (asteroidCenterX + 85.333) + "," + (asteroidCenterY + 42.666),
    (asteroidCenterX + 74.784) + "," + (asteroidCenterY + 34.061),
    (asteroidCenterX + 79.617) + "," + (asteroidCenterY + 21.334),
    (asteroidCenterX + 66.177) + "," + (asteroidCenterY + 19.155),
    (asteroidCenterX + 64.000) + "," + (asteroidCenterY + 5.717),
    (asteroidCenterX + 51.273) + "," + (asteroidCenterY + 10.550),
    (asteroidCenterX + 42.667) + "," + (asteroidCenterY + 0.001),
    (asteroidCenterX + 34.060) + "," + (asteroidCenterY + 10.550),
    (asteroidCenterX + 21.334) + "," + (asteroidCenterY + 5.717),
    (asteroidCenterX + 19.156) + "," + (asteroidCenterY + 19.155),
    (asteroidCenterX + 5.717) + "," + (asteroidCenterY + 21.334),
    (asteroidCenterX + 10.550) + "," + (asteroidCenterY + 34.061),
    (asteroidCenterX + 0.000) + "," + (asteroidCenterY + 42.666),
    (asteroidCenterX + 10.550) + "," + (asteroidCenterY + 51.271),
    (asteroidCenterX + 5.717) + "," + (asteroidCenterY + 63.666),
    (asteroidCenterX + 19.155) + "," + (asteroidCenterY + 66.178),
    (asteroidCenterX + 21.334) + "," + (asteroidCenterY + 79.617),
    (asteroidCenterX + 34.060) + "," + (asteroidCenterY + 74.784),
    (asteroidCenterX + 42.667) + "," + (asteroidCenterY + 85.333),
    (asteroidCenterX + 51.273) + "," + (asteroidCenterY + 74.784),
    (asteroidCenterX + 64.000) + "," + (asteroidCenterY + 79.617),
    (asteroidCenterX + 66.177) + "," + (asteroidCenterY + 66.178),
    (asteroidCenterX + 79.617) + "," + (asteroidCenterY + 63.666),
    (asteroidCenterX + 74.784) + "," + (asteroidCenterY + 51.271)
    ];

    // putting array values in a string to set the points attribute
    let pointsString = explosionPoints.join(" ");

    // setting explosion attributes
    newExplosion.setAttribute("points", pointsString);
    newExplosion.setAttribute("xmlns", svgNS);
    
    // setting origin point for animation to play at the right coordinates
    newExplosion.style.transformOrigin = asteroidCenterX + "px " + asteroidCenterY + "px";

    // replacing asteroid path with explosion polygon
    svg.replaceChild(newExplosion, asteroid);

    newExplosion.setAttribute("class", "explosion");

    // setting delay before removing explosion polygon
    setTimeout( function removeExplosion() {
    svg.removeChild(newExplosion);
}, 950);
}

/**
 * Resets spaceship color to white.
 */
function resetColor() {
    spaceship1.setAttribute("fill", "white"); 
}

/**
 * Creates a new star with SVG circle element.
 */
function createStar() {

    // random x position from 0 to 700
    let randX = Math.floor(Math.random() * 700);

    // creating new star namespace
    let newStar = document.createElementNS(svgNS, "circle");

    // setting attributes of star
    newStar.setAttribute("id", "star" + starID);
    newStar.setAttribute("r", 1);
    newStar.setAttribute("cx", randX);
    newStar.setAttribute("cy", 800);
    newStar.setAttribute("class", "star");
    newStar.setAttribute("xmlns", svgNS);

    // attaching star to svg
    svg.appendChild(newStar);

    // adding star to star array
    starArray.push(newStar);

    // calling star movement function to move up the screen
    starMoveInterval();

    starID ++;
}

/**
 * Sets interval at which stars will be created.
 */
function starCreationInterval() {
    starCreationTimer = setInterval(createStar, 50);
}

/**
 * Sets movement speed of stars.
 */
function starMoveInterval() {
    clearInterval(starMovementTimer);
    starMovementTimer = setInterval(moveStar, 30);
}

/**
 * Moves stars from the bottom to the top of the screen. Removes stars once they are out of view.
 */
function moveStar() {
    // iterates through star array to update y positions of all stars
    starArray.forEach((star, index) => {

        // getting xy values
        let cx = parseFloat(star.getAttribute("cx"));
        let cy = parseFloat(star.getAttribute("cy"));

        // decreasing y value to move star up
        cy -= 5;
        star.setAttribute("cy", cy);

        if (cy <= -15) {
            // clearing movement interval for this asteroid
            clearInterval(starMovementTimer);

            // removing star from document
            svg.removeChild(star);

            // removing star from array
            starArray.splice(index, 1);

            // if no stars are left stop the timer, otherwise restart timer interval
            if (starArray.length === 0) {
                clearInterval(starMovementTimer);
            } else {
                starMoveInterval();
            }
        }
    });
}

/**
 * Stops the game and displays message with final score.
 */
function stopGame() {
    // clearing asteroid timers
    clearInterval(asteroidCreationTimer);
    clearInterval(asteroidMovementTimer);

    // removing all asteroids from document
    asteroidArray.forEach((asteroid, index) => {
        svg.removeChild(asteroid);
    });

    // removing spaceship from document
    svg.removeChild(spaceship1);
    svg.removeChild(spaceship2);

    // clearing asteroid array
    asteroidArray = [];
    
    // displaying game over message and total score
    let gameOver = document.createElementNS(svgNS, "text");
    let gameOverText = document.createTextNode("Game over! Total Score: " + score);
    gameOver.appendChild(gameOverText);
    gameOver.setAttribute("x", 350);
    gameOver.setAttribute("y", 385);
    gameOver.setAttribute("id", "gameover");

    // attaching game over message to svg
    svg.appendChild(gameOver);

    gameNotOver = false;
}

/**
 * Sets slower asteroid creation and movement speeds for easy difficulty.
 */
function easyDifficulty() {
    if (gameNotOver) {
        currentDifficulty = "easy";

        clearInterval(asteroidMovementTimer);
        asteroidMovementTimer = setInterval(moveAsteroid, 20);

        clearInterval(asteroidCreationTimer);
        asteroidCreationTimer = setInterval(createAsteroid, 1000);
        
        if (!gameStarted) {
            startGame();
            starCreationInterval();
            gameStarted = true;
        }
    }
    
}

/**
 * Sets moderate asteroid creation and movement speeds for normal difficulty.
 */
function normalDifficulty() {
    if (gameNotOver) {
        currentDifficulty = "normal";

        clearInterval(asteroidMovementTimer);
        asteroidMovementTimer = setInterval(moveAsteroid, 10);

        clearInterval(asteroidCreationTimer);
        asteroidCreationTimer = setInterval(createAsteroid, 300);

        if (!gameStarted) {
            startGame();
            starCreationInterval();
            gameStarted = true;
        }
    }
    
}

/**
 * Sets faster asteroid creation speed for hard difficulty. Keeps same movement speed as normal difficulty.
 */
function hardDifficulty() {
    if (gameNotOver) {
        currentDifficulty = "hard";

        clearInterval(asteroidMovementTimer);
        asteroidMovementTimer = setInterval(moveAsteroid, 10);

        clearInterval(asteroidCreationTimer);
        asteroidCreationTimer = setInterval(createAsteroid, 120);

        if (!gameStarted) {
            startGame();
            starCreationInterval();
            gameStarted = true;
        }
        
    }
}