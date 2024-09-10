class Vec {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	set(x, y) {
		this.x = x
		this.y = y
		return this
	}
	draw (ctx, startX, startY, color, lineWidth=2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(this.x + startX, this.y + startY);
		ctx.stroke();
	}
	add(vec) {
		this.x += vec.x
		this.y += vec.y
		return this
	}
	sub(vec) {
		this.x -= vec.x
		this.y -= vec.y
		return this
	}
	scale(scalar) {
		this.x *= scalar
		this.y *= scalar
		return this
	}
	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	unit() {
		const mag = this.magnitude()
		if (mag == 0) {
			this.x = 0
			this.y = 0
			return this
		}
		this.x /= mag
		this.y /= mag
		return this
	}
	clone() {
		return new Vec(this.x, this.y)
	}
	copy(vec) {
		this.x = vec.x
		this.y = vec.y
		return this
	}
}

const origin = new Vec(0, 0)
