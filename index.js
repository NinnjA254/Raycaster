canvas = document.getElementsByTagName('canvas')[0]

const ctx = canvas.getContext('2d');

// Resize the canvas to fill the window
// function resizeCanvas() {
//     canvas.width =  window.innerWidth
//     canvas.height = window.innerHeight;
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);


function drawPoint(x, y, fill='rgba(0, 255, 255, 1)') {
	ctx.beginPath()
	ctx.arc(x, y, 5, 0, Math.PI * 2, true);
	ctx.strokeStyle = 'blue';
	ctx.fillStyle = fill;
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
		[1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
const gridSize = 20;
canvas.width = 640;
canvas.height = 480;

class Player {
	constructor(position) {
		this.position = position
		this.lookatDir = new Vec(0, -1).unit().scale(20)
		this.plane = new Vec(-this.lookatDir.y, this.lookatDir.x).unit().scale(20) // perpendicular to lookatDir
	}
	draw(ctx) {
		drawPoint(this.position.x, this.position.y)
		this.position.draw(ctx, origin, 'blue')
		this.lookatDir.draw(ctx, this.position, 'red')
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
				const ray = this.lookatDir.add(this.plane.scale(i/rayNum)).unit()
				// ray.draw(ctx, this.position, 'rgba(255,255,0,0.7)', 1)

				let stepX = ray.x == 0 ? 0 : ray.x / Math.abs(ray.x) // 0, -1 or 1
				let stepY = ray.y == 0 ? 0 : ray.y / Math.abs(ray.y) // 0, -1 or 1
				// In a language that doesn't support division by zero,
				// add checks for when stepX or stepY are 0, ie, when stepX is 0. 👇 
				// if (stepX == 0) {
				// 	nextColumn == (Infinity, Infinity)
				// 	columnDelta == (Infinity,Infinity)
				// }
				// else {
				// 	calculate nextColumn and columnDelta 
				// }

				const yEdgeDist = stepY == 1 ? gridSize - this.position.y % gridSize : -(this.position.y % gridSize)
				const x = (ray.x/ray.y) * yEdgeDist
				let nextRow = new Vec(x, yEdgeDist)

				const yRow = stepY == 1 ? gridSize : -gridSize
				const xRow = (ray.x/ray.y) * yRow
				const rowDelta = new Vec(xRow, yRow)

				const xEdgeDist = stepX == 1 ? gridSize - this.position.x % gridSize : -(this.position.x % gridSize)
				const y = (ray.y/ray.x) * xEdgeDist
				let nextColumn = new Vec(xEdgeDist, y)

				const xCol = stepX == 1 ? gridSize : -gridSize
				const yCol = (ray.y/ray.x) * xCol
				const columnDelta = new Vec(xCol, yCol)

				//casting time
				for (let i = 0; i < castSteps; i++) {
					let current;
					let color

					if (nextColumn.magnitude() < nextRow.magnitude()){
						current = nextColumn
						color = 'purple'
						nextColumn = nextColumn.add(columnDelta)
					}
					else {
						current = nextRow
						color = 'cyan'
						nextRow = nextRow.add(rowDelta)
					}
					//check for wall innit bruv
					current.draw(ctx, this.position, color, 1)
					const wallPoint = current.add(this.position)
					let col = Math.floor(wallPoint.x / gridSize)
					if (stepX === -1 && wallPoint.x % gridSize === 0) {
						col -= 1 
					}
					let row = Math.floor(wallPoint.y / gridSize)
					if (stepY === -1 && wallPoint.y % gridSize === 0) {
						row -= 1
					}
					if (row < 0 || row >= worldMap.length){
						break
					}
					if (col < 0 || col >= worldMap[row].length){
						break
					}
					ctx.strokeStyle = color
					if (worldMap[row][col] > 0) {
						ctx.fillStyle = 'rgba(255,0,0,0.2)'
						ctx.fillRect(gridSize * col, gridSize * row, gridSize, gridSize)
						drawPoint(current.add(this.position).x, current.add(this.position).y, color)
						break
					}
					ctx.lineWidth = 2
					ctx.strokeRect(gridSize * col, gridSize * row, gridSize, gridSize)
				}
			}
		}
	}
}
// const p1 = new Player(new Vec(425, 325))
const p1 = new Player(new Vec(425, 325))
const playerDisplay = document.getElementById('playerPos');
playerDisplay.innerText = `pos -> {x:${p1.position.x}, y:${p1.position.y}}`

const lxControl = document.getElementById('lx');
lxControl.value = p1.lookatDir.x
lxControl.addEventListener('input', () => {
	const x = parseFloat(lxControl.value)
	if (!isNaN(x)){
		p1.lookatDir = new Vec(x, p1.lookatDir.y).unit().scale(20)
		p1.plane = new Vec(-p1.lookatDir.y, p1.lookatDir.x).unit().scale(20) 
	}
})

const lyControl = document.getElementById('ly');
lyControl.value = p1.lookatDir.y
lyControl.addEventListener('input', () => {
	const y = parseFloat(lyControl.value)
	if (!isNaN(y)){
		p1.lookatDir = new Vec(p1.lookatDir.x, y).unit().scale(20)
		p1.plane = new Vec(-p1.lookatDir.y, p1.lookatDir.y).unit().scale(20) 
	}
})

const castStepsControl = document.getElementById('cast_steps')
let castSteps = 1
castStepsControl.value = castSteps
castStepsControl.addEventListener('input', () => {
	const steps = parseFloat(castStepsControl.value)
	if (!isNaN(steps)){
		castSteps = steps
	}
})

const debugLog = document.getElementById('dlog')

document.addEventListener('keydown', (e) => {
	switch (e.key.toLowerCase()) {
		case 'w':
			p1.position.y -= gridSize / 10
			break;

		case 'a':
			p1.position.x -= gridSize / 10
			break;

		case 's':
			p1.position.y += gridSize / 10
			break;

		case 'd':
			p1.position.x += gridSize / 10
			break;

		default:
			break;
	}
})
function gameloop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawMap(worldMap)

	if (`pos -> {x:${p1.position.x}, y:${p1.position.y}}` != playerDisplay.innerText) {
		playerDisplay.innerText = `pos -> {x:${p1.position.x}, y:${p1.position.y}}`
	}
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
