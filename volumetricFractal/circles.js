class Circles {
	constructor(gl, pid, camera, getWidth, getHeight) {
		this.gl = gl;
		this.camera = camera;
		this.lineThicknessFactor = 0.001;
		this.locationOfCircleRadiusRange = gl.getUniformLocation(pid, "circleRadiusRange");
		this.locationOfShowingCircumference = gl.getUniformLocation(pid, "isShowingCircumference");
		this.showSphereOutlineInput = document.getElementById('show-outline');
		var outer = this;
		this.showSphereOutlineInput.addEventListener('change', function() {
			outer.showSphereOutlineChanged(gl, outer.locationOfShowingCircumference, getWidth(), getHeight());
		});
		this.showSphereOutlineChanged(this.gl, this.locationOfShowingCircumference, getWidth(), getHeight());
	}

	setLineThicknessFactor(newLineThicknessFactor) {
		this.lineThicknessFactor = newLineThicknessFactor;
	}

	setSphereRadius(sphereRadius) {
		this.sphereRadius = sphereRadius;
	}

	getMaxCircleRadius(w, h, scaleValue) {
		var r = 2;
		if (this.sphereRadius)
			r = this.sphereRadius.getValue();
		var min = this.getCircleRadius(w, h, scaleValue);
		if (r > 0.97 * this.camera.rotationRadius) {
			return min;
		}
		else {
			var max = this.getRadiusFromSphereRadius(r * (1 + this.getOutlineThickness(w, h) * scaleValue), scaleValue);
			return max;
		}
	}

	getCircleRadius(w, h, scaleValue) {
		var r = 2;
		if (this.sphereRadius)
			r = this.sphereRadius.getValue();
		if (r > 0.97 * this.camera.rotationRadius) {
			return sanitizeFloat(w + h, 18000);
		}
		else {
			return this.getRadiusFromSphereRadius(r, scaleValue);
		}
	}

	getMaxCircleRadius(w, h, scaleValue) {
		var r = 2;
		if (this.sphereRadius)
			r = this.sphereRadius.getValue();
		var min = this.getCircleRadius(w, h, scaleValue);
		if (r > 0.97 * this.camera.rotationRadius) {
			return min;
		}
		else {
			var max = this.getRadiusFromSphereRadius(r * (1 + this.getOutlineThickness(w, h) * scaleValue), scaleValue);
			return max;
		}
	}

	getRadiusFromSphereRadius(sr, scaleValue) {
		var sinA = sr / this.camera.rotationRadius;
		var a = Math.asin(sinA);
		var rad = Math.tan(a) / scaleValue;
		return rad;
	}

	getOutlineThickness(w, h) {
		return (w + h) * this.lineThicknessFactor;
	}

	updateCircleRadiusRange(gl, w, h, scaleValue, locationOfCircleRadiusRange, locationOfShowingCircumference) {
		var r = this.sphereRadius.getValue();
		var min = this.getCircleRadius(w, h, scaleValue);
		var max = this.getMaxCircleRadius(w, h, scaleValue);
		if (r > 0.97 * this.camera.rotationRadius) {
			this.setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, false);
		}
		else {
			this.showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
			gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
		}
		gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
		return max;
	}

	setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, newValue) {
		gl.uniform1i(locationOfShowingCircumference, newValue);
	}

	showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h) {
		this.setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, !!this.showSphereOutlineInput.checked);
	}
}