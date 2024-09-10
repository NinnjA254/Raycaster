const worldCanvas = document.getElementById('world-canvas')
const mapCanvas = document.getElementById('map-canvas')

worldCanvas.width = 640
worldCanvas.height = 480
mapCanvas.width = 480 
mapCanvas.height = 480 

const worldCtx = worldCanvas.getContext('2d')
const mapCtx = mapCanvas.getContext('2d')

const gridSize = mapCanvas.width / 24
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

class Player {
	constructor(position) {
		this.position = position
		this.lookatDir = new Vec(1, 0).scale(15)
		this.planeRight = new Vec(-this.lookatDir.y, this.lookatDir.x)// perpendicular to lookatDir
		this.planeLeft = this.planeRight.clone().scale(-1)

		this.fovBorderLeft = this.lookatDir.clone().add(this.planeLeft).unit().scale(38)
		this.fovBorderRight = this.lookatDir.clone().add(this.planeRight).unit().scale(38)
	}
	rotate(degrees) {
		const ix = Math.cos(degrees)
		const iy = Math.sin(degrees)
		const jx = -Math.sin(degrees)
		const jy = Math.cos(degrees)
		const newX = this.lookatDir.x * ix + this.lookatDir.y * jx
		const newY = this.lookatDir.x * iy + this.lookatDir.y * jy
		this.lookatDir.set(newX, newY)

		this.planeRight.set(-this.lookatDir.y, this.lookatDir.x)
		this.planeLeft.copy(this.planeRight).scale(-1)

		this.fovBorderLeft.copy(this.lookatDir).add(this.planeLeft).unit().scale(38)
		this.fovBorderRight.copy(this.lookatDir).add(this.planeRight).unit().scale(38)
	}
	draw(ctx) {
		drawPoint(ctx, this.position.x, this.position.y)
		this.position.draw(ctx, 0, 0, 'blue')
		this.lookatDir.draw(ctx, this.position.x, this.position.y, 'red')

		const planeStartX = this.position.x + this.lookatDir.x
		const planeStartY = this.position.y + this.lookatDir.y
		this.planeRight.draw(ctx, planeStartX, planeStartY, 'green')
		this.planeLeft.draw(ctx, planeStartX, planeStartY, 'green')

		this.fovBorderRight.draw(ctx, this.position.x, this.position.y, 'green')
		this.fovBorderLeft.draw(ctx, this.position.x, this.position.y, 'green')
	}
	see(wCtx, mCtx, canvasWidth) {
		for (let i = 0; i < canvasWidth; i++) {
		}

	}
}
const p1 = new Player(new Vec(240, 240))

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
mapCanvas.addEventListener('mousemove', (e)=> {
	p1.rotate(e.movementX * 0.01)
})
worldCanvas.addEventListener('mousemove', (e)=> {
	p1.rotate(e.movementX * 0.01)
})

const playerPosDisplay = document.getElementById('player-pos')
const lookatDisplay = document.getElementById('lookat')
const fpsDisplay = document.getElementById('fps')
let fps = 0
let prevTime = 0
function gameLoop(timestamp) {
	fpsDisplay.innerText = `fps: ${Math.floor(1000 / (timestamp - prevTime))}`
	prevTime = timestamp

	clearCanvas(mapCanvas, mapCtx)
	clearCanvas(worldCanvas, worldCtx)

	drawMap(worldMap, mapCtx)
	p1.draw(mapCtx)

	p1.see(worldCtx, mapCtx, worldCanvas.width)

	playerPosDisplay.innerText = `Pos: ${p1.position.x}, ${p1.position.y}`
	lookatDisplay.innerText = `lookat: ${p1.lookatDir.x.toFixed(2)}, ${p1.lookatDir.y.toFixed(2)}`

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
