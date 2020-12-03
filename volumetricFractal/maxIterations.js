class MaxIterations {
	constructor(gl, pid, mandelBrotDisplay, realtimeRenderer) {
		this.gl = gl;
		this.mandelBrotDisplay = mandelBrotDisplay;
		this.realtimeRenderer = realtimeRenderer;
		this.maxIterationsInput = document.getElementById('max-iterations');
		this.locationOfFractalIterationDeltas = gl.getUniformLocation(pid, "fractalIterationDelta");
		var outer = this;
		this.maxIterationsInput.addEventListener('input', function() {
			outer.changed();
		});
		this.changed();
	}

	get() {
		var val = parseInt(this.maxIterationsInput.value);
		if (typeof val !== 'number' || isNaN(val))
			val = 20;
		return val;
	}

	set(newMaxIterations, forceChange) {
		if (typeof newMaxIterations !== 'number' || isNaN(newMaxIterations))
			throw new Error('MaxIterations must be set to a number.  Not: ' + newMaxIterations);
		var val = this.get();
		if (val !== newMaxIterations || forceChange) {
			if (newMaxIterations > 300)
				throw new Error('MaxIterations can not be set to such a large number. ' + newMaxIterations);
			this.gl.uniform1f(this.locationOfFractalIterationDeltas, 1.0 / newMaxIterations);
			this.mandelBrotDisplay.maxIterationsChanged();
			this.realtimeRenderer.redraw();
		}
		if (!forceChange) {
			this.maxIterationsInput.value = newMaxIterations;
		}
	}

	changed() {
		this.set(this.get(), true);
	}
}