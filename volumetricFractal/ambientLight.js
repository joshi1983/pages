class AmbientLight {
	constructor(gl, pid) {
		this.gl = gl;
		this.inputElement = document.getElementById('ambient');
		this.locationOfAmbient = gl.getUniformLocation(pid, "ambientFactor");
		var outer = this;
		this.inputElement.addEventListener('input', function(){
			outer.changed();
		});
		this.changed();
	}
	
	get() {
		return parseFloat(this.inputElement.value);
	}
	
	set(newAmbientValue, forceUpdate) {
		var val = sanitizeFloat(this.inputElement.value);
		if (newAmbientValue !== val || forceUpdate) {
			this.gl.uniform1f(this.locationOfAmbient, 1 - newAmbientValue);
			this.inputElement.value = newAmbientValue;
		}
	}

	changed() {
		this.set(sanitizeFloat(this.inputElement.value, 0.05), true);
	}
}