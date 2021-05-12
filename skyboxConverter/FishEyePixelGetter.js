class FishEyePixelGetter extends SkyBoxPixelGetter {
	getTitle() {
		return 'Fish Eye';
	}

	get(longitude, latitude) {
		var r = (latitude / Math.PI  + 0.5) * 0.5;
		var a = longitude;
		return {
			'x': 0.5 + r * Math.cos(a),
			'y': 0.5 + r * Math.sin(a)
		};
	}

	getDirection(x, y) {
		x -= 0.5;
		y -= 0.5;
		var r = Math.hypot(x, y);
		if (r > 0.5)
			return undefined; // transparent
		var a = Math.atan2(y, x);
		return {
			'lat': (r - 0.25) * Math.PI * 2,
			'lng': a
		};
	}
}