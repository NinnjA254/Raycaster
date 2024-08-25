canvas = document.getElementsByTagName('canvas')[0]

const ctx = canvas.getContext('2d');

// Resize the canvas to fill the window
// function resizeCanvas() {
//     canvas.width =  window.innerWidth
//     canvas.height = window.innerHeight;
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);


function drawPoint(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2, true);
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'rgba(0, 255, 255, 1)';
    ctx.lineWidth = 5;
    ctx.fill()
}
function drawFuturisticPoint(x, y) {
    // Draw the outer glow
    const outerRadius = 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the main point (inner circle)
    const innerRadius = 4;
    ctx.beginPath();
    ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'cyan';
    ctx.fill();
}

const worldMap =
[
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const playerDisplay = document.getElementById('playerPos');
canvas.width = 640;
canvas.height = 480;
// playerDisplay.innerText = `pos -> {x:null, y:null}`
const playerPos = new Vector(230, 230)
const lookatDir = new Vector(30, 0)
const plane = new Vector(0, 20)
const ray1 = lookatDir.add(plane).scale(2)
const ray2 = lookatDir.add(plane.scale(0.2)).scale(2)
const ray3 = lookatDir.add(plane.scale(-1)).scale(2)


function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMap(worldMap)
    playerPos.draw(ctx, origin, 'blue')
    lookatDir.draw(ctx, playerPos, 'red')
    plane.draw(ctx, playerPos.add(lookatDir), 'yellow')
    plane.scale(-1).draw(ctx, playerPos.add(lookatDir), 'yellow')
    ray1.draw(ctx, playerPos, 'green')
    ray2.draw(ctx, playerPos, 'green')
    ray3.draw(ctx, playerPos, 'green')
    findGrid(playerPos, worldMap, 20)
    drawPoint(playerPos.x, playerPos.y)
    requestAnimationFrame(gameloop)
}
gameloop()
function findGrid(playerPos, map, gridSize) {
    const column = Math.floor(playerPos.x / gridSize)
    const row = Math.floor(playerPos.y / gridSize)
    ctx.strokeStyle = 'rgba(255,0,0,0.5)'
    ctx.strokeRect(gridSize * column, gridSize * row, gridSize, gridSize);
}

function drawMap(map) {
    for (let i = 0; i < map.length; i++) {
	let gridSize = 20;
	ctx.fillStyle = 'black'
	for (let j = 0; j < map[i].length; j++){
	    ctx.strokeStyle = 'white'
	    ctx.lineWidth = 0.1 
	    ctx.strokeRect(gridSize * j, gridSize * i, gridSize, gridSize);
	    if (map[i][j] > 0) {
		ctx.fillStyle = 'grey'
		ctx.fillRect(gridSize * j, gridSize * i, gridSize, gridSize);
	    }
	}
    }
}

console.log(Vector)

function drawLine(start, end) {
    ctx.moveTo()
}

