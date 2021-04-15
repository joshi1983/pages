class LineSegmentMode {
	constructor(settings) {
		this.settings = settings;
		this.startPoint = undefined;
		this.lastPoint = undefined;
		this.id = 'line-segment';
	}

	draw(g) {
		if (this.startPoint !== undefined)
			this.startPoint.draw(g, '#888');
		if (this.lastPoint !== undefined) {
			this.lastPoint.draw(g, '#888');
			new LineSegment(this.startPoint, this.lastPoint).draw(g, '#888');
		}
	}

	moved(event) {
		if (this.startPoint === undefined)
			return false;
		this.lastPoint = new Point(event);
		
		return true;
	}

	click(event) {
		var newPoint = new Point(event);
		if (this.startPoint === undefined) {
			this.startPoint = newPoint;
		}
		else {
			this.settings.obstacles.push(new LineSegment(this.startPoint, newPoint));
			this.startPoint = undefined;
			this.lastPoint = undefined;
		}
	}
}