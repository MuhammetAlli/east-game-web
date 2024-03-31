//#region Değişkenler
let wallDensity = 5.0;
let gravity = 1.0;
let jumpPower = 35.0;
let currentJumpValue = 0.0;
let isGameActive = false;
let failed = false;

let updateTimer;
let addWallsTimer;

const drawableCanvas = new Drawable(0, 0, canvas.width, canvas.height, "#000");
const birdSize = 25;
const bird = new Drawable(50, canvas.height / 2.0 - birdSize / 2.0, birdSize, birdSize, "#00FF00");
const wallWidth = 50;
const wallOffset = 100;
let lastWallheight = canvas.height / 2.0;
let walls = [];
//#endregion

//#region Değişken Güncelleme
function updateVariables() {
    gravity = parseFloat(document.getElementById("gravityInput").value);
    jumpPower = parseFloat(document.getElementById("jumpPowerInput").value);
    wallDensity = parseFloat(document.getElementById("wallDensityInput").value);

    localStorage.setItem("gravity", JSON.stringify(gravity));
    localStorage.setItem("jumpPower", JSON.stringify(jumpPower));
    localStorage.setItem("wallDensity", JSON.stringify(wallDensity));
}

// Sayfa yüklendiğinde değerleri güncelle
document.addEventListener("DOMContentLoaded", function () {
    const fieldNames = ["gravity", "jumpPower", "wallDensity"];
    const saveds = []; for (let i = 0; i < fieldNames.length; i++)  saveds.push(JSON.parse(localStorage.getItem(fieldNames[i])));

    let index = 0;
    if (saveds[index] !== null) { gravity = saveds[index]; document.getElementById(fieldNames[index] + "Input").value = gravity; } index++;
    if (saveds[index] !== null) { jumpPower = saveds[index]; document.getElementById(fieldNames[index] + "Input").value = jumpPower; } index++;
    if (saveds[index] !== null) { wallDensity = saveds[index]; document.getElementById(fieldNames[index] + "Input").value = wallDensity; } index++;
});
//#endregion

//#region Oyun Fonksiyonları
function update() {
    if (!isGameActive || failed) return;

    // gravity
    bird.y += gravity;

    // jump
    bird.y -= currentJumpValue;
    currentJumpValue -= 30.0 / jumpPower;
    currentJumpValue = Math.max(currentJumpValue, 0);

    // clamp
    bird.y = clampNumber(bird.y, 0, canvas.height - birdSize);

    // draws
    drawIt(drawableCanvas);
    drawIt(bird);
    walls.forEach((wall) => wall.x -= 1.0);
    walls.forEach(drawIt);

    // fail control
    for (const wall of walls) {
        if (
            wall.x + wall.xSize > bird.x &&
            wall.x < bird.x + bird.xSize &&
            wall.y + wall.ySize > bird.y &&
            wall.y < bird.y + bird.ySize
        ) {
            failed = true;
            resetGame();
            break;
        }
    }

    updateTimer = setTimeout(update, 1);
}

function resetGame() {
    isGameActive = false;
    failed = false;

    currentJumpValue = 0;
    walls = [];
    bird.y = canvas.height / 2.0 - birdSize / 2.0;

    drawIt(drawableCanvas);
    drawIt(bird);

    clearTimeout(updateTimer);
    clearTimeout(addWallsTimer);
}
//#endregion

//#region Yardımcı Fonksiyonlar
const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

function addWalls() {
    if (!isGameActive || failed) return;
    let randomHeight =
        lastWallheight - canvas.height * 0.2 + Math.random() * canvas.height * 0.4;
    randomHeight = clampNumber(
        randomHeight,
        canvas.height * 0.2,
        canvas.height * 0.8
    );

    lastWallheight = randomHeight;

    walls.push(
        new Drawable(
            canvas.width,
            0,
            wallWidth,
            randomHeight - wallOffset / 2.0,
            "#FF0000"
        )
    );
    walls.push(
        new Drawable(
            canvas.width,
            randomHeight + wallOffset / 2.0,
            wallWidth,
            canvas.height - (randomHeight + wallOffset / 2.0),
            "#FF0000"
        )
    );
    addWallsTimer = setTimeout(addWalls, 50000 / wallDensity);
}

function drawIt(drawableParam) {
    ctx.fillStyle = drawableParam.color;
    ctx.fillRect(
        drawableParam.x,
        drawableParam.y,
        drawableParam.xSize,
        drawableParam.ySize
    );
}
//#endregion
