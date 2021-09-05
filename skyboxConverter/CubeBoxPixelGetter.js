class CubeBoxPixelGetter extends SkyBoxPixelGetter {
	getTitle() {
		return 'Cube';
	}

	get(longitude, latitude) {
		var xCategory = Math.floor(longitude * 0.5 / Math.PI);
		if (latitude > Math.PI * 0.25 || latitude < -Math.PI * 0.25)
		{
			var r = Math.tan(Math.PI * 0.5 - Math.abs(latitude));
			var x = 0.5 + r * Math.sin(longitude);
			var y = 0.5 + r * Math.cos(longitude);
			x = x * 0.25 + 0.25;
			y = y / 3;
			if (latitude > 0)
				y += 2/3;
			return {
				'x': x,
				'y': y
			};
		}
		else {
			return {
				'x': longitude / ( 2 * Math.PI ),
				'y': 0.5 + latitude / Math.PI
			};
		}
	}

	getDirection(x, y) {
		// sanitize a few edge cases.
		if (Math.floor(y * 3) !== 1 && Math.floor(x * 4) !== 1) {
			if (x * 4 > 0.999 && x * 4 < 1)
				x += 0.001;
			else if (x * 4 > 1.999 && x * 4 < 2.001)
				x -= 0.001;
			if (y * 3 > 0.999 && y * 3 < 1.001)
				y += 0.001;
			else if (y * 3 > 1.999)
				y -= 0.001;
		}
		var xCategory = Math.floor(x * 4);
		var yCategory = Math.floor(y * 3);
		if (yCategory !== 1)
		{
			if (xCategory !== 1)
				return undefined;
			else {
				x = x * 4 - xCategory - 0.5;
				y = y * 3 - yCategory - 0.5;
				x = -x;
				if (yCategory === 2)
					y = -y;
				var lng = Math.atan2(y, x);
				var lat;
				lat = Math.abs(Math.atan(Math.hypot(x, y) * 2));
				if (yCategory === 2)
					lat = Math.PI * 0.5 - lat;
				else
					lat -= Math.PI * 0.5;
				return {
					'lat': lat,
					'lng': lng
				};
			}
		}
		y = y * 3 - 1.5;
		x = x * 4 - xCategory - 0.5;
		lng = Math.PI * xCategory * 0.5 + Math.atan(x * 2);
		lat = Math.atan(y * 2 / Math.hypot(1, x * 2));
		// what rectangle does this hit?
		return {
			'lat': lat,
			'lng': lng
		};
	}
}