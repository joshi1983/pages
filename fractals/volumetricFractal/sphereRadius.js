class SphereRadius {
	constructor(gl, pid, planeCutValue, scale, circles,
	getWidth, getHeight, realtimeRenderer) {
		this.planeCutValue = planeCutValue;
		this.mainGL = gl;
		this.circles = circles;
		this.getWidth = getWidth;
		this.getHeight = getHeight;
		this.scale = scale;
		this.sphereRadiusInput = document.getElementById('sphere-radius');
		this.locationOfSphereRadiusSquared = gl.getUniformLocation(pid, "sphereRadiusSquared");
		this.locationOfSphereRadiusWithPlaneLineSquared = gl.getUniformLocation(pid, "sphereRadiusWithPlaneLineSquared");
		this.realtimeRenderer = realtimeRenderer;
		let outer = this;
		this.sphereRadiusInput.addEventListener('input', function() {
			outer._updated();
		});
		this._updated();
	}
	
	updateUniforms(gl, w, h, locationOfSphereRadiusSquared,
		locationOfSphereRadiusWithPlaneLineSquared) {
		let val = sanitizeFloat(this.sphereRadiusInput.value, 2);
		let val2 = val * (1 + this.circles.getOutlineThickness(w, h) * this.scale.get());
		gl.uniform1f(locationOfSphereRadiusSquared, val * val);
		gl.uniform1f(locationOfSphereRadiusWithPlaneLineSquared, val2 * val2);
	}

	_updated() {
		let val = this.get();
		this.updateUniforms(this.mainGL, this.getWidth(), this.getHeight(), this.locationOfSphereRadiusSquared, 
			this.locationOfSphereRadiusWithPlaneLineSquared);
		this.planeCutValue.inputElement.setAttribute('min', -val);
		this.planeCutValue.inputElement.setAttribute('max', val);
		this.planeCutValue.inputElement.value = Math.max(-val, Math.min(val, this.planeCutValue.get()));
		document.dispatchEvent(new Event('sphere-radius-change'));
		this.realtimeRenderer.redraw();
	}

	get() {
		return sanitizeFloat(this.sphereRadiusInput.value, 2);
	}
	
	set(newValue) {
		// For efficiency's sake, check that the value actually changed.
		if (newValue !== this.get()) {
			this.sphereRadiusInput.value = newValue;
			this._updated();
		}
	}
}
