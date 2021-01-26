class PointRotator {
	constructor() {
		this.setAngle(0);
	}

	setAngle(angle) {
		this.cosAngle = Math.cos(angle);
		this.sinAngle = Math.sin(angle);
	}

	transform(pointCoords) {
		return [
			pointCoords[0] * this.cosAngle - pointCoords[2] * this.sinAngle,
			pointCoords[1],
			pointCoords[0] * this.sinAngle + pointCoords[2] * this.cosAngle,
		];
	}
}