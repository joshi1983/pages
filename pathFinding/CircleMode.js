class CircleMode {
	constructor(settings) {
		this.settings = settings;
		this.centre = undefined;
		this.lastRadius = undefined;
		this.id = 'circle';
	}
	draw(g) {
		if (this.centre !== undefined && this.lastRadius !== undefined) {
			this.centre.draw(g, '#888', this.lastRadius);
			this.centre.draw(g, '#000');
		}
	}
	moved(event) {
		if (this.centre === undefined)
			return false;
		var newPoint = new Point(event);
		this.lastRadius = this.centre.distanceFrom(newPoint);
		return true;
	}
	click(event) {
		var newPoint = new Point(event);
		if (this.centre === undefined) {
			this.centre = newPoint;
		}
		else {
			this.settings.obstacles.push(new Circle(this.centre, this.centre.distanceFrom(newPoint)));
			this.centre = undefined;
			this.lastRadius = undefined;
		}
	}
}