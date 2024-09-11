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
		[1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
let gridSize = mapCanvas.width / worldMap.length 
gridSize = 40

function deg2Rad(degrees) {
	return degrees * (Math.PI / 180)
}
class Player {
	constructor(position) {
		this.position = position
		this.lookatDir = new Vec(1, 0) //always unit vector
		this.fov = 90 
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
		for (let x = 0; x <= width; x++) {
			const cameraX = (x / width) * 2 - 1 
			ray.copy(this.planeRight).scale(cameraX).add(this.lookatDir)
			ray.draw(mCtx, this.position.x, this.position.y, 'rgba(255,255,0,0.1)', 300, 1)
			drawLine(wCtx, x, 40, x, 70, 'yellow')
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
			if (map[i][j] > 0) {
				ctx.fillStyle = 'grey'
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
