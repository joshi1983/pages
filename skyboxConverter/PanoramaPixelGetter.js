class PanoramaPixelGetter extends SkyBoxPixelGetter {
	getTitle() {
		return '360 Degree Panorama';
	}

	get(longitude, latitude) {
		return {
			'x': longitude / ( 2 * Math.PI ),
			'y': (latitude + Math.PI * 0.5) / Math.PI
		};
	}

	getDirection(x, y) {
		return {
			'lat': (y - 0.5) * Math.PI,
			'lng': x * Math.PI * 2
		};
	}
}