class Vec {
    constructor(x, y) {
	this.x = x
	this.y = y
    }
    draw (ctx, startVec, color, lineWidth=2) {
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;

	ctx.beginPath();

	ctx.moveTo(startVec.x, startVec.y);

	ctx.lineTo(this.x + startVec.x, this.y + startVec.y);

	ctx.stroke();
    }
    add(vec) {
	return new Vec(this.x + vec.x, this.y + vec.y)
    }
    sub(vec) {
	return new Vec(this.x - vec.x, this.y - vec.y)
    }
    scale(scalar) {
	return new Vec(this.x * scalar, this.y * scalar) 
    }
    magnitude() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    unit() {
	const mag = this.magnitude()
	if (mag == 0) { //potential bug?
	    return new Vec(0,0)
	}
	return (new Vec(this.x / mag, this.y / mag))
    }
}

const origin = new Vec(0, 0)
