class CRealValue {
	constructor(gl, pid) {
		this.gl = gl;
		this.locationOfCReal = gl.getUniformLocation(pid, "cReal");
		this.inputElement = document.getElementById('c-real');
		var outer = this;
		this.inputElement.addEventListener('input', function() {
			outer.changed();
		});
	}

	setMandelBrotDisplay(mandelBrotDisplay) {
		this.mandelBrotDisplay = mandelBrotDisplay;
		this.changed();
	}
	
	get() {
		return sanitizeFloat(this.inputElement.value, 0.7);
	}

	set(newValue, forceUpdate) {
		if (this.get() !== newValue || forceUpdate) {
			this.inputElement.value = newValue;
			this.gl.uniform1f(this.locationOfCReal, newValue);
			this.mandelBrotDisplay.cRealUpdated();
		}
	}
  
	changed() {
		var val = this.get();
		this.gl.uniform1f(this.locationOfCReal, val);
		if (this.mandelBrotDisplay !== undefined)
			this.mandelBrotDisplay.cRealUpdated();	  
	}
}