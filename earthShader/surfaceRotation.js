class SurfaceRotation {
	constructor(gl, program, viewport) {
		this.gl = gl;
		this.viewport = viewport;
		this.uniforms = {
			surfaceRotation: gl.getUniformLocation(program, 'surfaceRotation'),
		};
		this._initUI();
	}

	_initUI() {
		var settings = document.querySelector('#settings section');
		var div = document.createElement('div');
		div.setAttribute('class', 'labelled-range');
		div.innerHTML = `<label for="surface-rotation">Surface Rotation</label>
			<input type="range" id="surface-rotation" min="-1" max="1" step="0.0001" value="0.5">
		`;
		settings.appendChild(div);
		this.input = document.getElementById('surface-rotation');
		var outer = this;
		function updated() {
			var newValue = parseFloat(outer.input.value);
			outer.gl.uniform1f(outer.uniforms.surfaceRotation, newValue);
			outer.viewport.draw();
		}
		this.input.addEventListener('input', updated);
		updated();
	}
}