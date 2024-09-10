class Vec {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	draw (ctx, startPos, color, lineWidth=2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(startPos.x, startPos.y);
		ctx.lineTo(this.x + startPos.x, this.y + startPos.y);
		ctx.stroke();
	}
	add(vec) {
		this.x += vec.x
		this.y += vec.y
	}
	sub(vec) {
		this.x -= vec.x
		this.y -= vec.y
	}
	scale(scalar) {
		this.x *= scalar
		this.y *= scalar
	}
	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	unit() {
		const mag = this.magnitude()
		if (mag == 0) { //potential bug?
			this.x = 0
			this.y = 0
			return
		}
		this.x /= mag
		this.y /= mag
	}
}

const origin = new Vec(0, 0)
