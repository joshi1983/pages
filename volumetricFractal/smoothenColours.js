class SmoothenColours {
	constructor(gl, pid, realtimeRenderer, mandelBrotDisplay) {
		this.checkbox = document.querySelector('#smooth-colours');
		this.locationOfSmoothenColours = gl.getUniformLocation(pid, 'smoothenColours');
		this.gl = gl;
		this.realtimeRenderer = realtimeRenderer;
		this.mandelBrotDisplay = mandelBrotDisplay;
		var outer = this;
		this.checkbox.addEventListener('change', function() {
			outer._changed();
		});
	}

	_changed() {
		this.set(this.get(), true);
	}

	get() {
		return this.checkbox.checked;
	}

	set(newValue, forceChange) {
		if (typeof newValue === 'number')
			newValue = (newValue !== 0);

		var val = this.get();
		if (val !== newValue || forceChange) {
			this.gl.uniform1i(this.locationOfSmoothenColours, newValue);
			if (val !== newValue) {
				this.checkbox.checked = newValue;
			}
			this.realtimeRenderer.redraw();
			this.mandelBrotDisplay.smoothenedColoursChanged();
		}
	}
}
