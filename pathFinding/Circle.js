class Circle {
	constructor(centre, radius) {
		this.centre = centre;
		this.radius = radius;
	}
	draw(g) {
		this.centre.draw(g, '#000', this.radius);
	}

	getKeyPoints() {
		const numPoints = 16;
		var result = [];
		var radius = this.radius * 1.05;
		for (var i = 0; i < numPoints;i++) {
			var a = i * Math.PI * 2 / numPoints;
			var x = this.centre.x + radius * Math.cos(a);
			var y = this.centre.y + radius * Math.sin(a);
			result.push(new Point(x, y));
		}
		return result;
	}

	_overlapsPoint(p) {
		return this.centre.distanceFrom(p) < this.radius;
	}

	overlapsLineSegment(lineSegment) {
		var closestPoint = lineSegment.getClosestPointTo(this.centre);
		return this._overlapsPoint(closestPoint);
	}
}