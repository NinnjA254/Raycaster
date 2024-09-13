const worldCanvas = document.getElementById('world-canvas')
const mapCanvas = document.getElementById('map-canvas')

worldCanvas.width = 640
worldCanvas.height = 480
mapCanvas.width = 480 
mapCanvas.height = 480 

const worldCtx = worldCanvas.getContext('2d')
const mapCtx = mapCanvas.getContext('2d')

const worldMap =
	[
		['red','red',null,'red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,'blue',null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,'green','green','green','green','green',null,null,null,null,'blue',null,'blue',null,'blue',null,null,null,'red'],
		['red',null,null,null,null,null,'green',null,null,null,'green',null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,'green',null,null,null,'green',null,null,null,null,'blue',null,null,null,'blue',null,null,null,'red'],
		['red',null,null,null,null,null,'green',null,null,null,'green',null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,'green','green',null,'green','green',null,null,null,null,'blue',null,'blue',null,'blue',null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,'brown',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow',null,'yellow',null,null,null,null,'yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow',null,null,null,null,'magenta',null,'yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow',null,'yellow',null,null,null,null,'yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow',null,'yellow','yellow','yellow','yellow','yellow','yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow',null,null,null,null,null,null,null,null,null,null,null,null,null,null,'red'],
		['red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red']
	];
let gridSize = mapCanvas.width / worldMap.length 
// gridSize = 40

function deg2Rad(degrees) {
	return degrees * (Math.PI / 180)
}
class Player {
	constructor(position) {
		this.position = position
		this.lookatDir = new Vec(1, 0) //always unit vector
		this.fov = 60 
		let planeLength = Math.tan(deg2Rad(this.fov / 2)) * this.lookatDir.magnitude()
		planeLength = 1
		this.planeRight = new Vec(-this.lookatDir.y, this.lookatDir.x).scale(planeLength) // perpendicular to lookatDir
		this.planeLeft = this.planeRight.clone().scale(-1)

		this.fovBorderLeft = this.lookatDir.clone().add(this.planeLeft)
		this.fovBorderRight = this.lookatDir.clone().add(this.planeRight)

		this.ray = new Vec(0, 0)
	}

	changeFov(degrees) {
		this.fov = degrees 
		const planeLength = Math.tan(deg2Rad(this.fov / 2)) * this.lookatDir.magnitude()
		this.planeRight = new Vec(-this.lookatDir.y, this.lookatDir.x).scale(planeLength) // perpendicular to lookatDir
		this.planeLeft = this.planeRight.clone().scale(-1)

		this.fovBorderLeft.copy(this.lookatDir).add(this.planeLeft)
		this.fovBorderRight.copy(this.lookatDir).add(this.planeRight)
	}

	rotate(degrees) {
		const ix = Math.cos(degrees)
		const iy = Math.sin(degrees)
		const jx = -Math.sin(degrees)
		const jy = Math.cos(degrees)
		const newX = this.lookatDir.x * ix + this.lookatDir.y * jx
		const newY = this.lookatDir.x * iy + this.lookatDir.y * jy
		this.lookatDir.set(newX, newY)

		const planeLength = Math.tan(deg2Rad(this.fov / 2))
		this.planeRight.set(-this.lookatDir.y, this.lookatDir.x).scale(planeLength)
		this.planeLeft.copy(this.planeRight).scale(-1)

		this.fovBorderLeft.copy(this.lookatDir).add(this.planeLeft)
		this.fovBorderRight.copy(this.lookatDir).add(this.planeRight)
	}
	draw(ctx) {
		const scale = 10 //scale of the drawn fov triangle

		drawPoint(ctx, this.position.x, this.position.y)
		// this.position.draw(ctx, 0, 0, 'blue')
		this.lookatDir.draw(ctx, this.position.x, this.position.y, 'red', scale)

		const planeStartX = this.position.x + this.lookatDir.x * scale 
		const planeStartY = this.position.y + this.lookatDir.y * scale
		this.planeRight.draw(ctx, planeStartX, planeStartY, 'green', scale)
		this.planeLeft.draw(ctx, planeStartX, planeStartY, 'green', scale)

		this.fovBorderRight.draw(ctx, this.position.x, this.position.y, 'green', scale * 2)
		this.fovBorderLeft.draw(ctx, this.position.x, this.position.y, 'green', scale * 2)
	}
	see(wCanvas, mCanvas) {
		const wCtx = wCanvas.getContext('2d')
		const mCtx = mCanvas.getContext('2d')
		const width = wCanvas.width
		const ray = this.ray
		const nextColumn = new Vec(Infinity, Infinity)
		const nextRow = new Vec(Infinity, Infinity)
		const rowDelta = new Vec(Infinity, Infinity)
		const columnDelta = new Vec(Infinity, Infinity)
		const current = new Vec(0, 0)
		for (let x = 0; x <= width; x++) {
			const cameraX = (x / width) * 2 - 1 
			ray.copy(this.planeRight).scale(cameraX).add(this.lookatDir)
			const rPlane = ray.magnitude()
			ray.unit()
			// ray.draw(mCtx, this.position.x, this.position.y, 'rgba(255,255,0,0.1)', 300, 1)
			let stepX = ray.x == 0 ? 0 : ray.x / Math.abs(ray.x) // 0, -1 or 1
			let stepY = ray.y == 0 ? 0 : ray.y / Math.abs(ray.y) // 0, -1 or 1

			if (stepX != 0) {
				const initialColX = stepX == 1 ? gridSize - this.position.x % gridSize : -(this.position.x % gridSize)
				const initialColY = (ray.y/ray.x) * initialColX
				nextColumn.set(initialColX, initialColY)

				const colX = stepX == 1 ? gridSize : -gridSize
				const colY = (ray.y/ray.x) * colX
				columnDelta.set(colX, colY)
			}
			if (stepY != 0) {
				const initialRowY = stepY == 1 ? gridSize - this.position.y % gridSize : -(this.position.y % gridSize)
				const initialRowX = (ray.x/ray.y) * initialRowY
				nextRow.set(initialRowX, initialRowY)

				const rowY = stepY == 1 ? gridSize : -gridSize
				const rowX = (ray.x/ray.y) * rowY
				rowDelta.set(rowX, rowY)
			}

			let color;
			let collision = false;
			castSteps = Infinity
			let col
			let row
			for(let j = 0; j < castSteps; j++) {
				if (nextColumn.magnitude() < nextRow.magnitude()) {
					color = 'rgba(128, 0, 128, 0.1)'
					current.copy(nextColumn)
					nextColumn.add(columnDelta)
				}
				else if (nextRow.magnitude() < nextColumn.magnitude()) {
					color = 'rgba(0, 255, 255, 0.1)'
					current.copy(nextRow)
					nextRow.add(rowDelta)
				}
				else {
					color = 'rgba(75, 0, 255, 0.1)'
					current.copy(nextRow) // test picking different
					nextColumn.add(columnDelta) // increment both since they are at the same place
					nextRow.add(rowDelta)
				}

				const wallX = this.position.x + current.x
				const wallY = this.position.y + current.y
				col = Math.floor(wallX / gridSize)
				row = Math.floor(wallY / gridSize)
				if (stepX === -1 && wallX % gridSize === 0) { //compress to ternary
					col -= 1 
				}
				if (stepY === -1 && wallY % gridSize === 0) {
					row -= 1
				}

				if (row < 0 || row >= worldMap.length){ //compress to one if
					break
				}
				if (col < 0 || col >= worldMap[row].length){
					break
				}
				if (worldMap[row][col]) {
					collision = true
					break
				}
				// mCtx.strokeStyle = color
				// mCtx.lineWidth = 2
				// mCtx.strokeRect(gridSize * col, gridSize * row, gridSize, gridSize)
			}
			// current.draw(mCtx, this.position.x, this.position.y, color, 1, 1)
			current.draw(mCtx, this.position.x, this.position.y, color, 1, 1)
			if (collision) {
				// drawing map
				// mCtx.fillStyle = color
				// mCtx.fillRect(gridSize * col, gridSize * row, gridSize, gridSize)
				
				// drawing world 
				const dWall = current.magnitude()
				const perpWall = (dWall / rPlane) * this.lookatDir.magnitude() //perpendicular wall distance correcting for fisheye effect

				const actualWallHeight = 64 // I don't completely get this mazematik
				const dPlane = 355 // distance from player to projection plane


				const projectedHeight = Math.floor((actualWallHeight / perpWall) * dPlane)
				const playerHeight = 240 // half the screen, so that their line of sight is at center of screen??
				drawLine(wCtx, x, playerHeight + projectedHeight / 2 , x, playerHeight - projectedHeight / 2 , worldMap[row][col])
			}
		}
	}
}

function drawLine(ctx, startX, startY, endX, endY, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

const p1 = new Player(new Vec(240, 240))
// console.log(p1.lookatDir.magnitude() * 2)
// console.log(p1.planeRight.magnitude() * 2)

document.addEventListener('keydown', (e) => {
	switch (e.key.toLowerCase()) {
		case 'q':
			mapCanvas.classList.toggle('small')
			worldCanvas.classList.toggle('small')
			break;

		case 'w':
			p1.position.y -= gridSize / 5
			break;

		case 'a':
			p1.position.x -= gridSize / 5
			break;

		case 's':
			p1.position.y += gridSize / 5
			break;

		case 'd':
			p1.position.x += gridSize / 5
			break;
		case 'arrowup':
			castSteps++
			cSteps.value = castSteps
			break;
		case 'arrowdown':
			castSteps--
			cSteps.value = castSteps
			break;

		default:
			break;
	}
})

const mousemove = (e)=> {
	p1.rotate(e.movementX * 0.01)
}
mapCanvas.onmousemove = mousemove
worldCanvas.onmousemove = mousemove

const wheel = (e) => {
	p1.changeFov(p1.fov + e.deltaY/10)
	// console.log(p1.lookatDir.magnitude() * 2)
	// console.log(p1.planeRight.magnitude() * 2)
}
worldCanvas.onwheel = wheel
mapCanvas.onwheel = wheel

const cSteps = document.getElementById('cast-steps')
let castSteps = 1
cSteps.value = castSteps
cSteps.addEventListener('input', () => {
	const steps = parseFloat(cSteps.value)
	if (!isNaN(steps)){
		castSteps = steps
	}
})

const playerPosDisplay = document.getElementById('player-pos')
const lookatDisplay = document.getElementById('lookat')
const fpsDisplay = document.getElementById('fps')
const fovDisplay = document.getElementById('fov')

let fps = 0
let prevTime = 0
function gameLoop(timestamp) {
	fps = 1000 / (timestamp - prevTime) // do we care about this precision?
	fps = fps.toFixed(2)
	fpsDisplay.innerText = `fps: ${fps}`
	prevTime = timestamp

	clearCanvas(mapCanvas, mapCtx)
	clearCanvas(worldCanvas, worldCtx)

	drawMap(worldMap, mapCtx)
	p1.draw(mapCtx)

	p1.see(worldCanvas, mapCanvas)

	playerPosDisplay.innerText = `Pos: ${p1.position.x}, ${p1.position.y}`
	lookatDisplay.innerText = `lookat: ${p1.lookatDir.x.toFixed(2)}, ${p1.lookatDir.y.toFixed(2)}`
	fovDisplay.innerText = `fov: ${p1.fov}`

	requestAnimationFrame(gameLoop)
}
gameLoop()

function clearCanvas(canvas, ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMap(map, ctx) {
	for (let i = 0; i < map.length; i++) {
		ctx.fillStyle = 'black'
		for (let j = 0; j < map[i].length; j++){
			ctx.strokeStyle = 'white'
			ctx.lineWidth = 0.1 
			ctx.strokeRect(gridSize * j, gridSize * i, gridSize, gridSize);
			if (map[i][j]) {
				ctx.fillStyle = map[i][j] 
				ctx.fillRect(gridSize * j, gridSize * i, gridSize, gridSize);
			}
		}
	}
}

function drawPoint(ctx, x, y, fill='rgba(0, 255, 255, 1)') {
	ctx.beginPath()
	ctx.arc(x, y, 5, 0, Math.PI * 2, true);
	ctx.fillStyle = fill;
	ctx.fill()
}
