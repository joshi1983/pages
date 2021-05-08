class PlaneCutValue {
	constructor(gl, pid, realtimeRenderer) {
		this.gl = gl;
		this.realtimeRenderer = realtimeRenderer;
		this.locationOfPlaneCutValue = gl.getUniformLocation(pid, "planeCutValue");
		var outer = this;
		this.inputElement = document.getElementById('plane-cut-value');
		this.inputElement.addEventListener('input', function() {
			outer.changed();
		});
	}

	setMandelBrotDisplay(mandelBrotDisplay) {
		this.mandelBrotDisplay = mandelBrotDisplay;
		this.changed();
	}

	get() {
		return sanitizeFloat(this.inputElement.value, 0);
	}

	set(newValue, forceUpdate) {
		if (forceUpdate || newValue !== this.get()) {
			this.inputElement.value = newValue;
			this.gl.uniform1f(this.locationOfPlaneCutValue, newValue);
			if (this.mandelBrotDisplay !== undefined) {
				this.mandelBrotDisplay.planeCutValueUpdated();
			}
			this.realtimeRenderer.redraw();
		}
	}

	changed() {
		this.set(this.get(), true);
	}
}