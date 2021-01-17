class Lighting {
	constructor(gl, program, viewport) {
		this.gl = gl;
		this.viewport = viewport;
		this.uniforms = {
			'lightDirection': gl.getUniformLocation(program, 'lightDirection')
		};
		this._initLocationSettingsUI();
		this._lightUpdated();
	}

	_initLocationSettingsUI() {
		var settings = document.querySelector('#settings section');
		var div = document.createElement('div');
		div.setAttribute('class', 'light-settings');
		div.innerHTML = `
			<fieldset>
				<legend>Light Direction</legend>
				<label for="light-x">x</label>
				<input type="range" id="light-x" min="-1" max="1" step="0.0001" value="0.5">
				<label for="light-y">y</label>
				<input type="range" id="light-y" min="-1" max="1" step="0.0001" value="0">
				<label for="light-z">z</label>
				<input type="range" id="light-z" min="-1" max="1" step="0.0001" value="0.8">
			</fieldset>
		`;
		settings.appendChild(div);
		var outer = this;
		['x', 'y', 'z'].forEach(function(key) {
			var input = document.querySelector('#light-' + key);
			outer['input' + key.toUpperCase()] = input;
			input.addEventListener('input', function() {
				outer._lightUpdated();
			});
		});
	}

	_lightUpdated() {
		var lightDirection = [
			parseFloat(this.inputX.value),
			parseFloat(this.inputY.value),
			parseFloat(this.inputZ.value)
		];
		var m = 0;
		for (var i = 0; i < lightDirection.length; i++) {
			// if any values aren't valid, don't update the light direction.
			if (typeof lightDirection[i] !== 'number' || isNaN(lightDirection[i]))
				return;
			m += lightDirection[i] * lightDirection[i];
		}
		// don't set light direction to a vector that has magnitude 0.
		if (m === 0)
			return;
		else {
			// normalize the vector.
			m = Math.sqrt(m);
			for (var i = 0; i < lightDirection.length; i++) {
				lightDirection[i] /= m;
			}
		}
		this.gl.uniform3fv(this.uniforms.lightDirection, lightDirection);
		this.viewport.draw();
	}
}