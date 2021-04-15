class Point {
	constructor(x, y) {
		if (typeof x === 'object') {
			this.set(event);
		}
		else {
			this.x = x;
			this.y = y;
		}
	}

	equals(o) {
		if (typeof o !== 'object')
			return false;
		return this.x === o.x && this.y === o.y;
	}

	draw(g, colour, radius) {
		if (isNaN(radius))
			radius = 5;

		g.fillStyle = colour;
		g.beginPath();
		g.arc(this.x, this.y, radius, 0, Math.PI * 2);
		g.closePath();
		g.fill();
	}

	set(event) {
		var x = event.offsetX;
		var y = event.offsetY;
		if (isNaN(x)) {
			['changedTouches', 'targetTouches'].forEach(function(key) {
				if (event[key] && event[key][0]) {
					x = event[key][0].pageX;
					y = event[key][0].pageY;
				}
			});
		}
		if (!isNaN(x)) {
			this.x = x;
			this.y = y;
		}
	}

	distanceFrom(otherPoint) {
		var dx = otherPoint.x - this.x;
		var dy = otherPoint.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
}