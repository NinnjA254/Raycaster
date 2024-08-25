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
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
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
const gridSize = 45;
canvas.width = 640;
canvas.height = 480;

class Player {
    constructor(position) {
	this.position = position
	this.lookatDir = new Vec(0, -5).unit().scale(20)
	this.plane = new Vec(-this.lookatDir.y, this.lookatDir.x).unit().scale(20)
    }
    draw(ctx) {
	drawPoint(this.position.x, this.position.y)
	this.position.draw(ctx, origin, 'blue')
	// this.lookatDir.draw(ctx, this.position, 'red')
	this.plane.draw(ctx, this.position.add(this.lookatDir), 'green')
	this.plane.scale(-1).draw(ctx, this.position.add(this.lookatDir), 'green')

	const fovBorderLeft = this.lookatDir.add(this.plane).unit().scale(180)
	const fovBorderRight = this.lookatDir.add(this.plane.scale(-1)).unit().scale(180)
	fovBorderRight.draw(ctx, this.position, 'green')
	fovBorderLeft.draw(ctx, this.position, 'green')
    }
    drawRays(ctx) {
	const rayNum = 10
	for (let i = -rayNum; i <= rayNum; i++) {
	    if (true) { //todo: remove this if, tis simply for debugging
		const ray = this.lookatDir.add(this.plane.scale(i/rayNum)).unit().scale(800)
		ray.draw(ctx, this.position, 'rgba(255,255,0,0.9)', 1)

		let stepX 
		if (ray.x < 0)
		    stepX = -1
		else if (ray.x > 0)
		    stepX = 1
		else
		    stepX = 0
		if (stepX != 0) {
		    //if the x cordinate of ray is 0, it will never intersect a column edge
		    //works fine without the check, but makes a vector with  the x-cordinate being infinity
		    //because in js, division by zero gives infinity
		    const xEdgeDist = stepX == 1 ? gridSize - this.position.x % gridSize : -(this.position.x % gridSize)
		    const y = (ray.y/ray.x) * xEdgeDist
		    const raytoEdge = Math.sqrt(xEdgeDist * xEdgeDist + y * y)

		    const hehe = new Vec(xEdgeDist, y)
		    // console.log(raytoEdge, hehe.magnitude())
		    hehe.draw(ctx, this.position, 'purple', 1)
		}

	    }
	}
    }
}
p1 = new Player(new Vec(215, 250))
const playerDisplay = document.getElementById('playerPos');
playerDisplay.innerText = `pos -> {x:${p1.position.x}, y:${p1.position.y}}`
function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMap(worldMap)
    p1.draw(ctx)
    p1.drawRays(ctx)
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
