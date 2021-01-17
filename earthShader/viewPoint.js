class ViewPoint {
	constructor(gl, program, viewport) {
		this.gl = gl;
		this.viewport = viewport;
		this.uniforms = {
			'viewPoint': gl.getUniformLocation(program, 'viewPoint'),
			'viewPointMagnitudeSquared': gl.getUniformLocation(program, 'viewPointMagnitudeSquared')
		};
		this._initViewPointUI();
	}

	_initViewPointUI() {
		var settings = document.querySelector('#settings section');
		var div = document.createElement('div');
		div.innerHTML = `
			<fieldset>
				<legend>View Point</legend>
				<label for="viewpoint-x">x</label>
				<input id="viewpoint-x" type="range" min="-3" max="3" step="0.01" value="0">
				<label for="viewpoint-y">y</label>
				<input id="viewpoint-y" type="range" min="-3" max="3" step="0.01" value="0">
				<label for="viewpoint-z">z</label>
				<input id="viewpoint-z" type="range" min="-30" max="1" step="0.01" value="-20">
			</fieldset>
		`;
		settings.appendChild(div);
		var outer = this;
		['x', 'y', 'z'].forEach(function(axis) {
			var input = document.getElementById('viewpoint-' + axis);
			outer[axis + 'Input'] = input;
			input.addEventListener('input', function() {
				outer._viewPointUpdated();
			});
		});
		this._viewPointUpdated();
	}

	_viewPointUpdated() {
		var newViewPoint = [
			parseFloat(this.xInput.value),
			parseFloat(this.yInput.value),
			parseFloat(this.zInput.value)
		];
		this._setViewPoint(newViewPoint);
		this.viewport.draw();
	}

	_setViewPoint(newViewPoint) {
		// Ignore the call if the parameter is invalid.
		if (!(newViewPoint) instanceof Array || isNaN(newViewPoint[0]) || isNaN(newViewPoint[1]) || isNaN(newViewPoint[2])) {
			return;
		}
		this.gl.uniform3fv(this.uniforms.viewPoint, newViewPoint);
		var squaredValue = 0;
		for (var i = 0; i < 3; i++) {
			squaredValue += newViewPoint[i] * newViewPoint[i];
		}
		this.gl.uniform1f(this.uniforms.viewPointMagnitudeSquared, squaredValue);
	}
}