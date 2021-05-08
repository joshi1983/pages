class Scale {
	constructor(gl, pid) {
		this.gl = gl;
		this.scaleFactor = 1;
		this.currentScale = 1;
		this.locationOfScale = gl.getUniformLocation(pid, "scale");
	}

	setScaleFactor(newScaleFactor) {
		this.scaleFactor = newScaleFactor;
	}

	get() {
		return this.currentScale;
	}

	set(newScale) {
		this.currentScale = newScale;
		this.gl.uniform1f(this.locationOfScale, newScale);
	}

	getScaleFromDimensions(w, h) {
		if (typeof w !== 'number' || typeof h !== 'number') {
			throw new Error('getScaleFromDimensions requires a pair of numbers.');
		}
		return 7.0 * this.scaleFactor / (w + h);
	}
}