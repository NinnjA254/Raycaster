const worldCanvas = document.getElementById('world-canvas')
const mapCanvas = document.getElementById('map-canvas')

worldCanvas.width = 640
worldCanvas.height = 480
mapCanvas.width = 640 / 4
mapCanvas.height = 480 / 4

const worldCtx = worldCanvas.getContext('2d')
const mapCtx = mapCanvas.getContext('2d')


const fpsDisplay = document.getElementById('fps')
let fps = 0
let prevTime = 0
function gameLoop(timestamp) {
	fpsDisplay.innerText = `fps: ${Math.floor(1000 / (timestamp - prevTime))}`
	prevTime = timestamp
	requestAnimationFrame(gameLoop)
}

gameLoop()

